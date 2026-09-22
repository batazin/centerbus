"use client";

import { useEffect } from "react";

export function ScrollRevealProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal-fade-up").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          } else {
            // Quando o usuário rola para cima e o elemento fica abaixo da tela novamente,
            // reseta para refazer o motion suave quando ele descer novamente
            if (entry.boundingClientRect.top > window.innerHeight) {
              entry.target.classList.remove("is-revealed");
            }
          }
        });
      },
      {
        // Aciona exatamente quando o elemento entra no campo de visão (60px da base)
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.08,
      }
    );

    const observeAll = () => {
      document.querySelectorAll(".reveal-fade-up").forEach((el) => {
        // Elementos já no topo visível no carregamento ganham revelação inicial
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
          el.classList.add("is-revealed");
        }
        observer.observe(el);
      });
    };

    observeAll();

    const mutationObserver = new MutationObserver(() => {
      document.querySelectorAll(".reveal-fade-up").forEach((el) => {
        observer.observe(el);
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return <>{children}</>;
}
