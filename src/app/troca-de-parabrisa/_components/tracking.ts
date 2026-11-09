"use client";

/**
 * Rastreamento da LP.
 * - Guarda gclid/UTMs da URL de entrada (anúncio do Google) durante a visita.
 * - Envia eventos para o dataLayer; quando o Google Tag Manager / Google Ads for
 *   instalado, basta criar as tags para estes eventos:
 *   lp_whatsapp_click, lp_phone_click, lp_form_submit.
 */

const KEYS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const STORAGE_KEY = "center-parabrisa-origin";

export type Origin = Partial<Record<(typeof KEYS)[number], string>>;

export function captureOrigin(): Origin {
  let stored: Origin = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") as Origin;
  } catch {
    stored = {};
  }
  const params = new URLSearchParams(window.location.search);
  const fresh: Origin = {};
  KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) fresh[key] = value.slice(0, 200);
  });
  const origin = Object.keys(fresh).length ? fresh : stored;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(origin));
  } catch {
    /* navegação privada: segue sem guardar */
  }
  return origin;
}

export function originLabel(origin: Origin) {
  if (origin.gclid || origin.gbraid || origin.wbraid) return `Google Ads${origin.utm_campaign ? ` · ${origin.utm_campaign}` : ""}`;
  if (origin.utm_source) return [origin.utm_source, origin.utm_medium, origin.utm_campaign].filter(Boolean).join(" · ");
  return "";
}

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export function track(event: "lp_whatsapp_click" | "lp_phone_click" | "lp_form_submit", data: Record<string, unknown> = {}) {
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, page: "troca-de-parabrisa", ...data });
}
