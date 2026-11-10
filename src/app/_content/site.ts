import type { Metadata } from "next";

const configuredOrigin = process.env.CENTER_SITE_ORIGIN || "https://centeronibus.com.br";
export const SITE_ORIGIN = new URL(configuredOrigin).origin;
export const INDEXABLE = process.env.CENTER_SITE_INDEXABLE !== "0" && !["deploy-preview", "branch-deploy"].includes(process.env.CONTEXT || "");
export const SOCIAL_IMAGE = "/images/center-social.jpg";
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: "Center Ônibus", locale: "pt_BR", type: "website", images: [{ url: SOCIAL_IMAGE, width: 1200, height: 630, alt: "Center Ônibus — peças para carrocerias de ônibus" }] },
    twitter: { card: "summary_large_image", title, description, images: [SOCIAL_IMAGE] },
  };
}
