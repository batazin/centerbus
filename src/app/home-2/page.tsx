"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "../_lib/gsap";
import { SmoothScrollProvider } from "../_components/smooth-scroll-provider";
import { ForgeHeroCar, ForgeHeroCarHandle } from "./_components/forge-hero-car";
import { ForgeHeader } from "./_components/forge-header";
import "./forge.css";
import "./center-refinement.css";
import "./center-mobile.css";
import "./center-locations.css";
import { CenterPhoto } from "../_components/center-photo";
import { CenterTeam } from "./_components/center-team";
import { CenterLocations } from "./_components/center-locations";
import { InstitutionalFooter } from "../_components/institutional-footer";

// Principais marcas e encarroçadoras atendidas pela Center Ônibus
const MARQUEE_BRANDS = ["Busscar", "Comil", "Caio", "Mascarello"];

const STEPS_DATA = [
  {
    num: "01",
    total: "03",
    title: "Identificação Precisa",
    desc: "Identificação por código, modelo e foto da peça. Nossa equipe confere os detalhes da carroceria antes de consultar o catálogo.",
    image: "/images/center-v3/step-identification.webp",
    alt: "Conferência real de peças pela equipe da Center Ônibus",
  },
  {
    num: "02",
    total: "03",
    title: "Estoque em Pronta-Entrega",
    desc: "Peças para diferentes carrocerias, com conferência de aplicação e disponibilidade antes do orçamento.",
    image: "/images/center-v2/step-02-precisao-dark.webp",
    alt: "Estoque real da Center Ônibus em São Paulo",
  },
  {
    num: "03",
    total: "03",
    title: "O Ônibus Volta pra Rua",
    desc: "Da consulta à expedição, conferimos a aplicação e combinamos o prazo de entrega com você. A peça certa para o ônibus voltar à operação.",
    image: "/images/center-v3/step-dispatch.webp",
    alt: "Expedição real de peças na Center Ônibus",
  },
];

const SERVICES_DATA = [
  {
    id: "carrocerias",
    tag: "Componentes",
    title: "Carrocerias & Lataria",
    desc: "Painéis, saias e tampas para reposição de carroceria. Envie modelo, ano e foto para conferir o componente e os pontos de fixação.",
    image: "/images/center-v3/service-carroceria.webp",
    alt: "Center Ônibus: Carrocerias e Lataria",
  },
  {
    id: "iluminacao",
    tag: "Sistemas",
    title: "Iluminação & Elétrica",
    desc: "Faróis, lanternas, lentes e componentes elétricos para carrocerias de ônibus. Informe código, lado e modelo para conferir a aplicação.",
    image: "/images/center-v3/service-iluminacao.webp",
    alt: "Center Ônibus: Iluminação e Lanternas",
  },
  {
    id: "retrovisores",
    tag: "Segurança",
    title: "Retrovisores Técnicos",
    desc: "Espelhos, braços e conjuntos para ônibus urbanos e rodoviários. Confira lado, fixação e aplicação com nossa equipe antes de solicitar a peça.",
    image: "/images/center-v3/service-retrovisores.webp",
    alt: "Center Ônibus: Retrovisores Técnicos",
  },
  {
    id: "vidros",
    tag: "Estrutural",
    title: "Vidros & Para-brisas",
    desc: "Para-brisas, vidros laterais e guarnições. Para o orçamento, informe dimensões, modelo e ano da carroceria.",
    image: "/images/center-v3/service-vidros.webp",
    alt: "Center Ônibus: Vidros e Para-brisas",
  },
  {
    id: "climatizacao",
    tag: "Operação",
    title: "Climatização & Filtros",
    desc: "Filtros e componentes de climatização. Envie o código e o modelo do equipamento para conferir aplicação, medidas e disponibilidade.",
    image: "/images/center-v3/service-climatizacao.webp",
    alt: "Center Ônibus: Climatização e Filtros de Ar",
  },
  {
    id: "protecao",
    tag: "Acabamento",
    title: "Para-choques & Proteção",
    desc: "Para-choques, saias, frisos e suportes de fixação para reposição de carroceria. Nossa equipe confere a aplicação com você.",
    image: "/images/center-v3/service-parachoques.webp",
    alt: "Center Ônibus: Para-choques e Proteção",
  },
];

// Helper button with moving neon border & character roll
function ForgeButton({ text, href = "/fale-conosco", className = "" }: { text: string; href?: string; className?: string }) {
  return (
    <Link href={href} className={`forge-btn ${className}`.trim()} aria-label={text}>
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
    </Link>
  );
}

export default function Home2() {
  const [isPreloaderLoaded, setIsPreloaderLoaded] = useState(false);
  const [progressBarActive, setProgressBarActive] = useState(false);
  const [mobileStepIndex, setMobileStepIndex] = useState(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [brandsPaused, setBrandsPaused] = useState(false);

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
  const mobileStepsTrackRef = useRef<HTMLDivElement>(null);
  const servicesTrackRef = useRef<HTMLDivElement>(null);

  const statementQuoteRef = useRef<HTMLHeadingElement>(null);
  const craftsmanImgRef = useRef<HTMLImageElement>(null);

  const carLeftRef = useRef<HTMLDivElement>(null);
  const carMainRef = useRef<HTMLDivElement>(null);
  const carRightRef = useRef<HTMLDivElement>(null);

  const goToMobileStep = (index: number) => {
    const nextIndex = Math.max(0, Math.min(STEPS_DATA.length - 1, index));
    const track = mobileStepsTrackRef.current;
    const slide = track?.children[nextIndex] as HTMLElement | undefined;
    if (!track || !slide) return;
    const targetLeft = slide.offsetLeft - track.offsetLeft;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollLeft = targetLeft;
      setMobileStepIndex(nextIndex);
      return;
    }
    gsap.killTweensOf(track, "scrollLeft");
    track.classList.add("is-programmatic-scroll");
    gsap.to(track, {
      scrollLeft: targetLeft,
      duration: 0.85,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => {
        track.classList.remove("is-programmatic-scroll");
        setMobileStepIndex(nextIndex);
      },
      onInterrupt: () => track.classList.remove("is-programmatic-scroll"),
    });
  };

  const goToService = (index: number) => {
    const nextIndex = Math.max(0, Math.min(SERVICES_DATA.length - 1, index));
    const track = servicesTrackRef.current;
    const slide = track?.children[nextIndex] as HTMLElement | undefined;
    if (!track || !slide) return;
    const targetLeft = slide.offsetLeft - track.offsetLeft;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollLeft = targetLeft;
      setActiveServiceIndex(nextIndex);
      return;
    }
    gsap.killTweensOf(track, "scrollLeft");
    track.classList.add("is-programmatic-scroll");
    gsap.to(track, {
      scrollLeft: targetLeft,
      duration: 0.85,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => {
        track.classList.remove("is-programmatic-scroll");
        setActiveServiceIndex(nextIndex);
      },
      onInterrupt: () => track.classList.remove("is-programmatic-scroll"),
    });
  };

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
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
    let removePointerListeners = () => {};
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

      if (hero && !reducedMotion && window.matchMedia("(hover: hover)").matches) {
        hero.addEventListener("mousemove", handleHeroMouseMove, { passive: true });
        hero.addEventListener("mouseleave", handleHeroMouseLeave);
        removePointerListeners = () => {
          hero.removeEventListener("mousemove", handleHeroMouseMove);
          hero.removeEventListener("mouseleave", handleHeroMouseLeave);
        };
      }

      if (reducedMotion) {
        ScrollTrigger.create({ trigger: heroPinWrapperRef.current, start: "top top", end: "bottom bottom", onUpdate: self => heroCarRef.current?.setFrame(self.progress) });
        return;
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
      if (!compact && approachTrackRef.current && approachApertureSlotRef.current) {
        const slot = approachApertureSlotRef.current;
        const bgImg = slot.querySelector<HTMLImageElement>(".forge-approach-bg img");

        const approachTl = gsap.timeline({
          scrollTrigger: {
            trigger: approachTrackRef.current,
            start: "top bottom",
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

      if (!compact && statementQuoteRef.current) {
        gsap.fromTo(statementQuoteRef.current.querySelectorAll(".center-statement-word"), { opacity: .25 }, { opacity: 1, stagger: .08, ease: "none", scrollTrigger: { trigger: statementQuoteRef.current, start: "top 80%", end: "bottom 35%", scrub: true } });
      }
      gsap.utils.toArray<HTMLElement>(compact ? ".no-parallax-on-mobile" : ".forge-full-banner").forEach(section => {
        gsap.fromTo(section.querySelector("img"), { yPercent: -10, scale: 1.15 }, { yPercent: 10, scale: 1.15, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // 4. Statement Craftsman Parallax
      if (!compact && craftsmanImgRef.current) {
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

      // 6. Aerial Buses Driving Motion along Highway ("O Ônibus Volta pra Rua")
      if (carLeftRef.current && carMainRef.current && carRightRef.current) {
        // Center Coach Bus: Accelerates forward powerfully along its lane, overtaking side traffic
        gsap.fromTo(
          carMainRef.current,
          { yPercent: 36 },
          {
            yPercent: -36,
            ease: "none",
            scrollTrigger: {
              trigger: "#ordinary",
              start: "top 95%",
              end: "bottom 5%",
              scrub: 0.2,
            },
          }
        );

        // Left Urban Bus: Cruising at steady speed along the left lane
        gsap.fromTo(
          carLeftRef.current,
          { yPercent: 20 },
          {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
              trigger: "#ordinary",
              start: "top 95%",
              end: "bottom 5%",
              scrub: 0.2,
            },
          }
        );

        // Right Minibus: Cruising along the right lane
        gsap.fromTo(
          carRightRef.current,
          { yPercent: 28 },
          {
            yPercent: -28,
            ease: "none",
            scrollTrigger: {
              trigger: "#ordinary",
              start: "top 95%",
              end: "bottom 5%",
              scrub: 0.2,
            },
          }
        );
      }
    });

    return () => { removePointerListeners(); ctx.revert(); };
  }, []);


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
            <div ref={heroCenterRevealRef} className="forge-hero-center-reveal" >
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
              <ForgeButton text="Falar com a Equipe" href="/fale-conosco" />
            </div>
          </section>
        </div>

        {/* 4. Approach Section with Aperture Reveal Transition (Hero -> Approach) */}
        <div ref={approachTrackRef} className="forge-approach-track">
          <div ref={approachApertureSlotRef} className="forge-approach-aperture-slot">
            <section id="approach" className="forge-approach-section">
              <div className="forge-approach-bg" aria-hidden="true">
                <CenterPhoto
                  src="/images/center-v2/approach-precision-v2.webp"
                  alt="Equipe da Center Ônibus conferindo uma peça na expedição"
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
                  <div className="forge-approach-marquee-col">
                    <p className="center-manufacturer-label">Carrocerias que fazem parte da nossa operação</p>
                    <div className={`forge-marquee-wrap center-manufacturer-wrap ${brandsPaused ? "is-paused" : ""}`}>
                      <div className="forge-marquee-track" aria-hidden="true">
                        {[0,1].map(group => <div className="center-manufacturer-group" key={group}>{MARQUEE_BRANDS.map(brand => <div className="forge-marquee-item" key={brand}><CenterPhoto src={`/brand/manufacturers/${brand.toLowerCase()}.png`} alt="" width="160" height="50" /></div>)}</div>)}
                      </div>
                    </div>
                    <div className="center-manufacturer-access"><span className="sr-only">Busscar, Comil, Caio e Mascarello.</span><button aria-pressed={brandsPaused} onClick={() => setBrandsPaused(value => !value)}>{brandsPaused ? "Retomar marcas" : "Pausar marcas"}</button></div>
                  </div>

                  <div className="forge-approach-cta-col">
                    <p className="forge-approach-desc">
                      Atendemos quem vive a rotina da estrada e da frota. Identificação da aplicação e consulta de disponibilidade para que o ônibus volte para a rua sem surpresas.
                    </p>
                    <ForgeButton text="Falar com Especialista" href="/fale-conosco" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 5. Compact horizontal 3-step carousel */}
        <section id="steps" ref={stepsRef} className="forge-steps-section">
          <div className="forge-steps-foreground">
            <div className="forge-grid-12">
              <div
                ref={mobileStepsTrackRef}
                className="forge-steps-articles-col"
                aria-label="Etapas do atendimento Center Ônibus"
                onScroll={(event) => {
                  const track = event.currentTarget;
                  const slides = Array.from(track.children) as HTMLElement[];
                  const nearest = slides.reduce((best, slide, index) =>
                    Math.abs((slide.offsetLeft - track.offsetLeft) - track.scrollLeft) < Math.abs((slides[best].offsetLeft - track.offsetLeft) - track.scrollLeft) ? index : best, 0);
                  setMobileStepIndex((current) => current === nearest ? current : nearest);
                }}
              >
                {STEPS_DATA.map((step, idx) => (
                  <article
                    key={step.title}
                    data-step-index={idx}
                    className={`forge-step-article ${mobileStepIndex === idx ? "is-active" : ""}`}
                  >
                    <div className="forge-step-indicator">
                      {step.num} <span>/ {step.total}</span>
                    </div>
                    <h3 className="forge-step-heading">{step.title}</h3>
                    <p className="forge-step-desc">{step.desc}</p>
                    <ForgeButton text="Consultar Peça" href="/fale-conosco" />

                    <CenterPhoto
                      src={step.image}
                      alt={step.alt}
                      className="forge-step-mobile-img"
                      loading="lazy"
                    />
                  </article>
                ))}
              </div>
              <nav className="forge-steps-carousel-nav" aria-label="Navegação das etapas">
                <button type="button" onClick={() => goToMobileStep(mobileStepIndex - 1)} disabled={mobileStepIndex === 0} aria-label="Etapa anterior">
                  <span aria-hidden="true">←</span>
                </button>
                <div className="forge-steps-carousel-dots" data-active-step={mobileStepIndex} aria-label={`Etapa ${mobileStepIndex + 1} de ${STEPS_DATA.length}`}>
                  {STEPS_DATA.map((step, index) => (
                    <button
                      type="button"
                      key={step.title}
                      className={mobileStepIndex === index ? "is-active" : ""}
                      onClick={() => goToMobileStep(index)}
                      aria-label={`Ir para etapa ${index + 1}: ${step.title}`}
                      aria-current={mobileStepIndex === index ? "step" : undefined}
                    />
                  ))}
                </div>
                <button type="button" onClick={() => goToMobileStep(mobileStepIndex + 1)} disabled={mobileStepIndex === STEPS_DATA.length - 1} aria-label="Próxima etapa">
                  <span aria-hidden="true">→</span>
                </button>
              </nav>
            </div>
          </div>
        </section>

        {/* 6. Statement Section with Craftsman Portrait */}
        <section className="forge-statement-section">
          <div className="forge-grid-12">
            {/* Left Content (Columns 2 to 8) */}
            <div className="forge-statement-content-col">
              <h2 ref={statementQuoteRef} className="forge-statement-quote">
                {"Cada hora com o ônibus parado na garagem custa caro. Conhecimento técnico faz a diferença na hora de encontrar a peça certa.".split(" ").map((word, index) => <span className="center-statement-word" key={index}>{word}{" "}</span>)}
              </h2>
              <div className="forge-statement-copy-wrap">
                <p className="forge-statement-copy">
                  Conhecer a aplicação faz parte do atendimento. Código, medidas, modelo e foto ajudam nossa equipe a conferir o que sua operação precisa. Da identificação à expedição, trabalhamos para que o ônibus volte pra rua.
                </p>
                <ForgeButton text="Falar com a Equipe Técnica" href="/fale-conosco" />
              </div>
            </div>

            {/* Right Side: Tall 2/3 Portrait of Craftsman (Columns 9 to 12) */}
            <aside className="forge-statement-portrait-col" aria-hidden="true">
              <div className="forge-statement-portrait-wrap">
                <CenterPhoto
                  ref={craftsmanImgRef}
                  src="/images/center-v2/statement-craftsman.webp"
                  alt="Conferência de peças pela equipe da Center Ônibus em São Paulo"
                  className="forge-statement-portrait-img"
                  loading="lazy"
                />
              </div>
            </aside>
          </div>
        </section>

        <CenterTeam />

        {/* 7. Compact horizontal services carousel */}
        <section id="services" className="forge-services-section">
          <div className="forge-services-split">
            <div
              ref={servicesTrackRef}
              className="forge-services-list"
              aria-label="Categorias de componentes para carrocerias"
              onScroll={(event) => {
                const track = event.currentTarget;
                const slides = Array.from(track.children) as HTMLElement[];
                const nearest = slides.reduce((best, slide, index) =>
                  Math.abs((slide.offsetLeft - track.offsetLeft) - track.scrollLeft) < Math.abs((slides[best].offsetLeft - track.offsetLeft) - track.scrollLeft) ? index : best, 0);
                setActiveServiceIndex((current) => current === nearest ? current : nearest);
              }}
            >
              {SERVICES_DATA.map((srv, idx) => (
                <article
                  key={srv.id}
                  data-service-index={idx}
                  className={`forge-service-card ${activeServiceIndex === idx ? "is-active" : ""}`}
                >
                  <span className="forge-service-tag">{srv.tag}</span>
                  <h3 className="forge-service-title">{srv.title}</h3>
                  <p className="forge-service-desc">{srv.desc}</p>
                  <ForgeButton text="Consultar Disponibilidade" href="/fale-conosco" />

                  <CenterPhoto
                    src={srv.image}
                    alt={srv.alt}
                    className="forge-service-mobile-img"
                    loading="lazy"
                  />
                </article>
              ))}
            </div>
            <nav className="forge-services-carousel-nav" aria-label="Navegação das categorias">
              <button type="button" onClick={() => goToService(activeServiceIndex - 1)} disabled={activeServiceIndex === 0} aria-label="Categoria anterior">
                <span aria-hidden="true">←</span>
              </button>
              <div className="forge-services-carousel-dots" data-active-service={activeServiceIndex} aria-label={`Categoria ${activeServiceIndex + 1} de ${SERVICES_DATA.length}`}>
                {SERVICES_DATA.map((service, index) => (
                  <button
                    type="button"
                    key={service.id}
                    className={activeServiceIndex === index ? "is-active" : ""}
                    onClick={() => goToService(index)}
                    aria-label={`Ir para categoria ${index + 1}: ${service.title}`}
                    aria-current={activeServiceIndex === index ? "step" : undefined}
                  />
                ))}
              </div>
              <button type="button" onClick={() => goToService(activeServiceIndex + 1)} disabled={activeServiceIndex === SERVICES_DATA.length - 1} aria-label="Próxima categoria">
                <span aria-hidden="true">→</span>
              </button>
            </nav>
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
              <CenterPhoto
                src="/images/center-v4/bus-aerial-urban.webp"
                alt="Ônibus Urbano e Metropolitano vista aérea superior"
                loading="lazy"
              />
            </div>

            {/* Center Main Bus: Luxury Coach Bus */}
            <div ref={carMainRef} className="forge-car-eagle-eye forge-car-main">
              <div className="forge-headlight-beam main-beam" />
              <CenterPhoto
                src="/images/center-v4/bus-aerial-coach.webp"
                alt="Ônibus Rodoviário de Alta Categoria Center Ônibus vista aérea superior"
                loading="lazy"
              />
            </div>

            {/* Right Bus: Executive Minibus */}
            <div ref={carRightRef} className="forge-car-eagle-eye forge-car-side right">
              <div className="forge-headlight-beam" />
              <CenterPhoto
                src="/images/center-v4/bus-aerial-mini.webp"
                alt="Micro-ônibus Executivo e Turismo vista aérea superior"
                loading="lazy"
              />
            </div>
          </div>

          <h2 className="forge-ordinary-bottom-title">Volta pra Rua</h2>
          <p className="forge-ordinary-copy">
            Do rodoviário de alta categoria ao transporte urbano diário: consulta de disponibilidade,
            conferência de aplicação e suporte técnico dedicado a cada quilômetro da sua frota.
          </p>
        </section>

        {/* 9. Catálogo Técnico Especializado Full Monumental Card */}
        <section id="builds" className="forge-full-banner">
          <div className="forge-full-banner-bg" aria-hidden="true">
            <CenterPhoto
              src="/images/center-v4/catalog-detail.webp"
              alt="Detalhe de farol e painel de carroceria de ônibus"
              loading="lazy"
            />
          </div>
          <div className="forge-full-banner-overlay" />
          <div className="forge-full-banner-content">
            <h2 className="forge-full-banner-title">Catálogo Técnico Especializado</h2>
            <p className="forge-full-banner-desc">
              Linha completa de componentes de reposição para as principais encarroçadoras e
              montadoras do Brasil.
            </p>
            <ForgeButton text="Acessar Catálogo" href="/produtos" />
            <nav className="center-catalog-links" aria-label="Informações da Center"><Link href="/sobre/a-center-onibus">A Center</Link><Link href="/vendedores">Atendimento</Link><Link href="/sobre/politica-de-privacidade">Privacidade</Link></nav>
          </div>
        </section>

        <CenterLocations />

      </div>
      <InstitutionalFooter />
    </SmoothScrollProvider>
  );
}
