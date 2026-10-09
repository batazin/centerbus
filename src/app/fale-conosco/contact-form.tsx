"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./contact-form.css";

const subjects = [
  { value: "orcamento", label: "Orçamento de peças" },
  { value: "identificacao", label: "Identificação de peça" },
  { value: "parceria", label: "Parcerias e Revenda" },
  { value: "outro", label: "Outros assuntos" },
] as const;

export function ContactForm() {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  const [status, setStatus] = useState<"idle" | "prepared">("idle");
  const [emailHref, setEmailHref] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const fields = new FormData(formRef.current);
    const subject = subjects.find(item => item.value === fields.get("subject"))?.label ?? "Solicitação de peças";
    const body = `Nome / empresa: ${fields.get("name")}\nE-mail: ${fields.get("email")}\nTelefone: ${fields.get("phone")}\n\n${fields.get("message")}`;
    const href = `mailto:contato@centeronibus.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setEmailHref(href);
    setStatus("prepared");
  };

  const handleReset = () => {
    setStatus("idle");
  };

  const isDisabled = !isReady;

  return (
    <section className="contact-form-section" id="formulario">
      <div className="contact-form-wrapper">
        {/* ── Sidebar ── */}
        <aside className="contact-sidebar">
          <div className="contact-sidebar-inner">
            <span className="contact-sidebar-kicker">Atendimento direto</span>
            <h2>Fale com quem entende de carroceria.</h2>
            <p>
              Envie foto, código ou modelo. A equipe identifica a peça, confere a aplicação e retorna com prazo real.
            </p>

            <div className="contact-channels">
              <div className="contact-channel">
                <span className="contact-channel-label">Telefone</span>
                <a href="tel:+551129673002"><strong>(11) 2967-3002</strong></a>
              </div>
              <div className="contact-channel">
                <span className="contact-channel-label">E-mail comercial</span>
                <a href="mailto:contato@centeronibus.com.br"><strong>contato@centeronibus.com.br</strong></a>
              </div>
              <div className="contact-channel">
                <span className="contact-channel-label">Horário</span>
                <strong>Seg a Sex · 08h às 18h</strong>
              </div>
            </div>

            <div className="contact-sidebar-units">
              <span>Unidades</span>
              <div>
                <strong>SP</strong>
                <strong>BA</strong>
                <strong>RJ</strong>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Form ── */}
        <div className="contact-form-panel">
          {status === "prepared" && (
            <div className="contact-form-success" role="status">
              <div className="contact-success-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <strong>Seu e-mail está preparado.</strong>
              <p>Conclua o envio no seu aplicativo de e-mail. A solicitação ainda não foi recebida pela Center. Você pode anexar fotos da peça antes de enviar.</p>
              <a href={emailHref} className="contact-btn contact-btn-primary">Abrir aplicativo de e-mail</a>
              <Link href="/vendedores" className="contact-btn contact-btn-outline">Falar com um vendedor</Link>
              <button type="button" onClick={handleReset} className="contact-btn contact-btn-outline">
                Voltar ao formulário
              </button>
            </div>
          )}
          <div hidden={status === "prepared"}>
              <div className="contact-form-header">
                <span className="contact-form-step">Formulário de contato</span>
                <h3>Envie sua solicitação</h3>
                <p>Preencha os detalhes para preparar um e-mail. Você conclui o envio no seu aplicativo de e-mail.</p>
              </div>

              <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                <div className={`form-field ${focusedField === "name" ? "is-focused" : ""}`}>
                  <label htmlFor="contact-name">Nome ou empresa</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    placeholder="Ex: Viação São José"
                    disabled={isDisabled}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div className="form-row-2">
                  <div className={`form-field ${focusedField === "email" ? "is-focused" : ""}`}>
                    <label htmlFor="contact-email">E-mail</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      placeholder="contato@empresa.com.br"
                      disabled={isDisabled}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  <div className={`form-field ${focusedField === "phone" ? "is-focused" : ""}`}>
                    <label htmlFor="contact-phone">Telefone / WhatsApp</label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      required
                      placeholder="(11) 90000-0000"
                      disabled={isDisabled}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                <div className={`form-field ${focusedField === "subject" ? "is-focused" : ""}`}>
                  <label htmlFor="contact-subject">Motivo do contato</label>
                  <div className="form-select-wrap">
                    <select
                      id="contact-subject"
                      name="subject"
                      required
                      disabled={isDisabled}
                      defaultValue=""
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                    >
                      <option value="" disabled>Selecione</option>
                      {subjects.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className={`form-field ${focusedField === "message" ? "is-focused" : ""}`}>
                  <label htmlFor="contact-message">Detalhes da solicitação</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Informe o código da peça, carroceria (Caio Apache Vip, Marcopolo Paradiso...), quantidade e urgência."
                    disabled={isDisabled}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div className="contact-form-footer">
                  <button
                    type="submit"
                    className={`contact-btn contact-btn-primary ${isDisabled ? "is-loading" : ""}`}
                    disabled={isDisabled}
                  >
                    {isDisabled ? (
                      <>
                        <span className="contact-btn-spinner" aria-hidden="true" />
                        Carregando formulário…
                      </>
                    ) : (
                      "Preparar e-mail"
                    )}
                  </button>
                  <p className="contact-form-disclaimer">
                    Seus dados são tratados conforme nossa política de privacidade.
                  </p>
                </div>
              </form>
          </div>
        </div>
      </div>
    </section>
  );
}
