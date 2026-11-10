type MeasurementWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

/** Somente intenção de contato; não equivale a lead recebido ou venda. Sem dados pessoais. */
export function measure(event: string, data: Record<string, unknown> = {}) {
  const w = window as MeasurementWindow;
  const safe = { page_path: location.pathname, ...data };
  let consent = false;
  try { consent = localStorage.getItem("center-measurement-consent") === "granted"; } catch { /* sem consentimento */ }
  if (!consent) return;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...safe });
  if (/^GTM-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GTM_ID || "")) return;
  w.gtag?.("event", event, safe);
  const label = event === "lp_form_submit" ? process.env.NEXT_PUBLIC_ADS_FORM_LABEL
    : event === "whatsapp_click" || event === "lp_whatsapp_click" ? process.env.NEXT_PUBLIC_ADS_WHATSAPP_LABEL
    : event === "phone_click" || event === "lp_phone_click" ? process.env.NEXT_PUBLIC_ADS_PHONE_LABEL : undefined;
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (/^AW-\d+$/.test(id || "") && /^[A-Za-z0-9_-]+$/.test(label || "")) w.gtag?.("event", "conversion", { send_to: `${id}/${label}` });
}
