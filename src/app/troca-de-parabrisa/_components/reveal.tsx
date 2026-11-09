"use client";

import { useEffect } from "react";

/**
 * Revelações leves da LP (sem GSAP e sem mexer na rolagem).
 * - Elementos com [data-reveal] ganham .is-visible ao entrar na tela.
 * - O conteúdo só é escondido depois que o script roda (classe .pb-anim);
 *   sem JS, ou com movimento reduzido, tudo aparece normalmente.
 * - A barra fixa do celular aparece quando os botões do Hero saem da tela.
 */
export function RevealObserver() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".pb-page");
    if (!page) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const items = Array.from(page.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | null = null;

    if (!reduced) {
      // O que já está na tela aparece direto, sem piscar.
      items.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("is-visible");
      });
      page.classList.add("pb-anim");
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
      );
      items.forEach((el) => { if (!el.classList.contains("is-visible")) observer?.observe(el); });
    }

    // Barra do celular: só depois que os botões do Hero saem da tela.
    const heroCtas = page.querySelector(".pb-hero .pb-hero-ctas");
    const barObserver = heroCtas
      ? new IntersectionObserver(([entry]) => page.classList.toggle("pb-show-bar", !entry.isIntersecting && entry.boundingClientRect.top < 0))
      : null;
    if (heroCtas) barObserver?.observe(heroCtas);

    return () => {
      observer?.disconnect();
      barObserver?.disconnect();
      page.classList.remove("pb-anim", "pb-show-bar");
    };
  }, []);

  return null;
}
