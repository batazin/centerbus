"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

type BootProgressDetail = {
  progress: number;
  loaded: number;
  total: number;
  ready: boolean;
};

export function SiteLoader() {
  const [phase, setPhase] = useState<"visible" | "exiting" | "hidden">("visible");
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(14);
  const startedAtRef = useRef(0);
  const finishingRef = useRef(false);

  useLayoutEffect(() => {
    startedAtRef.current = performance.now();
    const root = document.documentElement;

    const finish = (remember = true) => {
      if (finishingRef.current) return;
      finishingRef.current = true;
      const elapsed = performance.now() - startedAtRef.current;
      const minimumDelay = Math.max(0, 680 - elapsed);

      window.setTimeout(() => {
        setProgress(1);
        setPhase("exiting");
        if (remember) {
          sessionStorage.setItem("centerbus:boot-seen", "1");
        }
        window.setTimeout(() => {
          setPhase("hidden");
          root.classList.remove("centerbus-is-loading");
        }, 560);
      }, minimumDelay);
    };

    if (sessionStorage.getItem("centerbus:boot-seen") === "1") {
      finishingRef.current = true;
      root.classList.remove("centerbus-is-loading");
      const hideFrame = window.requestAnimationFrame(() => {
        setProgress(1);
        setPhase("hidden");
      });
      return () => {
        window.cancelAnimationFrame(hideFrame);
        root.classList.remove("centerbus-is-loading");
      };
    }

    root.classList.add("centerbus-is-loading");
    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<BootProgressDetail>).detail;
      setProgress((current) => Math.max(current, detail.progress));
      setLoaded(detail.loaded);
      setTotal(detail.total);
      if (detail.ready) finish();
    };

    window.addEventListener("centerbus:boot-progress", onProgress);
    const safetyTimeout = window.setTimeout(() => finish(), 4200);

    return () => {
      window.removeEventListener("centerbus:boot-progress", onProgress);
      window.clearTimeout(safetyTimeout);
      root.classList.remove("centerbus-is-loading");
    };
  }, []);

  if (phase === "hidden") return null;

  const percentage = Math.round(progress * 100);
  const status = percentage < 35
    ? "Inicializando sequência"
    : percentage < 85
      ? "Conferindo quadros"
      : "Operação pronta";

  return (
    <div className={`site-loader is-${phase}`} role="status" aria-live="polite" aria-label={`Carregando experiência, ${percentage}%`}>
      <Image
        className="site-loader-backdrop"
        src="/sequences/bus/frame_0001.webp"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <span className="site-loader-grid" aria-hidden="true" />
      <span className="site-loader-diagonal" aria-hidden="true" />
      <div className="site-loader-inner">
        <Image src="/logo.png" alt="Center Ônibus" width={1123} height={293} priority />
        <div className="site-loader-copy">
          <p>{status}</p>
          <strong>{String(percentage).padStart(2, "0")}%</strong>
        </div>
        <div
          className="site-loader-progress"
          role="progressbar"
          aria-label="Carregamento dos quadros essenciais"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
        >
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <div className="site-loader-frame-rail" aria-hidden="true">
          {Array.from({ length: total }, (_, index) => (
            <span className={index < loaded ? "is-loaded" : ""} key={index} />
          ))}
        </div>
        <div className="site-loader-meta">
          <span>Quadros essenciais</span>
          <span>{String(loaded).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
}
