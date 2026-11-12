"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export interface ForgeHeroCarHandle {
  setFrame: (progress: number) => void;
  isReady: boolean;
}

const DESKTOP = "/sequences/bus-body-flow-v2";
const MOBILE = "/sequences/bus-body-flow-mobile-v2";
const FRAME_COUNT = 121;
const FRAMES_PER_SHEET = 16;
const SHEET_COLUMNS = 4;

export const ForgeHeroCar = forwardRef<ForgeHeroCarHandle, { className?: string; onReady?: () => void }>(
  function ForgeHeroCar({ className = "", onReady }, ref) {
    const box = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const poster = useRef<HTMLImageElement>(null);
    const progress = useRef(0);
    const draw = useRef(() => {});
    const ready = useRef(onReady);
    const [painted, setPainted] = useState(false);
    ready.current = onReady;

    useImperativeHandle(ref, () => ({
      isReady: painted,
      setFrame(value) {
        progress.current = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
        draw.current();
      },
    }), [painted]);

    useEffect(() => {
      const element = box.current;
      const surface = canvas.current;
      const opening = poster.current;
      const context = surface?.getContext("2d", { alpha: false });
      if (!element || !surface || !opening || !context) return;

      const mobile = window.matchMedia("(max-width: 1023px)").matches;
      const source = mobile ? MOBILE : DESKTOP;
      const cellWidth = mobile ? 480 : 640;
      const cellHeight = mobile ? 270 : 360;
      const sheets: Array<HTMLImageElement | undefined> = [];
      const closing = new Image();
      let closingReady = false;
      let disposed = false;
      let first = true;
      let request = 0;
      let detailTimer = 0;
      let pendingFrame = 0;
      let detail: { frame: number; image: HTMLImageElement } | undefined;
      let lastFrame = -1;
      let lastImage: HTMLImageElement | undefined;
      let width = 0;
      let height = 0;

      const currentFrame = () => Math.round(progress.current * (FRAME_COUNT - 1));

      const paint = () => {
        request = 0;
        if (!width || !height) return;

        const target = currentFrame();
        let frame = target;
        let image: HTMLImageElement | undefined;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = cellWidth;
        let sourceHeight = cellHeight;

        if (target === 0 && opening.complete && opening.naturalWidth) {
          image = opening;
        } else if (target === FRAME_COUNT - 1 && closingReady) {
          image = closing;
        } else if (detail?.frame === target) {
          image = detail.image;
        }

        if (image) {
          sourceWidth = image.naturalWidth;
          sourceHeight = image.naturalHeight;
        } else {
          // Until all sheets load, use the closest available position.
          let distance = Infinity;
          sheets.forEach((sheet, index) => {
            const start = index * FRAMES_PER_SHEET;
            const end = Math.min(start + FRAMES_PER_SHEET, FRAME_COUNT) - 1;
            const candidate = Math.max(start, Math.min(target, end));
            if (sheet && Math.abs(candidate - target) < distance) {
              distance = Math.abs(candidate - target);
              frame = candidate;
              image = sheet;
              const cell = candidate - start;
              sourceX = cell % SHEET_COLUMNS * cellWidth;
              sourceY = Math.floor(cell / SHEET_COLUMNS) * cellHeight;
            }
          });
        }

        if (!image || (frame === lastFrame && image === lastImage)) return;
        lastFrame = frame;
        lastImage = image;

        const scale = Math.min(width / sourceWidth, height / sourceHeight);
        const imageWidth = sourceWidth * scale;
        const imageHeight = sourceHeight * scale;
        const left = (width - imageWidth) / 2;
        const top = (height - imageHeight) / 2;

        // Fill the full backing surface before compositing the scene and its edges.
        context.fillStyle = "#122b4a";
        context.fillRect(0, 0, width, height);
        if (top > 0) {
          context.drawImage(image, sourceX, sourceY, sourceWidth, 1, 0, 0, width, top + 1);
          context.drawImage(image, sourceX, sourceY + sourceHeight - 1, sourceWidth, 1, 0, top + imageHeight - 1, width, top + 1);
          if (mobile) {
            const upperFade = context.createLinearGradient(0, 0, 0, top);
            upperFade.addColorStop(0.81, "#122b4a");
            upperFade.addColorStop(1, "rgba(18,43,74,0)");
            context.fillStyle = upperFade;
            context.fillRect(0, 0, width, top);
            const lowerFade = context.createLinearGradient(0, top + imageHeight, 0, height);
            lowerFade.addColorStop(0, "rgba(18,43,74,0)");
            lowerFade.addColorStop(0.19, "#122b4a");
            context.fillStyle = lowerFade;
            context.fillRect(0, top + imageHeight, width, top);
          }
        } else if (left > 0) {
          context.drawImage(image, sourceX, sourceY, 1, sourceHeight, 0, 0, left + 1, height);
          context.drawImage(image, sourceX + sourceWidth - 1, sourceY, 1, sourceHeight, left + imageWidth - 1, 0, left + 1, height);
        }
        context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, left, top, imageWidth, imageHeight);

        if (first) {
          first = false;
          setPainted(true);
          ready.current?.();
        }
      };

      const schedule = () => {
        if (!disposed && !request) request = requestAnimationFrame(paint);
      };
      draw.current = () => {
        const frame = currentFrame();
        if (pendingFrame === frame) return;
        pendingFrame = frame;
        schedule();
        window.clearTimeout(detailTimer);
        if (frame === 0 || frame === FRAME_COUNT - 1 || detail?.frame === frame) return;

        // Use the full-resolution frame once the scroll stops.
        detailTimer = window.setTimeout(() => {
          const image = new Image();
          const file = String(frame * 2 + 1).padStart(4, "0");
          image.src = source + "/frame_" + file + ".webp";
          void image.decode().then(() => {
            if (disposed || currentFrame() !== frame) return;
            detail = { frame, image };
            schedule();
          }).catch(() => {});
        }, 170);
      };
      opening.addEventListener("load", schedule);

      for (let index = 0; index < Math.ceil(FRAME_COUNT / FRAMES_PER_SHEET); index++) {
        const sheet = new Image();
        sheet.src = source + "-sheets/sheet_" + index + ".webp";
        void sheet.decode().then(() => {
          if (disposed) return;
          sheets[index] = sheet;
          schedule();
        }).catch(() => {});
      }

      closing.fetchPriority = "low";
      closing.src = source + "/frame_0241.webp";
      void closing.decode().then(() => {
        closingReady = true;
        schedule();
      }).catch(() => {});

      const resize = () => {
        width = element.clientWidth;
        height = element.clientHeight;
        if (!width || !height) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        surface.width = Math.round(width * dpr);
        surface.height = Math.round(height * dpr);
        context.setTransform(surface.width / width, 0, 0, surface.height / height, 0, 0);
        lastFrame = -1;
        schedule();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(element);
      resize();

      return () => {
        disposed = true;
        cancelAnimationFrame(request);
        window.clearTimeout(detailTimer);
        observer.disconnect();
        opening.removeEventListener("load", schedule);
        draw.current = () => {};
      };
    }, []);

    return (
      <div ref={box} className={`forge-hero-car-container ${className}`}>
        <canvas ref={canvas} aria-hidden="true" className={`forge-hero-car-canvas ${painted ? "active" : ""}`} />
        <picture hidden={painted}>
          <source media="(max-width: 1023px)" srcSet={MOBILE + "/frame_0001.webp"} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={poster} src={DESKTOP + "/frame_0001.webp"} fetchPriority="high" alt="Ônibus rodoviário brasileiro em estúdio, com desmontagem da carroceria durante a rolagem" className="forge-hero-car-poster" />
        </picture>
      </div>
    );
  },
);
