import { Metadata } from "next";
import { InstitutionalPage } from "../_components/institutional-page";
import { sellersPage } from "../_content/institutional-pages";
import { SellersView } from "./sellers-view";
import { pageMetadata } from "../_content/site";

export const metadata: Metadata = pageMetadata("Vendedores e Atendimento Técnico | Center Ônibus", "Equipe comercial em São Paulo, Bahia e Rio de Janeiro. Encontre seu consultor de peças para carrocerias de ônibus por WhatsApp e telefone.", "/vendedores");

export default function SellersPage() {
  return (
    <InstitutionalPage {...sellersPage}>
      <SellersView />
    </InstitutionalPage>
  );
}
