"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";
import "./bus-scroll-sequence.css";

const frameCount = 241;
const leadFrameCount = 20;
const framePath = (frame: number) => `/sequences/bus/frame_${String(frame).padStart(4, "0")}.webp`;

const scenes = [
  {
    frame: 1,
    enterAt: 0,
    exitAt: 11.2,
    label: "ENTRADA",
    title: "O ônibus volta pra rua.",
    copy: "A operação começa pela identificação certa: modelo, aplicação e urgência da rota.",
  },
  {
    frame: 44,
    enterAt: 16.7,
    exitAt: 31.1,
    label: "CONFERÊNCIA",
    title: "Conhecimento antes do catálogo.",
    copy: "Código, foto e carroceria entram na mesma conversa antes da peça ser separada.",
  },
  {
    frame: 104,
    enterAt: 37.7,
    exitAt: 54.1,
    label: "CARROCERIA",
    title: "A peça certa, na primeira vez.",
    copy: "Estrutura, acabamento, iluminação e climatização tratados como parte da operação.",
  },
  {
    frame: 169,
    enterAt: 60.7,
    exitAt: 75.1,
    label: "RESPOSTA",
    title: "Prazo claro para quem precisa rodar.",
    copy: "Orçamento objetivo, disponibilidade conferida e acompanhamento até a retirada ou despacho.",
  },
  {
    frame: 218,
    enterAt: 80.7,
    label: "SAÍDA",
    title: "Operação seguindo.",
    copy: "Peça conferida, ônibus liberado e rota de volta ao movimento.",
  },
] as const;

const frameSegments = [
  { start: 0, to: 32, duration: 13 },
  { start: 13, to: 44, duration: 4 },
  { start: 17, to: 82, duration: 16 },
  { start: 33, to: 103, duration: 5 },
  { start: 38, to: 151, duration: 18 },
  { start: 56, to: 169, duration: 5 },
  { start: 61, to: 207, duration: 16 },
  { start: 77, to: 218, duration: 4 },
  { start: 81, to: 241, duration: 12 },
] as const;

const timelineDuration = 93;

export function BusScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLSpanElement>(null);
  const beaconRef = useRef<HTMLSpanElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const copyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const stripItemRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [isReady, setIsReady] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const copies = copyRefs.current.filter((copy): copy is HTMLDivElement => copy !== null);
    if (!section || !stage || !canvas || copies.length !== scenes.length) return;

    gsap.registerPlugin(ScrollTrigger);

    let disposed = false;
    let renderRequest: number | undefined;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let context: CanvasRenderingContext2D | null = null;
    let cssWidth = window.innerWidth;
    let cssHeight = window.innerHeight;
    let requestedFrame = 1;
    let lastRenderedFrame = 0;
    let lastRequestedFrame = 1;
    let lastIndicator = 0;
    let activeLoads = 0;
    let hasUserControl = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 760;
    const maxConcurrentLoads = isMobile ? 4 : 6;
    const anchorStep = isMobile ? 5 : 4;
    const leadFrames = Array.from({ length: leadFrameCount }, (_, index) => index + 1);
    const anchorFrames = Array.from(
      new Set([
        ...leadFrames,
        ...Array.from({ length: Math.ceil(frameCount / anchorStep) }, (_, index) => index * anchorStep + 1)
          .filter((frame) => frame <= frameCount),
        ...scenes.map((scene) => scene.frame),
        frameCount,
      ]),
    ).sort((first, second) => first - second);
    const bootFrameSet = new Set(anchorFrames);
    const settledBootFrames = new Set<number>();
    const images = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();
    const queued = new Set<number>();
    const urgentFrames = new Set<number>();
    const loadQueue: number[] = [];
    const frameState = { frame: 1 };
    let masterTimeline: gsap.core.Timeline | undefined;

    const quantizeFrame = (frame: number) => {
      return Math.max(1, Math.min(frameCount, Math.round(frame)));
    };

    const resizeCanvas = () => {
      const nextContext = canvas.getContext("2d", { alpha: false, desynchronized: true });
      if (!nextContext) return;

      cssWidth = window.innerWidth;
      cssHeight = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
      const maxPixels = isMobile ? 720_000 : 1_200_000;
      const desiredPixels = cssWidth * pixelRatio * cssHeight * pixelRatio;
      const renderScale = Math.min(1, Math.sqrt(maxPixels / Math.max(1, desiredPixels)));
      const renderRatio = pixelRatio * renderScale;
      const nextWidth = Math.round(cssWidth * renderRatio);
      const nextHeight = Math.round(cssHeight * renderRatio);

      if (canvasWidth !== nextWidth || canvasHeight !== nextHeight) {
        canvasWidth = nextWidth;
        canvasHeight = nextHeight;
        canvas.width = nextWidth;
        canvas.height = nextHeight;
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
      }

      nextContext.setTransform(renderRatio, 0, 0, renderRatio, 0, 0);
      nextContext.imageSmoothingEnabled = true;
      nextContext.imageSmoothingQuality = "medium";
      context = nextContext;
    };

    const resolveDrawableFrame = (frame: number) => {
      if (images.has(frame)) return frame;

      for (let offset = 1; offset < frameCount; offset += 1) {
        const previousFrame = frame - offset;
        const nextFrame = frame + offset;
        if (previousFrame >= 1 && images.has(previousFrame)) return previousFrame;
        if (nextFrame <= frameCount && images.has(nextFrame)) return nextFrame;
      }

      return undefined;
    };

    const drawFrame = (frame: number, force = false) => {
      const drawableFrame = resolveDrawableFrame(frame);
      if (drawableFrame === undefined) return;
      const image = images.get(drawableFrame);
      if (!context || !image?.naturalWidth || !image.naturalHeight) return;
      if (!force && lastRenderedFrame === drawableFrame) return;

      const scale = Math.max(cssWidth / image.naturalWidth, cssHeight / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.globalAlpha = 1;
      context.drawImage(image, (cssWidth - drawWidth) / 2, (cssHeight - drawHeight) / 2, drawWidth, drawHeight);
      lastRenderedFrame = drawableFrame;
    };

    const getIndicatorFromTime = (time: number) => {
      let sceneIndex = 0;
      for (let index = 1; index < scenes.length; index += 1) {
        if (time >= scenes[index].enterAt) sceneIndex = index;
      }
      return sceneIndex;
    };

    const updateIndicator = (sceneIndex: number) => {
      if (sceneIndex === lastIndicator) return;
      stripItemRefs.current[lastIndicator]?.classList.remove("is-active");
      stripItemRefs.current[sceneIndex]?.classList.add("is-active");
      lastIndicator = sceneIndex;
    };

    function loadFrame(frame: number, urgent = false) {
      const normalized = quantizeFrame(frame);
      if (images.has(normalized) || loading.has(normalized)) return;

      if (queued.has(normalized)) {
        if (urgent) {
          urgentFrames.add(normalized);
          const index = loadQueue.indexOf(normalized);
          if (index > 0) {
            loadQueue.splice(index, 1);
            loadQueue.unshift(normalized);
          }
        }
        return;
      }

      queued.add(normalized);
      if (urgent) {
        urgentFrames.add(normalized);
        loadQueue.unshift(normalized);
      } else {
        loadQueue.push(normalized);
      }
      pumpLoadQueue();
    }

    function requestFrameWindow(frame: number) {
      loadFrame(frame, true);
      const direction = Math.sign(frame - lastRequestedFrame) || 1;
      const ahead = isMobile ? 22 : 34;
      const behind = isMobile ? 8 : 12;
      lastRequestedFrame = frame;

      for (let offset = 1; offset <= Math.max(ahead, behind); offset += 1) {
        if (offset <= ahead) loadFrame(frame + offset * direction, offset <= 8);
        if (offset <= behind) loadFrame(frame - offset * direction);
      }
    }

    const scheduleRender = () => {
      if (renderRequest !== undefined) return;
      renderRequest = window.requestAnimationFrame(() => {
        renderRequest = undefined;
        const progress = masterTimeline?.progress() ?? 0;
        requestedFrame = quantizeFrame(frameState.frame);
        drawFrame(requestedFrame);
        requestFrameWindow(requestedFrame);

        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
        updateIndicator(getIndicatorFromTime(masterTimeline?.time() ?? 0));
      });
    };

    const announceBootProgress = (frame: number) => {
      if (!bootFrameSet.has(frame)) return;
      settledBootFrames.add(frame);
      const loaded = settledBootFrames.size;
      const progress = loaded / anchorFrames.length;
      const ready = images.has(1) && loaded === anchorFrames.length;
      setBootProgress(progress);
      if (ready) setIsReady(true);
      window.dispatchEvent(new CustomEvent("centerbus:boot-progress", {
        detail: { progress, loaded, total: anchorFrames.length, ready },
      }));
    };

    function startFrameLoad(frame: number) {
      loading.add(frame);
      activeLoads += 1;
      const image = new Image();
      image.decoding = "async";
      const isUrgent = urgentFrames.has(frame);
      urgentFrames.delete(frame);
      image.fetchPriority = bootFrameSet.has(frame) || isUrgent ? "high" : "low";
      let settled = false;

      const finishLoad = (loaded: boolean) => {
        if (settled) return;
        settled = true;
        loading.delete(frame);
        activeLoads -= 1;

        if (!disposed && loaded && image.naturalWidth && image.naturalHeight) images.set(frame, image);
        if (!disposed) {
          announceBootProgress(frame);
          if (loaded && (frame === requestedFrame || frame === 1)) scheduleRender();
          pumpLoadQueue();
        }
      };

      image.onload = async () => {
        try {
          await image.decode();
        } catch {
          // A imagem ainda pode ser desenhada quando alguns navegadores rejeitam decode().
        }
        finishLoad(true);
      };
      image.onerror = () => finishLoad(false);
      image.src = framePath(frame);
    }

    function pumpLoadQueue() {
      while (!disposed && activeLoads < maxConcurrentLoads && loadQueue.length > 0) {
        const frame = loadQueue.shift();
        if (frame === undefined) return;
        queued.delete(frame);
        if (!images.has(frame) && !loading.has(frame)) startFrameLoad(frame);
      }
    }

    const handleResize = () => {
      canvasWidth = 0;
      canvasHeight = 0;
      resizeCanvas();
      if (lastRenderedFrame) drawFrame(lastRenderedFrame, true);
      ScrollTrigger.refresh();
    };

    const markUserControl = () => {
      if (hasUserControl) return;
      hasUserControl = true;
      stage.classList.add("is-operated");
    };

    resizeCanvas();
    gsap.set(copies, { autoAlpha: 0 });
    gsap.set(copies[0], { autoAlpha: 1 });
    gsap.set(copies[0].querySelectorAll("[data-copy-line]"), { yPercent: 0, opacity: 1 });

    {
      masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * (isMobile ? 4.2 : 5.2), isMobile ? 3200 : 4200)}`,
          pin: stage,
          scrub: isMobile ? 0.22 : 0.32,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: scheduleRender,
      });

      frameSegments.forEach((segment) => {
        masterTimeline?.to(frameState, {
          frame: segment.to,
          duration: segment.duration,
          ease: "none",
        }, segment.start);
      });

      scenes.forEach((scene, index) => {
        const copy = copies[index];
        const lines = copy.querySelectorAll("[data-copy-line]");

        if (index > 0) {
          masterTimeline?.set(copy, { autoAlpha: 1 }, scene.enterAt);
          masterTimeline?.fromTo(lines, {
            yPercent: 108,
            opacity: 0,
          }, {
            yPercent: 0,
            opacity: 1,
            duration: 1.35,
            stagger: 0.12,
            ease: "power3.out",
          }, scene.enterAt);
        }

        if ("exitAt" in scene) {
          masterTimeline?.to(lines, {
            yPercent: -42,
            opacity: 0,
            duration: 1.05,
            stagger: 0.06,
            ease: "power2.in",
          }, scene.exitAt);
          masterTimeline?.set(copy, { autoAlpha: 0 }, scene.exitAt + 1.2);
        }
      });

      if (!reduceMotion && scanRef.current) {
        masterTimeline.fromTo(scanRef.current, { xPercent: 0 }, {
          xPercent: 560,
          duration: timelineDuration,
          ease: "none",
        }, 0);
      }
      if (!reduceMotion && beaconRef.current) {
        masterTimeline.to(beaconRef.current, {
          opacity: 0.9,
          duration: 1.1,
          repeat: 1,
          yoyo: true,
          ease: "power1.inOut",
        }, scenes[2].enterAt);
      }
      if (shadeRef.current) {
        masterTimeline.to(shadeRef.current, {
          opacity: 0.76,
          duration: 8,
          ease: "power1.inOut",
        }, 85);
      }
      if (stripRef.current) {
        masterTimeline.to(stripRef.current, {
          opacity: 0.42,
          duration: 4,
          ease: "power1.in",
        }, 89);
      }
    }

    const plannedFrames = Array.from({ length: frameCount }, (_, index) => index + 1);
    const backgroundFrames = plannedFrames.filter((frame) => !bootFrameSet.has(frame));
    let backgroundFrameIndex = 0;
    let backgroundIdle: number | undefined;
    let backgroundTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleBackgroundLoadBatch = () => {
      if (disposed || backgroundFrameIndex >= backgroundFrames.length) return;

      const runBatch = (deadline?: IdleDeadline) => {
        backgroundIdle = undefined;
        backgroundTimer = undefined;
        let queuedInBatch = 0;

        while (!disposed && backgroundFrameIndex < backgroundFrames.length) {
          const hasIdleTime = !deadline || deadline.didTimeout || deadline.timeRemaining() > 5;
          if (queuedInBatch >= 10 || (queuedInBatch > 0 && !hasIdleTime)) break;

          loadFrame(backgroundFrames[backgroundFrameIndex]);
          backgroundFrameIndex += 1;
          queuedInBatch += 1;
        }

        if (!disposed && backgroundFrameIndex < backgroundFrames.length) scheduleBackgroundLoadBatch();
      };

      if ("requestIdleCallback" in window) {
        backgroundIdle = window.requestIdleCallback(runBatch, { timeout: 850 });
      } else {
        backgroundTimer = setTimeout(() => runBatch(), 90);
      }
    };

    anchorFrames.forEach((frame) => loadFrame(frame, true));
    scheduleBackgroundLoadBatch();
    scheduleRender();

    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", markUserControl, { passive: true });
    window.addEventListener("touchstart", markUserControl, { passive: true });
    stage.addEventListener("pointerdown", markUserControl);
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 80);

    return () => {
      disposed = true;
      window.clearTimeout(refreshTimer);
      if (backgroundIdle !== undefined) window.cancelIdleCallback(backgroundIdle);
      if (backgroundTimer !== undefined) clearTimeout(backgroundTimer);
      if (renderRequest !== undefined) window.cancelAnimationFrame(renderRequest);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", markUserControl);
      window.removeEventListener("touchstart", markUserControl);
      stage.removeEventListener("pointerdown", markUserControl);
      masterTimeline?.scrollTrigger?.kill();
      masterTimeline?.kill();
    };
  }, []);

  return (
    <section id="inicio" ref={sectionRef} className="bus-scroll-sequence" aria-label="Sequência por cenas Center Ônibus">
      <div ref={stageRef} className="bus-scroll-sequence-stage">
        <canvas ref={canvasRef} className="bus-scroll-sequence-canvas" aria-hidden="true" />
        <div ref={shadeRef} className="bus-scroll-sequence-shade" aria-hidden="true" />
        <div className="bus-scroll-sequence-grid" aria-hidden="true" />
        <span ref={scanRef} className="bus-scroll-sequence-scan" aria-hidden="true" />
        <span ref={beaconRef} className="bus-scroll-sequence-beacon" aria-hidden="true" />
        <div className="bus-scroll-sequence-copy-layer">
          {scenes.map((scene, index) => (
            <div
              className="bus-scroll-sequence-copy"
              key={scene.label}
              ref={(element) => { copyRefs.current[index] = element; }}
            >
              <div className="bus-scroll-sequence-copy-clip is-label"><p data-copy-line>Center Ônibus / {scene.label}</p></div>
              <div className="bus-scroll-sequence-copy-clip is-title"><h1 data-copy-line>{scene.title}</h1></div>
              <div className="bus-scroll-sequence-copy-clip is-body"><p data-copy-line>{scene.copy}</p></div>
            </div>
          ))}
        </div>
        <div ref={stripRef} className="bus-scroll-sequence-strip" aria-hidden="true">
          {scenes.map((scene, index) => (
            <span
              className={index === 0 ? "is-active" : undefined}
              key={scene.label}
              ref={(element) => { stripItemRefs.current[index] = element; }}
            >
              {scene.label}
            </span>
          ))}
        </div>
        <i className="bus-scroll-sequence-progress" aria-hidden="true">
          <span ref={progressRef} />
        </i>
        <div className="bus-scroll-sequence-cue" aria-hidden="true">
          <span />
          <b className="is-pointer-cue">role para avançar</b>
          <b className="is-touch-cue">deslize para avançar</b>
        </div>
        {!isReady && (
          <div className="bus-scroll-sequence-loader">
            <div>
              <span>Carregando quadros</span>
              <strong>{String(Math.round(bootProgress * 100)).padStart(2, "0")}%</strong>
              <i><span style={{ transform: `scaleX(${bootProgress})` }} /></i>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
