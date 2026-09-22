"use client";

import { useEffect, useRef } from "react";

const TRAIL_IMAGES = [
  {
    src: "https://cdn.sanity.io/images/ed72g2cx/production/c6816412804f885e5d48ee01ee3b9adf93cd6028-216x270.jpg?auto=format",
    alt: "Matte black Lamborghini",
  },
  {
    src: "https://cdn.sanity.io/images/ed72g2cx/production/265550d505b29aab616906bf6bb36e663f026042-216x270.jpg?auto=format",
    alt: "Forge Lambo Interior",
  },
  {
    src: "https://cdn.sanity.io/images/ed72g2cx/production/bac6b66368bb14a5f30b72c9023f0ca415bf445e-216x270.jpg?auto=format",
    alt: "Man in black hoodie",
  },
  {
    src: "https://cdn.sanity.io/images/ed72g2cx/production/0f2d5e67ef0b8559cbac591684049e1c759988b6-216x270.jpg?auto=format",
    alt: "Two technicians meticulously applying PPF",
  },
  {
    src: "https://cdn.sanity.io/images/ed72g2cx/production/07a3bb27867616577bbab5252feea9ee77852428-216x270.jpg?auto=format",
    alt: "Rear view of a Porsche GT3RS",
  },
  {
    src: "https://cdn.sanity.io/images/ed72g2cx/production/2f7e59ac553eeb39525d1b94edfd2f6586a4859e-216x270.jpg?auto=format",
    alt: "Craftsman applying PPF",
  },
  {
    src: "https://cdn.sanity.io/images/ed72g2cx/production/1a6aec7cc7bfe9642a02a0415b2d47abadecb094-216x270.jpg?auto=format",
    alt: "Land Rover Defender in the workshop",
  },
  {
    src: "https://cdn.sanity.io/images/ed72g2cx/production/9de158282b1e95cc1085aa13bcf87216d3f0935f-216x270.jpg?auto=format",
    alt: "McLaren on grass",
  },
  {
    src: "https://cdn.sanity.io/images/ed72g2cx/production/bdb1684b7192aadac5801b8990a0b00a58f4eb76-216x270.jpg?auto=format",
    alt: "Audi R8 in orange outside the warehouse",
  },
  {
    src: "https://cdn.sanity.io/images/ed72g2cx/production/5c3279c79808da6f7a90e463b6fa67e8cefab151-216x270.jpg?auto=format",
    alt: "Range Rover getting a new wrap",
  },
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
