"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";
import "./bus-scroll-sequence.css";

const frameCount = 241;
const criticalFrameCount = 28;
const framePath = (frame: number) => `/sequences/bus/frame_${String(frame).padStart(4, "0")}.webp`;

const scenes = [
  {
    time: 0,
    label: "ENTRADA",
    title: "O ônibus volta pra rua.",
    copy: "A operação começa pela identificação certa: modelo, aplicação e urgência da rota.",
  },
  {
    time: 2.2,
    label: "CONFERENCIA",
    title: "Conhecimento antes do catálogo.",
    copy: "Código, foto e carroceria entram na mesma conversa antes da peça ser separada.",
  },
  {
    time: 4.6,
    label: "CARROCERIA",
    title: "A peça certa, na primeira vez.",
    copy: "Estrutura, acabamento, iluminação e climatização tratados como parte da operação.",
  },
  {
    time: 7.1,
    label: "RESPOSTA",
    title: "Prazo claro para quem precisa rodar.",
    copy: "Orçamento objetivo, disponibilidade conferida e acompanhamento até a retirada ou despacho.",
  },
  {
    time: 9.25,
    label: "SAIDA",
    title: "Operação seguindo.",
    copy: "Peça conferida, ônibus liberado e rota de volta ao movimento.",
  },
] as const;

const maxSceneTime = scenes[scenes.length - 1].time;
const sceneFrames = scenes.map((scene) => Math.max(1, Math.min(frameCount, Math.round((scene.time / maxSceneTime) * (frameCount - 1)) + 1)));

export function BusScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const activeSceneRef = useRef(0);
  const [activeScene, setActiveScene] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasOperated, setHasOperated] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage || !canvas) return;

    gsap.registerPlugin(ScrollTrigger);

    let canvasWidth = 0;
    let canvasHeight = 0;
    let disposed = false;
    let animationFrame: number | undefined;
    let currentFrame = sceneFrames[0];
    let idleFrame: number | undefined;
    let idleStartedAt = 0;
    let hasUserControl = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 760;
    const maxDecodedFrames = isMobile ? 36 : 54;
    const maxConcurrentLoads = isMobile ? 4 : 6;
    const images = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();
    const queued = new Set<number>();
    const loadQueue: number[] = [];
    const settledCriticalFrames = new Set<number>();
    let activeLoads = 0;
    let lastRequestedFrame = sceneFrames[0];

    const announceBootProgress = (frame: number) => {
      if (frame > criticalFrameCount) return;
      settledCriticalFrames.add(frame);
      const loaded = settledCriticalFrames.size;
      const progress = loaded / criticalFrameCount;
      setBootProgress(progress);
      window.dispatchEvent(new CustomEvent("centerbus:boot-progress", {
        detail: {
          progress,
          loaded,
          total: criticalFrameCount,
          ready: images.has(sceneFrames[0]) && loaded >= criticalFrameCount,
        },
      }));

    };

    let cachedContext: CanvasRenderingContext2D | null = null;
    let cachedWidth = 0;
    let cachedHeight = 0;

    const resizeCanvas = () => {
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return null;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      const maxRenderPixels = width < 760 ? 720_000 : 1_200_000;
      const desiredPixels = width * ratio * height * ratio;
      const renderScale = Math.min(1, Math.sqrt(maxRenderPixels / Math.max(1, desiredPixels)));
      const renderRatio = ratio * renderScale;
      const nextCanvasWidth = Math.round(width * renderRatio);
      const nextCanvasHeight = Math.round(height * renderRatio);

      if (canvasWidth !== nextCanvasWidth || canvasHeight !== nextCanvasHeight) {
        canvasWidth = nextCanvasWidth;
        canvasHeight = nextCanvasHeight;
        canvas.width = nextCanvasWidth;
        canvas.height = nextCanvasHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      context.setTransform(renderRatio, 0, 0, renderRatio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "medium";
      cachedContext = context;
      cachedWidth = width;
      cachedHeight = height;
      return { context, width, height };
    };

    const trimImageCache = (centerFrame: number) => {
      if (images.size <= maxDecodedFrames) return;

      const removableFrames = Array.from(images.keys())
        .sort((first, second) => Math.abs(second - centerFrame) - Math.abs(first - centerFrame));

      while (images.size > maxDecodedFrames && removableFrames.length > 0) {
        const frame = removableFrames.shift();
        if (frame !== undefined) images.delete(frame);
      }
    };

    const nearestLoadedFrame = (frame: number) => {
      if (images.has(frame)) return frame;

      for (let offset = 1; offset < frameCount; offset++) {
        const previous = frame - offset;
        const next = frame + offset;
        if (previous >= 1 && images.has(previous)) return previous;
        if (next <= frameCount && images.has(next)) return next;
      }

      return undefined;
    };

    const drawImageCover = (
      context: CanvasRenderingContext2D,
      image: HTMLImageElement,
      width: number,
      height: number,
      opacity = 1,
    ) => {
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.globalAlpha = opacity;
      context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    };

    const drawFrame = (framePosition: number) => {
      const context = cachedContext || resizeCanvas()?.context;
      if (!context) return;

      const width = cachedWidth || window.innerWidth;
      const height = cachedHeight || window.innerHeight;
      const previousFrame = Math.max(1, Math.floor(framePosition));
      const nextFrame = Math.min(frameCount, Math.ceil(framePosition));
      const previousImage = images.get(previousFrame);
      const nextImage = images.get(nextFrame);
      const blend = framePosition - previousFrame;

      if (previousImage?.naturalWidth && nextImage?.naturalWidth && previousFrame !== nextFrame) {
        drawImageCover(context, previousImage, width, height);
        drawImageCover(context, nextImage, width, height, blend);
      } else {
        const loadedFrame = nearestLoadedFrame(Math.round(framePosition));
        const image = loadedFrame ? images.get(loadedFrame) : undefined;
        if (!image?.naturalWidth || !image.naturalHeight) return;
        drawImageCover(context, image, width, height);
      }

      context.globalAlpha = 1;
      currentFrame = framePosition;
    };

    const getSceneFromFrame = (frame: number) => {
      let sceneIndex = 0;

      for (let index = 1; index < sceneFrames.length; index++) {
        const threshold = (sceneFrames[index - 1] + sceneFrames[index]) / 2;
        if (frame >= threshold) sceneIndex = index;
      }

      return sceneIndex;
    };

    const updateFromProgress = (progressValue: number) => {
      const progress = Math.max(0, Math.min(1, progressValue));
      const framePosition = Math.max(1, Math.min(frameCount, progress * (frameCount - 1) + 1));
      const frame = Math.round(framePosition);
      const nextScene = getSceneFromFrame(frame);

      if (progress > 0.008 && !hasUserControl) {
        hasUserControl = true;
        setHasOperated(true);
        if (idleFrame !== undefined) {
          window.cancelAnimationFrame(idleFrame);
          idleFrame = undefined;
        }
      }

      requestFrameWindow(frame);

      drawFrame(framePosition);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      if (nextScene !== activeSceneRef.current) {
        activeSceneRef.current = nextScene;
        setActiveScene(nextScene);
      }
    };

    const runIdlePreview = (time: number) => {
      if (disposed || reduceMotion || hasUserControl) return;
      if (!idleStartedAt) idleStartedAt = time;

      const elapsed = time - idleStartedAt;
      const cycle = (1 - Math.cos(elapsed / 900)) / 2;
      const frame = 1 + cycle * (criticalFrameCount - 1);

      drawFrame(frame);
      idleFrame = window.requestAnimationFrame(runIdlePreview);
    };

    const scheduleUpdate = () => {
      if (animationFrame !== undefined) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = undefined;
        updateFromProgress(scrollTrigger?.progress ?? 0);
      });
    };

    function startFrameLoad(frame: number) {
      loading.add(frame);
      activeLoads += 1;
      const image = new Image();
      image.decoding = "async";
      image.fetchPriority = frame <= criticalFrameCount || Math.abs(frame - currentFrame) <= 3 ? "high" : "auto";

      let settled = false;
      const finishLoad = (loaded: boolean) => {
        if (settled) return;
        settled = true;
        loading.delete(frame);
        activeLoads -= 1;

        if (!disposed && loaded && image.naturalWidth && image.naturalHeight) {
          images.set(frame, image);
          trimImageCache(currentFrame);
        }

        if (!disposed) {
          announceBootProgress(frame);
          if (frame === sceneFrames[0] && loaded) {
            setIsReady(true);
            scheduleUpdate();
            if (!reduceMotion && idleFrame === undefined) {
              idleFrame = window.requestAnimationFrame(runIdlePreview);
            }
          } else if (loaded && Math.abs(frame - currentFrame) <= 2) {
            scheduleUpdate();
          }

          pumpLoadQueue();
        }
      };

      image.onload = async () => {
        try {
          await image.decode();
        } catch {
          // Some browsers reject decode() even when the loaded image is drawable.
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
        if (images.has(frame) || loading.has(frame)) continue;
        startFrameLoad(frame);
      }
    }

    function loadFrame(frame: number, urgent = false) {
      if (frame < 1 || frame > frameCount || images.has(frame) || loading.has(frame)) return;

      if (queued.has(frame)) {
        if (urgent) {
          const queuedIndex = loadQueue.indexOf(frame);
          if (queuedIndex > 0) {
            loadQueue.splice(queuedIndex, 1);
            loadQueue.unshift(frame);
          }
        }
        return;
      }

      queued.add(frame);
      if (urgent) loadQueue.unshift(frame);
      else loadQueue.push(frame);
      pumpLoadQueue();
    }

    function requestFrameWindow(frame: number) {
      const direction = Math.sign(frame - lastRequestedFrame) || 1;
      const ahead = isMobile ? 18 : 30;
      const behind = isMobile ? 7 : 10;
      lastRequestedFrame = frame;

      for (let index = loadQueue.length - 1; index >= 0; index--) {
        const queuedFrame = loadQueue[index];
        const outsideActiveWindow = Math.abs(queuedFrame - frame) > ahead + behind + 8;
        if (queuedFrame > criticalFrameCount && outsideActiveWindow) {
          loadQueue.splice(index, 1);
          queued.delete(queuedFrame);
        }
      }

      loadFrame(frame, true);
      for (let offset = 1; offset <= Math.max(ahead, behind); offset++) {
        if (offset <= ahead) loadFrame(frame + offset * direction, offset <= 6);
        if (offset <= behind) loadFrame(frame - offset * direction);
      }
    }

    const handleResize = () => {
      canvasWidth = 0;
      canvasHeight = 0;
      cachedContext = null;
      resizeCanvas();
      scheduleUpdate();
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * 3.2, 2200)}`,
      pin: stage,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: scheduleUpdate,
      onRefresh: scheduleUpdate,
    });

    const ambientContext = gsap.context(() => {
      if (reduceMotion) return;

      gsap.to(".bus-scroll-sequence-grid", {
        x: -72,
        y: 36,
        duration: 10,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".bus-scroll-sequence-scan", {
        xPercent: 130,
        duration: 3.8,
        ease: "power1.inOut",
        repeat: -1,
        repeatDelay: 0.65,
      });

      gsap.to(".bus-scroll-sequence-beacon", {
        opacity: 1,
        scale: 1.08,
        duration: 1.25,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, section);

    const handlePointerMove = (event: PointerEvent) => {
      if (reduceMotion) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      stage.style.setProperty("--bus-pointer-x", x.toFixed(3));
      stage.style.setProperty("--bus-pointer-y", y.toFixed(3));
    };

    const markUserControl = () => {
      if (hasUserControl) return;
      hasUserControl = true;
      setHasOperated(true);
      if (idleFrame !== undefined) {
        window.cancelAnimationFrame(idleFrame);
        idleFrame = undefined;
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", markUserControl, { passive: true });
    window.addEventListener("touchstart", markUserControl, { passive: true });
    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerdown", markUserControl);

    for (let frame = 1; frame <= criticalFrameCount; frame++) loadFrame(frame, frame <= 8);
    scheduleUpdate();
    window.setTimeout(() => ScrollTrigger.refresh(), 80);

    return () => {
      disposed = true;
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
      if (idleFrame !== undefined) window.cancelAnimationFrame(idleFrame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", markUserControl);
      window.removeEventListener("touchstart", markUserControl);
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerdown", markUserControl);
      scrollTrigger.kill();
      ambientContext.revert();
    };
  }, []);

  const scene = scenes[activeScene];

  return (
    <section id="inicio" ref={sectionRef} className="bus-scroll-sequence" aria-label="Sequencia por cenas Center Onibus">
      <div ref={stageRef} className={`bus-scroll-sequence-stage${hasOperated ? " is-operated" : ""}`}>
        <canvas ref={canvasRef} className="bus-scroll-sequence-canvas" aria-hidden="true" />
        <div className="bus-scroll-sequence-shade" aria-hidden="true" />
        <div className="bus-scroll-sequence-grid" aria-hidden="true" />
        <span className="bus-scroll-sequence-scan" aria-hidden="true" />
        <span className="bus-scroll-sequence-beacon" aria-hidden="true" />
        <div className="bus-scroll-sequence-copy" key={scene.label}>
          <p>Center Onibus / {scene.label}</p>
          <h1>{scene.title}</h1>
          <span>{scene.copy}</span>
        </div>
        <div className="bus-scroll-sequence-strip" aria-hidden="true">
          {scenes.map((item, index) => (
            <span className={activeScene === index ? "is-active" : ""} key={item.label}>{item.label}</span>
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
