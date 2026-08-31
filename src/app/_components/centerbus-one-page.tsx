"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BusScrollSequence } from "./bus-scroll-sequence";
import { InstitutionalFooter } from "./institutional-footer";
import { aboutLinks, mainLinks } from "./institutional-nav";
import { SpatialCategoryExplorer } from "./spatial-category-explorer";
import { SiteLoader } from "./site-loader";

const PartsIdentificationScene = dynamic(
  () => import("./parts-identification-scene").then((module) => module.PartsIdentificationScene),
  {
    ssr: false,
    loading: () => <div id="identificacao-3d" className="home-parts-loading" aria-hidden="true" />,
  },
);

const ParticleBusShowcase = dynamic(
  () => import("./particle-bus-showcase").then((module) => module.ParticleBusShowcase),
  {
    ssr: false,
    loading: () => <div className="home-particle-showcase home-particle-loading" aria-hidden="true" />,
  },
);

const categories = [
  {
    code: "CAR",
    title: "Carroceria",
    detail: "Estrutura, fechamentos e reposição técnica",
    application: "Caio, Comil, Marcopolo e Neobus",
    examples: "Parachoques, tampas, borrachas, perfis e acabamentos",
    availability: "Identificação por aplicação",
  },
  {
    code: "ACB",
    title: "Acabamento",
    detail: "Interior, exterior, frisos e arremates",
    application: "Linha urbana, rodoviária e micro-ônibus",
    examples: "Revestimentos, trincos, puxadores, frisos e guarnições",
    availability: "Consulta por foto ou amostra",
  },
  {
    code: "ILU",
    title: "Iluminação",
    detail: "Luzes, lanternas, chicotes e sinalização",
    application: "Identificação por código, foto ou aplicação",
    examples: "Lanternas, faróis, luzes internas, chicotes e conectores",
    availability: "Código antes do despacho",
  },
  {
    code: "CLI",
    title: "Climatização",
    detail: "Conforto térmico, dutos e componentes",
    application: "Spheros, peças de reposição e suporte",
    examples: "Filtros, difusores, comandos, dutos e componentes de ar",
    availability: "Suporte para conferência",
  },
] as const;

const quickActions = [
  {
    label: "Enviar foto",
    title: "Não sabe o código?",
    copy: "Mande a foto da peça ou da carroceria. A equipe ajuda na identificação antes do orçamento.",
    href: "/fale-conosco",
  },
  {
    label: "Tenho o código",
    title: "Consulta direta",
    copy: "Informe o código, fabricante ou aplicação. A conferência evita troca e parada desnecessária.",
    href: "/produtos",
  },
  {
    label: "Ver categorias",
    title: "Catálogo por operação",
    copy: "Carroceria, acabamento, iluminação e climatização organizados para compra rápida.",
    href: "/produtos",
  },
] as const;

const operationSteps = [
  {
    number: "01",
    title: "Identificação técnica",
    copy: "Você informa a carroceria, o modelo, o código ou envia uma foto. A equipe cruza a aplicação antes do orçamento.",
  },
  {
    number: "02",
    title: "Conferência de estoque",
    copy: "Compatibilidade, fabricante e disponibilidade são validados para a peça sair certa na primeira vez.",
  },
  {
    number: "03",
    title: "Prazo e condição",
    copy: "Orçamento objetivo, disponibilidade conferida e prazo alinhado com a urgência da operação.",
  },
  {
    number: "04",
    title: "Retirada ou despacho",
    copy: "Peça separada, conferida e acompanhada até a retirada, entrega local ou envio para a frota.",
  },
] as const;

const units = [
  { state: "SP", city: "São Paulo", label: "Matriz", role: "Atendimento, estoque e suporte técnico para operações de grande giro." },
  { state: "BA", city: "Lauro de Freitas", label: "Filial", role: "Base regional para reduzir distância e acelerar reposição no Nordeste." },
  { state: "RJ", city: "Rio de Janeiro", label: "Filial", role: "Atendimento local para frotas, oficinas e manutenção urbana." },
] as const;

export function CenterbusOnePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 0.96,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      anchors: { offset: -90, duration: 1.25 },
      overscroll: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });

    const syncScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", syncScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const refreshScroll = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    const context = gsap.context(() => {
      gsap.from(".home-header", {
        y: -22,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.to(".home-scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
        },
      });

      const header = root.querySelector<HTMLElement>(".home-header");
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (!header || header.classList.contains("is-menu-open")) return;
          gsap.to(header, {
            yPercent: self.direction === 1 && self.scroll() > 260 ? -145 : 0,
            duration: 0.32,
            overwrite: true,
            ease: "power2.out",
          });
        },
      });

      gsap.fromTo(".home-action-diagonal", { xPercent: 18 }, {
        xPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: ".home-action-panel", start: "top bottom", end: "bottom top", scrub: true },
      });

      gsap.fromTo(".home-process-progress", { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: ".home-operation", start: "top 72%", end: "center center", scrub: true },
      });

      gsap.fromTo(".home-proof-signal", { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: ".home-proof", start: "top bottom", end: "center center", scrub: true },
      });

      root.querySelectorAll<HTMLElement>("[data-count-to]").forEach((counter) => {
        const target = Number(counter.dataset.countTo ?? 0);
        const suffix = counter.dataset.countSuffix ?? "";
        const formatter = new Intl.NumberFormat("pt-BR");
        const value = { current: 0 };

        gsap.to(value, {
          current: target,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: counter, start: "top 82%", once: true },
          onUpdate: () => {
            counter.textContent = `${formatter.format(Math.round(value.current))}${suffix}`;
          },
        });
      });

    }, root);

    const refreshTimeout = window.setTimeout(refreshScroll, 250);
    window.addEventListener("load", refreshScroll);
    document.fonts?.ready.then(refreshScroll).catch(() => undefined);
    refreshScroll();

    return () => {
      window.clearTimeout(refreshTimeout);
      window.removeEventListener("load", refreshScroll);
      gsap.ticker.remove(updateLenis);
      lenis.off("scroll", syncScrollTrigger);
      lenis.destroy();
      context.revert();
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  return (
    <div ref={rootRef} className="home-shell">
      <SiteLoader />
      <span className="home-scroll-progress" aria-hidden="true" />
      <header className={`home-header${isMenuOpen ? " is-menu-open" : ""}`}>
        <a className="home-brand" href="#inicio" aria-label="Center Ônibus, início" onClick={() => setIsMenuOpen(false)}>
          <Image src="/logo.png" alt="Center Ônibus" width={1123} height={293} priority />
        </a>

        <button
          className="home-menu-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="home-navigation"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <nav id="home-navigation" aria-label="Navegação principal" data-lenis-prevent>
          <a href="#inicio" onClick={() => setIsMenuOpen(false)}>Início</a>
          <div className="home-nav-dropdown">
            <Link href="/sobre/a-center-onibus" onClick={() => setIsMenuOpen(false)}>A Center</Link>
            <div className="home-nav-submenu">
              {aboutLinks.map((link) => (
                <Link href={link.href} key={link.href} onClick={() => setIsMenuOpen(false)}>{link.label}</Link>
              ))}
            </div>
          </div>
          {mainLinks.slice(1).map((link) => (
            <Link href={link.href} key={link.href} onClick={() => setIsMenuOpen(false)}>{link.label}</Link>
          ))}
        </nav>
      </header>

      <main>
        <BusScrollSequence />

        <section className="home-action-panel" aria-labelledby="action-title">
          <span className="home-action-diagonal" aria-hidden="true" />
          <div className="home-container home-action-layout" data-reveal-group>
            <div className="home-action-intro" data-reveal>
              <p className="home-kicker">Atendimento técnico</p>
              <h2 id="action-title">Precisa identificar uma peça?</h2>
              <p>
                Envie foto, código ou modelo do ônibus. A resposta começa pela aplicação correta, antes do preço e antes da promessa de prazo.
              </p>
              <div className="home-action-buttons">
                <Link className="home-button home-button-primary" href="/fale-conosco">Falar com especialista</Link>
                <Link className="home-button home-button-quiet-dark" href="/produtos">Consultar catálogo</Link>
              </div>
              <dl className="home-action-proof" aria-label="Dados do atendimento">
                <div><dt>Entrada</dt><dd>foto, código ou modelo</dd></div>
                <div><dt>Resposta</dt><dd>aplicação conferida</dd></div>
              </dl>
            </div>

            <div className="home-action-cards" aria-label="Caminhos rápidos">
              {quickActions.map((action, index) => (
                <Link href={action.href} className="home-action-card" key={action.label} data-reveal>
                  <span>0{index + 1}</span>
                  <div>
                    <small>{action.label}</small>
                    <strong>{action.title}</strong>
                    <p>{action.copy}</p>
                  </div>
                  <b aria-hidden="true">→</b>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <PartsIdentificationScene />

        <section id="catalogo-interativo" className="home-section home-catalog" aria-labelledby="catalog-title">
          <div className="home-catalog-sticky">
            <div className="home-container home-catalog-layout" data-reveal-group>
              <div className="home-section-heading" data-reveal>
                <p className="home-kicker">Linha Center Ônibus</p>
                <h2 id="catalog-title">Encontre pelo que você já tem em mãos.</h2>
                <p>Comece pela categoria. Depois, confirme por código, foto, carroceria ou aplicação com a equipe.</p>
                <Link className="home-text-link" href="/produtos">Consultar catálogo <span aria-hidden="true">→</span></Link>
                <div className="home-catalog-note" aria-label="Critérios de consulta">
                  <span>Consulta por</span>
                  <strong>código, foto, carroceria ou aplicação</strong>
                </div>
              </div>
              <SpatialCategoryExplorer categories={categories} />
            </div>
          </div>
        </section>

        <ParticleBusShowcase />

        <section id="operacao" className="home-section home-operation" aria-labelledby="operation-title">
          <div className="home-container home-operation-layout" data-reveal-group>
            <div className="home-operation-intro">
              <div className="home-section-heading" data-reveal>
                <p className="home-kicker">A peça certa, na primeira vez</p>
                <h2 id="operation-title">Da identificação ao despacho.</h2>
                <p>Uma linha operacional contínua para confirmar aplicação, disponibilidade e próxima saída.</p>
              </div>
              <aside className="home-operation-note" data-reveal aria-label="Resumo operacional">
                <span>Ordem de atendimento</span>
                <strong>Conferir antes de separar.</strong>
                <p>Menos troca, menos parada e uma resposta alinhada com a urgência da frota.</p>
              </aside>
            </div>
            <div className="home-process">
              <span className="home-process-progress" aria-hidden="true" />
              {operationSteps.map((step) => (
                <article key={step.number} data-reveal>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section home-proof" aria-labelledby="proof-title">
          <span className="home-proof-signal" aria-hidden="true" />
          <div className="home-container home-proof-layout" data-reveal-group>
            <div className="home-proof-statement" data-reveal>
              <p className="home-kicker">Palavra que se cumpre</p>
              <h2 id="proof-title">Estrutura para responder. Experiência para conferir.</h2>
              <p>Mais de quatro décadas acompanhando a evolução das carrocerias e as urgências de quem mantém o transporte em operação.</p>
            </div>
            <div className="home-proof-numbers">
              <article data-reveal><strong data-count-to="40" data-count-suffix="+">40+</strong><span>anos de atuação</span></article>
              <article data-reveal><strong data-count-to="30000" data-count-suffix="+">30.000+</strong><span>itens no portfólio</span></article>
              <article data-reveal><strong>ISO 9001</strong><span>processos certificados</span></article>
              <article data-reveal><strong>Brasil</strong><span>atendimento nacional</span></article>
            </div>
          </div>
        </section>

        <section className="home-section home-units" aria-labelledby="units-title">
          <div className="home-container" data-reveal-group>
            <div className="home-section-heading" data-reveal>
              <p className="home-kicker">Presença que encurta distâncias</p>
              <h2 id="units-title">Três unidades. Uma equipe pronta para atender.</h2>
              <p>Atendimento próximo para consulta, separação, retirada e despacho conforme a urgência da operação.</p>
            </div>
            <div className="home-unit-network" aria-hidden="true">
              <span className="home-unit-route" />
              <i>SP</i><i>BA</i><i>RJ</i>
            </div>
            <div className="home-unit-list">
              {units.map((unit) => (
                <article key={unit.state} data-reveal>
                  <strong>{unit.state}</strong>
                  <div><span>{unit.label}</span><h3>{unit.city}</h3><p>{unit.role}</p></div>
                  <Link href="/fale-conosco" aria-label={`Falar com a unidade de ${unit.city}`}>Falar com a unidade</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-contact" aria-labelledby="contact-title">
          <div className="home-container home-contact-layout" data-reveal-group>
            <div data-reveal>
              <p className="home-kicker">Resposta no tempo da operação</p>
              <h2 id="contact-title">O ônibus volta pra rua.</h2>
            </div>
            <div data-reveal>
              <p>Mande foto, código ou modelo. A equipe identifica, confere a aplicação e orienta a próxima saída.</p>
              <Link className="home-button home-button-light" href="/fale-conosco">Enviar foto da peça</Link>
              <Link className="home-contact-secondary" href="/produtos">Consultar catálogo <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
