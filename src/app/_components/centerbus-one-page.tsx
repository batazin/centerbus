"use client";

import gsap from "gsap";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { BusParticles } from "./bus-particles";

type Chapter = {
  eyebrow: string;
  title: string;
  copy: string;
  code: string;
};

type Part = {
  code: string;
  title: string;
  detail: string;
};

const chapters: Chapter[] = [
  {
    eyebrow: "01 / carroceria",
    title: "Estrutura confiável.",
    copy: "Componentes para carrocerias de ônibus com qualidade, procedência e aplicação correta.",
    code: "CAR-340",
  },
  {
    eyebrow: "02 / acabamento",
    title: "Interior em ordem.",
    copy: "Itens de acabamento, vedação e reposição para manter a frota apresentável e segura.",
    code: "ACB-410",
  },
  {
    eyebrow: "03 / iluminação",
    title: "Sinal sempre ligado.",
    copy: "Lanternas, faróis, chicotes e itens elétricos para operação urbana, rodoviária e fretamento.",
    code: "ILU-882",
  },
  {
    eyebrow: "04 / vidros",
    title: "Visibilidade na rota.",
    copy: "Soluções para vidros, borrachas, espelhos e acessórios com suporte consultivo.",
    code: "VID-217",
  },
];

const parts: Part[] = [
  { code: "CAR", title: "Carroceria", detail: "peças estruturais" },
  { code: "ACB", title: "Acabamento", detail: "interno e externo" },
  { code: "ILU", title: "Iluminação", detail: "luzes e chicotes" },
  { code: "VID", title: "Vidros", detail: "vidros e borrachas" },
];

const stockSteps = [
  { code: "01", title: "Identifica", detail: "Leitura técnica por aplicação, carroceria, modelo e necessidade da operação." },
  { code: "02", title: "Confere", detail: "Validação de estoque, marca, compatibilidade e padrão de qualidade." },
  { code: "03", title: "Atende", detail: "Contato comercial próximo para agilizar orçamento, retirada ou envio." },
];

const mapPoints = [
  { label: "Fabricantes", x: 20, y: 64 },
  { label: "Estoque", x: 42, y: 38 },
  { label: "Comercial", x: 62, y: 58 },
  { label: "Despacho", x: 78, y: 30 },
];

export function CenterbusOnePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedChapterRef = useRef(0);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [particleTransition, setParticleTransition] = useState(0);
  const activeChapterProgress = (selectedChapter + 0.5) / chapters.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const sections = Array.from(root.querySelectorAll<HTMLElement>(".snap-section"));
      let sectionOffsets: number[] = [];
      let touchStartX = 0;
      let touchStartY = 0;
      let touchDirection: "vertical" | "horizontal" | null = null;
      let lastActiveIndex = -1;
      let lockTimer: number | null = null;
      let wheelIntent = 0;
      let wheelIntentTimer: number | null = null;
      let animationId = 0;

      const scroll = {
        current: window.scrollY,
        target: window.scrollY,
        index: 0,
        enabled: true,
        locked: false,
      };

      const lockScroll = (duration = 820) => {
        scroll.locked = true;

        if (lockTimer) window.clearTimeout(lockTimer);
        lockTimer = window.setTimeout(() => {
          scroll.locked = false;
        }, duration);
      };

      gsap.set(".hero-word", { yPercent: 105, opacity: 0 });
      gsap.set(".chapter-card", { opacity: 0.28, y: 18 });
      gsap.set(".chapter-card:first-child", { opacity: 1, y: 0 });
      gsap.set(".sequence-canvas", { scale: 0.92, y: 24 });
      gsap.set(".part-pill", { y: 24, opacity: 0 });
      gsap.set(".motion-section .kicker, .motion-section h2, .motion-section .about-text, .motion-section .contact-copy, .motion-section .stat-card, .motion-section .feature-card, .motion-section .support-card, .motion-section .primary-action, .motion-section .stock-step, .motion-section .stock-metric, .motion-section .map-copy, .motion-section .map-panel, .motion-section .map-card", {
        y: -54,
        opacity: 0,
      });
      gsap.set(".section-trace", { scaleY: 0.25, opacity: 0, transformOrigin: "top" });
      gsap.set(".about-signal, .about-orbit-item, .about-data-line, .feature-beam, .support-route, .support-dot, .stock-scan, .map-pin", { y: 34, opacity: 0 });

      gsap.to(".hero-word", {
        yPercent: 0,
        opacity: 1,
        stagger: 0.045,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.to(".part-pill", { y: 0, opacity: 1, stagger: 0.04, duration: 0.62, delay: 0.18 });
      gsap.to(".sequence-canvas", { scale: 1, y: 0, duration: 0.72, ease: "power3.out" });

      const refreshOffsets = () => {
        sectionOffsets = sections.map((section) => section.offsetTop);
        scroll.target = sectionOffsets[scroll.index] ?? 0;
      };

      const getMostViewableIndex = () => {
        let bestIndex = 0;
        let bestVisibleHeight = -1;

        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));

          if (visibleHeight > bestVisibleHeight) {
            bestVisibleHeight = visibleHeight;
            bestIndex = index;
          }
        });

        return bestIndex;
      };

      const animateSectionIn = (section: HTMLElement) => {
        const items = section.querySelectorAll(
          ".kicker, h2, .about-text, .contact-copy, .stat-card, .feature-card, .support-card, .primary-action, .stock-step, .stock-metric, .map-copy, .map-panel, .map-card"
        );
        const trace = section.querySelector(".section-trace");
        const ambientItems = section.querySelectorAll(".about-signal, .about-orbit-item, .about-data-line, .feature-beam, .support-route, .support-dot, .stock-scan, .map-pin");

        gsap.to(items, {
          y: 0,
          opacity: 1,
          stagger: 0.055,
          duration: 0.8,
          overwrite: true,
          ease: "power3.out",
        });

        if (trace) {
          gsap.to(trace, { scaleY: 1, opacity: 1, duration: 0.72, overwrite: true, ease: "power2.out" });
        }

        if (ambientItems.length) {
          gsap.to(ambientItems, {
            y: 0,
            opacity: 1,
            stagger: 0.045,
            duration: 0.95,
            overwrite: true,
            ease: "power3.out",
          });
        }
      };

      const setActiveSection = (index: number) => {
        if (index === lastActiveIndex) return;
        lastActiveIndex = index;
        root.dataset.activeSection = String(index + 1);

        sections.forEach((section, sectionIndex) => {
          section.classList.toggle("is-active", sectionIndex === index);
          section.classList.toggle("is-before", sectionIndex < index);
        });

        animateSectionIn(sections[index]);
      };

      const goToSection = (index: number) => {
        const nextIndex = gsap.utils.clamp(0, sections.length - 1, index);

        if (nextIndex === scroll.index) return;

        scroll.index = nextIndex;
        scroll.target = sectionOffsets[scroll.index] ?? 0;
        lockScroll();

        window.dispatchEvent(new CustomEvent("mostViewable", {
          detail: { lerpedTimecode: 1 + scroll.target / window.innerHeight, index: scroll.index },
        }));
      };

      const handleScrollIntent = (deltaY: number) => {
        if (!scroll.enabled || scroll.locked || Math.abs(deltaY) < 8) return;

        const direction = Math.sign(deltaY);

        if (direction === 0) return;

        goToSection(scroll.index + direction);
        window.dispatchEvent(new CustomEvent("scrollDirection", { detail: { direction } }));
      };

      const onWheel = (event: WheelEvent) => {
        event.preventDefault();

        if (scroll.locked) return;

        wheelIntent += event.deltaY;

        if (wheelIntentTimer) window.clearTimeout(wheelIntentTimer);
        wheelIntentTimer = window.setTimeout(() => {
          wheelIntent = 0;
        }, 140);

        if (Math.abs(wheelIntent) < 80) return;

        handleScrollIntent(wheelIntent);
        wheelIntent = 0;
      };

      const onKeyDown = (event: KeyboardEvent) => {
        const downKeys = ["ArrowDown", "PageDown", " ", "End"];
        const upKeys = ["ArrowUp", "PageUp", "Home"];
        if (![...downKeys, ...upKeys].includes(event.key)) return;

        event.preventDefault();

        if (event.key === "Home") {
          goToSection(0);
          return;
        }

        if (event.key === "End") {
          goToSection(sections.length - 1);
          return;
        }

        handleScrollIntent(downKeys.includes(event.key) ? 120 : -120);
      };

      const onTouchStart = (event: TouchEvent) => {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchDirection = null;
      };

      const onTouchMove = (event: TouchEvent) => {
        const touch = event.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touchStartY - touch.clientY;

        if (!touchDirection && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 12) {
          touchDirection = Math.abs(deltaY) > Math.abs(deltaX) ? "vertical" : "horizontal";
        }

        if (touchDirection === "vertical") {
          event.preventDefault();
          handleScrollIntent(deltaY);
          touchStartY = touch.clientY;
        }
      };

      const onResize = () => {
        refreshOffsets();
        scroll.current = sectionOffsets[scroll.index] ?? window.scrollY;
        scroll.target = scroll.current;
        window.scrollTo({ top: scroll.current, behavior: "instant" });
      };

      const onNavClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
        if (!link) return;

        const id = link.getAttribute("href")?.slice(1);
        const sectionIndex = sections.findIndex((section) => section.id === id || (id === "topo" && section.id === "home"));
        if (sectionIndex < 0) return;

        event.preventDefault();
        goToSection(sectionIndex);
      };

      const tiltCards = Array.from(
        root.querySelectorAll<HTMLElement>(".stat-card, .feature-card, .support-card, .stock-step, .stock-metric, .map-panel, .map-card")
      );

      const onTiltEnter = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;

        const card = event.currentTarget as HTMLElement;
        card.classList.add("is-tilting");

        gsap.to(card, {
          y: -8,
          z: 28,
          scale: 1.018,
          filter: "brightness(1.05)",
          duration: 0.85,
          overwrite: "auto",
          ease: "expo.out",
        });
      };

      const onTiltMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;

        const card = event.currentTarget as HTMLElement;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 14;
        const rotateX = (0.5 - y) * 12;

        card.style.setProperty("--glow-x", `${x * 100}%`);
        card.style.setProperty("--glow-y", `${y * 100}%`);

        gsap.to(card, {
          rotateX,
          rotateY,
          y: -10,
          z: 42,
          scale: 1.028,
          filter: "brightness(1.08)",
          duration: 0.95,
          overwrite: "auto",
          ease: "power4.out",
        });
      };

      const onTiltLeave = (event: PointerEvent) => {
        const card = event.currentTarget as HTMLElement;

        card.classList.remove("is-tilting");

        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          z: 0,
          scale: 1,
          filter: "brightness(1)",
          duration: 1.35,
          overwrite: "auto",
          ease: "elastic.out(1, 0.34)",
        });
      };

      const tick = () => {
        scroll.current += (scroll.target - scroll.current) * 0.22;

        if (Math.abs(scroll.target - scroll.current) < 1) {
          scroll.current = scroll.target;
        }

        window.scrollTo({ top: scroll.current, behavior: "instant" });

        const firstSectionStart = sectionOffsets[0] ?? 0;
        const firstSectionEnd = sectionOffsets[1] ?? window.innerHeight;
        const firstVisualEnd = Math.max(firstSectionStart, firstSectionEnd - window.innerHeight);
        const firstGap = Math.max(1, firstVisualEnd - firstSectionStart);
        const firstProgress = gsap.utils.clamp(0, 1, (scroll.current - (sectionOffsets[0] ?? 0)) / firstGap);
        const transition = gsap.utils.clamp(0, 1, (firstProgress - 0.92) / 0.08);
        const timecode = 1 + scroll.current / window.innerHeight;
        const activeIndex = scroll.index;
        const chapterIndex = selectedChapterRef.current;

        document.documentElement.style.setProperty("--timecode", timecode.toFixed(3));
        document.documentElement.style.setProperty("--section-progress", firstProgress.toFixed(3));
        setScrollProgress(firstProgress);
        setParticleTransition(transition);
        setActiveSection(activeIndex);

        gsap.set(".hero-copy", { y: -42 * transition, opacity: 1 - transition * 0.78 });
        gsap.set(".chapter-stack", { y: 72 * transition, opacity: 1 - transition * 0.92 });
        gsap.set(".sequence-canvas", { y: 92 * transition, scale: 1 + transition * 0.08, opacity: 1 - transition * 0.12 });
        gsap.set(".chapter-card", { opacity: 0.22, y: 18 });
        gsap.set(`.chapter-card-${chapterIndex}`, { opacity: 1, y: 0 });

        window.dispatchEvent(new CustomEvent("currenTime", {
          detail: { lerpedTimecode: timecode, index: activeIndex },
        }));

        animationId = window.requestAnimationFrame(tick);
      };

      refreshOffsets();
      setActiveSection(getMostViewableIndex());
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("resize", onResize);
      root.addEventListener("click", onNavClick);
      tiltCards.forEach((card) => {
        card.addEventListener("pointerenter", onTiltEnter);
        card.addEventListener("pointermove", onTiltMove);
        card.addEventListener("pointerleave", onTiltLeave);
      });
      animationId = window.requestAnimationFrame(tick);

      return () => {
        window.cancelAnimationFrame(animationId);
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("resize", onResize);
        root.removeEventListener("click", onNavClick);
        tiltCards.forEach((card) => {
          card.removeEventListener("pointerenter", onTiltEnter);
          card.removeEventListener("pointermove", onTiltMove);
          card.removeEventListener("pointerleave", onTiltLeave);
        });
        if (lockTimer) window.clearTimeout(lockTimer);
        if (wheelIntentTimer) window.clearTimeout(wheelIntentTimer);
        document.documentElement.style.removeProperty("--timecode");
        document.documentElement.style.removeProperty("--section-progress");
      };
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="site-shell">
      <header className="topbar" aria-label="Navegação principal">
        <a className="brand-mark" href="#topo" aria-label="Center Ônibus início">
          <span aria-hidden="true">CO</span>
          <strong>Center Ônibus</strong>
        </a>
        <nav>
          <a href="#sobre">Empresa</a>
          <a href="#diferenciais">Diferenciais</a>
          <a href="#linha">Produtos</a>
          <a href="#estoque">Estoque</a>
          <a href="#maps">Qualidade</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <main id="topo">
        <section id="home" className="sequence-section snap-section free-section" data-timecode="1" aria-labelledby="hero-title">
          <div className="sequence-frame">
          <div className="hero-copy">
            <p className="kicker">peças para carrocerias de ônibus</p>
            <h1 id="hero-title" className="hero-title">
              {"Tradição que mantém a frota em movimento.".split(" ").map((word, i) => (
                <span className="hero-word" key={word + i}>
                  {word}
                </span>
              ))}
            </h1>
            <div className="part-pills" aria-label="Categorias de peças">
              {parts.map((part) => (
                <span className="part-pill" key={part.code}>
                  <strong>{part.code}</strong>
                  {part.title}
                </span>
              ))}
            </div>
          </div>

          <div className="sequence-stage">
            <div className="sequence-canvas">
              <BusParticles
                activeChapterIndex={selectedChapter}
                activeChapterProgress={activeChapterProgress}
                scrollProgress={scrollProgress}
                transitionProgress={particleTransition}
              />
            </div>
          </div>

          <aside className="chapter-stack" aria-label="Peças destacadas no scroll">
            {chapters.map((chapter, index) => (
              <button
                className={`chapter-card chapter-card-${index}${selectedChapter === index ? " is-selected" : ""}`}
                key={chapter.code}
                type="button"
                onClick={() => {
                  selectedChapterRef.current = index;
                  setSelectedChapter(index);
                }}
              >
                <span>{chapter.eyebrow}</span>
                <h2>{chapter.title}</h2>
                <p>{chapter.copy}</p>
                <strong>{chapter.code}</strong>
              </button>
            ))}
          </aside>
          </div>
        </section>

        <section id="sobre" className="about-section motion-section snap-section" data-timecode="2" aria-labelledby="sobre-title">
          <div className="about-echo" aria-hidden="true">
            <div className="about-signal about-signal-a" />
            <div className="about-signal about-signal-b" />
            <div className="about-data-line about-data-line-a" />
            <div className="about-data-line about-data-line-b" />
            <div className="about-orbit">
              {parts.map((part, index) => (
                <span className={`about-orbit-item about-orbit-item-${index}`} key={`about-${part.code}`}>
                  <strong>{part.code}</strong>
                  {part.detail}
                </span>
              ))}
            </div>
          </div>
          <div className="section-trace" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="about-grid">
            <div className="about-content">
              <p className="kicker">sobre a Center Ônibus</p>
              <h2 id="sobre-title">Mais de três décadas de confiança.</h2>
              <p className="about-text">
                A Center Ônibus atua no mercado de peças para carrocerias de ônibus, atendendo empresas de transporte coletivo, oficinas, revendedores e profissionais do setor.
              </p>
              <p className="about-text">
                A trajetória da empresa combina atendimento especializado, relacionamento sólido com parceiros e compromisso com a qualidade para apoiar operações de diferentes portes em todo o Brasil.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-card">
                <strong>30+</strong>
                <span>Anos de atuação no mercado</span>
              </div>
              <div className="stat-card">
                <strong>ISO</strong>
                <span>Certificação ISO 9001:2015</span>
              </div>
              <div className="stat-card">
                <strong>BR</strong>
                <span>Atendimento em todo o Brasil</span>
              </div>
              <div className="stat-card">
                <strong>360º</strong>
                <span>Suporte próximo e consultivo</span>
              </div>
            </div>
          </div>
        </section>

        <section id="diferenciais" className="features-section motion-section snap-section" data-timecode="3" aria-labelledby="diferencial-title">
          <div className="feature-echo" aria-hidden="true">
            <span className="feature-beam feature-beam-a" />
            <span className="feature-beam feature-beam-b" />
            <span className="feature-beam feature-beam-c" />
          </div>
          <div className="section-trace" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="section-heading">
            <p className="kicker">nosso diferencial</p>
            <h2 id="diferencial-title">Especialização para comprar com segurança.</h2>
          </div>
          <div className="features-grid">
            <article className="feature-card">
              <span className="feature-number">01</span>
              <h3>Portfólio amplo</h3>
              <p>Produtos organizados por categoria para facilitar a identificação das peças certas para cada carroceria e aplicação.</p>
            </article>
            <article className="feature-card">
              <span className="feature-number">02</span>
              <h3>Atendimento especializado</h3>
              <p>Equipe preparada para orientar compras técnicas, validar compatibilidade e apoiar empresas, oficinas e revendedores.</p>
            </article>
            <article className="feature-card">
              <span className="feature-number">03</span>
              <h3>Qualidade reconhecida</h3>
              <p>Processos certificados, relacionamento com grandes fabricantes e compromisso contínuo com a satisfação dos clientes.</p>
            </article>
          </div>
        </section>

        <section id="linha" className="support-section motion-section snap-section" data-timecode="4" aria-labelledby="linha-title">
          <div className="support-echo" aria-hidden="true">
            <span className="support-route support-route-a" />
            <span className="support-route support-route-b" />
            <span className="support-dot support-dot-a" />
            <span className="support-dot support-dot-b" />
            <span className="support-dot support-dot-c" />
          </div>
          <div className="section-trace" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="section-heading">
            <p className="kicker">linha Center Ônibus</p>
            <h2 id="linha-title">Categorias claras para orçar melhor.</h2>
          </div>
          <div className="support-grid">
            {parts.map((part) => (
              <article className="support-card" key={part.code}>
                <span>{part.code}</span>
                <h3>{part.title}</h3>
                <p>{part.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="estoque" className="stock-section motion-section snap-section" data-timecode="5" aria-labelledby="estoque-title">
          <div className="stock-echo" aria-hidden="true">
            <span className="stock-scan stock-scan-a" />
            <span className="stock-scan stock-scan-b" />
            <span className="stock-scan stock-scan-c" />
          </div>
          <div className="section-trace" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="stock-layout">
            <div>
              <p className="kicker">organização comercial</p>
              <h2 id="estoque-title">Identifica. Confere. Atende.</h2>
            </div>
            <div className="stock-board" aria-label="Fluxo de atendimento">
              {stockSteps.map((step) => (
                <article className="stock-step" key={step.code}>
                  <span>{step.code}</span>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </article>
              ))}
            </div>
            <div className="stock-metrics" aria-label="Indicadores de despacho">
              <div className="stock-metric">
                <strong>30+</strong>
                <span>anos de relacionamento no setor</span>
              </div>
              <div className="stock-metric">
                <strong>ISO</strong>
                <span>padrão de qualidade certificado</span>
              </div>
            </div>
          </div>
        </section>

        <section id="maps" className="maps-section motion-section snap-section" data-timecode="6" aria-labelledby="maps-title">
          <div className="section-trace" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="maps-grid">
            <div className="map-copy">
              <p className="kicker">qualidade e presença</p>
              <h2 id="maps-title">Uma parceira sólida para o transporte coletivo.</h2>
              <p>
                A Center Ônibus une tradição, organização e atendimento nacional para entregar segurança em cada orçamento, pedido e relacionamento comercial.
              </p>
              <a
                className="primary-action map-action"
                href="mailto:comercial@centerbus.com.br?subject=Solicitação%20de%20orçamento%20-%20Center%20Ônibus"
              >
                Solicitar orçamento
              </a>
            </div>
            <div className="map-panel" aria-label="Mapa estilizado de operação">
              <div className="map-gridlines" aria-hidden="true" />
              <svg className="map-route-svg" viewBox="0 0 100 100" role="img" aria-label="Rota entre áreas de operação">
                <path className="map-route-path map-route-shadow" d="M20 64 C28 42 36 30 42 38 S55 70 62 58 69 30 78 30" />
                <path className="map-route-path" d="M20 64 C28 42 36 30 42 38 S55 70 62 58 69 30 78 30" />
              </svg>
              {mapPoints.map((point, index) => (
                <span
                  className={`map-pin map-pin-${index}`}
                  key={point.label}
                  style={{ "--pin-x": `${point.x}%`, "--pin-y": `${point.y}%` } as CSSProperties}
                >
                  <strong>{point.label}</strong>
                </span>
              ))}
              <div className="map-card">
                <span>raio de atendimento</span>
                <strong>Brasil</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="contato" className="contact-section motion-section snap-section" data-timecode="7" aria-labelledby="contato-title">
          <div className="section-trace" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="kicker">comercial</p>
          <h2 id="contato-title">Fale com a Center Ônibus.</h2>
          <p className="contact-copy">
            Atendimento para empresas de transporte urbano, rodoviário, fretamento, oficinas, compradores, revendedores e parceiros comerciais.
          </p>
          <a href="mailto:comercial@centerbus.com.br?subject=Contato%20comercial%20-%20Center%20Ônibus" className="primary-action">
            Solicitar contato comercial
          </a>
        </section>
      </main>
    </div>
  );
}
