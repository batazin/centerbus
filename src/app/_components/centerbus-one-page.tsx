"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BusParticles } from "./bus-particles";
import { InstitutionalFooter } from "./institutional-footer";
import { aboutLinks, mainLinks } from "./institutional-nav";

const categories = [
  {
    code: "CAR",
    title: "Carroceria",
    detail: "Estrutura, fechamentos e reposição técnica",
    application: "Caio, Comil, Marcopolo e Neobus",
  },
  {
    code: "ACB",
    title: "Acabamento",
    detail: "Interior, exterior, frisos e arremates",
    application: "Linha urbana, rodoviária e micro-ônibus",
  },
  {
    code: "ILU",
    title: "Iluminação",
    detail: "Luzes, lanternas, chicotes e sinalização",
    application: "Identificação por código, foto ou aplicação",
  },
  {
    code: "CLI",
    title: "Climatização",
    detail: "Conforto térmico, dutos e componentes",
    application: "Spheros, peças de reposição e suporte",
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
    title: "Resposta comercial",
    copy: "Orçamento objetivo, prazo claro e acompanhamento até a retirada ou o despacho.",
  },
] as const;

const serviceSignals = [
  { label: "Entrada", value: "Código, foto ou modelo" },
  { label: "Conferência", value: "Aplicação antes do preço" },
  { label: "Saída", value: "Retirada ou despacho" },
] as const;

const units = [
  { state: "SP", city: "São Paulo", label: "Matriz" },
  { state: "BA", city: "Lauro de Freitas", label: "Filial" },
  { state: "RJ", city: "Rio de Janeiro", label: "Filial" },
] as const;

export function CenterbusOnePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const storyChapterRef = useRef(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [storyChapter, setStoryChapter] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 1.45,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.72,
      touchMultiplier: 1,
      anchors: { offset: -90, duration: 1.25 },
      overscroll: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: false,
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
      const revealGroups = gsap.utils.toArray<HTMLElement>("[data-reveal-group]");

      gsap.from(".home-header", {
        y: -22,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(".home-hero [data-hero-reveal]", {
        y: 34,
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
      });

      gsap.from(".home-hero-visual", {
        scale: 0.78,
        filter: "blur(10px)",
        duration: 1.1,
        delay: 0.16,
        ease: "expo.out",
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

      gsap.timeline({
        scrollTrigger: {
          trigger: ".home-hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
          onUpdate: (self) => setHeroProgress(self.progress),
        },
      })
        .to(".home-hero-copy", { yPercent: -14, opacity: 0.22, filter: "blur(2px)", ease: "none" }, 0)
        .to(".home-hero-visual", { yPercent: 12, scale: 0.88, opacity: 0.38, filter: "blur(3px)", ease: "none" }, 0)
        .to(".home-hero-diagonal", { xPercent: 18, opacity: 0.08, ease: "none" }, 0);

      gsap.timeline({
        scrollTrigger: {
          trigger: ".home-journey",
          start: "top top",
          end: "bottom bottom",
          pin: ".home-journey-sticky",
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.75,
          onUpdate: (self) => {
            const progress = self.progress;
            const chapter = Math.min(categories.length - 1, Math.floor(progress * categories.length));
            setStoryProgress(progress);

            if (chapter !== storyChapterRef.current) {
              storyChapterRef.current = chapter;
              setStoryChapter(chapter);
            }
          },
        },
      })
        .fromTo(
          ".home-journey-visual",
          { scale: 0.62, yPercent: 24, filter: "blur(9px)" },
          { scale: 1, yPercent: 0, filter: "blur(0px)", ease: "power2.out", duration: 0.24 },
        )
        .to(".home-journey-visual", { xPercent: 14, rotation: 1.1, ease: "none", duration: 0.28 })
        .to(".home-journey-visual", { xPercent: -11, yPercent: -4, scale: 0.92, rotation: -1.1, ease: "none", duration: 0.28 })
        .to(".home-journey-visual", { xPercent: 0, yPercent: 8, scale: 0.74, filter: "blur(4px)", ease: "power2.in", duration: 0.2 });

      gsap.fromTo(
        ".home-journey-scan",
        { xPercent: -120 },
        {
          xPercent: 120,
          ease: "none",
          scrollTrigger: { trigger: ".home-journey", start: "top top", end: "bottom bottom", scrub: true },
        },
      );

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

      revealGroups.forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>("[data-reveal]");
        gsap.from(items, {
          y: 24,
          duration: 0.78,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: group,
            start: "top 78%",
            once: true,
          },
        });
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
      <span className="home-scroll-progress" aria-hidden="true" />
      <header className={`home-header${isMenuOpen ? " is-menu-open" : ""}`}>
        <a className="home-brand" href="#inicio" aria-label="Center Ônibus, início" onClick={() => setIsMenuOpen(false)}>
          <Image src="/logo.png" alt="Center Ônibus" width={350} height={82} priority />
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
        <section id="inicio" className="home-hero" aria-labelledby="home-title">
          <div className="home-hero-diagonal" aria-hidden="true" />
          <div className="home-container home-hero-layout">
            <div className="home-hero-copy">
              <p className="home-kicker" data-hero-reveal>Peças para carrocerias de ônibus</p>
              <h1 id="home-title" data-hero-reveal>O ônibus volta <span>pra rua.</span></h1>
              <p className="home-hero-lead" data-hero-reveal>
                A peça certa, na primeira vez. Estoque, conhecimento técnico e resposta no tempo da operação.
              </p>
              <div className="home-hero-actions" data-hero-reveal>
                <Link className="home-button home-button-primary" href="/fale-conosco">Falar com especialista</Link>
                <Link className="home-button home-button-quiet" href="/produtos">Ver produtos</Link>
              </div>
              <dl className="home-hero-facts" data-hero-reveal>
                <div><dt>40+</dt><dd>anos no setor</dd></div>
                <div><dt>30 mil+</dt><dd>itens no portfólio</dd></div>
                <div><dt>3</dt><dd>unidades</dd></div>
              </dl>
            </div>

            <div className="home-hero-product">
              <div className="home-hero-visual" aria-label="Visualização interativa de peças para ônibus">
                <BusParticles
                  activeChapterIndex={selectedCategory}
                  activeChapterProgress={(selectedCategory + 0.5) / categories.length}
                  scrollProgress={heroProgress}
                  transitionProgress={Math.max(0, (heroProgress - 0.68) / 0.32)}
                  variant="hero"
                />
              </div>
              <div className="home-category-tabs" aria-label="Categorias em destaque">
                {categories.map((category, index) => (
                  <button
                    className={selectedCategory === index ? "is-active" : ""}
                    key={category.code}
                    type="button"
                    aria-pressed={selectedCategory === index}
                    onClick={() => setSelectedCategory(index)}
                  >
                    <span>{category.code}</span>
                    <strong>{category.title}</strong>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <a className="home-scroll-cue" href="#jornada" aria-label="Ir para a próxima seção">
            <span /> Role para conhecer
          </a>
        </section>

        <section id="jornada" className="home-journey" aria-label="Categorias de peças em movimento">
          <div className="home-journey-sticky">
            <div className="home-journey-grid" aria-hidden="true" />
            <span className="home-journey-scan" aria-hidden="true" />
            <div className="home-container home-journey-stage">
              <div className="home-journey-topline">
                <span>Peça certa / primeira vez</span>
                <strong>0{storyChapter + 1} / 04</strong>
              </div>

              <div className="home-journey-visual">
                <BusParticles
                  activeChapterIndex={storyChapter}
                  activeChapterProgress={(storyChapter + 0.5) / categories.length}
                  scrollProgress={storyProgress}
                  transitionProgress={0}
                />
              </div>

              <div className="home-journey-copy" aria-live="polite">
                {categories.map((category, index) => (
                  <article className={storyChapter === index ? "is-active" : ""} key={`story-${category.code}`}>
                    <p>{category.code} / 0{index + 1}</p>
                    <h2>{category.title}</h2>
                    <span>{category.detail}. {category.application}.</span>
                  </article>
                ))}
              </div>

              <div className="home-journey-progress" aria-hidden="true">
                <span style={{ transform: `scaleX(${storyProgress})` }} />
                {categories.map((category, index) => (
                  <i className={storyChapter >= index ? "is-active" : ""} key={`marker-${category.code}`} />
                ))}
              </div>

              <strong className="home-journey-index" aria-hidden="true">0{storyChapter + 1}</strong>
            </div>
          </div>
        </section>

        <section className="home-service-strip" aria-label="Fluxo rápido de atendimento">
          <div className="home-container home-service-strip-grid" data-reveal-group>
            {serviceSignals.map((signal) => (
              <article key={signal.label} data-reveal>
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section id="operacao" className="home-section home-operation" aria-labelledby="operation-title">
          <div className="home-container home-operation-layout" data-reveal-group>
            <div className="home-operation-intro">
              <div className="home-section-heading" data-reveal>
                <p className="home-kicker">Conhecimento antes do catálogo</p>
                <h2 id="operation-title">Comprar certo começa pela aplicação.</h2>
                <p>Da identificação ao despacho, cada etapa reduz dúvida e mantém a manutenção avançando.</p>
              </div>
              <aside className="home-operation-note" data-reveal aria-label="Resumo operacional">
                <span>Fluxo de atendimento</span>
                <strong>Foto, código ou modelo do ônibus.</strong>
                <p>A equipe confere a aplicação antes de prometer prazo. Menos troca, menos parada.</p>
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

        <section className="home-section home-catalog" aria-labelledby="catalog-title">
          <div className="home-catalog-sticky">
            <div className="home-container home-catalog-layout" data-reveal-group>
              <div className="home-section-heading" data-reveal>
                <p className="home-kicker">Linha Center Ônibus</p>
                <h2 id="catalog-title">Catálogo pensado para operação, não para vitrine.</h2>
                <p>Categoria, código, aplicação e disponibilidade precisam aparecer rápido. É assim que a peça certa sai primeiro.</p>
                <Link className="home-text-link" href="/produtos">Consultar catálogo <span aria-hidden="true">→</span></Link>
              </div>
              <div className="home-category-grid">
                {categories.map((category, index) => (
                  <article key={category.code} data-reveal>
                    <div><span>{category.code}</span><small>0{index + 1}</small></div>
                    <h3>{category.title}</h3>
                    <p>{category.detail}</p>
                    <small>{category.application}</small>
                    <Link href="/produtos" aria-label={`Ver produtos de ${category.title}`}>→</Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="home-section home-proof" aria-labelledby="proof-title">
          <span className="home-proof-signal" aria-hidden="true" />
          <div className="home-container home-proof-layout" data-reveal-group>
            <div className="home-proof-statement" data-reveal>
              <p className="home-kicker">Palavra que se cumpre</p>
              <h2 id="proof-title">Estrutura para responder. Experiência para resolver.</h2>
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
            </div>
            <div className="home-unit-list">
              {units.map((unit) => (
                <article key={unit.state} data-reveal>
                  <strong>{unit.state}</strong>
                  <div><span>{unit.label}</span><h3>{unit.city}</h3></div>
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
              <h2 id="contact-title">Fale com quem entende de carroceria.</h2>
            </div>
            <div data-reveal>
              <p>Envie o código, uma foto ou os dados do ônibus. A equipe ajuda a identificar e orçar.</p>
              <Link className="home-button home-button-light" href="/fale-conosco">Solicitar atendimento</Link>
            </div>
          </div>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
