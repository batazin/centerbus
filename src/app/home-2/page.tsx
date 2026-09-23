"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../_lib/gsap";
import { SmoothScrollProvider } from "../_components/smooth-scroll-provider";
import { ForgeHeroCar } from "./_components/forge-hero-car";
import "./forge-clean.css";

// Leading Brazilian Bus Bodywork & Chassis Manufacturers
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

const STEPS = [
  {
    num: "01",
    total: "03",
    tag: "CONFERÊNCIA",
    title: "Identificação Precisa",
    desc: "Código, foto, chassi e montadora conferidos antes da separação para garantir a peça certa na primeira vez. Evitamos retrabalho na oficina.",
    image: "/images/center/step-01-conferencia.jpg",
    alt: "Identificação técnica de lanterna e código de carroceria Center Ônibus",
  },
  {
    num: "02",
    total: "03",
    tag: "ESTOQUE",
    title: "Pronta Entrega",
    desc: "Mais de 30 mil itens disponíveis: lanternas, faróis, para-brisas, retrovisores, climatização e componentes estruturais para todas as linhas.",
    image: "/images/center/step-02-estoque.jpg",
    alt: "Conferência técnica no estoque de peças Center Ônibus",
  },
  {
    num: "03",
    total: "03",
    tag: "LOGÍSTICA",
    title: "Despacho Ágil",
    desc: "Entrega em até 48h para a Grande São Paulo e despacho no mesmo dia para transportadoras de todo o Brasil. O ônibus volta pra rua.",
    image: "/images/center/step-03-despacho.jpg",
    alt: "Inspeção e liberação de ônibus na oficina técnica",
  },
];

const SERVICES = [
  {
    tag: "Linha 01",
    title: "Iluminação & Sinalização",
    desc: "Lanternas traseiras modulares, blocos ópticos, faróis halógenos e LED, delimitadoras e chicotes de reposição para todos os modelos.",
    image: "/images/center/service-iluminacao.jpg",
    alt: "Lanternas e sinalização técnica para ônibus",
  },
  {
    tag: "Linha 02",
    title: "Vidros & Para-brisas",
    desc: "Para-brisas laminados bipartidos e inteiriços, vigias traseiros, vidros de janelas móveis e fixas, borrachas e guarnições de vedação EPDM.",
    image: "/images/center/service-vidros.jpg",
    alt: "Para-brisas e vidros para carrocerias de ônibus",
  },
  {
    tag: "Linha 03",
    title: "Retrovisores & Espelhos",
    desc: "Conjuntos completos com braço tubular ou carenado, espelhos convexos auxiliares, comandos elétricos e desembaçadores térmicos.",
    image: "/images/center/service-retrovisores.jpg",
    alt: "Retrovisores e espelhos de reposição",
  },
  {
    tag: "Linha 04",
    title: "Carroceria & Chaparia",
    desc: "Para-choques em fibra e plástico injetado, grades dianteiras, tampas de motor, painéis laterais, dobradiças reforçadas e fechaduras.",
    image: "/products/catalogo-geral-pecas.png",
    alt: "Peças de carroceria e lataria de ônibus",
  },
  {
    tag: "Linha 05",
    title: "Climatização & Filtros",
    desc: "Filtros anti-pólen (Spheros CC305 / 335 / 355T), dutos de ar, grades de ventilação, motores de condensador e componentes térmicos.",
    image: "/products/co-11084-packaging.webp",
    alt: "Filtro anti-pólen CO 11084 e climatização Center Ônibus",
  },
  {
    tag: "Linha 06",
    title: "Vedação & Acabamento",
    desc: "Perfis de borracha para portas e janelas, pega-mãos, corrimãos, assoalhos taraflex, itinerários eletrônicos e componentes de cabine.",
    image: "/blog/conferencia-estoque.webp",
    alt: "Acabamento interno e vedação para ônibus",
  },
];

function CenterButton({ text, href = "#contato" }: { text: string; href?: string }) {
  return (
    <a href={href} className="f-btn" aria-label={text}>
      <span className="f-btn-shine" aria-hidden="true" />
      <span className="f-btn-label">
        {text.split("").map((char, i) => (
          <span key={i} className="f-btn-char" style={{ transitionDelay: `${i * 0.015}s` }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </a>
  );
}

export default function Home2() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Section Refs for ScrollTrigger
  const stepItemsRef = useRef<(HTMLElement | null)[]>([]);
  const serviceItemsRef = useRef<(HTMLElement | null)[]>([]);

  // Bus Parallax Refs
  const busesWrapRef = useRef<HTMLDivElement>(null);
  const busMainRef = useRef<HTMLDivElement>(null);
  const busLeftRef = useRef<HTMLDivElement>(null);
  const busRightRef = useRef<HTMLDivElement>(null);

  // Header handlers
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Step detection for active 1:1 image
      stepItemsRef.current.forEach((el, idx) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveStep(idx),
          onEnterBack: () => setActiveStep(idx),
        });
      });

      // 2. Service detection for sticky photo panel
      serviceItemsRef.current.forEach((el, idx) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveService(idx),
          onEnterBack: () => setActiveService(idx),
        });
      });

      // 3. Parallax showcase on the 3 bus models
      if (busesWrapRef.current) {
        if (busMainRef.current) {
          gsap.fromTo(
            busMainRef.current,
            { scale: 0.88, opacity: 0.5 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: busesWrapRef.current,
                start: "top 85%",
                end: "center center",
                scrub: true,
              },
            }
          );
        }

        if (busLeftRef.current) {
          gsap.fromTo(
            busLeftRef.current,
            { x: -70, opacity: 0.4 },
            {
              x: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: busesWrapRef.current,
                start: "top 80%",
                end: "center center",
                scrub: true,
              },
            }
          );
        }

        if (busRightRef.current) {
          gsap.fromTo(
            busRightRef.current,
            { x: 70, opacity: 0.4 },
            {
              x: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: busesWrapRef.current,
                start: "top 80%",
                end: "center center",
                scrub: true,
              },
            }
          );
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <SmoothScrollProvider anchorOffset={0} lerp={0.09} wheelMultiplier={0.82}>
      <div className="forge-page">
        {/* =========================================================================
            HEADER & FULLSCREEN NAVIGATION
            ========================================================================= */}
        <header className="f-header">
          {/* Institutional Contact Bar */}
          <nav aria-label="Canais de Atendimento" className="f-header-socials">
            <a
              href="tel:+551122215000"
              aria-label="Telefone (11) 2221-5000"
              className="f-social-link"
              style={{ fontSize: "0.85rem", letterSpacing: "0.1rem", textDecoration: "none" }}
            >
              (11) 2221-5000
            </a>
            <span style={{ opacity: 0.3 }}>|</span>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Vendas"
              className="f-social-link"
              style={{ fontSize: "0.85rem", letterSpacing: "0.1rem", textDecoration: "none" }}
            >
              WHATSAPP
            </a>
          </nav>

          {/* Center Official Center Ônibus Negative Logo */}
          <a href="#hero" className="f-header-logo-wrap" aria-label="Center Ônibus Início">
            <img
              src="/brand/center-onibus-logo-negative.png"
              alt="Center Ônibus Distribuidora de Peças"
              style={{ height: "3.2rem", width: "auto", objectFit: "contain" }}
            />
          </a>

          {/* Right Menu Button */}
          <button
            type="button"
            onClick={toggleMenu}
            className="f-header-nav-btn"
            aria-label="Navegação do site"
          >
            <span className="f-header-nav-label">{menuOpen ? "FECHAR" : "MENU"}</span>
            <div className={`f-hamburger ${menuOpen ? "open" : ""}`}>
              <span />
              <span />
              <span />
            </div>
          </button>
        </header>

        {/* Fullscreen Navigation Modal */}
        <div className={`f-nav-modal ${menuOpen ? "open" : ""}`}>
          <nav aria-label="Navegação Principal">
            <ul className="f-nav-list">
              <li><a href="#hero" className="f-nav-link" onClick={closeMenu}>Início</a></li>
              <li><a href="#estrutura" className="f-nav-link" onClick={closeMenu}>Estrutura Operacional</a></li>
              <li><a href="#conferencia" className="f-nav-link" onClick={closeMenu}>Conferência Técnica</a></li>
              <li><a href="#proposito" className="f-nav-link" onClick={closeMenu}>Nosso Propósito</a></li>
              <li><a href="#linhas" className="f-nav-link" onClick={closeMenu}>Linhas de Peças</a></li>
              <li><a href="#frotas" className="f-nav-link" onClick={closeMenu}>Frotas Atendidas</a></li>
              <li><a href="#catalogo" className="f-nav-link" onClick={closeMenu}>Catálogo Técnico</a></li>
              <li><a href="#contato" className="f-nav-link" onClick={closeMenu}>Fale Conosco</a></li>
            </ul>
          </nav>
          <div className="f-nav-contacts">
            <a href="tel:+551122215000">(11) 2221-5000</a>
            <a href="mailto:contato@centeronibus.com.br">contato@centeronibus.com.br</a>
            <span style={{ color: "var(--color-vermelho-sinal)", fontWeight: 700, marginTop: "1rem" }}>
              O ÔNIBUS VOLTA PRA RUA.
            </span>
          </div>
        </div>

        {/* =========================================================================
            1. HERO SECTION (ForgeHeroCar: 241-Frame 3D Bus Sequence Scrubbing)
            ========================================================================= */}
        <ForgeHeroCar />

        {/* =========================================================================
            2. APPROACH SECTION (Estrutura Operacional + Marquee Encarroçadoras)
            ========================================================================= */}
        <section id="estrutura" className="f-approach-section">
          <div className="f-approach-bg">
            <img
              src="/images/center/approach-workshop.jpg"
              alt="Inspeção técnica em garagem de ônibus"
            />
          </div>
          <div className="f-approach-overlay" />

          <div className="f-approach-content">
            <h2 className="f-approach-title">Estrutura Operacional Para Manter Frotas em Movimento</h2>

            {/* Marquee of Brazilian Bus Bodywork & Chassis Manufacturers */}
            <div className="f-marquee-wrap" aria-hidden="true">
              <div className="f-marquee-track">
                {BUS_MANUFACTURERS.concat(BUS_MANUFACTURERS).map((maker, idx) => (
                  <div key={idx} className="f-marquee-item">
                    <div className="f-marquee-badge">
                      <span className="f-marquee-badge-name">{maker.name}</span>
                      <span className="f-marquee-badge-type">{maker.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="f-approach-bottom">
              <p className="f-approach-desc">
                Conhecimento antes do catálogo. Código, foto, chassi e carroceria entram na mesma conferência antes de qualquer separação. Mais de 30 mil itens cadastrados com despacho ágil para todo o país.
              </p>
              <CenterButton text="Falar com Especialista" href="#contato" />
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. 3-STEP NARRATIVE (Identificação, Estoque, Logística)
            ========================================================================= */}
        <section id="conferencia" className="f-steps-section">
          <div className="f-steps-grid">
            {/* Left Sticky 1:1 Image Frame */}
            <div className="f-steps-visual-sticky" aria-hidden="true">
              {STEPS.map((step, idx) => (
                <img
                  key={step.title}
                  src={step.image}
                  alt={step.alt}
                  className={`f-steps-visual-img ${activeStep === idx ? "active" : ""}`}
                />
              ))}
            </div>

            {/* Right Scrollable Step Articles */}
            <div className="f-steps-list">
              {STEPS.map((step, idx) => (
                <article
                  key={step.title}
                  ref={(el) => {
                    stepItemsRef.current[idx] = el;
                  }}
                  className="f-step-card"
                >
                  <div className="f-step-counter">
                    {step.num} <span>/ {step.total} — {step.tag}</span>
                  </div>
                  <h3 className="f-step-heading">{step.title}</h3>
                  <p className="f-step-desc">{step.desc}</p>
                  <CenterButton text="Consultar Disponibilidade" href="#contato" />

                  {/* Inline photo on tablet/mobile */}
                  <img src={step.image} alt={step.alt} className="f-step-mobile-img" loading="lazy" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. STATEMENT SECTION (Conhecimento Antes do Catálogo)
            ========================================================================= */}
        <section id="proposito" className="f-statement-section">
          <div className="f-statement-grid">
            <div className="f-statement-left">
              <h2 className="f-statement-quote">
                No transporte de passageiros, cada hora de veículo parado representa prejuízo e atraso na linha.
              </h2>
              <p className="f-statement-copy">
                A Center Ônibus não entrega apenas peças: entregamos a certeza de que o veículo volta a rodar sem retrabalho. Nossa bancada técnica valida código, foto e carroceria para Caio, Comil, Marcopolo, Neobus e todas as principais montadoras do país.
              </p>
              <CenterButton text="Solicitar Cotação" href="#contato" />
            </div>

            <div className="f-statement-img-wrap">
              <img
                src="/images/center/statement-consultor.jpg"
                alt="Consultor técnico de peças Center Ônibus"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. SERVICES SECTION (6 Linhas de Peças com Sticky Photo Panel)
            ========================================================================= */}
        <section id="linhas" className="f-services-section">
          <div className="f-services-grid">
            {/* Left Scrollable Service Articles */}
            <div className="f-services-list">
              {SERVICES.map((srv, idx) => (
                <article
                  key={srv.title}
                  ref={(el) => {
                    serviceItemsRef.current[idx] = el;
                  }}
                  className="f-service-card"
                >
                  <span className="f-service-tag">{srv.tag}</span>
                  <h3 className="f-service-title">{srv.title}</h3>
                  <p className="f-service-desc">{srv.desc}</p>
                  <CenterButton text="Consultar Linha" href="#contato" />

                  {/* Mobile image inline */}
                  <img src={srv.image} alt={srv.alt} className="f-service-mobile-img" loading="lazy" />
                </article>
              ))}
            </div>

            {/* Right Sticky Photo Panel */}
            <div className="f-services-sticky-panel" aria-hidden="true">
              {SERVICES.map((srv, idx) => (
                <img
                  key={srv.title}
                  src={srv.image}
                  alt={srv.alt}
                  className={`f-service-sticky-img ${activeService === idx ? "active" : ""}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. "FROTAS EM MOVIMENTO" BUS SHOWCASE
            ========================================================================= */}
        <section id="frotas" className="f-ordinary-section">
          <h2 className="f-ordinary-top-title">FROTAS EM MOVIMENTO</h2>

          <div ref={busesWrapRef} className="f-ordinary-cars-wrap">
            {/* Left Bus: Rodoviário */}
            <div ref={busLeftRef} className="f-ordinary-car-side left">
              <img
                src="/sequences/bus/frame_0060.webp"
                alt="Ônibus Rodoviário alta linha"
                loading="lazy"
              />
              <span className="f-bus-badge">RODOVIÁRIO</span>
            </div>

            {/* Center Main Bus: Urbano */}
            <div ref={busMainRef} className="f-ordinary-car-main">
              <img
                src="/sequences/bus/frame_0120.webp"
                alt="Ônibus Urbano Center Ônibus"
                loading="lazy"
              />
              <span className="f-bus-badge center">FROTAS URBANAS</span>
            </div>

            {/* Right Bus: Micro & Fretamento */}
            <div ref={busRightRef} className="f-ordinary-car-side right">
              <img
                src="/sequences/bus/frame_0180.webp"
                alt="Micro-ônibus e transporte executivo"
                loading="lazy"
              />
              <span className="f-bus-badge">MICRO & FRETE</span>
            </div>
          </div>

          <h2 className="f-ordinary-bottom-title">SE RODA, A GENTE TEM.</h2>
          <p className="f-ordinary-desc">
            Atendimento especializado para empresas de transporte regular, operadores de turismo, frotas municipais e oficinas independentes de todo o Brasil.
          </p>
        </section>

        {/* =========================================================================
            7. CATÁLOGO TÉCNICO MONUMENTAL BANNER
            ========================================================================= */}
        <section id="catalogo" className="f-banner-section">
          <div className="f-banner-bg">
            <img
              src="/products/catalogo-geral-pecas.png"
              alt="Catálogo completo de peças de carroceria Center Ônibus"
              loading="lazy"
            />
          </div>
          <div className="f-banner-overlay" />
          <div className="f-banner-content">
            <h2 className="f-banner-title">Catálogo de Peças</h2>
            <p className="f-banner-desc">
              Mais de 30 mil itens para carrocerias de ônibus organizados por montadora, chassi, sistema e aplicação técnica.
            </p>
            <CenterButton text="Consultar Catálogo" href="#contato" />
          </div>
        </section>

        {/* =========================================================================
            8. ESTOQUE & DESPACHO IMEDIATO BANNER
            ========================================================================= */}
        <section id="estoque" className="f-banner-section">
          <div className="f-banner-bg">
            <img
              src="/images/center/banner-frotas.jpg"
              alt="Terminal central e frota em operação atendida pela Center Ônibus"
              loading="lazy"
            />
          </div>
          <div className="f-banner-overlay" />
          <div className="f-banner-content">
            <h2 className="f-banner-title">Estoque Imediato</h2>
            <p className="f-banner-desc">
              Resposta no tempo da sua operação. Despacho rápido para transportadoras de todo o Brasil e entrega expressa na Grande São Paulo.
            </p>
            <CenterButton text="Cotar Pelo WhatsApp" href="https://wa.me/5511999999999" />
          </div>
        </section>

        {/* =========================================================================
            9. FOOTER & "O ÔNIBUS VOLTA PRA RUA"
            ========================================================= */}
        <footer id="contato" className="f-footer-section">
          <div className="f-footer-bg">
            <img
              src="/images/center/hero-bus-lineup.jpg"
              alt="Linha de ônibus liberados e operando"
              loading="lazy"
            />
          </div>
          <div className="f-footer-overlay" />

          <div className="f-footer-cta-box">
            <p className="f-footer-kicker">RESPOSTA NO TEMPO DA OPERAÇÃO</p>
            <h2 className="f-footer-title">O ÔNIBUS VOLTA PRA RUA.</h2>
            <CenterButton text="Falar com Especialista" href="https://wa.me/5511999999999" />
          </div>

          <div className="f-footer-bottom-bar">
            <button type="button" onClick={scrollToTop} className="f-back-to-top" aria-label="Voltar ao Topo">
              <span>
                {"Voltar ao Topo".split("").map((c, i) => (
                  <span key={i} style={{ transitionDelay: `${i * 0.02}s` }}>
                    {c === " " ? "\u00A0" : c}
                  </span>
                ))}
              </span>
              <span aria-hidden="true" style={{ marginLeft: "0.5rem" }}>↑</span>
            </button>

            <div className="f-footer-legals">
              <span>Center Ônibus Distribuidora de Peças Ltda.</span>
              <span>São Paulo - SP | Tel: (11) 2221-5000</span>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScrollProvider>
  );
}
