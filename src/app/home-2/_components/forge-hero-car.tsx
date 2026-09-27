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
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const activeFrameRef = useRef<any>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const lastDrawnFrameRef = useRef<number>(-1);

    const [isLoaded, setIsLoaded] = useState(false);
    const [hasPaintedFirstFrame, setHasPaintedFirstFrame] = useState(false);
    const [useFallback, setUseFallback] = useState(false);

    // Exact drawCoverFrame implementation from Forge Automotive (Chunk 456393)
    const drawCoverFrame = useCallback((ctx: CanvasRenderingContext2D, frame: any, clientWidth: number, clientHeight: number) => {
      const fw = frame.displayWidth || frame.videoWidth || frame.width || 2880;
      const fh = frame.displayHeight || frame.videoHeight || frame.height || 1620;
      if (!clientWidth || !clientHeight || !fw || !fh) return;

      const scale = Math.max(clientWidth / fw, clientHeight / fh);
      const drawW = fw * scale;
      const drawH = fh * scale;
      const drawX = (clientWidth - drawW) / 2;
      const drawY = (clientHeight - drawH) / 2;

      ctx.clearRect(0, 0, clientWidth, clientHeight);
      ctx.drawImage(frame, drawX, drawY, drawW, drawH);
    }, []);

    // Expose setFrame method directly driven by ScrollTrigger progress [0, 1]
    useImperativeHandle(
      ref,
      () => ({
        isReady: isLoaded,
        setFrame: (progress: number) => {
          const clamped = Math.max(0, Math.min(1, progress));
          const af = activeFrameRef.current;
          if (af?.manifest?.totalFrames) {
            const total = af.manifest.totalFrames;
            const targetFrame = Math.min(Math.round(clamped * (total - 1)), total - 1);
            if (targetFrame !== lastDrawnFrameRef.current) {
              lastDrawnFrameRef.current = targetFrame;
              af.setFrame(targetFrame);
            }
          }
        },
      }),
      [isLoaded]
    );

    useEffect(() => {
      let isMounted = true;
      let activeFrameInstance: any = null;

      const updateCanvasSize = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return false;

        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const { clientWidth: w, clientHeight: h } = container;
        if (!w || !h) return false;

        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return false;
        ctxRef.current = ctx;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (activeFrameInstance?.refresh && lastDrawnFrameRef.current >= 0) {
          activeFrameInstance.refresh(lastDrawnFrameRef.current);
        }
        return true;
      };

      async function init() {
        if (typeof window === "undefined") return;

        if (!("VideoDecoder" in window)) {
          if (isMounted) setUseFallback(true);
          return;
        }

        // Ensure /ActiveFrame.js script is loaded
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
            console.warn("ActiveFrame script load error:", e);
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

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize, { passive: true });

        try {
          // Forge Authentic 152-frame scroll sequence: front vehicle drives forward into cockpit
          activeFrameInstance = new ActiveFrameClass("/videos/intro-scroll.af", {
            hardwareAcceleration: "prefer-hardware",
            process: (videoFrame: any) => {
              if (!isMounted) return;
              const ctx = ctxRef.current;
              const container = containerRef.current;
              if (ctx && container) {
                drawCoverFrame(ctx, videoFrame, container.clientWidth, container.clientHeight);
                if (!hasPaintedFirstFrame) {
                  setHasPaintedFirstFrame(true);
                }
              }
            },
          });

          await activeFrameInstance.loading;
          if (!isMounted) {
            activeFrameInstance.destroy();
            return;
          }

          activeFrameRef.current = activeFrameInstance;
          lastDrawnFrameRef.current = 0;
          activeFrameInstance.setFrame(0);
          setIsLoaded(true);
          onReady?.();
        } catch (err) {
          console.warn("ActiveFrame initialization error, using fallback poster:", err);
          if (isMounted) {
            setUseFallback(true);
            setIsLoaded(true);
            onReady?.();
          }
        }
      }

      init();

      return () => {
        isMounted = false;
        window.removeEventListener("resize", updateCanvasSize);
        if (activeFrameInstance) {
          activeFrameInstance.destroy();
        }
        activeFrameRef.current = null;
        ctxRef.current = null;
      };
    }, [drawCoverFrame, hasPaintedFirstFrame, onReady]);

    return (
      <div ref={containerRef} className={`forge-hero-car-container ${className}`}>
        {/* Hardware-accelerated canvas for 1:1 Forge front scroll sequence */}
        <canvas
          ref={canvasRef}
          className={`forge-hero-car-canvas ${hasPaintedFirstFrame && !useFallback ? "active" : ""}`}
        />

        {/* Fallback front lineup poster if loading or unsupported */}
        {(!hasPaintedFirstFrame || useFallback) && (
          <img
            src="/images/hero-cars.jpg"
            alt="Forge Automotive Front Supercars Lineup"
            className="forge-hero-car-poster"
          />
        )}
      </div>
    );
  }
);
