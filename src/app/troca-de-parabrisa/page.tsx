import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CHECKS, FAQ, HERO_POINTS, LP_PATH, MANUFACTURERS, MODES, PHOTOS, SERVICE_CASES, STEPS, branches } from "./_content";
import { LeadForm } from "./_components/lead-form";
import { OriginCapture, PhoneLink, WhatsAppButton } from "./_components/lp-actions";
import { RevealObserver } from "./_components/reveal";
import "./parabrisa.css";
import { pageMetadata } from "../_content/site";

export const metadata: Metadata = {
  ...pageMetadata("Troca e instalação de vidros para ônibus | Center Ônibus", "Troca e instalação de para-brisas e vidros laterais de ônibus. Envie cidade, modelo da carroceria e foto do vidro para consultar aplicação e atendimento.", LP_PATH),
  title: "Troca e instalação de vidros para ônibus | Center Ônibus",
  description:
    "Consulte a troca e instalação de vidros para ônibus com a Center. Envie cidade, modelo da carroceria e foto do vidro para conferir aplicação, orçamento e atendimento pelo WhatsApp.",
  alternates: { canonical: LP_PATH },
  openGraph: {
    title: "Troca e instalação de vidros para ônibus | Center Ônibus",
    description: "Vidro e instalação no mesmo atendimento. Consulte a cobertura para sua cidade pelo WhatsApp.",
    images: [PHOTOS.hero.src],
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Troca e instalação de vidros | Center Ônibus", images: [PHOTOS.hero.src] },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Troca e instalação de vidros para ônibus",
  name: "Troca e instalação de vidros para ônibus",
  provider: {
    "@type": "Organization",
    name: "Center Ônibus",
    location: branches.map((branch) => ({
      "@type": "Place",
      name: branch.name,
      telephone: branch.phone,
      address: { "@type": "PostalAddress", streetAddress: branch.address, addressLocality: branch.city, postalCode: branch.cep, addressCountry: "BR" },
    })),
  },
};

/** Atraso da revelação em sequência. */
const delay = (index: number, step = 110) => ({ "--d": `${index * step}ms` }) as CSSProperties;

function Logo() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/center-onibus-logo-partial-negative.png" alt="Center Ônibus" width={168} height={44} className="pb-logo" />;
}

export default function TrocaDeParabrisaPage() {
  return (
    <div className="pb-page">
      <OriginCapture />
      <RevealObserver />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      {/* Header enxuto: só marca e contato, para a pessoa não sair da página */}
      <header className="pb-header">
        <div className="pb-shell pb-header-inner">
          <Link href="/" aria-label="Center Ônibus — site institucional"><Logo /></Link>
          <div className="pb-header-actions">
            <span className="pb-header-phone">
              <small>Matriz SP</small>
              <PhoneLink place="header" />
            </span>
            <WhatsAppButton label="WhatsApp" className="pb-btn pb-btn-sm" place="header" />
          </div>
        </div>
      </header>

      <main>
        {/* 1. Hero com formulário */}
        <section className="pb-hero" aria-labelledby="pb-title">
          <div className="pb-hero-bg" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PHOTOS.hero.src} alt="" fetchPriority="high" />
          </div>
          <div className="pb-shell pb-hero-grid">
            <div className="pb-hero-copy">
              <span className="pb-kicker pb-kicker-light">Troca e instalação de vidros para ônibus</span>
              <h1 id="pb-title">
                <span className="pb-line"><span>Troca e instalação de vidros para ônibus.</span></span>{" "}
                <span className="pb-line pb-line-accent"><span>Conte com a Center.</span></span>
              </h1>
              <p className="pb-lead">
                Mais que fornecer o vidro: a Center também cuida da troca. Envie o modelo da carroceria, a cidade e uma foto para consultar a aplicação, o orçamento e o local de atendimento.
              </p>
              <ul className="pb-hero-points">
                {HERO_POINTS.map((point) => <li key={point}>{point}</li>)}
              </ul>
              <div className="pb-hero-ctas">
                <WhatsAppButton place="hero" />
                <a className="pb-btn pb-btn-ghost" href="#orcamento">Preencher orçamento</a>
              </div>
            </div>
            <LeadForm />
          </div>
        </section>

        {/* 2. Carrocerias */}
        <section className="pb-brands" aria-label="Carrocerias atendidas">
          <div className="pb-shell pb-brands-inner">
            <p>Informe a carroceria.<br />A equipe confere a aplicação.</p>
            <ul data-reveal="stagger">
              {MANUFACTURERS.map((brand, index) => (
                <li key={brand} style={delay(index, 90)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/brand/manufacturers/${brand.toLowerCase()}.png`} alt={brand} width={150} height={52} loading="lazy" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Duas formas de atendimento */}
        <section className="pb-section pb-modes" aria-labelledby="pb-modes-title">
          <div className="pb-shell">
            <header className="pb-section-head" data-reveal="up">
              <span className="pb-kicker">Atendimento para a sua operação</span>
              <h2 id="pb-modes-title">Na sua garagem ou na unidade Center</h2>
              <p>Consulte a cobertura e a disponibilidade com a unidade mais próxima antes de agendar.</p>
            </header>
            <div className="pb-modes-grid">
              {MODES.map((mode, index) => (
                <article key={mode.id} className="pb-mode" data-reveal="up" style={delay(index, 140)}>
                  <div className="pb-mode-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mode.photo.src} alt={mode.photo.alt} loading="lazy" />
                    <span className="pb-mode-num">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="pb-mode-body">
                    <span className="pb-kicker">{mode.kicker}</span>
                    <h3>{mode.title}</h3>
                    <p>{mode.text}</p>
                    <ul className="pb-checklist">
                      {mode.points.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                    <a className="pb-link" href="#orcamento">Pedir orçamento {mode.id === "garagem" ? "com atendimento móvel" : "na unidade"} <span aria-hidden="true">→</span></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Como funciona */}
        <section className="pb-section pb-steps" aria-labelledby="pb-steps-title">
          <div className="pb-shell">
            <header className="pb-section-head pb-section-head-light" data-reveal="up">
              <span className="pb-kicker pb-kicker-light">Como funciona</span>
              <h2 id="pb-steps-title">Da primeira foto ao agendamento da troca</h2>
            </header>
            <ol className="pb-steps-list" data-reveal="steps">
              {STEPS.map((step, index) => (
                <li key={step.title}>
                  <span className="pb-step-num">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5. Vidro certo */}
        <section className="pb-section pb-glass" aria-labelledby="pb-glass-title">
          <div className="pb-shell pb-glass-grid">
            <div className="pb-glass-photo" data-reveal="photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PHOTOS.glass.src} alt={PHOTOS.glass.alt} loading="lazy" />
            </div>
            <div className="pb-glass-copy" data-reveal="up">
              <span className="pb-kicker">Vidro e serviço, juntos</span>
              <h2 id="pb-glass-title">A troca começa pela aplicação certa.</h2>
              <p>O nome do ônibus sozinho nem sempre identifica o vidro. Modelo, ano, medidas e fotos ajudam a equipe a conferir o vidro e preparar o orçamento do serviço.</p>
              <ul className="pb-checklist pb-checklist-grid">
                {CHECKS.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <WhatsAppButton label="Enviar foto pelo WhatsApp" place="vidro" />
            </div>
          </div>
        </section>

        <section className="pb-section pb-service-records" aria-labelledby="pb-records-title">
          <div className="pb-shell">
            <header className="pb-section-head">
              <span className="pb-kicker">Serviços realizados</span>
              <h2 id="pb-records-title">A troca, vista de perto.</h2>
              <p>Para-brisas e vidros laterais: acompanhe os registros reais de preparação e resultado.</p>
            </header>
            <div className="pb-records-grid">
              {SERVICE_CASES.map((record) => (
                <article className="pb-record" key={record.title}>
                  <div className="pb-record-pair">
                    {[record.before, record.after].map((photo) => (
                      <figure key={photo.src}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.src} alt={photo.alt} width={960} height={1280} loading="lazy" />
                        <figcaption>{photo.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                  <div className="pb-record-copy">
                    <h3>{record.title}</h3>
                    <p>{record.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="pb-records-cta"><WhatsAppButton label="Consultar a troca do meu vidro" place="servicos-reais" /></div>
          </div>
        </section>

        {/* 6. Unidades */}
        <section className="pb-section pb-units" aria-labelledby="pb-units-title">
          <div className="pb-shell">
            <header className="pb-section-head" data-reveal="up">
              <span className="pb-kicker">Unidades Center</span>
              <h2 id="pb-units-title">Fale com a unidade mais próxima</h2>
              <p>Escolha SP, Bahia ou RJ e consulte as condições de atendimento para a sua cidade.</p>
            </header>
            <div className="pb-units-grid">
              {branches.map((branch, index) => (
                <article key={branch.state} className="pb-unit" data-reveal="up" style={delay(index)}>
                  <span className="pb-unit-state">{branch.state}</span>
                  <h3>{branch.title}</h3>
                  <p>{branch.address}<br />{branch.city} · CEP {branch.cep}</p>
                  <PhoneLink branch={branch} className="pb-unit-phone" place={`unidade-${branch.state}`} />
                  <WhatsAppButton branch={branch} label={`WhatsApp ${branch.state}`} className="pb-btn pb-btn-outline" place={`unidade-${branch.state}`} />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Perguntas frequentes */}
        <section className="pb-section pb-faq" aria-labelledby="pb-faq-title">
          <div className="pb-shell pb-faq-grid">
            <header className="pb-section-head" data-reveal="up">
              <span className="pb-kicker">Dúvidas</span>
              <h2 id="pb-faq-title">Perguntas frequentes</h2>
              <p>Não achou sua resposta? Fale com a equipe pelo WhatsApp.</p>
            </header>
            <div className="pb-faq-list" data-reveal="up" style={delay(1)}>
              {FAQ.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Chamada final */}
        <section className="pb-final" aria-labelledby="pb-final-title">
          <div className="pb-final-bg" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PHOTOS.fleet.src} alt="" loading="lazy" />
          </div>
          <div className="pb-shell pb-final-inner" data-reveal="up">
            <h2 id="pb-final-title">Mostre o vidro.<br />A gente confere o próximo passo.</h2>
            <p>Tenha em mãos a cidade, o modelo da carroceria e as fotos. A conversa começa pelo WhatsApp.</p>
            <div className="pb-hero-ctas">
              <WhatsAppButton place="final" />
              <a className="pb-btn pb-btn-ghost" href="#orcamento">Preencher orçamento</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="pb-footer">
        <div className="pb-shell pb-footer-inner">
          <Logo />
          <nav aria-label="Links institucionais">
            <Link href="/">Site Center Ônibus</Link>
            <Link href="/produtos">Catálogo de peças</Link>
            <Link href="/sobre/politica-de-privacidade">Política de privacidade</Link>
          </nav>
          <small>© {new Date().getFullYear()} Center Ônibus</small>
        </div>
      </footer>

      {/* Barra fixa no celular */}
      <div className="pb-mobile-bar">
        <WhatsAppButton label="WhatsApp" className="pb-btn" place="barra-mobile" />
        <a className="pb-btn pb-btn-light" href="#orcamento">Orçamento</a>
      </div>
    </div>
  );
}
