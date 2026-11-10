"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { measure } from "../_lib/measurement";

const ga = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA4_ID || "") ? process.env.NEXT_PUBLIC_GA4_ID : undefined;
const ads = /^AW-\d+$/.test(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "") ? process.env.NEXT_PUBLIC_GOOGLE_ADS_ID : undefined;
const gtm = /^GTM-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GTM_ID || "") ? process.env.NEXT_PUBLIC_GTM_ID : undefined;
const configured = !!(ga || ads || gtm);
const key = "center-measurement-consent";
type GoogleWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
let memoryChoice: string | null = null;
function consentSnapshot() {
  let value = memoryChoice;
  try { value = localStorage.getItem(key) || memoryChoice; } catch { /* memória nesta visita */ }
  return value === "granted" || value === "denied" ? value : null;
}
function subscribeConsent(callback: () => void) {
  window.addEventListener("center-consent-change", callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener("center-consent-change", callback); window.removeEventListener("storage", callback); };
}

export function GoogleMeasurement() {
  const path = usePathname();
  const choice = useSyncExternalStore(subscribeConsent, consentSnapshot, () => null);
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState(false);
  const initialized = useRef(false);
  useEffect(() => {
    if (!configured) return;
    const w = window as GoogleWindow;
    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || ((...args: unknown[]) => { w.dataLayer!.push(args); });
    w.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  }, []);
  useEffect(() => {
    if (!configured) return;
    const w = window as GoogleWindow;
    const status = choice === "granted" ? "granted" : "denied";
    w.gtag?.("consent", "update", { analytics_storage: status, ad_storage: status, ad_user_data: status, ad_personalization: status });
  }, [choice]);
  useEffect(() => {
    if (!ready || choice !== "granted") return;
    const w = window as GoogleWindow;
    if (gtm) w.dataLayer?.push({ event: "center_page_view", page_path: path });
    else w.gtag?.("event", "page_view", { page_location: `${location.origin}${path}`, page_path: path });
  }, [path, ready, choice]);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const link = (event.target as Element)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.closest(".pb-page")) return; // A landing já emite eventos específicos.
      if (link.href.startsWith("https://wa.me/")) measure("whatsapp_click", { canal: "whatsapp" });
      if (link.href.startsWith("tel:")) measure("phone_click", { canal: "telefone" });
      if (/^https:\/\/(?:[a-z0-9-]+\.)?mercadolivre\.com\.br\//i.test(link.href)) measure("marketplace_click");
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  const choose = (value: string) => { memoryChoice = value; setSettings(false); try { localStorage.setItem(key, value); } catch { /* memória nesta visita */ } window.dispatchEvent(new Event("center-consent-change")); };
  if (!configured) return null;
  return <>
    {choice === "granted" && (gtm
      ? <Script id="center-gtm" strategy="afterInteractive" onReady={() => setReady(true)}>{`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=${gtm}';document.head.appendChild(s);`}</Script>
      : <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga || ads}`} strategy="afterInteractive" onReady={() => {
        if (!initialized.current) {
          const w = window as GoogleWindow;
          w.gtag?.("js", new Date());
          if (ga) w.gtag?.("config", ga, { send_page_view: false });
          if (ads) w.gtag?.("config", ads, { send_page_view: false });
          initialized.current = true;
        }
        setReady(true);
      }} />)}
    {(choice === null || settings) ? <section className="center-cookie-panel" aria-label="Preferências de medição">
      <p>Podemos usar cookies para medir visitas e resultados dos anúncios? Você pode recusar e continuar usando o site. <Link href="/sobre/politica-de-privacidade">Política de privacidade</Link></p>
      <div><button onClick={() => choose("denied")}>Recusar</button><button onClick={() => choose("granted")}>Permitir medição</button></div>
    </section> : <button className="center-cookie-settings" onClick={() => setSettings(true)}>Preferências de cookies</button>}
  </>;
}
