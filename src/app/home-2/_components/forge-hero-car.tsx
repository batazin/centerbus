"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from "react";

export interface ForgeHeroCarHandle {
  setFrame: (progress: number) => void;
  isReady: boolean;
}

interface ForgeHeroCarProps {
  className?: string;
  onReady?: () => void;
}

export const ForgeHeroCar = forwardRef<ForgeHeroCarHandle, ForgeHeroCarProps>(
  function ForgeHeroCar({ className = "", onReady }, ref) {
    const stageWrapperRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const activeFrameRef = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasPaintedFirstFrame, setHasPaintedFirstFrame] = useState(false);
    const [useFallback, setUseFallback] = useState(false);
    const fallbackImgRef = useRef<HTMLImageElement | null>(null);

    // Cover drawing math for canvas
    const drawCover = useCallback((frame: any) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const fw = frame.displayWidth || frame.videoWidth || frame.width || 2880;
      const fh = frame.displayHeight || frame.videoHeight || frame.height || 1620;

      if (!cw || !ch || !fw || !fh) return;

      const scale = Math.max(cw / fw, ch / fh);
      const drawW = fw * scale;
      const drawH = fh * scale;
      const drawX = (cw - drawW) / 2;
      const drawY = (ch - drawH) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(frame, drawX, drawY, drawW, drawH);
    }, []);

    // Expose setFrame method to parent (driven smoothly by ScrollTrigger)
    useImperativeHandle(
      ref,
      () => ({
        isReady: isLoaded,
        setFrame: (progress: number) => {
          const clamped = Math.max(0, Math.min(1, progress));

          // 1. Scrub through video frames (front-facing vehicle sequence)
          if (activeFrameRef.current?.manifest?.totalFrames) {
            const total = activeFrameRef.current.manifest.totalFrames;
            const targetFrame = Math.min(Math.round(clamped * (total - 1)), total - 1);
            activeFrameRef.current.setFrame(targetFrame);
          }

          // 2. Drive vehicle forward into camera / pass through windshield into interior
          // Smooth progressive scale pushing in towards the windshield center
          if (stageWrapperRef.current) {
            const zoomScale = 1 + Math.pow(clamped, 1.25) * 0.95; // grows up to ~1.95x
            const yShift = clamped * 45; // slight shift so camera punches directly into cockpit
            const fadeOut = clamped > 0.88 ? Math.max(0, 1 - (clamped - 0.88) * 7.5) : 1;

            stageWrapperRef.current.style.transform = `scale(${zoomScale}) translateY(${yShift}px)`;
            stageWrapperRef.current.style.opacity = `${fadeOut}`;
          }
        },
      }),
      [isLoaded]
    );

    useEffect(() => {
      let isMounted = true;
      let activeFrameInstance: any = null;

      const handleResize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const newW = Math.max(1, Math.round(rect.width * dpr));
        const newH = Math.max(1, Math.round(rect.height * dpr));

        if (canvas.width !== newW || canvas.height !== newH) {
          canvas.width = newW;
          canvas.height = newH;
          if (activeFrameInstance?.refresh) {
            activeFrameInstance.refresh();
          }
        }
      };

      async function initActiveFrame() {
        if (typeof window === "undefined") return;

        // Check if browser has native VideoDecoder
        if (!("VideoDecoder" in window)) {
          if (isMounted) setUseFallback(true);
          return;
        }

        // Load /ActiveFrame.js script if not loaded
        if (!(window as any).ActiveFrame) {
          try {
            await new Promise<void>((resolve, reject) => {
              const existing = document.querySelector('script[src="/ActiveFrame.js"]');
              if (existing) {
                existing.addEventListener("load", () => resolve(), { once: true });
                existing.addEventListener("error", reject, { once: true });
                return;
              }
              const script = document.createElement("script");
              script.src = "/ActiveFrame.js";
              script.async = true;
              script.onload = () => resolve();
              script.onerror = (e) => reject(e);
              document.head.appendChild(script);
            });
          } catch (e) {
            console.warn("Failed to load /ActiveFrame.js script:", e);
            if (isMounted) setUseFallback(true);
            return;
          }
        }

        if (!isMounted) return;

        const ActiveFrameClass = (window as any).ActiveFrame;
        if (!ActiveFrameClass) {
          if (isMounted) setUseFallback(true);
          return;
        }

        // Initialize canvas resolution
        handleResize();
        window.addEventListener("resize", handleResize, { passive: true });

        try {
          // Front-facing hero intro video sequence
          activeFrameInstance = new ActiveFrameClass("/videos/hero-intro.af", {
            hardwareAcceleration: "prefer-hardware",
            process: async (videoFrame: any) => {
              if (!isMounted) return;
              drawCover(videoFrame);
              setHasPaintedFirstFrame(true);
            },
          });

          await activeFrameInstance.loading;
          if (!isMounted) {
            activeFrameInstance.destroy();
            return;
          }

          activeFrameRef.current = activeFrameInstance;
          // Paint initial frame 0 (front-facing vehicle lineup) immediately
          activeFrameInstance.setFrame(0);
          setIsLoaded(true);
          onReady?.();
        } catch (err) {
          console.warn("ActiveFrame decoder error or fallback:", err);
          if (isMounted) {
            setUseFallback(true);
            setIsLoaded(true);
            onReady?.();
          }
        }
      }

      initActiveFrame();

      return () => {
        isMounted = false;
        window.removeEventListener("resize", handleResize);
        if (activeFrameInstance) {
          activeFrameInstance.destroy();
        }
        activeFrameRef.current = null;
      };
    }, [drawCover, onReady]);

    return (
      <div className={`forge-hero-car-container ${className}`}>
        {/* Inner scaling wrapper centered on the front vehicle hood/windshield */}
        <div
          ref={stageWrapperRef}
          className="forge-hero-car-stage-wrapper"
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 55%",
            willChange: "transform, opacity",
          }}
        >
          {/* Hardware-accelerated canvas for 1:1 front scroll sequence */}
          <canvas
            ref={canvasRef}
            className={`forge-hero-car-canvas ${hasPaintedFirstFrame && !useFallback ? "active" : ""}`}
          />

          {/* Front-Facing Supercars Lineup Poster / Fallback */}
          {(!hasPaintedFirstFrame || useFallback) && (
            <img
              ref={fallbackImgRef}
              src="/images/hero-cars.jpg"
              alt="Forge Automotive Front Supercars Lineup: Porsche 911 GT3, Lotus, Lamborghini, Defender, G63"
              className="forge-hero-car-poster"
            />
          )}
        </div>
      </div>
    );
  }
);
