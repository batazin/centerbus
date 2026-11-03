"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { sellersList } from "./sellers-data";
import { branches, branchWhatsapp } from "../_content/branches";
import "./vendedores.css";

export function SellersView() {
  const [selectedState, setSelectedState] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = useMemo(() => sellersList.filter(seller => (selectedState === "ALL" || seller.state === selectedState) && [seller.name,seller.stateName,seller.state,seller.email,seller.phone,seller.extension ?? ""].join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchQuery.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim())), [selectedState,searchQuery]);
  return <section className="sellers-wrapper" aria-label="Equipe de vendedores por estado">
    <div className="sellers-branches-strip">{branches.map(branch => <article className={`branch-highlight-card is-${branch.state.toLowerCase()}`} key={branch.state}>
      <div><span className="branch-badge">{branch.state} · {branch.state === "SP" ? "Matriz" : "Filial"}</span><h3 className="branch-title">{branch.title}</h3><p className="branch-desc">{sellersList.filter(seller => seller.state === branch.state).length} profissionais na equipe.</p></div>
      <a className="branch-direct-phone" href={branchWhatsapp(branch)} target="_blank" rel="noopener noreferrer">WhatsApp · {branch.phone} ↗</a>
    </article>)}</div>
    <div className="sellers-controls-bar">
      <div className="state-filter-tabs" aria-label="Filtrar por estado">{[{state:"ALL",name:"Todos os estados"},...branches].map(branch => <button key={branch.state} type="button" aria-pressed={selectedState === branch.state} className={`state-tab-btn ${selectedState === branch.state ? "is-active" : ""}`} onClick={() => setSelectedState(branch.state)}>{branch.name} <span className="tab-pill-count">{sellersList.filter(seller => branch.state === "ALL" || seller.state === branch.state).length}</span></button>)}</div>
      <div className="sellers-search-box"><input className="sellers-search-input" type="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Buscar por nome, ramal ou e-mail..." aria-label="Buscar vendedor" /></div>
    </div>
    <p className="sellers-result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "profissional encontrado" : "profissionais encontrados"}</p>
    {filtered.length ? <div className="sellers-grid">{filtered.map(seller => <article className={`seller-card seller-card--${seller.state.toLowerCase()}`} id={`vendedor-${seller.id}`} key={seller.id}>
      <header className="seller-card-header"><span className="seller-state-tag">{seller.state} · {seller.stateName}</span></header>
      <div className="seller-profile"><div className="seller-avatar-frame"><Image className="seller-avatar-img" src={seller.fotoImage} alt={`Foto de ${seller.name}`} width={360} height={420} /></div><div className="seller-profile-titles"><h3 className="seller-name">{seller.name}</h3><span className="seller-role">{seller.unit}</span></div></div>
      {(seller.phone || seller.email) && <div className="seller-card-body"><div className="seller-contact-list">{seller.phone && <a className="seller-contact-item" href={`tel:+55${seller.phone.replace(/\D/g,"")}`}>{seller.phone}{seller.extension && <span className="seller-ramal-badge">Ramal {seller.extension}</span>}</a>}{seller.email && <a className="seller-contact-item" href={`mailto:${seller.email}`}>{seller.email}</a>}</div></div>}
      {seller.whatsapp && <footer className="seller-card-actions"><a className="seller-btn-whatsapp" href={`https://wa.me/${seller.whatsapp}`} target="_blank" rel="noopener noreferrer">Falar com {seller.name.split(" ")[0]} no WhatsApp ↗</a></footer>}
    </article>)}</div> : <div className="sellers-empty-state"><h3>Nenhum vendedor encontrado</h3><button className="sellers-reset-btn" onClick={() => {setSearchQuery("");setSelectedState("ALL");}}>Ver todos os vendedores</button></div>}
  </section>;
}
