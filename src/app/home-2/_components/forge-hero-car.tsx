"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../../_lib/gsap";

const TOTAL_FRAMES = 241;
const framePath = (frame: number) => `/sequences/bus/frame_${String(frame).padStart(4, "0")}.webp`;

export function ForgeHeroCar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const busWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const introTextRef = useRef<HTMLDivElement>(null);
  const revealTextRef = useRef<HTMLDivElement>(null);

  // Default to 'video' media as requested by user ("coloca outro video/midia na hero")
  const [activeMedia, setActiveMedia] = useState<"video" | "3d">("video");
  const [initialFrameLoaded, setInitialFrameLoaded] = useState(false);

  // Store loaded images for 3D sequence
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const activeFrameIndexRef = useRef<number>(1);

  // Helper to draw a specific frame to the canvas
  const drawFrame = (frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = imagesRef.current.get(frameNum);
    if (!img || !img.complete || img.naturalWidth === 0) {
      let nearest = 1;
      let minDiff = Infinity;
      for (const [key, val] of imagesRef.current.entries()) {
        if (val.complete && val.naturalWidth > 0) {
          const diff = Math.abs(key - frameNum);
          if (diff < minDiff) {
            minDiff = diff;
            nearest = key;
          }
        }
      }
      img = imagesRef.current.get(nearest);
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return;

    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const scale = Math.max(cw / nw, ch / nh);
    const sw = nw * scale;
    const sh = nh * scale;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  };

  // 1. Preload 3D sequence in background
  useEffect(() => {
    let isCancelled = false;

    const img1 = new Image();
    img1.src = framePath(1);
    img1.onload = () => {
      if (isCancelled) return;
      imagesRef.current.set(1, img1);
      setInitialFrameLoaded(true);
      if (activeMedia === "3d") drawFrame(1);
    };

    const anchors: number[] = [];
    for (let i = 5; i <= TOTAL_FRAMES; i += 5) {
      anchors.push(i);
    }
    if (!anchors.includes(TOTAL_FRAMES)) anchors.push(TOTAL_FRAMES);

    const loadAnchorBatch = async () => {
      for (const frame of anchors) {
        if (isCancelled) break;
        if (imagesRef.current.has(frame)) continue;

        const img = new Image();
        img.src = framePath(frame);
        img.onload = () => {
          if (!isCancelled) {
            imagesRef.current.set(frame, img);
          }
        };
      }

      for (let frame = 2; frame <= TOTAL_FRAMES; frame++) {
        if (isCancelled) break;
        if (imagesRef.current.has(frame)) continue;

        const img = new Image();
        img.src = framePath(frame);
        img.onload = () => {
          if (!isCancelled) {
            imagesRef.current.set(frame, img);
          }
        };
      }
    };

    const timer = setTimeout(() => {
      loadAnchorBatch();
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [activeMedia]);

  // 2. Resize Canvas with DPR
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const stage = stageRef.current;
      if (!canvas || !stage) return;

      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      if (activeMedia === "3d") {
        drawFrame(activeFrameIndexRef.current);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialFrameLoaded, activeMedia]);

  // 3. Mouse 3D Perspective Tilt on the media wrapper
  useEffect(() => {
    const stage = stageRef.current;
    const busWrapper = busWrapperRef.current;
    if (!stage || !busWrapper) return;

    const rotX = gsap.quickTo(busWrapper, "rotationX", { duration: 0.8, ease: "power2.out" });
    const rotY = gsap.quickTo(busWrapper, "rotationY", { duration: 0.8, ease: "power2.out" });
    const transX = gsap.quickTo(busWrapper, "xPercent", { duration: 0.8, ease: "power2.out" });
    const transY = gsap.quickTo(busWrapper, "yPercent", { duration: 0.8, ease: "power2.out" });

    const handlePointerMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      rotY(x * 3.5);
      rotX(-y * 2.5);
      transX(x * 1.2);
      transY(y * 1.2);
    };

    const handlePointerLeave = () => {
      rotX(0);
      rotY(0);
      transX(0);
      transY(0);
    };

    stage.addEventListener("mousemove", handlePointerMove, { passive: true });
    stage.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    return () => {
      stage.removeEventListener("mousemove", handlePointerMove);
      stage.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  // 4. GSAP ScrollTrigger Sequence Scrubbing & Narrative
  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    const busWrapper = busWrapperRef.current;
    const introText = introTextRef.current;
    const revealText = revealTextRef.current;

    if (!container || !stage || !busWrapper) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=180%",
          pin: stage,
          scrub: 0.35,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Update 3D canvas frames if in 3D mode
            if (activeMedia === "3d") {
              const targetFrame = Math.min(
                TOTAL_FRAMES,
                Math.max(1, Math.round(self.progress * (TOTAL_FRAMES - 1)) + 1)
              );
              if (targetFrame !== activeFrameIndexRef.current) {
                activeFrameIndexRef.current = targetFrame;
                drawFrame(targetFrame);
              }
            }
          },
        },
      });

      // 1. Initial headline fades out and lifts
      if (introText) {
        tl.to(
          introText,
          {
            opacity: 0,
            y: -50,
            duration: 0.3,
            ease: "power2.inOut",
          },
          0
        );
      }

      // 2. Bus media scales and drives forward
      tl.to(
        busWrapper,
        {
          scale: 1.22,
          y: "4%",
          duration: 1,
          ease: "none",
        },
        0
      );

      // 3. Technical statement emerges in center as the bus moves
      if (revealText) {
        tl.fromTo(
          revealText,
          { opacity: 0, y: 40, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          0.25
        );

        tl.to(
          revealText,
          {
            opacity: 0.15,
            y: -25,
            scale: 1.04,
            duration: 0.3,
            ease: "power2.in",
          },
          0.72
        );
      }
    }, container);

    return () => ctx.revert();
  }, [initialFrameLoaded, activeMedia]);

  return (
    <div ref={containerRef} className="f-hero-scroll-track" id="hero">
      <div ref={stageRef} className="f-hero-stage">
        {/* Media Switcher Badge (Top Right of Hero) */}
        <div className="f-hero-media-switch" aria-label="Alternar Mídia da Hero">
          <button
            type="button"
            className={`f-hero-switch-btn ${activeMedia === "video" ? "active" : ""}`}
            onClick={() => setActiveMedia("video")}
            title="Vídeo real da operação em movimento"
          >
            <span>▶ VÍDEO OPERACIONAL</span>
          </button>
          <button
            type="button"
            className={`f-hero-switch-btn ${activeMedia === "3d" ? "active" : ""}`}
            onClick={() => setActiveMedia("3d")}
            title="Sequência técnica 3D interativa no scroll"
          >
            <span>⟳ SEQUÊNCIA 3D</span>
          </button>
        </div>

        {/* Bus Media Stage Wrapper */}
        <div
          ref={busWrapperRef}
          className="f-hero-car-wrapper"
          style={{ transformOrigin: "50% 60%" }}
        >
          {/* 1. Real Bus Video Loop */}
          {activeMedia === "video" && (
            <video
              ref={videoRef}
              src="/video/video1.mp4"
              autoPlay
              loop
              muted
              playsInline
              poster="/images/center/hero-bus-lineup.jpg"
              className="f-hero-bus-video"
            />
          )}

          {/* 2. Main 3D Bus Canvas */}
          <canvas
            ref={canvasRef}
            className={`f-hero-car-canvas ${activeMedia === "3d" ? "active" : ""}`}
            style={{ display: activeMedia === "3d" ? "block" : "none" }}
          />

          {/* 3. Fallback High-Res Bus Lineup Image */}
          {activeMedia === "3d" && !initialFrameLoaded && (
            <img
              src="/images/center/hero-bus-lineup.jpg"
              alt="Center Ônibus - Estrutura técnica para carrocerias de ônibus"
              className="f-hero-car-img"
            />
          )}
        </div>

        {/* Ambient Dark Gradient Overlay */}
        <div className="f-hero-overlay" />

        {/* Initial Hero Headlines */}
        <div ref={introTextRef} className="f-hero-content">
          <span className="f-hero-tag">DISTRIBUIÇÃO TÉCNICA DE PEÇAS</span>
          <h1 className="f-hero-title">O ÔNIBUS VOLTA PRA RUA.</h1>
          <p className="f-hero-desc">
            Mais de 30 mil itens para carrocerias de ônibus, vans e transporte de passageiros.
            A peça certa, na primeira vez.
          </p>
          <div className="f-hero-cta-wrap">
            <a href="#catalogo" className="f-btn f-btn-primary">
              <span className="f-btn-shine" aria-hidden="true" />
              <span className="f-btn-label">CONSULTAR CÓDIGO DA PEÇA</span>
            </a>
          </div>
        </div>

        {/* Drive-Forward Technical Statement */}
        <div ref={revealTextRef} className="f-hero-reveal-center">
          <p className="f-hero-reveal-tag">RESPOSTA NO TEMPO DA OPERAÇÃO</p>
          <h2 className="f-hero-reveal-headline">
            CONHECIMENTO ANTES DO CATÁLOGO.
            <br />
            <span>A PEÇA CERTA, NA PRIMEIRA VEZ.</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
