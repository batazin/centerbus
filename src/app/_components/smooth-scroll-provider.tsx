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
 * Single source of truth for smooth scroll: Lenis is driven exclusively by
 * gsap.ticker (no competing rAF loop) and reports back into ScrollTrigger.
 * physical scroll -> Lenis -> gsap.ticker -> Lenis.raf -> ScrollTrigger.update -> timelines
 */
export function SmoothScrollProvider({
  children,
  anchorOffset = 0,
  lerp = 0.075,
  wheelMultiplier = 0.82,
}: SmoothScrollProviderProps) {
  useLayoutEffect(() => {
    const lenis = new Lenis({
      lerp,
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

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", syncScrollTrigger);
      lenis.destroy();
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [anchorOffset, lerp, wheelMultiplier]);

  return <>{children}</>;
}
