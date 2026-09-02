"use client";

import Lenis from "lenis";
import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../_lib/gsap";

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
  lerp = 0.1,
  wheelMultiplier = 0.78,
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
      // The home depends on scrubbed scrolling; decorative motion still
      // respects reduced-motion in each section.
      respectReducedMotion: false,
    });

    const syncScrollTrigger = () => ScrollTrigger.update();
    lenis.on("scroll", syncScrollTrigger);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", syncScrollTrigger);
      lenis.destroy();
    };
  }, [anchorOffset, lerp, wheelMultiplier]);

  return <>{children}</>;
}
