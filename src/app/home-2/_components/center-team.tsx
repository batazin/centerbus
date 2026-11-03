"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { sellersList } from "../../vendedores/sellers-data";

export function CenterTeam() {
  const [unit, setUnit] = useState<"SP" | "BA" | "RJ">("SP");
  const track = useRef<HTMLDivElement>(null);
  const sellers = sellersList.filter(seller => seller.state === unit);
  const move = (direction: number) => {
    const el = track.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * .8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <section id="equipe" className="center-team" aria-labelledby="center-team-title">
    <header className="center-team-heading">
      <div><span className="center-eyebrow">Gente que conhece a operação</span><h2 id="center-team-title">Fale com quem entende<br />de carroceria.</h2></div>
      <p>Código, foto, medida ou modelo. Conte com nossa equipe para conferir a aplicação e consultar a peça que você precisa.</p>
    </header>
    <div className="center-team-toolbar">
      <div className="center-team-units" aria-label="Unidade de atendimento">{(["SP", "BA", "RJ"] as const).map(state => <button key={state} aria-pressed={unit === state} onClick={() => { setUnit(state); track.current?.scrollTo({left:0}); }}>{state === "SP" ? "São Paulo · Matriz" : state === "BA" ? "Bahia · Filial" : "Rio de Janeiro · Filial"}</button>)}</div>
      {<div className="center-team-arrows"><button onClick={() => move(-1)} aria-label="Vendedores anteriores">←</button><button onClick={() => move(1)} aria-label="Próximos vendedores">→</button></div>}
    </div>
    {<div ref={track} className="center-team-track" role="region" aria-label={`Vendedores de ${unit === "SP" ? "São Paulo" : unit === "BA" ? "Bahia" : "Rio de Janeiro"}`} tabIndex={0}>
      {sellers.map(seller => <article className="center-team-card" key={seller.id}>
        <div className="center-team-photo"><img src={seller.fotoImage} alt={seller.name} loading="lazy" width="360" height="420" /><span>{seller.unit}</span></div>
        <div className="center-team-card-copy"><h3>{seller.name}</h3><p>{seller.phone}{seller.extension ? ` · Ramal ${seller.extension}` : ""}</p>
          {(seller.whatsapp || seller.email) && <a className="center-team-contact" href={seller.whatsapp ? `https://wa.me/${seller.whatsapp}?text=${encodeURIComponent(`Olá ${seller.name}, gostaria de consultar uma peça de carroceria.`)}` : `mailto:${seller.email}`} target={seller.whatsapp ? "_blank" : undefined} rel={seller.whatsapp ? "noopener noreferrer" : undefined}>Falar com {seller.name.split(" ")[0]} <span aria-hidden="true">↗</span></a>}
        </div>
      </article>)}
    </div>}
    <footer className="center-team-footer"><span>Atendimento direto. De pessoa para pessoa.</span><Link href="/vendedores">Ver todos os contatos ↗</Link></footer>
  </section>;
}
