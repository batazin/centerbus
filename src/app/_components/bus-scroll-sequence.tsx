"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";
import "./bus-scroll-sequence.css";

const frameCount = 241;
const framePath = (frame: number) => `/sequences/bus/frame_${String(frame).padStart(4, "0")}.webp`;

const scenes = [
  {
    time: 0,
    label: "ENTRADA",
    title: "O onibus volta pra rua.",
    copy: "A operacao comeca pela identificacao certa: modelo, aplicacao e urgencia da rota.",
  },
  {
    time: 2.2,
    label: "CONFERENCIA",
    title: "Conhecimento antes do catalogo.",
    copy: "Codigo, foto e carroceria entram na mesma conversa antes da peca ser separada.",
  },
  {
    time: 4.6,
    label: "CARROCERIA",
    title: "A peca certa, na primeira vez.",
    copy: "Estrutura, acabamento, iluminacao e climatizacao tratados como parte da operacao.",
  },
  {
    time: 7.1,
    label: "RESPOSTA",
    title: "Prazo claro para quem precisa rodar.",
    copy: "Orcamento objetivo, disponibilidade conferida e acompanhamento ate a retirada ou despacho.",
  },
  {
    time: 9.25,
    label: "SAIDA",
    title: "Operacao seguindo.",
    copy: "Peca conferida, onibus liberado e rota de volta ao movimento.",
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
    const images = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();

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

      drawFrame(frame);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      if (nextScene !== activeSceneRef.current) {
        activeSceneRef.current = nextScene;
        setActiveScene(nextScene);
      }
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
        if (frame === sceneFrames[0]) {
          setIsReady(true);
          scheduleUpdate();
          return;
        }

        if (Math.abs(frame - currentFrame) <= 2) scheduleUpdate();
      };
      image.onerror = () => {
        loading.delete(frame);
      };
    };

    const preloadRange = (startFrame: number, endFrame: number) => {
      const start = Math.max(1, Math.min(startFrame, endFrame) - 4);
      const end = Math.min(frameCount, Math.max(startFrame, endFrame) + 4);
      for (let frame = start; frame <= end; frame++) loadFrame(frame);
    };

    const preloadAllFrames = () => {
      let frame = 1;
      const loadChunk = () => {
        if (disposed) return;
        const chunkEnd = Math.min(frameCount, frame + 11);
        for (; frame <= chunkEnd; frame++) loadFrame(frame);
        if (frame <= frameCount) window.setTimeout(loadChunk, 60);
      };

      loadChunk();
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

    window.addEventListener("resize", handleResize);

    sceneFrames.forEach(loadFrame);
    preloadRange(sceneFrames[0], sceneFrames[1]);
    window.setTimeout(preloadAllFrames, 240);
    scheduleUpdate();
    window.setTimeout(() => ScrollTrigger.refresh(), 80);

    return () => {
      disposed = true;
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      scrollTrigger.kill();
    };
  }, []);

  const scene = scenes[activeScene];

  return (
    <section id="inicio" ref={sectionRef} className="bus-scroll-sequence" aria-label="Sequencia por cenas Center Onibus">
      <div ref={stageRef} className="bus-scroll-sequence-stage">
        <canvas ref={canvasRef} className="bus-scroll-sequence-canvas" aria-hidden="true" />
        <div className="bus-scroll-sequence-shade" aria-hidden="true" />
        <div className="bus-scroll-sequence-grid" aria-hidden="true" />
        <div className="bus-scroll-sequence-copy">
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
        {!isReady && <div className="bus-scroll-sequence-loader">Carregando cena</div>}
      </div>
    </section>
  );
}
