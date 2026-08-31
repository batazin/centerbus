import type { Metadata } from "next";
import { Archivo_Narrow, Inter } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./home-rebrand.css";
import "./product-catalog.css";
import "./blog.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  variable: "--font-archivo-condensed",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Center Ônibus | Peças para carrocerias de ônibus",
  description:
    "Center Ônibus: peças para carrocerias de ônibus, atendimento técnico e estoque para manter a frota em operação.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
