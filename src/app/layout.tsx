import type { Metadata } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./home-rebrand.css";
import "./product-catalog.css";
import "./blog.css";
import "./_components/center-site-header.css";
import "./site-consistency.css";
import "./center-october.css";
import { BranchWhatsapp } from "./_components/branch-whatsapp";
import { SITE_ORIGIN, INDEXABLE, SOCIAL_IMAGE } from "./_content/site";
import { branches } from "./_content/branches";
import { GoogleMeasurement } from "./_components/google-measurement";

const inter = localFont({ src: "./fonts/Inter-Variable.woff2", variable: "--font-inter", display: "swap", weight: "100 900" });
const archivoNarrow = localFont({
  src: [{ path: "./fonts/ArchivoCondensed-Bold.woff2", weight: "700" }, { path: "./fonts/ArchivoCondensed-ExtraBold.woff2", weight: "800" }],
  variable: "--font-archivo-condensed", display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: "Center Ônibus | Peças para carrocerias de ônibus",
  description:
    "Center Ônibus: peças para carrocerias de ônibus, atendimento técnico e estoque para manter a frota em operação.",
  robots: { index: INDEXABLE, follow: INDEXABLE },
  openGraph: { siteName: "Center Ônibus", locale: "pt_BR", type: "website", images: [SOCIAL_IMAGE] },
  twitter: { card: "summary_large_image", images: [SOCIAL_IMAGE] },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`h-full antialiased ${inter.variable} ${archivoNarrow.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Organization", "@id": `${SITE_ORIGIN}/#organization`, name: "Center Ônibus", url: SITE_ORIGIN,
          logo: `${SITE_ORIGIN}/brand/center-onibus-logo-color.svg`,
          contactPoint: branches.map(branch => ({ "@type": "ContactPoint", telephone: `+${branch.whatsapp}`, contactType: "sales", availableLanguage: "Portuguese", name: branch.name })),
          location: branches.map(branch => ({ "@type": "Place", name: branch.name, address: { "@type": "PostalAddress", streetAddress: branch.address, addressLocality: branch.city.split(" - ")[0], addressRegion: branch.state, postalCode: branch.cep, addressCountry: "BR" } })),
        }).replace(/</g, "\\u003c") }} />
        {children}<BranchWhatsapp /><GoogleMeasurement />
      </body>
    </html>
  );
}
