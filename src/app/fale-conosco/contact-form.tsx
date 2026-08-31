"use client";

import { useRef, useState } from "react";
import "./contact-form.css";

const subjects = [
  { value: "orcamento", label: "Orçamento de peças" },
  { value: "identificacao", label: "Identificação de peça" },
  { value: "parceria", label: "Parcerias e Revenda" },
  { value: "outro", label: "Outros assuntos" },
] as const;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 1800);
  };

  const handleReset = () => {
    setStatus("idle");
    formRef.current?.reset();
  };

  const isDisabled = status === "submitting";

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
                <span className="contact-channel-label">Telefone / WhatsApp</span>
                <strong>(11) 2065-4620</strong>
              </div>
              <div className="contact-channel">
                <span className="contact-channel-label">E-mail comercial</span>
                <strong>contato@centeronibus.com.br</strong>
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
          {status === "success" ? (
            <div className="contact-form-success">
              <div className="contact-success-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <strong>Solicitação recebida.</strong>
              <p>O retorno é feito pela equipe técnica, com conferência de aplicação antes do orçamento.</p>
              <div className="contact-success-meta">
                <span>Prazo médio de resposta</span>
                <strong>Até 4 horas úteis</strong>
              </div>
              <button type="button" onClick={handleReset} className="contact-btn contact-btn-outline">
                Enviar nova solicitação
              </button>
            </div>
          ) : (
            <>
              <div className="contact-form-header">
                <span className="contact-form-step">Formulário de contato</span>
                <h3>Envie sua solicitação</h3>
                <p>Quanto mais detalhes, mais rápido o retorno técnico.</p>
              </div>

              <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                <div className={`form-field ${focusedField === "name" ? "is-focused" : ""}`}>
                  <label htmlFor="contact-name">Nome ou empresa</label>
                  <input
                    type="text"
                    id="contact-name"
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
                        Enviando…
                      </>
                    ) : (
                      "Enviar solicitação"
                    )}
                  </button>
                  <p className="contact-form-disclaimer">
                    Seus dados são tratados conforme nossa política de privacidade.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
