"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";
import "./bus-scroll-sequence.css";

const frameCount = 241;
const criticalFrameCount = 14;
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
    const images = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();
    const settledCriticalFrames = new Set<number>();
    let backgroundPreloadStarted = false;

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

      if (images.has(sceneFrames[0]) && loaded >= 8 && !backgroundPreloadStarted) {
        backgroundPreloadStarted = true;
        window.setTimeout(() => {
          preloadSceneFrames();
          window.setTimeout(preloadAllFrames, 420);
        }, 240);
      }
    };

    const resizeCanvas = () => {
      const context = canvas.getContext("2d");
      if (!context) return null;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const nextCanvasWidth = Math.round(width * ratio);
      const nextCanvasHeight = Math.round(height * ratio);

      if (canvasWidth !== nextCanvasWidth || canvasHeight !== nextCanvasHeight) {
        canvasWidth = nextCanvasWidth;
        canvasHeight = nextCanvasHeight;
        canvas.width = nextCanvasWidth;
        canvas.height = nextCanvasHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      return { context, width, height };
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

    const drawFrame = (frame: number) => {
      const canvasInfo = resizeCanvas();
      if (!canvasInfo) return;

      const loadedFrame = nearestLoadedFrame(frame);
      if (!loadedFrame) return;

      const image = images.get(loadedFrame);
      if (!image?.naturalWidth || !image.naturalHeight) return;

      const { context, width, height } = canvasInfo;
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;

      context.clearRect(0, 0, width, height);
      context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      currentFrame = frame;
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
      const frame = Math.max(1, Math.min(frameCount, Math.round(progress * (frameCount - 1)) + 1));
      const nextScene = getSceneFromFrame(frame);

      if (progress > 0.008 && !hasUserControl) {
        hasUserControl = true;
        setHasOperated(true);
        if (idleFrame !== undefined) {
          window.cancelAnimationFrame(idleFrame);
          idleFrame = undefined;
        }
      }

      for (let offset = -2; offset <= 2; offset++) {
        const requestedFrame = frame + offset;
        if (requestedFrame >= 1 && requestedFrame <= frameCount) loadFrame(requestedFrame);
      }

      drawFrame(frame);

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
      const frame = Math.round(1 + cycle * 27);

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

    const loadFrame = (frame: number) => {
      if (images.has(frame) || loading.has(frame)) return;

      loading.add(frame);
      const image = new Image();
      image.decoding = "async";
      image.src = framePath(frame);
      image.onload = () => {
        loading.delete(frame);
        if (disposed) return;
        images.set(frame, image);
        announceBootProgress(frame);
        if (frame === sceneFrames[0]) {
          setIsReady(true);
          scheduleUpdate();
          if (!reduceMotion && idleFrame === undefined) {
            idleFrame = window.requestAnimationFrame(runIdlePreview);
          }
          return;
        }

        if (Math.abs(frame - currentFrame) <= 2) scheduleUpdate();
      };
      image.onerror = () => {
        loading.delete(frame);
        announceBootProgress(frame);
      };
    };

    const preloadAllFrames = () => {
      let frame = 1;
      const loadChunk = () => {
        if (disposed) return;
        const chunkEnd = Math.min(frameCount, frame + (window.innerWidth < 760 ? 3 : 7));
        for (; frame <= chunkEnd; frame++) loadFrame(frame);
        if (frame <= frameCount) window.setTimeout(loadChunk, window.innerWidth < 760 ? 150 : 95);
      };

      loadChunk();
    };

    const preloadSceneFrames = () => {
      sceneFrames.forEach((sceneFrame) => {
        for (let offset = -3; offset <= 3; offset++) {
          const frame = sceneFrame + offset;
          if (frame >= 1 && frame <= frameCount) loadFrame(frame);
        }
      });
    };

    const handleResize = () => {
      canvasWidth = 0;
      canvasHeight = 0;
      scheduleUpdate();
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * 4, 1800)}`,
      pin: stage,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => updateFromProgress(self.progress),
      onRefresh: (self) => updateFromProgress(self.progress),
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

    for (let frame = 1; frame <= criticalFrameCount; frame++) loadFrame(frame);
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
