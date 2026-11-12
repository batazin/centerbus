"use client";
import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
export interface ForgeHeroCarHandle { setFrame: (progress: number) => void; isReady: boolean; }
const COUNT = 241;

export const ForgeHeroCar = forwardRef<ForgeHeroCarHandle, { className?: string; onReady?: () => void }>(
 function ForgeHeroCar({ className = "", onReady }, ref) {
  const sourceRoot = useRef("/sequences/bus-body-flow-v2");
  const path = (i: number) => `${sourceRoot.current}/frame_${String(i + 1).padStart(4, "0")}.webp`;
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const progress = useRef(0);
  const update = useRef<() => void>(() => {});
  const ready = useRef(onReady);
  const [painted, setPainted] = useState(false);
  ready.current = onReady;
  useImperativeHandle(ref, () => ({ isReady: painted, setFrame(p) {
   progress.current = Number.isFinite(p) ? Math.max(0, Math.min(1, p)) : 0;
   update.current();
  }}), [painted]);
  useEffect(() => {
   const el = box.current, cv = canvas.current, ctx = cv?.getContext("2d", { alpha: false });
   if (!el || !cv || !ctx) return;
   const mobile = window.matchMedia("(max-width: 1023px)").matches;
   sourceRoot.current = mobile ? "/sequences/bus-body-flow-mobile-v2" : "/sequences/bus-body-flow-v2";
   let disposed = false, first = true, active = 0, raf = 0, previousTarget = 0;
   const images = new Map<number, HTMLImageElement>();
   const anchors = new Set([0, 60, 120, 180, 240]);
   const cacheLimit = mobile ? 16 : 32;
   const requested = new Set<number>();
   const queue: number[] = [0, 60, 120, 180, 240];
   const target = () => Math.round(progress.current * (COUNT - 1));
   const paint = () => {
    raf = 0;
    if (disposed || !images.size) return;
    const n = target();
    const nearest = images.has(n) ? n : Array.from(images.keys()).reduce((a, b) => Math.abs(b-n) < Math.abs(a-n) ? b : a);
    const im = images.get(nearest)!;
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    const s = Math.min(w/im.naturalWidth, h/im.naturalHeight);
    const iw = im.naturalWidth*s, ih = im.naturalHeight*s;
    const left = (w-iw)/2, top = (h-ih)/2;
    // Extend the studio backdrop to the edges without cropping the assembly.
    if (top > 0) {
     ctx.drawImage(im,0,0,im.naturalWidth,1,0,0,w,top+1);
     ctx.drawImage(im,0,im.naturalHeight-1,im.naturalWidth,1,0,top+ih-1,w,top+1);
     if (mobile) {
      const upperFade = ctx.createLinearGradient(0,0,0,top);
      upperFade.addColorStop(0,"#122b4a");
      upperFade.addColorStop(0.81,"#122b4a");
      upperFade.addColorStop(1,"rgba(18,43,74,0)");
      ctx.fillStyle = upperFade;
      ctx.fillRect(0,0,w,top);
      const lowerFade = ctx.createLinearGradient(0,top+ih,0,h);
      lowerFade.addColorStop(0,"rgba(18,43,74,0)");
      lowerFade.addColorStop(0.19,"#122b4a");
      lowerFade.addColorStop(1,"#122b4a");
      ctx.fillStyle = lowerFade;
      ctx.fillRect(0,top+ih,w,top);
     }
    } else if (left > 0) {
     ctx.drawImage(im,0,0,1,im.naturalHeight,0,0,left+1,h);
     ctx.drawImage(im,im.naturalWidth-1,0,1,im.naturalHeight,left+iw-1,0,left+1,h);
    }
    // Never blend adjacent frames: blending creates duplicate headlights and bodywork.
    ctx.drawImage(im,left,top,iw,ih);
    if (first) { first = false; setPainted(true); ready.current?.(); }
   };
   const draw = () => { if (!raf) raf = requestAnimationFrame(paint); };
   const pump = () => {
    while (!disposed && active < 4 && queue.length) {
     const n = queue.shift()!;
     if (requested.has(n)) continue;
     requested.add(n); active++;
     const im = new Image(); im.decoding = "async";
     im.onload = () => { if (!disposed) { images.set(n,im);
       while (images.size > cacheLimit) {
        const candidates = Array.from(images.keys()).filter(i => !anchors.has(i) && i !== target());
        const farthest = candidates.sort((a,b) => Math.abs(b-target())-Math.abs(a-target()))[0];
        if (farthest === undefined) break;
        images.delete(farthest); requested.delete(farthest);
       }
       active--; draw(); pump(); } };
     im.onerror = () => { if (!disposed) { active--; pump(); } };
     im.src = path(n);
    }
   };
   update.current = () => {
    const n = target();
    const direction=n>=previousTarget?1:-1;previousTarget=n;
    const behind=mobile?2:6,ahead=mobile?8:18;
    const nearby=Array.from({length:behind+ahead+1},(_,i)=>n+(i-behind)*direction).filter(i=>i>=0&&i<COUNT&&!requested.has(i)).sort((a,b)=>Math.abs(a-n)-Math.abs(b-n));
    queue.splice(0,queue.length,...new Set([...nearby,...Array.from(anchors).filter(i=>!requested.has(i))]));
    pump(); draw();
   };
   const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1,1.5);
    cv.width = Math.round(el.clientWidth*dpr); cv.height = Math.round(el.clientHeight*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0); draw();
   };
   const observer = new ResizeObserver(resize); observer.observe(el); resize(); pump();
   return () => { disposed=true; cancelAnimationFrame(raf); observer.disconnect(); images.clear(); update.current=()=>{}; };
  },[]);
  return <div ref={box} className={`forge-hero-car-container ${className}`}>
   <canvas ref={canvas} aria-hidden="true" className={`forge-hero-car-canvas ${painted ? "active" : ""}`} />
   {!painted && <picture><source media="(max-width: 1023px)" srcSet="/sequences/bus-body-flow-mobile-v2/frame_0001.webp" /><img src="/sequences/bus-body-flow-v2/frame_0001.webp" alt="Ônibus rodoviário brasileiro em estúdio, com desmontagem da carroceria durante a rolagem" className="forge-hero-car-poster" /></picture>}
  </div>;
 }
);
