"use client";

import { useEffect, useRef } from "react";

const TRAIL_IMAGES = [
  { src: "/images/center/step-01-conferencia.jpg", alt: "Conferência técnica de peças" },
  { src: "/images/center/service-iluminacao.jpg", alt: "Iluminação e lanternas de ônibus" },
  { src: "/images/center/step-02-estoque.jpg", alt: "Estoque técnico de peças para carrocerias" },
  { src: "/images/center/service-retrovisores.jpg", alt: "Retrovisores e espelhos de reposição" },
  { src: "/images/center/step-03-despacho.jpg", alt: "Despacho ágil e inspeção de frotas" },
  { src: "/images/center/service-vidros.jpg", alt: "Para-brisas e vidros de carroceria" },
  { src: "/images/center/statement-consultor.jpg", alt: "Consultor especialista Center Ônibus" },
  { src: "/products/co-11084-packaging.webp", alt: "Embalagem filtro CO 11084" },
  { src: "/images/center/approach-workshop.jpg", alt: "Oficina técnica e manutenção de frotas" },
  { src: "/blog/conferencia-estoque.webp", alt: "Organização e controle de estoque" },
];

export function ForgeCursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const indexRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const spawnCard = (x: number, y: number) => {
      const imgData = TRAIL_IMAGES[indexRef.current % TRAIL_IMAGES.length];
      indexRef.current += 1;

      const card = document.createElement("div");
      card.className = "forge-trail-item";
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;

      const rot = (Math.random() - 0.5) * 14;
      card.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0.85)`;
      card.style.opacity = "0";
      card.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease";

      const img = document.createElement("img");
      img.src = imgData.src;
      img.alt = imgData.alt;
      img.draggable = false;
      card.appendChild(img);

      container.appendChild(card);

      // Trigger entrance
      requestAnimationFrame(() => {
        card.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1)`;
        card.style.opacity = "1";
      });

      // Schedule fade out and cleanup
      setTimeout(() => {
        card.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 1, 1), opacity 0.6s ease";
        card.style.transform = `translate(-50%, -50%) rotate(${rot * 1.3}deg) scale(0.92)`;
        card.style.opacity = "0";

        setTimeout(() => {
          if (card.parentNode === container) {
            container.removeChild(card);
          }
        }, 650);
      }, 750);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 75) {
        lastPosRef.current = { x, y };
        spawnCard(x, y);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <div ref={containerRef} className="forge-trail-container" aria-hidden="true" />;
}
