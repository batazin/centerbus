import type { Metadata } from "next";
import Link from "next/link";
import { ProductCatalog } from "../_components/product-catalog";
import { InstitutionalFooter } from "../_components/institutional-footer";
import { InstitutionalHeader } from "../_components/institutional-header";

export const metadata: Metadata = {
  title: "Catálogo de peças | Center Ônibus",
  description:
    "Consulte peças para carrocerias de ônibus por código, aplicação e categoria. Atendimento técnico para identificar a peça certa.",
};

const catalogSteps = [
  ["01", "Identifique", "Informe carroceria, modelo e ano."],
  ["02", "Confira", "Envie código, medida, foto ou amostra."],
  ["03", "Consulte", "A equipe valida aplicação e disponibilidade."],
] as const;

export default function ProductsPage() {
  return (
    <div className="institutional-shell product-catalog-shell">
      <InstitutionalHeader />
      <main className="product-catalog-main">
        <section className="catalog-hero">
          <div className="catalog-hero-inner">
            <div className="catalog-hero-copy">
              <p className="catalog-kicker">Catálogo técnico</p>
              <h1>A peça certa, na primeira vez.</h1>
              <p>
                Consulte por categoria, aplicação ou referência. Se o código não estiver em mãos, envie uma foto da
                peça e da carroceria.
              </p>
              <div className="catalog-hero-actions">
                <a href="#catalogo">Abrir catálogo</a>
                <Link href="/fale-conosco">Identificar uma peça</Link>
              </div>
            </div>
            <div className="catalog-hero-index" aria-label="Informações do catálogo">
              <span>LINHA</span>
              <strong>30.000+</strong>
              <p>itens para manter o ônibus em operação</p>
              <dl>
                <div>
                  <dt>Atendimento</dt>
                  <dd>Nacional</dd>
                </div>
                <div>
                  <dt>Consulta</dt>
                  <dd>Por aplicação</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="catalog-process" aria-label="Como consultar uma peça">
          {catalogSteps.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <div>
                <h2>{title}</h2>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </section>

        <div id="catalogo" className="catalog-container">
          <ProductCatalog />
        </div>

        <section className="catalog-support">
          <div>
            <p className="catalog-kicker">Conhecimento antes do catálogo</p>
            <h2>Não arrisque a aplicação.</h2>
          </div>
          <div>
            <p>
              Uma foto da peça, a referência gravada e o modelo da carroceria ajudam nossa equipe a conferir o item
              antes do faturamento.
            </p>
            <Link href="/fale-conosco">Enviar dados da peça</Link>
          </div>
        </section>
      </main>
      <InstitutionalFooter />
    </div>
  );
}
