"use client";

import { useEffect } from "react";
import { branches, whatsappLink, type Branch } from "../_content";
import { captureOrigin, track } from "./tracking";

/** Captura a origem da campanha assim que a LP abre. */
export function OriginCapture() {
  useEffect(() => {
    captureOrigin();
  }, []);
  return null;
}

type WhatsAppProps = {
  branch?: Branch;
  label?: string;
  className?: string;
  place?: string;
};

export function WhatsAppButton({ branch = branches[0], label = "Orçar troca pelo WhatsApp", className = "pb-btn", place = "geral" }: WhatsAppProps) {
  return (
    <a
      className={`${className} pb-btn-whatsapp`}
      href={whatsappLink(branch)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("lp_whatsapp_click", { unidade: branch.state, posicao: place })}
    >
      <img src="/brand/whatsapp.svg" alt="" width={20} height={20} aria-hidden="true" />
      {label}
    </a>
  );
}

export function PhoneLink({ branch = branches[0], className = "", place = "geral" }: { branch?: Branch; className?: string; place?: string }) {
  return (
    <a
      className={className}
      href={`tel:+55${branch.phone.replace(/\D/g, "")}`}
      onClick={() => track("lp_phone_click", { unidade: branch.state, posicao: place })}
    >
      {branch.phone}
    </a>
  );
}
