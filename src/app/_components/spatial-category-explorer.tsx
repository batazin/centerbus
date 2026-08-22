"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

const wrapOffset = (index: number, active: number, length: number) => {
  let offset = index - active;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
};

export function SpatialCategoryExplorer({ categories }: SpatialCategoryExplorerProps) {
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState(0);
  const dragStartRef = useRef<number | null>(null);
  const dragPositionStartRef = useRef(0);
  const dragDeltaRef = useRef(0);
  const currentPositionRef = useRef(0);
  const targetPositionRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const animate = () => {
      if (dragStartRef.current === null) {
        const distance = targetPositionRef.current - currentPositionRef.current;
        if (reducedMotion) {
          currentPositionRef.current = targetPositionRef.current;
          velocityRef.current = 0;
        } else {
          velocityRef.current = (velocityRef.current + distance * 0.075) * 0.78;
          currentPositionRef.current += velocityRef.current;
          if (Math.abs(distance) < 0.0008 && Math.abs(velocityRef.current) < 0.0008) {
            currentPositionRef.current = targetPositionRef.current;
            velocityRef.current = 0;
          }
        }

        if (Math.abs(distance) > 0.0001 || Math.abs(velocityRef.current) > 0.0001) {
          setPosition(currentPositionRef.current);
        }
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const select = (next: number) => {
    const normalized = (next + categories.length) % categories.length;
    const offset = wrapOffset(normalized, currentPositionRef.current, categories.length);
    targetPositionRef.current = currentPositionRef.current + offset;
    setActive(normalized);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = event.clientX;
    dragPositionStartRef.current = currentPositionRef.current;
    dragDeltaRef.current = 0;
    velocityRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current === null) return;
    dragDeltaRef.current = event.clientX - dragStartRef.current;
    const nextPosition = dragPositionStartRef.current - dragDeltaRef.current / 240;
    currentPositionRef.current = nextPosition;
    targetPositionRef.current = nextPosition;
    setPosition(nextPosition);
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current === null) return;
    const delta = dragDeltaRef.current;
    dragStartRef.current = null;
    dragDeltaRef.current = 0;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const directionalBias = Math.abs(delta) > 58 ? (delta < 0 ? 0.34 : -0.34) : 0;
    const target = Math.round(currentPositionRef.current + directionalBias);
    targetPositionRef.current = target;
    setActive(((target % categories.length) + categories.length) % categories.length);
  };

  return (
    <div className="home-spatial-catalog" aria-label="Explorador de categorias">
      <div className="home-spatial-toolbar">
        <div>
          <span>Categoria ativa</span>
          <strong>0{active + 1} / 0{categories.length}</strong>
        </div>
        <p>Arraste pelo túnel</p>
        <div className="home-spatial-controls">
          <button type="button" onClick={() => select(active - 1)} aria-label="Categoria anterior">←</button>
          <button type="button" onClick={() => select(active + 1)} aria-label="Próxima categoria">→</button>
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
          if (event.key === "ArrowLeft") select(active - 1);
          if (event.key === "ArrowRight") select(active + 1);
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
                onClick={() => logicalOffset !== 0 && select(index)}
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
        style={{ "--rail-position": `${((active + 0.5) / categories.length) * 100}%` } as React.CSSProperties}
      >
        {categories.map((category, index) => (
          <button
            type="button"
            className={index === active ? "is-active" : ""}
            aria-label={`Selecionar ${category.title}`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => select(index)}
            key={category.code}
          />
        ))}
      </div>
    </div>
  );
}
