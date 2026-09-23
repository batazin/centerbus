const cacheActiveFrameList = new Map();

Promise.create = () => {
	let resolve = null;
	let reject = null;
	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});

	promise.resolve = resolve;
	promise.reject = reject;
	return promise;
};

// How long feeding must go quiet before considering a flush. Must sit above
// typical wheel-notch gaps (~50-150ms): flushing invalidates the delta chain
// (the next chunk must be a key frame), so a flush between scrub notches would
// cold-start the decoder on every notch and make backward scrubbing stutter.
const FLUSH_IDLE_MS = 250;

// A decoder that keeps dying gets this many fresh instances before giving up.
const MAX_DECODER_RECOVERIES = 3;

window.ActiveFrame = class ActiveFrame {
	file = null;
	manifest = null;
	data = null;
	decoder = null;
	frame = null;
	desideredFrame = 0;
	enabled = true;
	framesByTimestamp = new Map();
	frameProcessed = null;
	_pendingFrame = null;
	_queuedFrame = null;
	_needsKeyFrame = true;
	_renderFloor = 0;
	_flushTimer = null;
	_decoderFailed = false;
	_recoveries = 0;

	constructor(file, { process = () => {}, hardwareAcceleration = 'prefer-hardware' }) {
		this.loading = Promise.create();
		this.process = process;
		this.hardwareAcceleration = hardwareAcceleration;

		this.file = file;
		this.init();
	}

	async init() {
		try {
			cacheActiveFrameList.set(this.file, this.loadBinary(this.file));

			const loading = await cacheActiveFrameList.get(this.file);
			const { manifest, data } = loading;

			this.manifest = manifest;
			this.data = data;

			this.manifest.frames.forEach(frame => {
				frame.data = new Uint8Array(this.data, frame.o, frame.l);
				this.framesByTimestamp.set(frame.t, frame.i);
			});

			await this.initDecoder();
			this.loading.resolve();
		} catch (error) {
			this.loading.reject(error);
		}
	}

	async loadBinary(file) {
		const res = await fetch(file);
		const fullBuffer = await res.arrayBuffer();

		const footer = new DataView(fullBuffer, fullBuffer.byteLength - 4);
		const manifestOffset = footer.getUint32(0, true);

		const manifestBytes = new Uint8Array(fullBuffer, manifestOffset, fullBuffer.byteLength - 4 - manifestOffset);
		const manifest = JSON.parse(new TextDecoder().decode(manifestBytes));

		return {
			manifest,
			data: fullBuffer,
		};
	}

	decodeDescription(description) {
		const binaryString = atob(description);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	}

	async initDecoder() {
		const baseConfig = {
			codec: this.manifest.codec,
			codedWidth: this.manifest.width,
			codedHeight: this.manifest.height,
			colorSpace: {
				primaries: 'bt709',
				transfer: 'bt709',
				matrix: 'bt709',
				fullRange: false,
			},
		};

		// Codecs like VP8/VP9 carry no out-of-band config; passing a description
		// for them is a config error, so only include one when the manifest has it.
		if (this.manifest.description) {
			baseConfig.description = this.decodeDescription(this.manifest.description);
		}

		const candidates = [
			{ ...baseConfig, hardwareAcceleration: this.hardwareAcceleration, optimizeForLatency: true },
			{ ...baseConfig, hardwareAcceleration: this.hardwareAcceleration },
			{ ...baseConfig, optimizeForLatency: true },
			{ ...baseConfig },
		];

		this.config = null;

		for (const candidate of candidates) {
			const support = await VideoDecoder.isConfigSupported(candidate);
			if (support.supported) {
				this.config = candidate;
				break;
			}
		}

		if (!this.config) {
			throw new Error('Decoder not supported');
		}

		this.createDecoder();
	}

	createDecoder() {
		this.decoder = new VideoDecoder({
			output: this.outputFrame.bind(this),
			error: e => {
				console.error('ActiveFrame decoder error:', this.file, e);
				// Flag only — the next setFrame() call swaps in a fresh decoder.
				// Touching the dead decoder here would throw inside its own callback.
				this._decoderFailed = true;
			},
		});

		this.decoder.configure(this.config);
		this._needsKeyFrame = true;
		this._queuedFrame = null;
		this._pendingFrame = null;
	}

	resetDecoder() {
		clearTimeout(this._flushTimer);
		this._flushTimer = null;
		this._needsKeyFrame = true;
		this._queuedFrame = null;
		this._pendingFrame = null;

		if (!this.decoder || this.decoder.state === 'closed') {
			this.createDecoder();
			return;
		}

		try {
			this.decoder.reset();
			this.decoder.configure(this.config);
		} catch (_error) {
			this.createDecoder();
		}
	}

	// Emit whatever is buffered once feeding pauses. Never called mid-stream:
	// flushing invalidates the delta chain (next chunk must be a key frame), so
	// the timer is pushed back on every setFrame() while frames keep arriving.
	scheduleIdleFlush() {
		clearTimeout(this._flushTimer);

		this._flushTimer = setTimeout(() => {
			this._flushTimer = null;

			if (!this.enabled || !this.decoder || this.decoder.state !== 'configured') return;

			// Everything requested has already painted — no output is owed, so keep
			// the stream intact. Fast decoders land here every time, which is what
			// keeps scrub chains warm across wheel notches; only decoders that are
			// actually withholding the target frame pay the flush + re-key cost.
			if (this.frameProcessed === this.desideredFrame) return;

			this._needsKeyFrame = true;
			this._queuedFrame = null;
			this.decoder.flush().catch(() => {});
		}, FLUSH_IDLE_MS);
	}

	async outputFrame(frame) {
		if (!this.enabled) {
			frame.close();
			return;
		}

		const timestampToFrameId = this.framesByTimestamp.get(frame.timestamp);

		// A pending request is only pending until its output arrives — clear it even
		// when the frame gets dropped below, or the id is refused forever after.
		if (this._pendingFrame === timestampToFrameId) {
			this._pendingFrame = null;
		}

		// Below the floor means a seek warm-up frame: it only rebuilds decoder
		// references and must never paint (it would flash earlier footage).
		if (timestampToFrameId === undefined || timestampToFrameId < this._renderFloor) {
			frame.close();
			return;
		}

		this.frame = timestampToFrameId;

		if (this.process) {
			await this.process(frame);
		}

		this.frameProcessed = timestampToFrameId;

		frame.close();
	}

	decodeChunk(frameMeta) {
		this.decoder.decode(
			new EncodedVideoChunk({
				type: frameMeta.ty,
				timestamp: frameMeta.t,
				data: frameMeta.data,
			})
		);
	}

	setFrame(desideredFrame) {
		if (!this.manifest) return;
		if (!this.enabled) return;

		// A decoder that died mid-stream (hardware decode errors happen, notably on
		// iOS) gets replaced with a fresh instance rather than poisoning every
		// subsequent call. Give up after a few corpses.
		if (this._decoderFailed) {
			this._decoderFailed = false;
			this._recoveries += 1;

			if (this._recoveries > MAX_DECODER_RECOVERIES) {
				this.enabled = false;
				return;
			}

			this.createDecoder();
		}

		desideredFrame = Math.round(Number(desideredFrame));
		const maxFrame = Math.max(0, this.manifest.totalFrames - 1);
		desideredFrame = Math.min(Math.max(desideredFrame, 0), maxFrame);
		this.desideredFrame = desideredFrame;

		// Already on screen — nothing to do.
		if (desideredFrame === this.frameProcessed) return;

		// Outputs arrive in order, so the only frames whose paint is genuinely en
		// route are the ones past the last painted frame, within the queued range,
		// and at or above the render floor. Anything else — notably any backward
		// target — has either painted-and-gone or was dropped as seek warm-up, and
		// must be re-decoded.
		const isOutputEnRoute =
			this._queuedFrame !== null &&
			desideredFrame > (this.frameProcessed ?? -1) &&
			desideredFrame <= this._queuedFrame &&
			desideredFrame >= this._renderFloor;

		if (isOutputEnRoute) return;
		if (desideredFrame === this._pendingFrame) return;

		this._pendingFrame = desideredFrame;

		const frames = this.manifest.frames;

		if (!frames[desideredFrame]) return;

		try {
			// Forward continuation: the stream is intact (no reset/flush since the
			// last chunk), so feed every frame from the queue head to the target in
			// order — tween ticks and scrolls routinely skip several frames at a
			// time, and each intermediate delta is needed as a reference anyway.
			// All of them paint (monotonic playback), which is what makes motion
			// visible while the pipeline is saturated.
			const canContinueForward =
				!this._needsKeyFrame && this._queuedFrame !== null && desideredFrame > this._queuedFrame;

			if (canContinueForward) {
				this._renderFloor = Math.min(this._renderFloor, this._queuedFrame + 1);

				for (let i = this._queuedFrame + 1; i <= desideredFrame; i++) {
					this.decodeChunk(frames[i]);
				}

				this._queuedFrame = desideredFrame;
				this.scheduleIdleFlush();
				return;
			}

			// Seek: backward, first frame, or after a flush — rebuild from the
			// nearest key frame. Warm-up frames stay below the render floor so only
			// the target paints.
			if (this.decoder.decodeQueueSize > 0 || this.decoder.state !== 'configured') {
				this.resetDecoder();
				this._pendingFrame = desideredFrame;
			}

			let keyIndex = desideredFrame;

			while (keyIndex > 0 && frames[keyIndex].ty !== 'key') {
				keyIndex -= 1;
			}

			if (frames[keyIndex].ty !== 'key' || !frames[keyIndex].data) {
				console.error('ActiveFrame: no key frame found for', desideredFrame);
				return;
			}

			this._renderFloor = desideredFrame;

			for (let i = keyIndex; i <= desideredFrame; i++) {
				this.decodeChunk(frames[i]);
			}

			this._needsKeyFrame = false;
			this._queuedFrame = desideredFrame;
			this.scheduleIdleFlush();
		} catch (error) {
			// Never let a decode error escape into the caller's animation loop — a
			// throw inside a GSAP ticker callback takes down every later callback
			// in the tick, including the Lenis raf that drives page scrolling.
			console.error('ActiveFrame decode failed:', this.file, error);
			this._decoderFailed = true;
		}
	}

	// Re-decode and repaint a frame that is already considered painted — needed
	// after anything clears the canvas (resizing a canvas wipes its bitmap): the
	// painted/queued memos would otherwise swallow the repaint request.
	refresh(desideredFrame = this.desideredFrame) {
		if (!this.manifest || !this.enabled) return;

		this.frame = null;
		this.frameProcessed = null;
		this._pendingFrame = null;
		this._queuedFrame = null;
		this._needsKeyFrame = true;

		this.setFrame(desideredFrame ?? 0);
	}

	stop() {
		this.enabled = false;
	}

	destroy() {
		if (this.file) {
			cacheActiveFrameList.delete(this.file);
		}

		clearTimeout(this._flushTimer);
		this._flushTimer = null;
		this.stop();

		if (this.decoder && this.decoder.state !== 'closed') {
			this.decoder.close();
		}

		this.decoder = null;
		this.data = null;
		this.manifest = null;
		this.file = null;
		this.process = null;
		this.frameProcessed = null;
		this.enabled = false;
		this.framesByTimestamp.clear();
	}
};
