"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { branches, THANKS_PATH, whatsappLink } from "../_content";
import { captureOrigin, originLabel, track, type Origin } from "./tracking";

type Place = "garagem" | "unidade";

/**
 * Formulário de orçamento. Hoje o envio abre o WhatsApp da unidade escolhida com
 * a mensagem preenchida e leva para a página de obrigado (conversão do Google Ads).
 * Quando houver CRM/e-mail, o envio para o servidor entra em `handleSubmit`.
 */
export function LeadForm() {
  const router = useRouter();
  const [place, setPlace] = useState<Place>("garagem");
  const [error, setError] = useState("");
  const origin = useRef<Origin>({});

  useEffect(() => {
    origin.current = captureOrigin();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setError("Preencha os campos obrigatórios para continuar.");
      form.reportValidity();
      return;
    }
    setError("");
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const branch = branches.find((item) => item.state === value("unidade")) ?? branches[0];
    const source = originLabel(origin.current);

    const optional = (label: string, key: string) => (value(key) ? [`${label}: ${value(key)}`] : []);
    const lines = [
      "Olá! Quero um orçamento de troca de para-brisa.",
      "",
      `Nome: ${value("nome")}`,
      ...optional("Empresa", "empresa"),
      `Telefone: ${value("telefone")}`,
      `Cidade: ${value("cidade")}`,
      `Local da troca: ${place === "garagem" ? "Na minha garagem (atendimento móvel)" : `Na unidade ${branch.title}`}`,
      ...optional("Carroceria / modelo", "carroceria"),
      ...optional("Quantidade de ônibus", "quantidade"),
      ...optional("Observações", "mensagem"),
      ...(source ? ["", `Origem: ${source}`] : []),
    ];

    track("lp_form_submit", { unidade: branch.state, local: place });
    // Abre o WhatsApp no mesmo clique (evita bloqueio de pop-up) e segue para o obrigado.
    window.open(whatsappLink(branch, lines.join("\n")), "_blank", "noopener,noreferrer");
    router.push(`${THANKS_PATH}?unidade=${branch.state}`);
  };

  return (
    <form className="pb-form" id="orcamento" noValidate onSubmit={handleSubmit} aria-labelledby="pb-form-title">
      <div className="pb-form-head">
        <span className="pb-kicker">Orçamento sem compromisso</span>
        <h2 id="pb-form-title">Vamos conferir seu para-brisa?</h2>
        <p>Prepare o pedido e envie à unidade escolhida pelo WhatsApp.</p>
      </div>

      <fieldset className="pb-form-place">
        <legend>Onde fazer a troca?</legend>
        <div>
          {([
            ["garagem", "Na minha garagem"],
            ["unidade", "Na unidade Center"],
          ] as const).map(([id, label]) => (
            <label key={id} className={place === id ? "is-checked" : ""}>
              <input type="radio" name="local" value={id} checked={place === id} onChange={() => setPlace(id)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="pb-form-grid">
        <label className="pb-field">
          <span>Nome *</span>
          <input name="nome" required autoComplete="name" maxLength={80} />
        </label>
        <label className="pb-field">
          <span>Telefone / WhatsApp *</span>
          <input name="telefone" required type="tel" inputMode="tel" autoComplete="tel" maxLength={20} pattern="[\d\s\(\)\+\-]{10,20}" placeholder="(11) 90000-0000" />
        </label>
        <label className="pb-field">
          <span>Empresa / frota</span>
          <input name="empresa" autoComplete="organization" maxLength={80} />
        </label>
        <label className="pb-field">
          <span>Cidade *</span>
          <input name="cidade" required autoComplete="address-level2" maxLength={60} />
        </label>
        <label className="pb-field">
          <span>{place === "garagem" ? "Unidade mais próxima *" : "Unidade *"}</span>
          <select name="unidade" required defaultValue="SP">
            {branches.map((branch) => (
              <option key={branch.state} value={branch.state}>{branch.title}</option>
            ))}
          </select>
        </label>
        <label className="pb-field">
          <span>Quantidade de ônibus</span>
          <input name="quantidade" type="number" min={1} max={500} inputMode="numeric" placeholder="1" />
        </label>
        <label className="pb-field pb-field-wide">
          <span>Carroceria / modelo e ano</span>
          <input name="carroceria" maxLength={100} placeholder="Ex.: Comil Campione 2019" />
        </label>
        <label className="pb-field pb-field-wide">
          <span>Observações</span>
          <textarea name="mensagem" rows={2} maxLength={500} placeholder="Ex.: trinca no lado do motorista" />
        </label>
      </div>

      {error && <p className="pb-form-error" role="alert">{error}</p>}

      <button type="submit" className="pb-btn pb-btn-whatsapp pb-form-submit">
        <img src="/brand/whatsapp.svg" alt="" width={20} height={20} aria-hidden="true" />
        Enviar pelo WhatsApp
      </button>
      <p className="pb-form-note">O botão abre uma mensagem pronta. Conclua o envio no WhatsApp e anexe as fotos do vidro.</p>
      <p className="pb-form-note">
        Usamos seus dados só para responder a este pedido. Veja a <Link href="/sobre/politica-de-privacidade">política de privacidade</Link>.
      </p>
    </form>
  );
}
