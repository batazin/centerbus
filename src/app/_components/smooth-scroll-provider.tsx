"use client";

import Lenis from "lenis";
import { useLayoutEffect } from "react";
import { ScrollTrigger } from "../_lib/gsap";

type SmoothScrollProviderProps = {
  children: React.ReactNode;
  anchorOffset?: number;
  lerp?: number;
  wheelMultiplier?: number;
};

/**
 * Lenis uses a monotonic, frame-clamped browser clock and reports its
 * interpolated position back to ScrollTrigger. Clamping prevents a delayed
 * frame from becoming a large visible scroll step.
 */
export function SmoothScrollProvider({
  children,
  anchorOffset = 0,
  lerp = 0.06,
  wheelMultiplier = 0.85,
}: SmoothScrollProviderProps) {
  useLayoutEffect(() => {
    const lenis = new Lenis({
      lerp,
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier,
      touchMultiplier: 1,
      anchors: { offset: anchorOffset, duration: 0.95 },
      overscroll: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });

    const syncScrollTrigger = () => ScrollTrigger.update();
    lenis.on("scroll", syncScrollTrigger);

    let animationFrame = 0;
    let previousBrowserTime = performance.now();
    let lenisTime = 0;
    const update = (browserTime: number) => {
      const elapsed = Math.max(0, browserTime - previousBrowserTime);
      previousBrowserTime = browserTime;
      lenisTime += Math.min(elapsed, 1000 / 45);
      lenis.raf(lenisTime);
      animationFrame = window.requestAnimationFrame(update);
    };
    animationFrame = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      lenis.off("scroll", syncScrollTrigger);
      lenis.destroy();
    };
  }, [anchorOffset, lerp, wheelMultiplier]);

  return <>{children}</>;
}
