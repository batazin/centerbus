"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CenterPhoto } from "../../_components/center-photo";
import { getLenis } from "../../_components/smooth-scroll-provider";

export type SlideItem = {
  id: string;
  kicker: string;
  title: string;
  desc: string;
  image: string;
  alt: string;
};

type Props = {
  id: string;
  items: SlideItem[];
  ariaLabel: string;
  cta: ReactNode;
};

/** Quantos px um gesto precisa rolar para avançar/voltar um slide. */
const STEP_THRESHOLD_PX = 5;

/**
 * Carrossel de slides em tela cheia controlado pelo scroll.
 * A seção tem altura de uma tela por slide e o painel fica travado no topo (sticky).
 * Cada gesto de scroll avança ou volta um slide (snap pelo Lenis, posições medidas ao vivo).
 * Setas, barras, teclado e swipe rolam a página até o slide correspondente,
 * para o scroll e o slide nunca ficarem dessincronizados.
 */
export function CenterSlideCarousel({ id, items, ariaLabel, cta }: Props) {
  // active: slide visível; previous: o que está saindo; dir: sentido da troca (anima a transição lateral)
  const [view, setView] = useState<{ active: number; previous: number | null; dir: "next" | "prev" | null }>({ active: 0, previous: null, dir: null });
  const { active, previous, dir } = view;
  const setActive = (next: number) =>
    setView((current) => (current.active === next ? current : { active: next, previous: current.active, dir: next > current.active ? "next" : "prev" }));
  const sectionRef = useRef<HTMLElement>(null);
  const scrollToSlideRef = useRef<((index: number) => void) | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const count = items.length;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || count < 2) return;

    let anchor = 0; // slide em que o scroll está "ancorado"
    let snapping = false;
    let settleTimer = 0;
    let wasInside = false;

    // Posições medidas ao vivo: imagens que carregam depois mudam a altura da página,
    // então nada de posições guardadas.
    const bounds = () => {
      const start = section.getBoundingClientRect().top + window.scrollY;
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      return { start, end: start + range, range };
    };
    const slideTop = (index: number) => {
      const { start, range } = bounds();
      return start + (range * index) / (count - 1);
    };
    const show = (index: number) =>
      setView((current) => (current.active === index ? current : { active: index, previous: current.active, dir: index > current.active ? "next" : "prev" }));

    const scrollToSlide = (index: number) => {
      const target = Math.min(count - 1, Math.max(0, index));
      const top = slideTop(target);
      anchor = target;
      show(target); // a transição começa junto com o gesto, sem esperar o scroll terminar
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lenis = getLenis();
      if (!lenis) {
        window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
        return;
      }
      if (Math.abs(top - window.scrollY) < 2) return;
      snapping = true;
      lenis.scrollTo(top, {
        duration: reduced ? 0 : 0.5,
        immediate: reduced,
        lock: true,
        force: true,
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
        // Pequena pausa depois do snap para a inércia do touchpad não pular outro slide.
        onComplete: () => { window.setTimeout(() => { snapping = false; }, 120); },
      });
      if (reduced) snapping = false;
    };
    scrollToSlideRef.current = scrollToSlide;

    const onScroll = () => {
      window.clearTimeout(settleTimer);
      const y = window.scrollY;
      const { start, end, range } = bounds();
      const inside = y >= start - 2 && y <= end + 2;

      if (!inside) {
        // Ao sair, a âncora fica no slide da borda pela qual a pessoa saiu.
        anchor = y < start ? 0 : count - 1;
        wasInside = false;
        show(anchor);
        return;
      }
      if (snapping) return;

      // Entrou agora: alinha no slide da borda (sem deixar o embalo pular slides).
      if (!wasInside) {
        wasInside = true;
        scrollToSlide(anchor);
        return;
      }

      // Cada gesto que passa do limite troca um slide, imediatamente.
      const delta = y - (start + (range * anchor) / (count - 1));
      if (delta > STEP_THRESHOLD_PX && anchor < count - 1) { scrollToSlide(anchor + 1); return; }
      if (delta < -STEP_THRESHOLD_PX && anchor > 0) { scrollToSlide(anchor - 1); return; }

      // Movimento pequeno: volta para o slide atual quando o scroll parar.
      settleTimer = window.setTimeout(() => {
        const b = bounds();
        const yy = window.scrollY;
        if (!snapping && yy > b.start && yy < b.end) scrollToSlide(anchor);
      }, 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settleTimer);
      scrollToSlideRef.current = null;
    };
  }, [count]);

  const go = (index: number) => {
    const target = Math.min(count - 1, Math.max(0, index));
    if (scrollToSlideRef.current) scrollToSlideRef.current(target);
    else setActive(target);
  };

  return (
    <section
      id={id}
      ref={sectionRef}
      className="center-slides-pin"
      style={{ ["--slides-count" as string]: count }}
      aria-label={ariaLabel}
      aria-roledescription="carrossel"
    >
      <div
        className="center-slides"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(active + 1);
          if (event.key === "ArrowLeft") go(active - 1);
        }}
        onTouchStart={(event) => {
          touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(active + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="center-slides-viewport">
          <div className="center-slides-track" data-dir={dir ?? undefined}>
            {items.map((item, index) => {
              const isActive = index === active;
              const isLeaving = index === previous && !isActive;
              return (
                <article
                  key={item.id}
                  className={`center-slide${isActive ? " is-active" : ""}${isLeaving ? " is-leaving" : ""}`}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} de ${count}: ${item.title}`}
                  aria-hidden={!isActive}
                  inert={!isActive}
                >
                  <div className="center-slide-media">
                    <CenterPhoto src={item.image} alt={item.alt} className="center-slide-img" loading={index === 0 ? "eager" : "lazy"} />
                  </div>
                  <div className="center-slide-shade" aria-hidden="true" />
                  <div className="center-slide-copy">
                    <p className="center-slide-kicker">
                      <span>{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
                      {item.kicker}
                    </p>
                    <h3 className="center-slide-title">{item.title}</h3>
                    <p className="center-slide-desc">{item.desc}</p>
                    <div className="center-slide-cta">{cta}</div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="center-slides-controls">
          <div className="center-slides-progress">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`center-slides-bar${index === active ? " is-active" : ""}${index < active ? " is-done" : ""}`}
                onClick={() => go(index)}
                aria-label={`Ir para ${index + 1}: ${item.title}`}
                aria-current={index === active ? "true" : undefined}
              >
                <span className="center-slides-bar-track" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="center-slides-arrows">
            <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Slide anterior"><span aria-hidden="true">←</span></button>
            <button type="button" onClick={() => go(active + 1)} disabled={active === count - 1} aria-label="Próximo slide"><span aria-hidden="true">→</span></button>
          </div>
        </div>
      </div>
    </section>
  );
}
