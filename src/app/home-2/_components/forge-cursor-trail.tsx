"use client";

import { useEffect, useRef } from "react";

const TRAIL_IMAGES = [
  { src: "/images/forge/trail-01.jpg", alt: "Matte black Lamborghini" },
  { src: "/images/forge/trail-02.jpg", alt: "Forge Lambo Interior" },
  { src: "/images/forge/trail-03.jpg", alt: "Man in black hoodie" },
  { src: "/images/forge/trail-04.jpg", alt: "Two technicians meticulously applying PPF" },
  { src: "/images/forge/trail-05.jpg", alt: "Rear view of a Porsche GT3RS" },
  { src: "/images/forge/trail-06.jpg", alt: "Craftsman applying PPF" },
  { src: "/images/forge/trail-07.jpg", alt: "Land Rover Defender in the workshop" },
  { src: "/images/forge/trail-08.jpg", alt: "McLaren on grass" },
  { src: "/images/forge/trail-09.jpg", alt: "Audi R8 in orange outside the warehouse" },
  { src: "/images/forge/trail-10.jpg", alt: "Range Rover getting a new wrap" },
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
