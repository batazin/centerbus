import type { Metadata } from "next";
import Link from "next/link";
import { LP_PATH, branches, whatsappLink } from "../_content";
import "../parabrisa.css";

// Página de conversão do Google Ads: fora da busca orgânica.
export const metadata: Metadata = {
  title: "Conclua no WhatsApp | Troca de para-brisa | Center Ônibus",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ unidade?: string }> };

export default async function ObrigadoPage({ searchParams }: Props) {
  const { unidade } = await searchParams;
  const branch = branches.find((item) => item.state === unidade) ?? branches[0];

  return (
    <div className="pb-page pb-thanks">
      <header className="pb-header">
        <div className="pb-shell pb-header-inner">
          <Link href="/" aria-label="Center Ônibus — site institucional">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/center-onibus-logo-partial-negative.png" alt="Center Ônibus" width={168} height={44} className="pb-logo" />
          </Link>
        </div>
      </header>

      <main className="pb-thanks-main">
        <div className="pb-shell pb-thanks-inner">
          <span className="pb-kicker">Pedido preparado</span>
          <h1>Falta só enviar no WhatsApp.</h1>
          <p>
            Conclua o envio da mensagem para a <strong>{branch.title}</strong> e anexe as fotos do vidro. A solicitação só chega à equipe depois que você envia na conversa. Se o WhatsApp não abriu, use o botão abaixo e informe os dados do serviço.
          </p>
          <div className="pb-hero-ctas">
            <a className="pb-btn pb-btn-whatsapp" href={whatsappLink(branch)} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/whatsapp.svg" alt="" width={20} height={20} aria-hidden="true" />
              Abrir WhatsApp {branch.state}
            </a>
            <Link className="pb-btn pb-btn-outline" href={LP_PATH}>Voltar para a página</Link>
          </div>
          <p className="pb-thanks-note">Atendimento de segunda a sexta, das 8h às 18h. Telefone da unidade: {branch.phone}.</p>
        </div>
      </main>
    </div>
  );
}
