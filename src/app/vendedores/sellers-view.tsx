"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { sellersList } from "./sellers-data";
import "./vendedores.css";

export function SellersView() {
  const [selectedState, setSelectedState] = useState<"ALL" | "SP" | "BA">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Counts
  const totalCount = sellersList.length;
  const spCount = useMemo(() => sellersList.filter((s) => s.state === "SP").length, []);
  const baCount = useMemo(() => sellersList.filter((s) => s.state === "BA").length, []);

  // Filtered sellers
  const filteredSellers = useMemo(() => {
    return sellersList.filter((seller) => {
      const matchesState = selectedState === "ALL" || seller.state === selectedState;
      if (!matchesState) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchName = seller.name.toLowerCase().includes(q);
      const matchEmail = seller.email.toLowerCase().includes(q);
      const matchPhone = seller.phone.includes(q);
      const matchExtension = seller.extension ? seller.extension.includes(q) : false;
      const matchState = seller.stateName.toLowerCase().includes(q) || seller.state.toLowerCase().includes(q);

      return matchName || matchEmail || matchPhone || matchExtension || matchState;
    });
  }, [selectedState, searchQuery]);

  return (
    <section className="sellers-wrapper" aria-label="Equipe de Vendedores por Estado">
      {/* Branch overview strip */}
      <div className="sellers-branches-strip">
        <article className="branch-highlight-card is-sp">
          <div>
            <div className="branch-header">
              <span className="branch-badge branch-badge-sp">SP • Matriz</span>
              <span className="branch-count">{spCount} Especialistas</span>
            </div>
            <h3 className="branch-title">São Paulo — Matriz</h3>
            <p className="branch-desc">
              Central de distribuição nacional e estoque de pronta entrega para as principais carrocerias do Brasil.
            </p>
          </div>
          <div>
            <a href="tel:1129673002" className="branch-direct-phone" title="Ligue para a Matriz em São Paulo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              (11) 2967-3002
            </a>
          </div>
        </article>

        <article className="branch-highlight-card is-ba">
          <div>
            <div className="branch-header">
              <span className="branch-badge branch-badge-ba">BA • Filial</span>
              <span className="branch-count">{baCount} Especialistas</span>
            </div>
            <h3 className="branch-title">Bahia — Filial Lauro de Freitas</h3>
            <p className="branch-desc">
              Atendimento regional focado nas operações de frotas, oficinas e concessionárias do Norte e Nordeste.
            </p>
          </div>
          <div>
            <a href="tel:7133770770" className="branch-direct-phone" title="Ligue para a Filial Bahia">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              (71) 3377-0770
            </a>
          </div>
        </article>
      </div>

      {/* Controls Bar: Filter by State + Search */}
      <div className="sellers-controls-bar">
        <div className="state-filter-tabs" role="tablist" aria-label="Filtrar por estado">
          <button
            type="button"
            role="tab"
            aria-selected={selectedState === "ALL"}
            className={`state-tab-btn ${selectedState === "ALL" ? "is-active" : ""}`}
            onClick={() => setSelectedState("ALL")}
          >
            Todos os Estados <span className="tab-pill-count">{totalCount}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedState === "SP"}
            className={`state-tab-btn ${selectedState === "SP" ? "is-active" : ""}`}
            onClick={() => setSelectedState("SP")}
          >
            São Paulo — Matriz <span className="tab-pill-count">{spCount}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedState === "BA"}
            className={`state-tab-btn ${selectedState === "BA" ? "is-active" : ""}`}
            onClick={() => setSelectedState("BA")}
          >
            Bahia — Filial <span className="tab-pill-count">{baCount}</span>
          </button>
        </div>

        <div className="sellers-search-box">
          <input
            type="text"
            className="sellers-search-input"
            placeholder="Buscar por nome, ramal ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar vendedor"
          />
          <svg className="sellers-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Sellers Grid */}
      {filteredSellers.length > 0 ? (
        <div className="sellers-grid">
          {filteredSellers.map((seller) => {
            const isSp = seller.state === "SP";
            const whatsappText = `Olá ${seller.name}, vim pelo site da Center Ônibus e gostaria de solicitar um orçamento para peças de carroceria.`;
            const whatsappUrl = seller.whatsapp
              ? `https://wa.me/${seller.whatsapp}?text=${encodeURIComponent(whatsappText)}`
              : null;
            const phoneDigits = seller.phone.replace(/[^0-9]/g, "");

            return (
              <article
                key={seller.id}
                className={`seller-card ${isSp ? "seller-card--sp" : "seller-card--ba"}`}
                id={`vendedor-${seller.id}`}
              >
                {/* State & Unit Header Tag */}
                <header className="seller-card-header">
                  <span className="seller-state-tag">
                    {seller.state} • {seller.stateName}
                  </span>
                  <span className="seller-unit-label">{seller.unit}</span>
                </header>

                {/* Seller Profile Lead with Clean Avatar Photo */}
                <div className="seller-profile-lead">
                  <div className="seller-avatar-frame">
                    <Image
                      src={seller.fotoImage}
                      alt={`Foto de ${seller.name} - Consultor Center Ônibus`}
                      width={88}
                      height={88}
                      className="seller-avatar-img"
                    />
                    <span className="seller-online-dot" title="Consultor ativo para atendimento" />
                  </div>
                  <div className="seller-profile-titles">
                    <h4 className="seller-name">{seller.name}</h4>
                    <span className="seller-role">Consultor Técnico Comercial</span>
                  </div>
                </div>

                {/* Structured Contact Details */}
                <div className="seller-card-body">
                  <div className="seller-contact-list">
                    {/* Direct Phone & Ramal */}
                    <a
                      href={`tel:${phoneDigits}`}
                      className="seller-contact-item"
                      title={`Ligar para ${seller.phone}${seller.extension ? ` ramal ${seller.extension}` : ""}`}
                    >
                      <svg className="seller-contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>
                        {seller.phone}
                        {seller.extension ? <span className="seller-ramal-badge">Ramal {seller.extension}</span> : ""}
                      </span>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${seller.email}?subject=${encodeURIComponent("Cotação de Peças de Carroceria")}`}
                      className="seller-contact-item"
                      title={`Enviar e-mail para ${seller.email}`}
                    >
                      <svg className="seller-contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>{seller.email}</span>
                    </a>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <footer className="seller-card-actions">
                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="seller-btn-whatsapp"
                      title={`Iniciar conversa no WhatsApp com ${seller.name}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12.031 2C6.496 2 2 6.496 2 12.031c0 1.77.462 3.498 1.34 5.023L2 22l5.074-1.33a10.007 10.007 0 0 0 4.957 1.306h.004c5.534 0 10.03-4.496 10.03-10.031 0-2.68-1.043-5.2-2.937-7.094A9.96 9.96 0 0 0 12.031 2zm0 18.283a8.27 8.27 0 0 1-4.223-1.155l-.303-.18-3.136.823.837-3.057-.197-.315a8.26 8.26 0 0 1-1.267-4.368c0-4.57 3.718-8.288 8.29-8.288 2.213 0 4.293.862 5.858 2.428a8.23 8.23 0 0 1 2.428 5.86c0 4.57-3.718 8.288-8.287 8.288zm4.542-6.205c-.248-.124-1.47-.726-1.698-.809-.228-.083-.394-.124-.56.124-.166.248-.643.809-.788.975-.145.166-.29.186-.538.062-.249-.124-1.049-.387-1.998-1.233-.739-.659-1.238-1.473-1.383-1.722-.145-.248-.015-.382.109-.506.111-.112.249-.29.373-.435.124-.145.166-.249.249-.415.083-.166.041-.311-.021-.435-.062-.124-.56-1.349-.767-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.075 0 1.224.892 2.407 1.016 2.573.124.166 1.755 2.68 4.252 3.758.594.257 1.058.41 1.42.525.597.19 1.14.163 1.569.099.479-.072 1.47-.601 1.677-1.182.207-.581.207-1.079.145-1.182-.062-.104-.228-.166-.476-.29z"/>
                      </svg>
                      Chamar no WhatsApp
                    </a>
                  ) : null}

                  <div className="seller-btn-secondary-row">
                    <a
                      href={`tel:${phoneDigits}`}
                      className="seller-btn-secondary"
                      title={`Ligar para ${seller.phone}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      Ligar
                    </a>
                    <a
                      href={`mailto:${seller.email}?subject=${encodeURIComponent("Cotação de Peças")}`}
                      className="seller-btn-secondary"
                      title={`E-mail para ${seller.email}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      E-mail
                    </a>
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="sellers-empty-state">
          <h3>Nenhum vendedor encontrado</h3>
          <p>Não encontramos nenhum vendedor para a busca &quot;{searchQuery}&quot;.</p>
          <button
            type="button"
            className="sellers-reset-btn"
            onClick={() => {
              setSearchQuery("");
              setSelectedState("ALL");
            }}
          >
            Ver todos os vendedores
          </button>
        </div>
      )}
    </section>
  );
}
