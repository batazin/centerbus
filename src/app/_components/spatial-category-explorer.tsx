"use client";

import gsap from "gsap";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Category = {
  code: string;
  title: string;
  detail: string;
  application: string;
  examples: string;
  availability: string;
};

type SpatialCategoryExplorerProps = {
  categories: readonly Category[];
};

// Continuous circular offset calculation supporting any real position
const wrapOffset = (index: number, position: number, length: number) => {
  let diff = (index - position) % length;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
};

export function SpatialCategoryExplorer({ categories }: SpatialCategoryExplorerProps) {
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState(0);
  const positionRef = useRef(0);
  const activeRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const isInteractingRef = useRef(false);
  const dragStartRef = useRef<number | null>(null);
  const dragPositionStartRef = useRef(0);
  const dragDeltaRef = useRef(0);

  activeRef.current = active;

  const select = useCallback(
    (next: number, duration = 0.7) => {
      const normalized = ((next % categories.length) + categories.length) % categories.length;
      const offset = wrapOffset(normalized, positionRef.current, categories.length);
      const target = positionRef.current + offset;

      setActive(normalized);

      if (tweenRef.current) tweenRef.current.kill();
      const proxy = { val: positionRef.current };
      tweenRef.current = gsap.to(proxy, {
        val: target,
        duration,
        ease: "power3.out",
        onUpdate: () => {
          positionRef.current = proxy.val;
          setPosition(proxy.val);
        },
      });
    },
    [categories.length],
  );

  // Auto-play infinite loop timer (pauses when user hovers or interacts)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isInteractingRef.current && typeof document !== "undefined" && document.visibilityState === "visible") {
        select(activeRef.current + 1);
      }
    }, 4500);

    return () => {
      clearInterval(timer);
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [select]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (tweenRef.current) tweenRef.current.kill();
    isInteractingRef.current = true;
    dragStartRef.current = event.clientX;
    dragPositionStartRef.current = positionRef.current;
    dragDeltaRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current === null) return;
    dragDeltaRef.current = event.clientX - dragStartRef.current;
    const nextPosition = dragPositionStartRef.current - dragDeltaRef.current / 260;
    positionRef.current = nextPosition;
    setPosition(nextPosition);
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current === null) return;
    const delta = dragDeltaRef.current;
    dragStartRef.current = null;
    dragDeltaRef.current = 0;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const directionalBias = Math.abs(delta) > 40 ? (delta < 0 ? 0.35 : -0.35) : 0;
    const target = Math.round(positionRef.current + directionalBias);
    const normalized = ((target % categories.length) + categories.length) % categories.length;

    setActive(normalized);

    if (tweenRef.current) tweenRef.current.kill();
    const proxy = { val: positionRef.current };
    tweenRef.current = gsap.to(proxy, {
      val: target,
      duration: 0.55,
      ease: "power3.out",
      onUpdate: () => {
        positionRef.current = proxy.val;
        setPosition(proxy.val);
      },
      onComplete: () => {
        isInteractingRef.current = false;
      },
    });
  };

  return (
    <div
      className="home-spatial-catalog"
      aria-label="Explorador de categorias"
      onMouseEnter={() => {
        isInteractingRef.current = true;
      }}
      onMouseLeave={() => {
        if (dragStartRef.current === null) {
          isInteractingRef.current = false;
        }
      }}
    >
      <div className="home-spatial-toolbar">
        <div>
          <span>Categoria ativa</span>
          <strong>0{active + 1} / 0{categories.length}</strong>
        </div>
        <p>Arraste pelo túnel</p>
        <div className="home-spatial-controls">
          <button
            type="button"
            onClick={() => {
              isInteractingRef.current = true;
              select(active - 1);
            }}
            aria-label="Categoria anterior"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => {
              isInteractingRef.current = true;
              select(active + 1);
            }}
            aria-label="Próxima categoria"
          >
            →
          </button>
        </div>
      </div>

      <div
        className="home-spatial-viewport"
        role="region"
        aria-roledescription="carrossel 3D"
        aria-label="Categorias de peças"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onPointerLeave={(event) => {
          if (dragStartRef.current !== null && event.currentTarget.hasPointerCapture(event.pointerId)) finishDrag(event);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            isInteractingRef.current = true;
            select(active - 1);
          }
          if (event.key === "ArrowRight") {
            isInteractingRef.current = true;
            select(active + 1);
          }
        }}
      >
        <span className="home-spatial-axis" aria-hidden="true" />
        <div className="home-spatial-stage">
          {categories.map((category, index) => {
            const logicalOffset = wrapOffset(index, active, categories.length);
            const offset = wrapOffset(index, position, categories.length);
            const distance = Math.abs(offset);
            const depth = Math.min(distance, 2.25);
            const style = {
              "--card-x": `${offset * 54}%`,
              "--card-y": `${depth * 11}px`,
              "--card-z": `${depth * -260}px`,
              "--card-rotate": `${offset * -22}deg`,
              "--card-tilt": `${depth * 1.2}deg`,
              "--card-scale": String(Math.max(0.62, 1 - depth * 0.18)),
              "--card-opacity": String(Math.max(0.08, 1 - depth * 0.48)),
              "--card-blur": `${Math.max(0, depth - 0.15) * 3.2}px`,
              zIndex: Math.round((categories.length - depth) * 10),
            } as React.CSSProperties;

            return (
              <article
                className={logicalOffset === 0 ? "is-active" : ""}
                style={style}
                key={category.code}
                aria-hidden={logicalOffset !== 0}
                onClick={() => {
                  if (logicalOffset !== 0) {
                    isInteractingRef.current = true;
                    select(index);
                  }
                }}
              >
                <div className="home-spatial-card-head">
                  <span>{category.code}</span>
                  <small>0{index + 1}</small>
                </div>
                <div className="home-spatial-card-title">
                  <p>Linha Center Ônibus</p>
                  <h3>{category.title}</h3>
                  <strong>{category.detail}</strong>
                </div>
                <dl>
                  <div><dt>Aplicação</dt><dd>{category.application}</dd></div>
                  <div><dt>Exemplos</dt><dd>{category.examples}</dd></div>
                  <div><dt>Conferência</dt><dd>{category.availability}</dd></div>
                </dl>
                <Link href="/produtos" tabIndex={logicalOffset === 0 ? 0 : -1}>
                  Ver linha <span aria-hidden="true">→</span>
                </Link>
              </article>
            );
          })}
        </div>
      </div>

      <div
        className="home-spatial-dots"
        aria-label="Selecionar categoria"
        style={{
          "--dot-count": categories.length,
          "--rail-position": `${(active / categories.length) * 100}%`,
        } as React.CSSProperties}
      >
        {categories.map((category, index) => (
          <button
            type="button"
            className={index === active ? "is-active" : ""}
            aria-label={`Selecionar ${category.title}`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => {
              isInteractingRef.current = true;
              select(index);
            }}
            key={category.code}
          >
            <span>{category.code}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
