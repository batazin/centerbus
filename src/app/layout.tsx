import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CenterBus | Peças para ônibus",
  description:
    "One page criativa para uma distribuidora de peças de ônibus, com navegação em snap e animações técnicas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`h-full antialiased ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
