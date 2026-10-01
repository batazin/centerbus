import { Metadata } from "next";
import { InstitutionalPage } from "../_components/institutional-page";
import { sellersPage } from "../_content/institutional-pages";
import { SellersView } from "./sellers-view";

export const metadata: Metadata = {
  title: "Vendedores e Atendimento Técnico | Center Ônibus",
  description:
    "Equipe comercial especializada por estado: Matriz São Paulo e Filial Bahia. Encontre seu consultor de peças de carrocerias de ônibus com contato direto via WhatsApp e telefone.",
};

export default function SellersPage() {
  return (
    <InstitutionalPage {...sellersPage}>
      <SellersView />
    </InstitutionalPage>
  );
}
