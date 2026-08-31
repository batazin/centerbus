"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../_lib/gsap";
import "./scroll-lab.css";

const BG_IMAGE = "/sequences/bus/frame_0001.webp";
const MAIN_IMAGE = "/sequences/bus/frame_0180.webp";

/**
 * Single test scene to validate the Lenis + gsap.ticker + ScrollTrigger
 * integration before building more scenes: one ScrollTrigger, one timeline,
 * pin + scrub, parallax via yPercent, ease:none throughout.
 */
export function SceneOne() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleARef = useRef<HTMLDivElement>(null);
  const titleBRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const image = imageRef.current;
    const titleA = titleARef.current;
    const titleB = titleBRef.current;
    if (!section || !bg || !image || !titleA || !titleB) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add({ isDesktop: "(min-width: 861px)" }, (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };
        const end = isDesktop ? "+=3200" : "+=1800";

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(bg, { scale: isDesktop ? 1.15 : 1.08, ease: "none" }, 0)
          .to(image, { scale: isDesktop ? 1.25 : 1.12, yPercent: isDesktop ? -8 : -4, ease: "none" }, 0)
          .to(titleA, { yPercent: -100, opacity: 0, ease: "none" }, 0.2)
          .fromTo(titleB, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "none" }, 0.35)
          .to(image, { yPercent: isDesktop ? -20 : -10, ease: "none" }, 0.6);

        return () => tl.scrollTrigger?.kill();
      });
    }, section);

    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={sectionRef} className="scroll-lab-scene" aria-label="Teste de cena cinematográfica">
        <img
          ref={bgRef}
          className="scroll-lab-scene__bg"
          src={BG_IMAGE}
          alt=""
          aria-hidden="true"
          onLoad={() => ScrollTrigger.refresh()}
        />
        <img ref={imageRef} className="scroll-lab-scene__image" src={MAIN_IMAGE} alt="" onLoad={() => ScrollTrigger.refresh()} />
        <div ref={titleARef} className="scroll-lab-scene__title scroll-lab-scene__title--a">
          Primeiro título
        </div>
        <div ref={titleBRef} className="scroll-lab-scene__title scroll-lab-scene__title--b">
          Segundo título
        </div>
      </section>
      <section className="scroll-lab-next">
        <p>Próxima seção — o scroll continua normal depois do pin.</p>
      </section>
    </>
  );
}
