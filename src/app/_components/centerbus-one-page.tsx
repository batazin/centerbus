"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

const categories = [
  {
    code: "CAR",
    title: "Carroceria",
    detail: "Estrutura, fechamentos e reposição técnica",
    application: "Caio, Comil, Marcopolo e Neobus",
    examples: "Parachoques, tampas, borrachas, perfis e acabamentos",
    availability: "Pronta-entrega",
  },
  {
    code: "ACB",
    title: "Acabamento",
    detail: "Interior, exterior, frisos e arremates",
    application: "Linha urbana, rodoviária e micro-ônibus",
    examples: "Revestimentos, trincos, puxadores, frisos e guarnições",
    availability: "Foto ou amostra",
  },
  {
    code: "ILU",
    title: "Iluminação",
    detail: "Luzes, lanternas, chicotes e sinalização",
    application: "Identificação por código, foto ou aplicação",
    examples: "Lanternas, faróis, luzes internas, chicotes e conectores",
    availability: "Código conferido",
  },
  {
    code: "CLI",
    title: "Climatização",
    detail: "Conforto térmico, dutos e componentes",
    application: "Spheros, peças de reposição e suporte",
    examples: "Filtros, difusores, comandos, dutos e componentes de ar",
    availability: "Suporte técnico",
  },
] as const;

const operationalCommitments = [
  {
    number: "01",
    tag: "DISPONIBILIDADE",
    title: "Estoque a pronta-entrega",
    copy: "Mais de 30.000 itens para liberação imediata, reduzindo o tempo do ônibus parado.",
  },
  {
    number: "02",
    tag: "PRECISÃO",
    title: "A peça certa na 1ª vez",
    copy: "Conferência prévia por código, aplicação e foto da carroceria para eliminar devoluções.",
  },
  {
    number: "03",
    tag: "LOGÍSTICA",
    title: "Despacho no tempo da rota",
    copy: "Agilidade com transportadoras parceiras e atendimento prioritário para frotas e oficinas.",
  },
  {
    number: "04",
    tag: "CONFIABILIDADE",
    title: "Processos ISO 9001",
    copy: "Rastreabilidade e garantia técnica de fábrica para garantir durabilidade na rodagem.",
  },
] as const;

const units = [
  { state: "SP", city: "São Paulo", label: "Matriz", role: "Atendimento, estoque central e suporte técnico para operações de grande giro." },
  { state: "BA", city: "Lauro de Freitas", label: "Filial Bahia", role: "Base regional para reduzir distância e acelerar reposição no Nordeste." },
  { state: "RJ", city: "Rio de Janeiro", label: "Filial Rio", role: "Atendimento local para frotas, oficinas e manutenção urbana." },
] as const;

export function CenterbusOnePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const refreshScroll = () => {
      ScrollTrigger.refresh();
    };

    const context = gsap.context(() => {
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
    }, root);

    const refreshTimeout = window.setTimeout(refreshScroll, 250);
    window.addEventListener("load", refreshScroll);
    document.fonts?.ready.then(refreshScroll).catch(() => undefined);
    refreshScroll();

    return () => {
      window.clearTimeout(refreshTimeout);
      window.removeEventListener("load", refreshScroll);
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

        <PartsIdentificationScene />

        <section id="catalogo-interativo" className="home-section home-catalog" aria-labelledby="catalog-title">
          <div className="home-catalog-sticky">
            <div className="home-container home-catalog-layout" data-reveal-group>
              <div className="home-section-heading" data-reveal>
                <p className="home-kicker">Linha Center Ônibus</p>
                <h2 id="catalog-title">Peças por categoria.</h2>
                <p>Veja as linhas de reposição e os componentes de cada sistema.</p>
                <Link className="home-text-link" href="/produtos">Consultar catálogo <span aria-hidden="true">→</span></Link>
              </div>
              <SpatialCategoryExplorer categories={categories} />
            </div>
          </div>
        </section>

        <section id="operacao" className="home-section home-operation" aria-labelledby="operation-title">
          <div className="home-container home-operation-layout" data-reveal-group>
            <div className="home-operation-intro">
              <div className="home-section-heading" data-reveal>
                <p className="home-kicker">Estrutura Operacional</p>
                <h2 id="operation-title">Compromisso com o ônibus na rua.</h2>
                <p>Estoque técnico com mais de 30 mil itens, conferência antes da separação e agilidade no despacho para manter sua frota em movimento.</p>
              </div>
              <Link className="home-button home-button-light" href="/fale-conosco">Iniciar orçamento</Link>
            </div>
            <div className="home-process">
              {operationalCommitments.map((step) => (
                <article key={step.number} data-reveal>
                  <span>{step.number}</span>
                  <small className="home-process-tag">{step.tag}</small>
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
              <p>Da oficina à gestão de frota, conhecimento de carroceria para orientar cada compra com precisão.</p>
            </div>
            <div className="home-proof-numbers">
              <article data-reveal><strong>40+</strong><span>anos de atuação</span></article>
              <article data-reveal><strong>30.000+</strong><span>itens no portfólio</span></article>
              <article data-reveal><strong>ISO 9001</strong><span>processos certificados</span></article>
              <article data-reveal><strong>Brasil</strong><span>atendimento nacional</span></article>
            </div>
          </div>
        </section>

        <section className="home-section home-units" aria-labelledby="units-title">
          <div className="home-container" data-reveal-group>
            <div className="home-units-top">
              <div className="home-section-heading" data-reveal>
                <p className="home-kicker">Presença que encurta distâncias</p>
                <h2 id="units-title">Bases operacionais e atendimento.</h2>
                <p>Matriz em São Paulo e filiais na Bahia e no Rio de Janeiro para agilizar entregas e reduzir o tempo de rota.</p>
              </div>
            </div>

            <div className="home-unit-network" aria-hidden="true">
              <span className="home-unit-route"><span className="home-unit-signal" /></span>
              <i>SP</i><i>BA</i><i>RJ</i>
            </div>

            <div className="home-unit-list">
              {units.map((unit) => (
                <article key={unit.state} data-reveal>
                  <strong>{unit.state}</strong>
                  <div>
                    <span>{unit.label}</span>
                    <h3>{unit.city}</h3>
                    <p>{unit.role}</p>
                  </div>
                  <Link href="/fale-conosco" aria-label={`Falar com a unidade de ${unit.city}`}>
                    Falar com a unidade
                  </Link>
                </article>
              ))}
            </div>

            <div className="home-units-banner" data-reveal>
              <div className="home-units-banner-content">
                <div>
                  <p className="home-kicker">Fale com a Center</p>
                  <h3>Fale com quem entende de carroceria.</h3>
                  <p>Escolha um vendedor técnico ou inicie uma cotação com quem valida código e aplicação antes de separar a peça.</p>
                </div>
                <div className="home-units-banner-actions">
                  <Link className="home-button home-button-primary" href="/vendedores">Encontrar vendedor</Link>
                  <Link className="home-button home-button-outline" href="/fale-conosco">Solicitar cotação</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
