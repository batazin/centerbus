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

// 31 Cinematic photorealistic forward-drive frames
// Bus driving directly forward on the wet road towards the camera with beaming headlights
const TOTAL_DRIVE_FRAMES = 31;
const getFramePath = (idx: number) =>
  `/sequences/bus/frame_${String(idx + 1).padStart(4, "0")}.webp`;

export const ForgeHeroCar = forwardRef<ForgeHeroCarHandle, ForgeHeroCarProps>(
  function ForgeHeroCar({ className = "", onReady }, ref) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const imagesCache = useRef<HTMLImageElement[]>([]);
    const requestedProgressRef = useRef<number>(0);

    const [isLoaded, setIsLoaded] = useState(false);
    const [hasPaintedFirstFrame, setHasPaintedFirstFrame] = useState(false);

    // Exact cover scaling calculation matching Forge Automotive (Chunk 456393)
    const drawCoverFrame = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        clientWidth: number,
        clientHeight: number,
        alpha: number = 1.0,
        extraScale: number = 1.0
      ) => {
        const fw = img.naturalWidth || img.width || 1280;
        const fh = img.naturalHeight || img.height || 720;
        if (!clientWidth || !clientHeight || !fw || !fh) return;

        const baseScale = Math.max(clientWidth / fw, clientHeight / fh);
        const finalScale = baseScale * extraScale;
        const drawW = fw * finalScale;
        const drawH = fh * finalScale;
        const drawX = (clientWidth - drawW) / 2;
        const drawY = (clientHeight - drawH) / 2;

        ctx.globalAlpha = alpha;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      },
      []
    );

    const renderProgress = useCallback(
      (progress: number) => {
        const ctx = ctxRef.current;
        const container = containerRef.current;
        if (!ctx || !container) return;

        const clamped = Math.max(0, Math.min(1, progress));
        const { clientWidth: w, clientHeight: h } = container;
        if (!w || !h) return;

        ctx.clearRect(0, 0, w, h);

        const imgs = imagesCache.current;
        const firstImg = imgs[0];
        if (!firstImg || !firstImg.complete) return;

        // Calculate smooth continuous frame index across the 31 driving frames
        const frameProgress = clamped * (TOTAL_DRIVE_FRAMES - 1);
        const baseIdx = Math.floor(frameProgress);
        const nextIdx = Math.min(baseIdx + 1, TOTAL_DRIVE_FRAMES - 1);
        const t = frameProgress - baseIdx;

        // Subtle scale increase for maximum cinematic punch as bus advances
        const currentScale = 1.0 + 0.12 * Math.pow(clamped, 1.2);

        const baseImg = imgs[baseIdx] && imgs[baseIdx].complete ? imgs[baseIdx] : firstImg;
        const nextImg = imgs[nextIdx] && imgs[nextIdx].complete ? imgs[nextIdx] : baseImg;

        // Draw current driving frame
        drawCoverFrame(ctx, baseImg, w, h, 1.0, currentScale);

        // Sub-frame interpolation between adjacent video frames for ultra-smooth 60fps scrubbing
        if (t > 0.02 && nextImg !== baseImg) {
          drawCoverFrame(ctx, nextImg, w, h, t, currentScale);
        }

        // Atmospheric vignette and headlight bloom enhancement as bus approaches camera
        if (clamped > 0.1) {
          const bloomAlpha = Math.min(0.35, clamped * 0.45);
          const cx = w * 0.5;
          const cy = h * 0.62;
          const r = Math.max(w, h) * 0.45;

          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
          grad.addColorStop(0, `rgba(255, 255, 255, ${bloomAlpha * 0.3})`);
          grad.addColorStop(0.3, `rgba(200, 230, 255, ${bloomAlpha * 0.15})`);
          grad.addColorStop(0.7, `rgba(46, 109, 164, ${bloomAlpha * 0.06})`);
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }

        ctx.globalAlpha = 1.0;

        if (!hasPaintedFirstFrame) {
          setHasPaintedFirstFrame(true);
        }
      },
      [drawCoverFrame, hasPaintedFirstFrame]
    );

    // Expose setFrame method directly driven by ScrollTrigger progress [0, 1]
    useImperativeHandle(
      ref,
      () => ({
        isReady: isLoaded,
        setFrame: (progress: number) => {
          requestedProgressRef.current = progress;
          renderProgress(progress);
        },
      }),
      [isLoaded, renderProgress]
    );

    useEffect(() => {
      let isMounted = true;

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

        renderProgress(requestedProgressRef.current);
        return true;
      };

      updateCanvasSize();
      window.addEventListener("resize", updateCanvasSize, { passive: true });

      // Preload all 31 driving frames
      const loadPromises = Array.from({ length: TOTAL_DRIVE_FRAMES }, (_, idx) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = getFramePath(idx);
          img.onload = () => {
            if (isMounted) {
              imagesCache.current[idx] = img;
              if (idx === 0) {
                renderProgress(0);
                setIsLoaded(true);
                onReady?.();
              }
            }
            resolve(img);
          };
          img.onerror = () => {
            resolve(img);
          };
        });
      });

      Promise.all(loadPromises).then(() => {
        if (!isMounted) return;
        renderProgress(requestedProgressRef.current);
        setIsLoaded(true);
      });

      return () => {
        isMounted = false;
        window.removeEventListener("resize", updateCanvasSize);
        ctxRef.current = null;
      };
    }, [onReady, renderProgress]);

    return (
      <div ref={containerRef} className={`forge-hero-car-container ${className}`}>
        {/* Hardware-accelerated canvas for photorealistic bus driving sequence */}
        <canvas
          ref={canvasRef}
          className={`forge-hero-car-canvas ${hasPaintedFirstFrame ? "active" : ""}`}
        />

        {/* Fallback frame 1 poster if loading */}
        {!hasPaintedFirstFrame && (
          <img
            src="/sequences/bus/frame_0001.webp"
            alt="Center Ônibus - Operação e Rodagem de Carrocerias"
            className="forge-hero-car-poster"
          />
        )}
      </div>
    );
  }
);
