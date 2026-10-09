import type { Metadata } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./home-rebrand.css";
import "./product-catalog.css";
import "./blog.css";

const inter = localFont({ src: "./fonts/Inter-Variable.ttf", variable: "--font-inter", display: "swap", weight: "100 900" });
const archivoNarrow = localFont({
  src: [{ path: "./fonts/ArchivoCondensed-Bold.ttf", weight: "700" }, { path: "./fonts/ArchivoCondensed-ExtraBold.ttf", weight: "800" }],
  variable: "--font-archivo-condensed", display: "swap",
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
