"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../_lib/gsap";
import { SmoothScrollProvider } from "../_components/smooth-scroll-provider";
import { ForgeHeroCar, ForgeHeroCarHandle } from "./_components/forge-hero-car";
import { ForgeHeader } from "./_components/forge-header";
import "./forge.css";

// Principais marcas e encarroçadoras atendidas pela Center Ônibus
const MARQUEE_BRANDS = [
  "Marcopolo",
  "Caio Induscar",
  "Comil Ônibus",
  "Neobus",
  "Busscar",
  "Mascarello",
  "Irizar",
  "Volare",
  "Spheros Climatização",
  "Valeo Thermal",
];

const STEPS_DATA = [
  {
    num: "01",
    total: "03",
    title: "Identificação Precisa",
    desc: "Diagnóstico ágil por modelo, chassi ou código CO. Nossa equipe técnica entende a realidade da carroceria antes mesmo de abrir o catálogo.",
    image: "/images/center/step-01-identidade-dark.jpg?v=3",
    alt: "Center Ônibus: Grade e Emblema Aerodinâmico",
  },
  {
    num: "02",
    total: "03",
    title: "Estoque em Pronta-Entrega",
    desc: "Mais de 15.000 itens disponíveis para Marcopolo, Caio, Comil e Neobus. Estoque real com conferência rigorosa de encaixe técnico.",
    image: "/images/center/step-02-precisao-dark.jpg?v=3",
    alt: "Center Ônibus: Inspeção e Encaixe Técnico de Painel",
  },
  {
    num: "03",
    total: "03",
    title: "O Ônibus Volta pra Rua",
    desc: "Despacho prioritário e logística rápida para todo o Brasil. A peça certa, na primeira vez, mantendo sua frota em movimento constante.",
    image: "/images/center/step-03-rodagem-dark.jpg?v=3",
    alt: "Center Ônibus: Traseira Aerodinâmica, Difusor e Iluminação LED",
  },
];

const SERVICES_DATA = [
  {
    id: "carrocerias",
    tag: "Componentes",
    title: "Carrocerias & Lataria",
    desc: "Painéis estruturais, saias, tampas traseiras e aerodinâmica para Marcopolo, Caio, Comil e Neobus. A peça certa, com encaixe perfeito na primeira vez.",
    image: "/images/center/service-carroceria.jpg",
    alt: "Center Ônibus: Carrocerias e Lataria",
  },
  {
    id: "iluminacao",
    tag: "Sistemas",
    title: "Iluminação & Elétrica",
    desc: "Faróis em LED, conjuntos ópticos modulares, lanternas traseiras e chicotes dedicados que garantem visibilidade e segurança operacional em rota.",
    image: "/images/center/service-iluminacao.jpg",
    alt: "Center Ônibus: Iluminação e Lanternas",
  },
  {
    id: "retrovisores",
    tag: "Segurança",
    title: "Retrovisores Técnicos",
    desc: "Braços mecânicos e elétricos com espelhos bi-partidos e eliminação de pontos cegos. Robustez com fixação antivibração para frotas rodoviárias e urbanas.",
    image: "/images/center/service-retrovisores.jpg",
    alt: "Center Ônibus: Retrovisores Técnicos",
  },
  {
    id: "vidros",
    tag: "Estrutural",
    title: "Vidros & Para-brisas",
    desc: "Para-brisas laminados panorâmicos, borrachas guarnição de alta vedação e vidros laterais colados que suportam as torções reais de rodagem.",
    image: "/images/center/service-vidros.jpg",
    alt: "Center Ônibus: Vidros e Para-brisas",
  },
  {
    id: "climatizacao",
    tag: "Operação",
    title: "Climatização & Filtros",
    desc: "Filtros antipólen homologados CO 11084, condensadores e componentes Spheros e Valeo. Ar limpo e controle térmico no tempo da sua operação.",
    image: "/images/center/service-climatizacao.jpg",
    alt: "Center Ônibus: Climatização e Filtros de Ar",
  },
  {
    id: "protecao",
    tag: "Acabamento",
    title: "Para-choques & Proteção",
    desc: "Para-choques modulares reforçados, almas de impacto estruturais e frisos de absorção que protegem o veículo e mantêm seu ônibus na rua.",
    image: "/images/center/service-parachoques.jpg",
    alt: "Center Ônibus: Para-choques e Proteção",
  },
];

// Helper button with moving neon border & character roll
function ForgeButton({ text, href = "#contact", className = "" }: { text: string; href?: string; className?: string }) {
  return (
    <a href={href} className={`forge-btn ${className}`.trim()} aria-label={text}>
      <span className="forge-btn-border-glow" aria-hidden="true" />
      <span className="forge-btn-border-beam" aria-hidden="true" />
      <span className="forge-btn-inner" aria-hidden="true" />
      <span className="forge-btn-label">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="forge-btn-char"
            style={{ transitionDelay: `${i * 0.02}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </a>
  );
}

export default function Home2() {
  const [isPreloaderLoaded, setIsPreloaderLoaded] = useState(false);
  const [progressBarActive, setProgressBarActive] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  const heroCarRef = useRef<ForgeHeroCarHandle>(null);
  const heroPinWrapperRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const heroVehicleRef = useRef<HTMLDivElement>(null);
  const heroTopRef = useRef<HTMLDivElement>(null);
  const heroCenterRevealRef = useRef<HTMLDivElement>(null);
  const heroBottomRef = useRef<HTMLDivElement>(null);

  const approachTrackRef = useRef<HTMLDivElement>(null);
  const approachApertureSlotRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const stepArticleRefs = useRef<(HTMLElement | null)[]>([]);
  const stepClippedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const serviceRefs = useRef<(HTMLElement | null)[]>([]);
  const serviceImgRefs = useRef<(HTMLDivElement | null)[]>([]);

  const statementQuoteRef = useRef<HTMLHeadingElement>(null);
  const craftsmanImgRef = useRef<HTMLImageElement>(null);

  const carLeftRef = useRef<HTMLDivElement>(null);
  const carMainRef = useRef<HTMLDivElement>(null);
  const carRightRef = useRef<HTMLDivElement>(null);

  // Preloader animation
  useEffect(() => {
    const timerStart = setTimeout(() => {
      setProgressBarActive(true);
    }, 80);

    const timerEnd = setTimeout(() => {
      setIsPreloaderLoaded(true);
    }, 800);

    return () => {
      clearTimeout(timerStart);
      clearTimeout(timerEnd);
    };
  }, []);

  // GSAP Animations (Hero pinned narrative, Steps sticky visual, Services sticky panel, Aerial cars parallax)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero interactive mouse 3D tilt
      const hero = heroSectionRef.current;
      const vehicle = heroVehicleRef.current;

      const handleHeroMouseMove = (e: MouseEvent) => {
        if (!hero || !vehicle) return;
        const rect = hero.getBoundingClientRect();
        const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
        const yNorm = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(vehicle, {
          rotateY: xNorm * 7,
          rotateX: -yNorm * 5,
          duration: 0.6,
          ease: "power2.out",
        });
      };

      const handleHeroMouseLeave = () => {
        if (!vehicle) return;
        gsap.to(vehicle, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      };

      if (hero) {
        hero.addEventListener("mousemove", handleHeroMouseMove, { passive: true });
        hero.addEventListener("mouseleave", handleHeroMouseLeave);
      }

      // 2. Hero Scroll-driven narrative (pinned over the heroPinWrapper)
      if (heroPinWrapperRef.current && vehicle) {
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroPinWrapperRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            onUpdate: (self) => {
              heroCarRef.current?.setFrame(self.progress);
            },
          },
        });

        heroTl
          .to(
            heroTopRef.current,
            {
              y: -70,
              opacity: 0,
              duration: 0.28,
              ease: "power1.inOut",
            },
            0
          )
          .to(
            heroBottomRef.current,
            {
              y: 70,
              opacity: 0,
              duration: 0.28,
              ease: "power1.inOut",
            },
            0
          )
          .fromTo(
            heroCenterRevealRef.current,
            {
              opacity: 0,
              scale: 0.92,
              filter: "blur(12px)",
            },
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.32,
              ease: "power2.out",
            },
            0.28
          )
          .to(
            heroCenterRevealRef.current,
            {
              opacity: 0,
              scale: 1.08,
              filter: "blur(8px)",
              duration: 0.24,
              ease: "power2.in",
            },
            0.72
          );
      }

      // 2.5 Approach Aperture Transition (Hero -> Approach 1:1 Forge Aperture Reveal)
      if (approachTrackRef.current && approachApertureSlotRef.current) {
        const slot = approachApertureSlotRef.current;
        const bgImg = slot.querySelector<HTMLImageElement>(".forge-approach-bg img");

        const approachTl = gsap.timeline({
          scrollTrigger: {
            trigger: approachTrackRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        });

        // Phase 1: Aperture starts COMPLETELY CLOSED at center (inset 50% 50%) and expands smoothly outward
        approachTl.fromTo(
          slot,
          {
            clipPath: "inset(50% 50% round 8px)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            boxShadow: "0 40px 100px rgba(0, 0, 0, 0.95)",
          },
          {
            clipPath: "inset(0% 0% round 0px)",
            border: "1px solid rgba(255, 255, 255, 0)",
            boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
            duration: 0.65,
            ease: "power2.inOut",
          },
          0
        );

        if (bgImg) {
          approachTl.fromTo(
            bgImg,
            { scale: 1.12 },
            { scale: 1.0, duration: 0.65, ease: "power2.inOut" },
            0
          );
        }

        // Phase 2: Hold open at full screen for comfortable reading before scrolling to steps
        approachTl.to(slot, { duration: 0.35 }, 0.65);
      }

      // 3. Step articles scroll-driven expanding clip-path reveal (1:1 Forge Automotive)
      // Step 0 starts fully open
      if (stepClippedRefs.current[0]) {
        gsap.set(stepClippedRefs.current[0], { clipPath: "inset(0% 0% 0% 0%)" });
      }

      // Step 1 to Step 2 transition (triggered by article 1 scrolling in)
      const article1 = stepArticleRefs.current[1];
      if (article1 && stepClippedRefs.current[1]) {
        gsap.fromTo(
          stepClippedRefs.current[1],
          { clipPath: "inset(50% 50% 50% 50%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: article1,
              start: "top 85%",
              end: "center center",
              scrub: true,
            },
          }
        );
      }

      // Step 2 to Step 3 transition (triggered by article 2 scrolling in)
      const article2 = stepArticleRefs.current[2];
      if (article2 && stepClippedRefs.current[2]) {
        gsap.fromTo(
          stepClippedRefs.current[2],
          { clipPath: "inset(50% 50% 50% 50%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: article2,
              start: "top 85%",
              end: "center center",
              scrub: true,
            },
          }
        );
      }

      // Step articles active indicator tracking & background blur switcher
      stepArticleRefs.current.forEach((el, idx) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveStepIndex(idx);
            }
          },
          onEnter: () => setActiveStepIndex(idx),
          onEnterBack: () => setActiveStepIndex(idx),
        });
      });

      // 4. Statement Craftsman Parallax
      if (craftsmanImgRef.current) {
        gsap.fromTo(
          craftsmanImgRef.current,
          { y: -30, scale: 1.08 },
          {
            y: 30,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: craftsmanImgRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // 5. Service cards and sliding wipe image reveal (1:1 Forge Automotive)
      const mmServices = gsap.matchMedia();
      mmServices.add("(min-width: 1024px)", () => {
        serviceImgRefs.current.forEach((imgEl, idx) => {
          const contentEl = serviceRefs.current[idx];
          if (!imgEl || !contentEl) return;

          // Image 0 starts fully visible; images 1-5 wipe UP from bottom over the previous image
          if (idx > 0) {
            gsap.fromTo(
              imgEl,
              { clipPath: "inset(100% 0% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: {
                  trigger: contentEl,
                  start: "top 95%",
                  end: "top 10%",
                  scrub: true,
                },
              }
            );
          }

          // Subtle parallax scale on the photo
          const innerImg = imgEl.querySelector("img");
          if (innerImg) {
            gsap.fromTo(
              innerImg,
              { scale: 1.15 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: contentEl,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }
        });

        // Left text: as each card scrolls past center, it fades out and moves up
        serviceRefs.current.forEach((contentEl, idx) => {
          if (!contentEl) return;
          if (idx < serviceRefs.current.length - 1) {
            gsap.to(contentEl, {
              autoAlpha: 0,
              y: -50,
              ease: "none",
              scrollTrigger: {
                trigger: contentEl,
                start: "center 35%",
                end: "bottom 5%",
                scrub: true,
              },
            });
          }
        });
      });

      // 6. Aerial Buses Driving Motion along Highway ("O Ônibus Volta pra Rua")
      if (carLeftRef.current && carMainRef.current && carRightRef.current) {
        // Center Coach Bus: Accelerates forward powerfully along its lane, overtaking side traffic
        gsap.fromTo(
          carMainRef.current,
          { y: 220, scale: 0.9 },
          {
            y: -300,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: carMainRef.current,
              start: "top 95%",
              end: "bottom 5%",
              scrub: 1.2,
            },
          }
        );

        // Left Urban Bus: Cruising at steady speed along the left lane
        gsap.fromTo(
          carLeftRef.current,
          { y: 110 },
          {
            y: -150,
            ease: "none",
            scrollTrigger: {
              trigger: carLeftRef.current,
              start: "top 95%",
              end: "bottom 5%",
              scrub: 1.5,
            },
          }
        );

        // Right Minibus: Cruising along the right lane
        gsap.fromTo(
          carRightRef.current,
          { y: 140 },
          {
            y: -90,
            ease: "none",
            scrollTrigger: {
              trigger: carRightRef.current,
              start: "top 95%",
              end: "bottom 5%",
              scrub: 1.8,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SmoothScrollProvider anchorOffset={0} lerp={0.09} wheelMultiplier={0.82}>
      <div className="forge-body">
        {/* 1. Preloader */}
        <aside className={`forge-preloader ${isPreloaderLoaded ? "loaded" : ""}`} aria-hidden="true">
          <p className="forge-preloader-text">
            CENTRO DE DISTRIBUIÇÃO E COMPONENTES TÉCNICOS • O ÔNIBUS VOLTA PRA RUA
          </p>
          <div className="forge-preloader-progress-wrap">
            <div className="forge-preloader-track">
              <div className={`forge-preloader-bar ${progressBarActive ? "active" : ""}`} />
            </div>
          </div>
        </aside>

        {/* 2. Official Header */}
        <ForgeHeader />

        {/* 3. Hero Section with Scroll-Driven Vehicle Drive-Through Sequence */}
        <div ref={heroPinWrapperRef} className="forge-hero-pin-wrapper">
          <section id="hero" ref={heroSectionRef} className="forge-hero-section">
            <div className="forge-hero-bg-texture" />
            <div className="forge-hero-vignette" />

            {/* Vehicle Showcase Stage inside Hero (Scrubbed frame-by-frame on scroll, vehicle drives forward into cabin) */}
            <div ref={heroVehicleRef} className="forge-hero-vehicle-stage" aria-hidden="true">
              <ForgeHeroCar ref={heroCarRef} />
            </div>

            {/* Top Text - Primeira coisa que o lead lê na tela */}
            <div ref={heroTopRef} className="forge-hero-top">
              <h1 className="forge-hero-title">O Ônibus Volta pra Rua</h1>
            </div>

            {/* Center Reveal Text (Hidden at start, reveals during scroll) */}
            <div ref={heroCenterRevealRef} className="forge-hero-center-reveal" style={{ opacity: 0 }}>
              <h2 className="forge-hero-center-title">
                A peça certa, na primeira vez
                <br />
                Resposta no tempo da operação
              </h2>
            </div>

            {/* Bottom Text & Initial Hero CTA */}
            <div ref={heroBottomRef} className="forge-hero-bottom">
              <p className="forge-hero-desc">
                Especialistas técnicos em componentes e carrocerias. Manter o Brasil em movimento.
              </p>
              <ForgeButton text="Falar com a Equipe" href="#contact" />
            </div>
          </section>
        </div>

        {/* 4. Approach Section with Aperture Reveal Transition (Hero -> Approach) */}
        <div ref={approachTrackRef} className="forge-approach-track">
          <div ref={approachApertureSlotRef} className="forge-approach-aperture-slot">
            <section id="approach" className="forge-approach-section">
              <div className="forge-approach-bg" aria-hidden="true">
                <img
                  src="/images/center/approach-precision-v2.jpg?v=3"
                  alt="Ajuste técnico de precisão em componentes e carroceria Center Ônibus"
                  loading="lazy"
                />
              </div>

              {/* Top Row: Heading in Columns 2 to 8 */}
              <div className="forge-approach-top-row">
                <div className="forge-grid-12">
                  <div className="forge-approach-title-col">
                    <h2 className="forge-approach-title">Conhecimento Antes do Catálogo</h2>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Marquee on Left (Col 1-8), Copy & Button on Right (Col 9-12) */}
              <div className="forge-approach-bottom-row">
                <div className="forge-grid-12">
                  <div className="forge-approach-marquee-col" aria-hidden="true">
                    <div className="forge-marquee-wrap">
                      <div className="forge-marquee-track">
                        {MARQUEE_BRANDS.concat(MARQUEE_BRANDS).map((brand, idx) => (
                          <div key={idx} className="forge-marquee-item">
                            <span className="forge-marquee-item-text">
                              {brand}
                              <span className="marquee-dot" aria-hidden="true">
                                •
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="forge-approach-cta-col">
                    <p className="forge-approach-desc">
                      Atendemos quem vive a rotina da estrada e da frota. Diagnóstico preciso, peças originais
                      e estoque imediato para que o ônibus volte para a rua sem surpresas.
                    </p>
                    <ForgeButton text="Falar com Especialista" href="#contact" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 5. Sticky 3-Step Narrative (Identity, Insight, Cohesion) */}
        <section id="steps" ref={stepsRef} className="forge-steps-section">
          {/* Fullscreen Blurred Atmospheric Background */}
          <aside className="forge-steps-blur-bg" aria-hidden="true">
            <div className="forge-steps-blur-panel">
              {STEPS_DATA.map((step, idx) => (
                <img
                  key={step.title}
                  src={step.image}
                  alt=""
                  className={`forge-steps-blur-img ${activeStepIndex === idx ? "active" : ""}`}
                />
              ))}
            </div>
          </aside>

          {/* Foreground 12-Column Grid */}
          <div className="forge-steps-foreground">
            <div className="forge-grid-12">
              {/* Left: Sticky 1:1 image visual with expanding inner clip-path reveal (Desktop: Columns 2 to 7) */}
              <aside className="forge-steps-sticky-col" aria-hidden="true">
                <div className="forge-steps-sticky-inner">
                  <div className="forge-steps-visual">
                    {STEPS_DATA.map((step, idx) => (
                      <div
                        key={step.title}
                        ref={(el) => {
                          stepClippedRefs.current[idx] = el;
                        }}
                        className="forge-step-clipped-wrapper"
                        style={{
                          zIndex: idx + 1,
                          clipPath: idx === 0 ? "inset(0% 0% 0% 0%)" : "inset(50% 50% 50% 50%)",
                        }}
                      >
                        <img
                          src={step.image}
                          alt={step.alt}
                          className="forge-steps-image"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Right: 3 Sequential Step Articles (Desktop: Columns 8 to 12) */}
              <div className="forge-steps-articles-col">
                {STEPS_DATA.map((step, idx) => (
                  <article
                    key={step.title}
                    data-step-index={idx}
                    ref={(el) => {
                      stepArticleRefs.current[idx] = el;
                    }}
                    className="forge-step-article"
                  >
                    <div className="forge-step-indicator">
                      {step.num} <span>/ {step.total}</span>
                    </div>
                    <h3 className="forge-step-heading">{step.title}</h3>
                    <p className="forge-step-desc">{step.desc}</p>
                    <ForgeButton text="Consultar Peça" href="#contact" />

                    {/* Mobile inline image */}
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="forge-step-mobile-img"
                      loading="lazy"
                    />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. Statement Section with Craftsman Portrait */}
        <section className="forge-statement-section">
          <div className="forge-grid-12">
            {/* Left Content (Columns 2 to 8) */}
            <div className="forge-statement-content-col">
              <h2 ref={statementQuoteRef} className="forge-statement-quote">
                Cada hora com o ônibus parado na garagem custa caro. Conhecimento técnico é o que garante a peça certa, na primeira vez.
              </h2>
              <div className="forge-statement-copy-wrap">
                <p className="forge-statement-copy">
                  Com mais de duas décadas de experiência direta em oficinas e pátios de frotas rodoviárias e urbanas, atendemos quem precisa de agilidade. Do para-brisa ao compressor de ar-condicionado, nosso compromisso é uma palavra que se cumpre: resposta rápida para o ônibus voltar pra rua.
                </p>
                <ForgeButton text="Falar com a Equipe Técnica" href="#contact" />
              </div>
            </div>

            {/* Right Side: Tall 2/3 Portrait of Craftsman (Columns 9 to 12) */}
            <aside className="forge-statement-portrait-col" aria-hidden="true">
              <div className="forge-statement-portrait-wrap">
                <img
                  ref={craftsmanImgRef}
                  src="/images/center/statement-craftsman.jpg?v=1"
                  alt="Especialista técnico em carrocerias e componentes Center Ônibus"
                  className="forge-statement-portrait-img"
                  loading="lazy"
                />
              </div>
            </aside>
          </div>
        </section>

        {/* 7. Sticky Services Split (6 Services) - Confirmed as correct by user */}
        <section id="services" className="forge-services-section">
          <div className="forge-services-split">
            {/* Left: Scrollable service cards */}
            <div className="forge-services-list">
              {SERVICES_DATA.map((srv, idx) => (
                <article
                  key={srv.id}
                  data-service-index={idx}
                  ref={(el) => {
                    serviceRefs.current[idx] = el;
                  }}
                  className="forge-service-card"
                >
                  <span className="forge-service-tag">{srv.tag}</span>
                  <h3 className="forge-service-title">{srv.title}</h3>
                  <p className="forge-service-desc">{srv.desc}</p>
                  <ForgeButton text="Consultar Disponibilidade" href="#contact" />

                  {/* Mobile inline image */}
                  <img
                    src={srv.image}
                    alt={srv.alt}
                    className="forge-service-mobile-img"
                    loading="lazy"
                  />
                </article>
              ))}
            </div>

            {/* Right: Sticky Image Showcase (Desktop) */}
            <aside className="forge-services-sticky-panel" aria-hidden="true">
              {SERVICES_DATA.map((srv, idx) => (
                <div
                  key={srv.id}
                  ref={(el) => {
                    serviceImgRefs.current[idx] = el;
                  }}
                  className="forge-service-image-item"
                  style={{
                    zIndex: idx + 1,
                    clipPath: idx === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                  }}
                >
                  <img
                    src={srv.image}
                    alt={srv.alt}
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </aside>
          </div>
        </section>

        {/* 8. "O Ônibus Volta pra Rua" Aerial Vehicle Showcase */}
        <section id="ordinary" className="forge-ordinary-section">
          <h2 className="forge-ordinary-top-title">O Ônibus</h2>

          <div className="forge-ordinary-cars-container">
            {/* Highway Road Track Lines */}
            <div className="forge-road-track-lines" aria-hidden="true">
              <div className="forge-lane-divider" />
              <div className="forge-lane-divider" />
            </div>

            {/* Left Bus: Transit Urban Bus */}
            <div ref={carLeftRef} className="forge-car-eagle-eye forge-car-side left">
              <div className="forge-headlight-beam" />
              <img
                src="/images/center/bus-aerial-transit.png?v=3"
                alt="Ônibus Urbano e Metropolitano vista aérea superior"
                loading="lazy"
              />
            </div>

            {/* Center Main Bus: Luxury Coach Bus */}
            <div ref={carMainRef} className="forge-car-eagle-eye forge-car-main">
              <div className="forge-headlight-beam main-beam" />
              <img
                src="/images/center/bus-aerial-main.png?v=3"
                alt="Ônibus Rodoviário de Alta Categoria Center Ônibus vista aérea superior"
                loading="lazy"
              />
            </div>

            {/* Right Bus: Executive Minibus */}
            <div ref={carRightRef} className="forge-car-eagle-eye forge-car-side right">
              <div className="forge-headlight-beam" />
              <img
                src="/images/center/bus-aerial-minibus.png?v=3"
                alt="Micro-ônibus Executivo e Turismo vista aérea superior"
                loading="lazy"
              />
            </div>
          </div>

          <h2 className="forge-ordinary-bottom-title">Volta pra Rua</h2>
          <p className="forge-ordinary-copy">
            Do rodoviário de alta categoria ao transporte urbano diário: disponibilidade imediata,
            especificações homologadas e suporte técnico dedicado a cada quilômetro da sua frota.
          </p>
        </section>

        {/* 9. Catálogo Técnico Especializado Full Monumental Card */}
        <section id="builds" className="forge-full-banner">
          <div className="forge-full-banner-bg" aria-hidden="true">
            <img
              src="/images/center/banner-previous-builds.jpg?v=1"
              alt="Conjunto óptico Full LED e faróis de precisão em carroceria de ônibus Center Ônibus"
              loading="lazy"
            />
          </div>
          <div className="forge-full-banner-overlay" />
          <div className="forge-full-banner-content">
            <h2 className="forge-full-banner-title">Catálogo Técnico Especializado</h2>
            <p className="forge-full-banner-desc">
              Linha completa de componentes de reposição homologados para as principais encarroçadoras e
              montadoras do Brasil.
            </p>
            <ForgeButton text="Acessar Catálogo" href="#contact" />
          </div>
        </section>

        {/* 10. Estoque em Pronta-Entrega Full Monumental Card */}
        <section id="stock" className="forge-full-banner">
          <div className="forge-full-banner-bg" aria-hidden="true">
            <img
              src="/images/center/banner-available-stock.jpg?v=1"
              alt="Frota de ônibus rodoviários, urbanos e executivos alinhados em hangar técnico Center Ônibus"
              loading="lazy"
            />
          </div>
          <div className="forge-full-banner-overlay" />
          <div className="forge-full-banner-content">
            <h2 className="forge-full-banner-title">Estoque em Pronta-Entrega</h2>
            <p className="forge-full-banner-desc">
              Agilidade logística para frotistas, mecânicos e garagens com despacho diário para todo o
              Brasil. Se roda, a gente tem.
            </p>
            <ForgeButton text="Consultar Estoque" href="#contact" />
          </div>
        </section>

        {/* 11. Footer & Final CTA ("Refuse Ordinary") */}
        <footer id="contact" className="forge-footer-section">
          <div className="forge-footer-bg" aria-hidden="true">
            <img
              src="/images/center/footer-buses-rear.jpg?v=1"
              alt="Três ônibus rodoviários modernos vistos pela traseira com iluminação LED vermelha e difusores Center Ônibus"
              loading="lazy"
            />
          </div>
          <div className="forge-footer-overlay" />

          <div className="forge-footer-cta-box">
            <p className="forge-footer-kicker">Resposta no tempo da sua operação</p>
            <h2 className="forge-footer-title">O Ônibus Volta pra Rua</h2>
            <ForgeButton text="Solicitar Orçamento" href="#contact" />
          </div>

          <div className="forge-footer-bottom-bar">
            <button
              type="button"
              onClick={scrollToTop}
              className="forge-back-to-top"
              aria-label="Voltar ao Topo"
            >
              <span>
                {"Voltar ao Topo".split("").map((char, i) => (
                  <span key={i} style={{ transitionDelay: `${i * 0.02}s` }}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
              <span aria-hidden="true">↑</span>
            </button>

            <div className="forge-footer-legals">
              <a href="#hero">Privacidade</a>
              <a href="#hero">Termos</a>
              <a href="#contact">Atendimento</a>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScrollProvider>
  );
}
