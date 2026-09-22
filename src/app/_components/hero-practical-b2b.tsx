"use client";

import "./hero-practical-b2b.css";

export function HeroPracticalB2B() {
  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de falar com um consultor da Center Ônibus para cotar peças de carroceria para minha frota."
  );

  return (
    <section className="hero-clean-section" aria-label="Apresentação Principal Center Ônibus">
      {/* Vídeo do Ônibus em Loop Contínuo e Silencioso de Fundo com Fade-In Motion */}
      <div className="hero-clean-video-wrap" aria-hidden="true">
        <video
          className="hero-clean-video"
          src="/video/video1.mp4"
          autoPlay
          loop
          muted
          playsInline
          poster="/sequences/bus/frame_0001.webp"
        />
        <div className="hero-clean-video-overlay" />
      </div>

      {/* Conteúdo Central Ultra Limpo e Focado */}
      <div className="hero-clean-container">
        {/* Barra Vermelha Oficial do Manual */}
        <span className="hero-clean-red-bar" aria-hidden="true" />

        {/* Kicker Oficial */}
        <span className="hero-clean-kicker">Estrutura Operacional</span>

        {/* A FRASE PRIMORDIAL COM REVELAÇÃO FADE UP */}
        <h1 className="hero-clean-title">
          Compromisso com o ônibus na rua.
        </h1>

        {/* SUBTÍTULO OFICIAL */}
        <p className="hero-clean-copy">
          Estoque técnico com mais de 30 mil itens, conferência antes da separação 
          e agilidade no despacho para manter sua frota em movimento.
        </p>

        {/* Apenas 2 Ações Diretas com Entrada Stagger Fade Up */}
        <div className="hero-clean-actions">
          <div className="hero-clean-action-item hero-fade-btn-1">
            <a
              href={`https://wa.me/5511999999999?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-clean-btn-primary"
            >
              Falar com um Especialista no WhatsApp →
            </a>
          </div>
          <div className="hero-clean-action-item hero-fade-btn-2">
            <a href="#catalogo" className="hero-clean-btn-secondary">
              Ver Peças em Estoque
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
