"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { branches, branchWhatsapp } from "../_content/branches";

export function BranchWhatsapp() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", key); };
  }, [open]);
  return <div className="branch-whatsapp" ref={root}>
    {open && <section id="branch-whatsapp-panel" className="branch-whatsapp-panel" aria-label="Escolha a unidade para conversar">
      <div className="branch-whatsapp-heading"><div><span>Atendimento Center</span><h2>Qual unidade você procura?</h2></div><button onClick={() => { setOpen(false); toggle.current?.focus(); }} aria-label="Fechar unidades">×</button></div>
      {branches.map(branch => <a key={branch.state} href={branchWhatsapp(branch)} target="_blank" rel="noopener noreferrer"><span className="branch-whatsapp-state">{branch.state}</span><span><strong>{branch.name}</strong><small>{branch.phone}</small></span><span aria-hidden="true">↗</span></a>)}
    </section>}
    <button ref={toggle} className="branch-whatsapp-toggle" aria-label="WhatsApp: escolher unidade" aria-expanded={open} aria-controls="branch-whatsapp-panel" onClick={() => setOpen(value => !value)}>
      <img src="/brand/whatsapp.svg" width="29" height="29" alt="" aria-hidden="true" className="whatsapp-brand-icon" /><span>WhatsApp</span>
    </button>
  </div>;
}
