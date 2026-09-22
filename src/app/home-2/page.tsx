"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { HeroPracticalB2B } from "../_components/hero-practical-b2b";
import { ScrollRevealProvider } from "../_components/scroll-reveal-provider";
import { SmoothScrollProvider } from "../_components/smooth-scroll-provider";
import { UnitedBusShowcase } from "../_components/united-bus-showcase";
import "./home-2.css";

const MARQUEE_ITEMS = [
  "MARCOPOLO",
  "CAIO INDUSCAR",
  "COMIL ONIBUS",
  "NEOBUS",
  "SPHEROS CLIMATIZACAO",
  "DENSO HEAVY-DUTY",
  "SCANIA CHASSIS",
  "VOLVO ONIBUS",
  "MERCEDES-BENZ",
  "KNORR-BREMSE",
];

const COMMITMENTS = [
  {
    num: "01",
    tag: "DISPONIBILIDADE",
    title: "Estoque a Pronta-Entrega",
    copy: "Mais de 30.000 itens para liberação imediata, reduzindo drasticamente o tempo do veículo parado na oficina.",
  },
  {
    num: "02",
    tag: "PRECISÃO",
    title: "A Peça Certa na 1ª Vez",
    copy: "Conferência prévia por código OEM, aplicação e foto da carroceria para eliminar devoluções e retrabalho.",
  },
  {
    num: "03",
    tag: "LOGÍSTICA",
    title: "Despacho no Tempo da Rota",
    copy: "Agilidade com transportadoras parceiras e atendimento prioritário para frotas rodoviárias e urbanas.",
  },
  {
    num: "04",
    tag: "CONFIABILIDADE",
    title: "Processos ISO 9001",
    copy: "Rastreabilidade e garantia técnica de fábrica para garantir durabilidade contínua na rodagem.",
  },
];

const STATS = [
  {
    num: "30K+",
    label: "Itens em Estoque",
    desc: "Pronta-entrega imediata para ônibus rodoviários, urbanos e micros em todo o Brasil.",
  },
  {
    num: "24h",
    label: "Despacho Ágil",
    desc: "Separação e envio no tempo da rota através de malha logística e transportadoras parceiras.",
  },
  {
    num: "40+",
    label: "Anos de Estrada",
    desc: "Conhecimento técnico de carrocerias acumulado para orientar cada compra com precisão.",
  },
  {
    num: "99.4%",
    label: "Precisão na 1ª Vez",
    desc: "Conferência prévia por chassi, aplicação e foto para eliminar retrabalho e devoluções.",
  },
];

const UNITS = [
  {
    state: "SP",
    city: "São Paulo",
    label: "Matriz Operacional",
    role: "Atendimento executivo, estoque central com mais de 30.000 itens e suporte técnico para grandes frotas e oficinas.",
  },
  {
    state: "BA",
    city: "Lauro de Freitas",
    label: "Filial Nordeste",
    role: "Base estratégica regional para encurtar prazos de entrega e acelerar reposição em toda a malha rodoviária do Nordeste.",
  },
  {
    state: "RJ",
    city: "Rio de Janeiro",
    label: "Filial Rio",
    role: "Atendimento local com pronta-entrega para frotas urbanas, turismo, intermunicipais e operadores de manutenção.",
  },
];

const CATALOG_CATEGORIES = [
  {
    code: "CAR-01",
    title: "Frentes, Traseiras & Fibra",
    desc: "Máscaras frontais integrais, tampas de motor, parachoques e perfis estruturais de reposição para Marcopolo, Caio, Comil e Neobus.",
    avail: "Pronta-Entrega",
  },
  {
    code: "ILU-02",
    title: "Faróis & Blocos Ópticos",
    desc: "Faróis triplos, projetores Bi-LED, lanternas traseiras modulares estilo G7/G8, delimitadoras ovais e lâmpadas heavy-duty 24V.",
    avail: "Conferência por Foto",
  },
  {
    code: "PAN-03",
    title: "Limpadores & Pantográficos",
    desc: "Motores elétricos 24V, conjuntos articulados pantográficos duplos e palhetas de alto rendimento para parabrisas panorâmicos.",
    avail: "Estoque Físico",
  },
  {
    code: "CAB-04",
    title: "Salão, Teto & Climatização",
    desc: "Alçapões com saída de emergência, difusores de ar-condicionado, retrovisores carenados, chapas de alumínio xadrez e porta-copos.",
    avail: "Linha Completa",
  },
  {
    code: "VAL-05",
    title: "Pneumática, Válvulas & Chaves",
    desc: "Chaves gerais de corte de bateria, válvulas manuais de freio de estacionamento, fechaduras e trincos de tampas de bagageiro.",
    avail: "Despacho em 24h",
  },
];

function UnitedCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const loop = () => {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="uc-cursor-layer" aria-hidden="true">
      <div ref={cursorRef} className="uc-cursor-follower">
        <svg viewBox="0 0 60 60" className="uc-cursor-svg">
          <circle r="26" cx="30" cy="30" strokeWidth="1.5" fill="none" stroke="currentColor" strokeDasharray="140" strokeDashoffset="40" />
        </svg>
      </div>
      <div ref={dotRef} className="uc-cursor-dot" />
    </div>
  );
}

export default function Home2() {
  return (
    <SmoothScrollProvider anchorOffset={-90}>
      <ScrollRevealProvider>
        <div className="home-2-wrapper">
          <UnitedCursor />

          {/* Fundo Ambiente com Malha Técnica e Ondas de Radar Estilo United Carriers */}
          <div className="home-2-ambient-grid" aria-hidden="true" />
          <div className="home-2-ambient-vignette" aria-hidden="true" />

          {/* Header Flutuante de Alto Padrão com Rolling Flip Links */}
          <header className="home-2-header">
            <div className="home-2-brand-area">
              <Link href="/" className="home-2-logo-wrap" aria-label="Center Ônibus">
                <Image
                  src="/logo.png"
                  alt="Center Ônibus"
                  width={160}
                  height={40}
                  className="home-2-logo"
                  priority
                />
              </Link>
            </div>

            <nav className="home-2-nav" aria-label="Navegação Principal">
              <a href="#inicio" className="uc-flip-link">
                <span className="flip-text">Início</span>
                <span className="flip-text-clone" aria-hidden="true">Início</span>
              </a>
              <a href="#showcase" className="uc-flip-link">
                <span className="flip-text">Sistemas 3D</span>
                <span className="flip-text-clone" aria-hidden="true">Sistemas 3D</span>
              </a>
              <a href="#catalogo" className="uc-flip-link">
                <span className="flip-text">Peças em Estoque</span>
                <span className="flip-text-clone" aria-hidden="true">Peças em Estoque</span>
              </a>
              <a href="#compromissos" className="uc-flip-link">
                <span className="flip-text">Estrutura</span>
                <span className="flip-text-clone" aria-hidden="true">Estrutura</span>
              </a>
              <Link href="/produtos" className="uc-flip-link">
                <span className="flip-text">Catálogo Geral</span>
                <span className="flip-text-clone" aria-hidden="true">Catálogo Geral</span>
              </Link>
              <Link className="home-2-nav-cta" href="/fale-conosco">
                Solicitar Cotação
              </Link>
            </nav>
          </header>

          {/* Conteúdo Principal */}
          <main className="home-2-content-layer">
            {/* =================================================================
                1. HERO B2B COM VÍDEO DE FUNDO EM LOOP & FRASE PRIMORDIAL
                ================================================================= */}
            <div id="inicio">
              <HeroPracticalB2B />
            </div>

            {/* Marquee Contínuo de Fabricantes Homologados */}
            <div className="home-2-marquee-wrap reveal-fade-up" aria-hidden="true">
              <div className="home-2-marquee-inner">
                {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, idx) => (
                  <span key={idx} className="home-2-marquee-item">
                    <span className="home-2-marquee-dot" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* =================================================================
                2. SHOWCASE DE SISTEMAS COM FUNDO FIXO (STICKY SCROLLYTELLING)
                   "O fundo não muda, porém o conteúdo muda e as animações também"
                ================================================================= */}
            <div id="showcase" className="reveal-fade-up">
              <UnitedBusShowcase />
            </div>

            {/* =================================================================
                3. CATÁLOGO TÉCNICO VISUAL (LINHA REAL DE PEÇAS DE CARROCERIA)
                ================================================================= */}
            <section id="catalogo" className="home-2-catalog-section">
              <div className="reveal-fade-up" style={{ maxWidth: "1440px", margin: "0 auto 3rem auto" }}>
                <span className="home-2-kicker">Catálogo de Reposição Direta</span>
                <h2 className="home-2-hero-title" style={{ fontSize: "clamp(2.4rem, 4.2vw, 3.8rem)" }}>
                  Mais de 30 mil itens para pronta-entrega.
                </h2>
                <p className="home-2-hero-copy" style={{ maxWidth: "680px" }}>
                  Frentes em fibra, fechamentos, iluminação óptica completa, limpadores pantográficos,
                  retrovisores e componentes de cabine com identificação precisa por foto e chassi.
                </p>
              </div>

              <div className="home-2-catalog-grid">
                {/* Esquerda: Imagem Técnica Autêntica do Catálogo Center Ônibus */}
                <div className="home-2-catalog-frame reveal-fade-up">
                  <div className="home-2-catalog-image-wrap">
                    <Image
                      src="/products/catalogo-geral-pecas.png"
                      alt="Catálogo Oficial de Peças de Carroceria Center Ônibus"
                      width={1200}
                      height={800}
                      className="home-2-catalog-img"
                      priority
                    />
                  </div>
                  <div className="home-2-catalog-frame-badge">
                    <span className="home-2-status-dot" />
                    <span>LINHA HOMOLOGADA • MARCOPOLO • CAIO • COMIL • NEOBUS</span>
                  </div>
                </div>

                {/* Direita: Grupos de Peças e Aplicações Técnicas */}
                <div className="home-2-catalog-categories-list">
                  {CATALOG_CATEGORIES.map((cat, idx) => (
                    <article key={cat.code} className={`home-2-catalog-cat-item reveal-fade-up reveal-delay-${(idx % 4) + 1}`}>
                      <div className="home-2-catalog-cat-top">
                        <span className="home-2-catalog-cat-code">{cat.code}</span>
                        <span className="home-2-catalog-cat-avail">{cat.avail}</span>
                      </div>
                      <h3 className="home-2-catalog-cat-title">{cat.title}</h3>
                      <p className="home-2-catalog-cat-desc">{cat.desc}</p>
                    </article>
                  ))}

                  <div className="reveal-fade-up" style={{ marginTop: "1rem" }}>
                    <Link className="home-2-btn-primary" style={{ width: "100%", textAlign: "center" }} href="/produtos">
                      Consultar Linha Completa no Catálogo →
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================================
                4. MÉTRICAS MONUMENTAIS (ESTILO UNITED CARRIERS STATS GRID)
                ================================================================= */}
            <section className="home-2-stats-section">
              <div className="home-2-stats-grid">
                {STATS.map((s, idx) => (
                  <div key={s.label} className={`home-2-stat-box reveal-fade-up reveal-delay-${idx + 1}`}>
                    <div className="home-2-stat-num">
                      {s.num.replace("+", "")}
                      <span>+</span>
                    </div>
                    <div className="home-2-stat-label">{s.label}</div>
                    <p className="home-2-stat-desc">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* =================================================================
                4. COMPROMISSOS OPERACIONAIS & PROCESSOS ISO 9001
                ================================================================= */}
            <section id="compromissos" className="home-2-section" style={{ minHeight: "auto", padding: "6rem clamp(1.5rem, 5vw, 4.5rem)" }}>
              <div style={{ maxWidth: "1440px", margin: "0 auto", width: "100%" }}>
                <div className="reveal-fade-up" style={{ marginBottom: "3rem" }}>
                  <span className="home-2-kicker">Estrutura Operacional</span>
                  <h2 className="home-2-hero-title" style={{ fontSize: "clamp(2.4rem, 4vw, 3.8rem)" }}>
                    Compromisso com o ônibus na rua.
                  </h2>
                  <p className="home-2-hero-copy">
                    Estoque técnico a pronta-entrega com mais de 30 mil itens, conferência prévia 
                    e agilidade no despacho para manter sua frota em movimento.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                  {COMMITMENTS.map((c, idx) => (
                    <article key={c.num} className={`home-2-editorial-card reveal-fade-up reveal-delay-${idx + 1}`}>
                      <span className="home-2-card-tag">{c.num} / {c.tag}</span>
                      <h3 className="home-2-card-heading" style={{ fontSize: "1.4rem", margin: "0 0 0.75rem" }}>
                        {c.title}
                      </h3>
                      <p className="home-2-card-text" style={{ fontSize: "0.92rem", margin: 0 }}>
                        {c.copy}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* =================================================================
                5. BASES OPERACIONAIS & FILIAIS (SP, BA, RJ)
                ================================================================= */}
            <section className="home-2-units-section">
              <div style={{ maxWidth: "1440px", margin: "0 auto", width: "100%" }}>
                <div className="reveal-fade-up">
                  <span className="home-2-kicker">Presença que Encurta Distâncias</span>
                  <h2 className="home-2-hero-title" style={{ fontSize: "clamp(2.4rem, 4vw, 3.8rem)" }}>
                    Bases operacionais e atendimento.
                  </h2>
                  <p className="home-2-hero-copy">
                    Matriz em São Paulo e filiais na Bahia e no Rio de Janeiro para agilizar entregas,
                    reduzir prazos de trânsito e assegurar pronta-resposta em todo o país.
                  </p>
                </div>

                <div className="home-2-units-grid">
                  {UNITS.map((u, idx) => (
                    <article key={u.state} className={`home-2-unit-card reveal-fade-up reveal-delay-${idx + 1}`}>
                      <div className="home-2-unit-header">
                        <span className="home-2-unit-badge">{u.state}</span>
                        <span className="home-2-unit-type">{u.label}</span>
                      </div>
                      <h3 className="home-2-unit-city">{u.city}</h3>
                      <p className="home-2-unit-role">{u.role}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* =================================================================
                6. CTA FINAL: COTAÇÃO IMEDIATA & ENGENHARIA DE ATENDIMENTO
                ================================================================= */}
            <section className="home-2-final-cta">
              <div className="home-2-final-inner reveal-fade-up">
                <span className="home-2-card-tag">Atendimento Técnico Especializado</span>
                <h2 className="home-2-final-title">
                  Fale com quem entende de carroceria.
                </h2>
                <p className="home-2-final-copy">
                  Nossos consultores conferem o código da peça, aplicação no chassi e 
                  disponibilidade em estoque antes do fechamento do pedido.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                  <Link className="home-2-btn-primary" style={{ padding: "1rem 2.5rem" }} href="/fale-conosco">
                    Iniciar Orçamento Imediato →
                  </Link>
                  <Link className="home-2-btn-secondary" style={{ padding: "1rem 2.5rem" }} href="/produtos">
                    Acessar Catálogo Digital
                  </Link>
                </div>
              </div>
            </section>

            {/* Footer Ultra Clean */}
            <footer className="home-2-footer reveal-fade-up">
              <div>
                <strong>Center Ônibus Peças e Serviços Ltda.</strong> — São Paulo • Bahia • Rio de Janeiro
              </div>
              <div style={{ display: "flex", gap: "2rem" }}>
                <Link href="/" className="uc-flip-link">
                  <span className="flip-text">Home Original</span>
                  <span className="flip-text-clone" aria-hidden="true">Home Original</span>
                </Link>
                <Link href="/sobre/a-center-onibus" className="uc-flip-link">
                  <span className="flip-text">Institucional</span>
                  <span className="flip-text-clone" aria-hidden="true">Institucional</span>
                </Link>
                <Link href="/produtos" className="uc-flip-link">
                  <span className="flip-text">Catálogo</span>
                  <span className="flip-text-clone" aria-hidden="true">Catálogo</span>
                </Link>
                <Link href="/fale-conosco" className="uc-flip-link">
                  <span className="flip-text">Contato</span>
                  <span className="flip-text-clone" aria-hidden="true">Contato</span>
                </Link>
              </div>
            </footer>
          </main>
        </div>
      </ScrollRevealProvider>
    </SmoothScrollProvider>
  );
}
