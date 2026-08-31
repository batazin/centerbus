"use client";

import Lenis from "lenis";
import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../_lib/gsap";

/**
 * Single source of truth for smooth scroll: Lenis is driven exclusively by
 * gsap.ticker (no competing rAF loop) and reports back into ScrollTrigger.
 * physical scroll -> Lenis -> gsap.ticker -> Lenis.raf -> ScrollTrigger.update -> timelines
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      respectReducedMotion: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
