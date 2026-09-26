"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../_lib/gsap";
import { SmoothScrollProvider } from "../_components/smooth-scroll-provider";
import { ForgeHeader } from "./_components/forge-header";
import "./forge.css";

// Bus Manufacturers & Chassis Partners
const BUS_MANUFACTURERS = [
  { name: "Marcopolo", type: "Carroceria" },
  { name: "Caio Induscar", type: "Carroceria" },
  { name: "Comil", type: "Carroceria" },
  { name: "Neobus", type: "Carroceria" },
  { name: "Mascarello", type: "Carroceria" },
  { name: "Irizar", type: "Carroceria" },
  { name: "Volare", type: "Mini & Micro" },
  { name: "Mercedes-Benz", type: "Chassi" },
  { name: "Scania", type: "Chassi" },
  { name: "Volvo", type: "Chassi" },
  { name: "Volkswagen Ônibus", type: "Chassi" },
  { name: "Agrale", type: "Chassi" },
];

const STEPS_DATA = [
  {
    num: "01",
    total: "03",
    tag: "CONFERÊNCIA",
    title: "Identificação Precisa",
    desc: "Código, foto, chassi e montadora conferidos antes da separação para garantir a peça certa na primeira vez. Evitamos retrabalho e horas paradas na oficina.",
    image: "/images/center/step-01-conferencia.jpg",
    alt: "Conferência técnica de peças Center Ônibus",
  },
  {
    num: "02",
    total: "03",
    tag: "ESTOQUE",
    title: "Pronta Entrega",
    desc: "Mais de 30 mil itens disponíveis: lanternas, faróis, para-brisas, retrovisores, climatização e componentes estruturais para todas as linhas e montadoras.",
    image: "/images/center/step-02-estoque.jpg",
    alt: "Estoque amplo de peças Center Ônibus",
  },
  {
    num: "03",
    total: "03",
    tag: "LOGÍSTICA",
    title: "Despacho Ágil",
    desc: "Entrega em até 48h para a Grande São Paulo e despacho no mesmo dia para transportadoras de todo o Brasil. Resposta rápida para o ônibus voltar pra rua.",
    image: "/images/center/step-03-despacho.jpg",
    alt: "Despacho ágil e liberação de ônibus para a frota",
  },
];

const SERVICES_DATA = [
  {
    id: "iluminacao",
    tag: "Linha 01",
    title: "Iluminação & Sinalização",
    desc: "Lanternas traseiras modulares, blocos ópticos, faróis halógenos e LED, delimitadoras e chicotes de reposição para todos os modelos de carrocerias.",
    image: "/images/center/service-iluminacao.jpg",
    alt: "Lanternas e sinalização técnica para ônibus",
  },
  {
    id: "vidros",
    tag: "Linha 02",
    title: "Vidros & Para-brisas",
    desc: "Para-brisas laminados bipartidos e inteiriços, vigias traseiros, vidros de janelas móveis e fixas, borrachas e guarnições de vedação EPDM reforçadas.",
    image: "/images/center/service-vidros.jpg",
    alt: "Para-brisas e vidros para carrocerias de ônibus",
  },
  {
    id: "retrovisores",
    tag: "Linha 03",
    title: "Retrovisores & Espelhos",
    desc: "Conjuntos completos com braço tubular ou carenado, espelhos convexos auxiliares, comandos elétricos, desembaçadores térmicos e capas de proteção.",
    image: "/images/center/service-retrovisores.jpg",
    alt: "Retrovisores e espelhos de reposição",
  },
  {
    id: "carroceria",
    tag: "Linha 04",
    title: "Carroceria & Chaparia",
    desc: "Para-choques em fibra e plástico injetado, grades dianteiras, tampas de motor, painéis laterais, dobradiças reforçadas e fechaduras para frotas.",
    image: "/products/catalogo-geral-pecas.png",
    alt: "Peças de carroceria e lataria de ônibus",
  },
  {
    id: "climatizacao",
    tag: "Linha 05",
    title: "Climatização & Filtros",
    desc: "Filtros anti-pólen (Spheros CC305 / 335 / 355T), dutos de ar condicionado, grades de ventilação, motores de condensador e componentes térmicos.",
    image: "/products/co-11084-packaging.webp",
    alt: "Filtro anti-pólen CO 11084 e climatização Center Ônibus",
  },
  {
    id: "vedacao",
    tag: "Linha 06",
    title: "Vedação & Acabamento",
    desc: "Perfis de borracha para portas e janelas, pega-mãos, corrimãos de segurança, assoalhos taraflex, itinerários eletrônicos e componentes de cabine.",
    image: "/blog/conferencia-estoque.webp",
    alt: "Acabamento interno e vedação para ônibus",
  },
];

// Authentic Forge luxury button with conic gradient border shine and rolling characters
function ForgeButton({ text, href = "#contact" }: { text: string; href?: string }) {
  return (
    <a href={href} className="forge-btn" aria-label={text}>
      <span className="forge-btn-shine" aria-hidden="true" />
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

  const pageRef = useRef<HTMLDivElement>(null);

  const heroSectionRef = useRef<HTMLElement>(null);
  const heroVehicleRef = useRef<HTMLDivElement>(null);
  const heroTopRef = useRef<HTMLDivElement>(null);
  const heroCenterRef = useRef<HTMLDivElement>(null);
  const heroBottomRef = useRef<HTMLDivElement>(null);

  const frotasSectionRef = useRef<HTMLElement>(null);
  const carLeftRef = useRef<HTMLDivElement>(null);
  const carMainRef = useRef<HTMLDivElement>(null);
  const carRightRef = useRef<HTMLDivElement>(null);
  const roadLinesRef = useRef<HTMLDivElement>(null);

  const stepArticleRefs = useRef<(HTMLElement | null)[]>([]);
  const serviceRefs = useRef<(HTMLElement | null)[]>([]);

  // Preloader progress animation
  useEffect(() => {
    const timerStart = setTimeout(() => {
      setProgressBarActive(true);
    }, 80);

    const timerEnd = setTimeout(() => {
      setIsPreloaderLoaded(true);
    }, 600);

    return () => {
      clearTimeout(timerStart);
      clearTimeout(timerEnd);
    };
  }, []);

  // 1. Mouse 3D Perspective Tilt on the Hero Studio Bus Stage
  useEffect(() => {
    const hero = heroSectionRef.current;
    const vehicle = heroVehicleRef.current;
    if (!hero || !vehicle) return;

    const rotX = gsap.quickTo(vehicle, "rotationX", { duration: 0.8, ease: "power2.out" });
    const rotY = gsap.quickTo(vehicle, "rotationY", { duration: 0.8, ease: "power2.out" });
    const transX = gsap.quickTo(vehicle, "xPercent", { duration: 0.8, ease: "power2.out" });
    const transY = gsap.quickTo(vehicle, "yPercent", { duration: 0.8, ease: "power2.out" });

    const handlePointerMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      rotY(x * 3.5);
      rotX(-y * 2.5);
      transX(x * 1.2);
      transY(y * 1.2);
    };

    const handlePointerLeave = () => {
      rotX(0);
      rotY(0);
      transX(0);
      transY(0);
    };

    hero.addEventListener("mousemove", handlePointerMove, { passive: true });
    hero.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    return () => {
      hero.removeEventListener("mousemove", handlePointerMove);
      hero.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  // 2. Scroll-driven timeline for Hero Vehicle zoom and statement reveal
  useEffect(() => {
    const hero = heroSectionRef.current;
    const vehicle = heroVehicleRef.current;
    const heroTop = heroTopRef.current;
    const heroCenter = heroCenterRef.current;
    const heroBottom = heroBottomRef.current;

    if (!hero || !vehicle) return;

    const ctx = gsap.context(() => {
      // Pin hero during the vehicle reveal transition
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // Top title fades and lifts
      if (heroTop) {
        tl.to(
          heroTop,
          {
            opacity: 0,
            y: -50,
            duration: 0.35,
            ease: "power2.inOut",
          },
          0
        );
      }

      // Studio Bus scales and pushes forward into view
      tl.to(
        vehicle,
        {
          scale: 1.18,
          y: "3%",
          duration: 1,
          ease: "none",
        },
        0
      );

      // Central editorial statement emerges smoothly
      if (heroCenter) {
        tl.fromTo(
          heroCenter,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "power2.out",
          },
          0.25
        );
      }

      // Bottom bar fades gently
      if (heroBottom) {
        tl.to(
          heroBottom,
          {
            opacity: 0.2,
            duration: 0.4,
            ease: "power2.in",
          },
          0.6
        );
      }

      // Steps articles ScrollTrigger tracking for sticky image panel
      stepArticleRefs.current.forEach((el, idx) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveStepIndex(idx);
            }
          },
        });
      });

      // Services cards ScrollTrigger tracking for sticky image panel
      serviceRefs.current.forEach((el, idx) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveServiceIndex(idx);
            }
          },
        });
      });

      // 3. Scroll-driven highway driving animation for the aerial fleet
      const frotas = frotasSectionRef.current;
      const cMain = carMainRef.current;
      const cLeft = carLeftRef.current;
      const cRight = carRightRef.current;
      const rLines = roadLinesRef.current;

      if (frotas && cMain && cLeft && cRight) {
        const frotasTl = gsap.timeline({
          scrollTrigger: {
            trigger: frotas,
            start: "top 85%",
            end: "bottom 15%",
            scrub: 0.7,
          },
        });

        // Road dashed lines stream downward to create rapid forward movement
        if (rLines) {
          frotasTl.fromTo(
            rLines,
            { y: -140 },
            { y: 160, ease: "none" },
            0
          );
        }

        // Left transit bus drives forward at steady cruise pace
        frotasTl.fromTo(
          cLeft,
          { y: 180, rotation: -0.8 },
          { y: -120, rotation: 0.5, ease: "none" },
          0
        );

        // Main luxury coach starts behind, accelerates and overtakes powerfully forward
        frotasTl.fromTo(
          cMain,
          { y: 240, scale: 0.94 },
          { y: -180, scale: 1.05, ease: "power1.out" },
          0
        );

        // Right executive van drives swiftly alongside
        frotasTl.fromTo(
          cRight,
          { y: 280, rotation: 1 },
          { y: -220, rotation: -0.4, ease: "power1.inOut" },
          0
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SmoothScrollProvider anchorOffset={0} lerp={0.09} wheelMultiplier={0.82}>
      <div ref={pageRef} className="forge-body">
        {/* 1. Preloader */}
        <aside className={`forge-preloader ${isPreloaderLoaded ? "loaded" : ""}`}>
          <p className="forge-preloader-text">
            Estrutura técnica para carrocerias de ônibus. A peça certa, na primeira vez.
          </p>
          <div className="forge-preloader-progress-wrap">
            <div className="forge-preloader-track">
              <div className={`forge-preloader-bar ${progressBarActive ? "active" : ""}`} />
            </div>
          </div>
        </aside>

        {/* 2. Authentic Header */}
        <ForgeHeader />

        {/* 3. Hero Section with Luxury Studio Bus Stage */}
        <section id="hero" ref={heroSectionRef} className="forge-hero-section">
          {/* Subtle Ambient Texture Overlay */}
          <div className="forge-hero-bg-texture" />

          {/* Studio Bus Stage (Forge Atelier Style - Luxury Fleet) */}
          <div ref={heroVehicleRef} className="forge-hero-vehicle-stage">
            <img
              src="/images/center/forge-hero-bus.jpg"
              alt="Center Ônibus - Frotas em Atelier Studio"
              className="forge-hero-vehicle-img"
            />
            <div className="forge-hero-overlay-radial" />
          </div>

          {/* Top Initial Headline */}
          <div ref={heroTopRef} className="forge-hero-top">
            <span className="forge-hero-kicker">DISTRIBUIÇÃO TÉCNICA DE PEÇAS</span>
            <h1 className="forge-hero-title">O Ônibus Volta pra Rua.</h1>
          </div>

          {/* Central Pinned Editorial Statement */}
          <div ref={heroCenterRef} className="forge-hero-center-reveal" style={{ opacity: 0 }}>
            <span className="forge-hero-center-tag">RESPOSTA NO TEMPO DA OPERAÇÃO</span>
            <h2 className="forge-hero-center-title">
              Conhecimento antes do catálogo.
              <br />
              <span style={{ color: "#2E6DA4" }}>A peça certa, na primeira vez.</span>
            </h2>
          </div>

          {/* Bottom Kicker & CTA */}
          <div ref={heroBottomRef} className="forge-hero-bottom">
            <p className="forge-hero-desc">
              Mais de 30 mil itens para carrocerias de ônibus, vans e transporte de passageiros.
            </p>
            <div className="forge-hero-cta">
              <ForgeButton text="Consultar Código da Peça" href="#catalogo" />
            </div>
          </div>
        </section>

        {/* 4. Approach Section & Manufacturer Logo Marquee */}
        <section id="approach" className="forge-approach-section">
          <div className="forge-approach-bg">
            <img
              src="/images/center/approach-workshop.jpg"
              alt="Oficina técnica e manutenção de ônibus"
              loading="lazy"
            />
          </div>
          <div className="forge-approach-overlay" />

          <div className="forge-approach-top">
            <span className="forge-approach-tag">ATENDIMENTO & COMPATIBILIDADE</span>
            <h2 className="forge-approach-heading">
              Atendemos as Principais Carrocerias e Chassis
            </h2>
          </div>

          {/* Infinite Marquee of Bus Manufacturers & Chassis */}
          <div className="forge-logo-marquee-wrap">
            <div className="forge-logo-marquee">
              <ul className="forge-logo-list">
                {BUS_MANUFACTURERS.map((m, idx) => (
                  <li key={`m1-${idx}`} className="forge-logo-item">
                    <span className="forge-logo-name">{m.name}</span>
                    <span className="forge-logo-type">{m.type}</span>
                  </li>
                ))}
              </ul>
              {/* Duplicated list for seamless marquee infinite loop */}
              <ul className="forge-logo-list" aria-hidden="true">
                {BUS_MANUFACTURERS.map((m, idx) => (
                  <li key={`m2-${idx}`} className="forge-logo-item">
                    <span className="forge-logo-name">{m.name}</span>
                    <span className="forge-logo-type">{m.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="forge-approach-bottom">
            <p className="forge-approach-copy">
              Conferência rigorosa de código, chassi e foto antes do despacho para evitar retrabalho
              na oficina. Cada detalhe tem propósito para manter sua operação em movimento contínuo.
            </p>
            <ForgeButton text="Falar com Especialista" href="#contact" />
          </div>
        </section>

        {/* 5. Sticky 3-Step Process (Forge Identity / Insight / Cohesion) */}
        <section id="steps" className="forge-steps-section">
          <div className="forge-steps-split">
            {/* Left: Sticky Image Preview (Desktop) */}
            <aside className="forge-steps-sticky-aside" aria-hidden="true">
              <div className="forge-steps-visual">
                {STEPS_DATA.map((step, idx) => (
                  <img
                    key={step.num}
                    src={step.image}
                    alt={step.alt}
                    className={`forge-steps-image ${activeStepIndex === idx ? "active" : ""}`}
                  />
                ))}
              </div>
            </aside>

            {/* Right: Scrollable Step Cards */}
            <div className="forge-steps-cards-list">
              {STEPS_DATA.map((step, idx) => (
                <article
                  key={step.num}
                  ref={(el) => {
                    stepArticleRefs.current[idx] = el;
                  }}
                  className="forge-step-article"
                >
                  <div className="forge-step-indicator">
                    {step.num} <span>/ {step.total}</span> — {step.tag}
                  </div>
                  <h3 className="forge-step-heading">{step.title}</h3>
                  <p className="forge-step-desc">{step.desc}</p>
                  <ForgeButton text="Solicitar Peça" href="#contact" />

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
        </section>

        {/* 6. Monumental Editorial Statement */}
        <section className="forge-statement-section">
          <div className="forge-statement-grid">
            <h2 className="forge-statement-quote">
              No transporte de passageiros, cada hora de veículo parado representa prejuízo e atraso
              na linha.
            </h2>
            <div className="forge-statement-details">
              <p className="forge-statement-copy">
                Nossos consultores entendem de montagem e aplicação prática. Antes de emitir o
                pedido, validamos a compatibilidade exata com sua carroceria e garantimos despacho
                imediato para quem precisa rodar.
              </p>
              <ForgeButton text="Falar com Consultor" href="#contact" />
            </div>
          </div>
        </section>

        {/* 7. Sticky Services Split (6 Linhas de Peças) */}
        <section id="services" className="forge-services-section">
          <div className="forge-services-split">
            {/* Left: Scrollable service cards */}
            <div className="forge-services-list">
              {SERVICES_DATA.map((srv, idx) => (
                <article
                  key={srv.id}
                  ref={(el) => {
                    serviceRefs.current[idx] = el;
                  }}
                  className="forge-service-card"
                >
                  <span className="forge-service-tag">{srv.tag}</span>
                  <h3 className="forge-service-title">{srv.title}</h3>
                  <p className="forge-service-desc">{srv.desc}</p>
                  <ForgeButton text="Consultar Linha" href="#contact" />

                  {/* Mobile image inline */}
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
                <img
                  key={srv.id}
                  src={srv.image}
                  alt={srv.alt}
                  className={`forge-service-sticky-image ${activeServiceIndex === idx ? "active" : ""}`}
                />
              ))}
            </aside>
          </div>
        </section>

        {/* 8. "Ordinary Ends Here" Aerial Vehicle Showcase */}
        <section id="frotas" ref={frotasSectionRef} className="forge-ordinary-section">
          <h2 className="forge-ordinary-top-title">Frotas em Movimento</h2>

          <div className="forge-ordinary-cars-container">
            {/* Highway animated road lane lines */}
            <div ref={roadLinesRef} className="forge-road-track-lines" aria-hidden="true">
              <div className="forge-lane-divider" />
              <div className="forge-lane-divider" />
            </div>

            {/* Left: Urban Transit Bus */}
            <div ref={carLeftRef} className="forge-car-eagle-eye forge-car-side left">
              <div className="forge-headlight-beam" />
              <img
                src="/images/center/bus-aerial-transit.png"
                alt="Ônibus Urbano Transit POV aérea"
                loading="lazy"
              />
            </div>

            {/* Center: Luxury Touring Coach Bus */}
            <div ref={carMainRef} className="forge-car-eagle-eye forge-car-main">
              <div className="forge-headlight-beam main-beam" />
              <img
                src="/images/center/bus-aerial-main.png"
                alt="Ônibus Rodoviário Paradiso POV aérea"
                loading="lazy"
              />
            </div>

            {/* Right: Executive Minibus Van */}
            <div ref={carRightRef} className="forge-car-eagle-eye forge-car-side right">
              <div className="forge-headlight-beam" />
              <img
                src="/images/center/bus-aerial-minibus.png"
                alt="Van Minibus Executiva POV aérea"
                loading="lazy"
              />
            </div>
          </div>

          <h2 className="forge-ordinary-bottom-title">Se Roda, A Gente Tem.</h2>
          <p className="forge-ordinary-copy">
            Linhas completas para carrocerias urbanas, rodoviárias e fretamento. Peças originais e
            compatíveis de máxima durabilidade, com entrega em até 48 horas.
          </p>
        </section>

        {/* 9. Monumental Full Banners */}
        <section id="catalogo" className="forge-full-banner">
          <div className="forge-full-banner-bg">
            <img
              src="/images/center/banner-catalogo-tecnico.jpg"
              alt="Catálogo técnico de peças para carrocerias Center Ônibus"
              loading="lazy"
            />
          </div>
          <div className="forge-full-banner-overlay" />
          <div className="forge-full-banner-content">
            <h2 className="forge-full-banner-title">Catálogo Técnico</h2>
            <p className="forge-full-banner-desc">
              Mais de 30 mil itens catalogados. Consulte por código de fabricante, foto da peça ou
              montadora da carroceria.
            </p>
            <ForgeButton text="Consultar Catálogo" href="#contact" />
          </div>
        </section>

        <section id="estoque" className="forge-full-banner">
          <div className="forge-full-banner-bg">
            <img
              src="/images/center/banner-frotas.jpg"
              alt="Estoque e liberação rápida de peças para frotas"
              loading="lazy"
            />
          </div>
          <div className="forge-full-banner-overlay" />
          <div className="forge-full-banner-content">
            <h2 className="forge-full-banner-title">Estoque Imediato</h2>
            <p className="forge-full-banner-desc">
              Despacho no mesmo dia para transportadoras de todo o país. Agilidade máxima para frotas
              não ficarem paradas.
            </p>
            <ForgeButton text="Solicitar Cotação" href="#contact" />
          </div>
        </section>

        {/* 10. Footer & Final CTA */}
        <footer id="contact" className="forge-footer-section">
          <div className="forge-footer-bg">
            <img
              src="/images/center/forge-hero-bus.jpg"
              alt="Center Ônibus - Frotas prontas para rodar"
              loading="lazy"
            />
          </div>
          <div className="forge-footer-overlay" />

          <div className="forge-footer-cta-box">
            <p className="forge-footer-kicker">Sua frota no tempo certo</p>
            <h2 className="forge-footer-title">O Ônibus Volta pra Rua.</h2>
            <ForgeButton text="Fale com a Center Ônibus" href="https://wa.me/5511999999999" />
          </div>

          <div className="forge-footer-bottom-bar">
            <button
              type="button"
              onClick={scrollToTop}
              className="forge-back-to-top"
              aria-label="Voltar ao início"
            >
              <span>
                {"Voltar ao Início".split("").map((char, i) => (
                  <span key={i} style={{ transitionDelay: `${i * 0.02}s` }}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
              <span aria-hidden="true">↑</span>
            </button>

            <div className="forge-footer-legals">
              <span>Center Ônibus © {new Date().getFullYear()}</span>
              <a href="#hero">Privacidade</a>
              <a href="#hero">Termos</a>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScrollProvider>
  );
}
