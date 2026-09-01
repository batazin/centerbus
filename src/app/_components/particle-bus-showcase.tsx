"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BusParticles } from "./bus-particles";

const chapters = [
  {
    code: "CAR 01",
    kicker: "Leitura de carroceria",
    title: "O ônibus entra como referência.",
    description: "A silhueta abre a leitura. Modelo, carroceria e posição da peça colocam a busca no caminho certo.",
    facts: [["Entrada", "modelo + foto"], ["Leitura", "carroceria + posição"], ["Próximo", "localizar sistema"]],
  },
  {
    code: "CLI 04",
    kicker: "Sistema de climatização",
    title: "A forma se abre em sistemas.",
    description: "O conjunto se reorganiza para revelar aplicação, encaixe e compatibilidade antes do código.",
    facts: [["Entrada", "fabricante + modelo"], ["Conferência", "encaixe + configuração"], ["Próximo", "definir componente"]],
  },
  {
    code: "FRE 02",
    kicker: "Freio e rodagem",
    title: "A aplicação define a peça.",
    description: "Cada ponto converge para o componente correto, com menos tentativa e mais precisão na operação.",
    facts: [["Entrada", "medida + montagem"], ["Conferência", "aplicação cruzada"], ["Próximo", "validar compatibilidade"]],
  },
  {
    code: "ELE 03",
    kicker: "Elétrica e identificação",
    title: "A referência chega pronta para consulta.",
    description: "Foto, medida e aplicação viram uma resposta objetiva para o ônibus voltar à rua.",
    facts: [["Entrada", "foto + código"], ["Resultado", "referência conferida"], ["Saída", "consulta objetiva"]],
  },
] as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function ParticleBusShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const updateProgress = () => {
      frameRef.current = null;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      setProgress(clamp(-rect.top / travel, 0, 1));
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(updateProgress);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldRender(true);
      requestUpdate();
      observer.disconnect();
    }, { rootMargin: "600px 0px" });

    observer.observe(section);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    updateProgress();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const phase = progress * (chapters.length - 1);
  const active = clamp(Math.round(phase), 0, chapters.length - 1);
  const localPhase = phase >= chapters.length - 1 ? 0 : phase - Math.floor(phase);
  const morphEnergy = Math.sin(localPhase * Math.PI);
  const objectSideClass = active % 2 === 0 ? "is-object-right" : "is-object-left";

  return (
    <section ref={sectionRef} id="forma-em-particulas" className="home-particle-showcase" aria-labelledby="particle-showcase-title">
      <div className={`home-particle-stage ${objectSideClass}`}>
        <div className="home-particle-grid" aria-hidden="true" />
        <div className="home-particle-canvas">
          {shouldRender ? (
            <BusParticles
              activeChapterIndex={active}
              activeChapterProgress={progress}
              transitionProgress={0}
              morphEnergy={morphEnergy}
              variant="journey"
            />
          ) : null}
        </div>

        <div className={`home-container home-particle-content ${objectSideClass}`}>
          <div className="home-particle-chapters">
            {chapters.map((chapter, index) => {
              const distance = Math.abs(phase - index);
              const visibility = clamp(1 - distance * 1.8, 0, 1);

              return (
                <article
                  className={`home-particle-chapter${active === index ? " is-active" : ""}`}
                  style={{ opacity: visibility, transform: `translate3d(0, ${(index - phase) * 34}px, 0)` }}
                  aria-hidden={active !== index}
                  key={chapter.code}
                >
                  <p className="home-kicker"><span>{chapter.code}</span>{chapter.kicker}</p>
                  <h2 id={index === 0 ? "particle-showcase-title" : undefined}>{chapter.title}</h2>
                  <p>{chapter.description}</p>
                  {index === chapters.length - 1 ? (
                    <Link href="/fale-conosco">Enviar foto da peça <span aria-hidden="true">→</span></Link>
                  ) : null}
                </article>
              );
            })}
          </div>

          <dl className="home-particle-facts" key={chapters[active].code} aria-label={`Dados da etapa ${chapters[active].kicker}`}>
            {chapters[active].facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="home-particle-scroll-index" aria-hidden="true">
            <span>{String(active + 1).padStart(2, "0")}</span>
            <i><b style={{ transform: `scaleY(${progress})` }} /></i>
            <span>{String(chapters.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
