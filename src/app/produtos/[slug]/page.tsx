import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InstitutionalFooter } from "../../_components/institutional-footer";
import { InstitutionalHeader } from "../../_components/institutional-header";
import { ProductTechnicalVisual } from "../../_components/product-technical-visual";
import { getProduct, getRelatedProducts, products } from "../../_content/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {};
  }

  return {
    title: `${product.shortName} | Center Ônibus`,
    description: `${product.description} Consulte aplicação e disponibilidade com a equipe Center Ônibus.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps<"/produtos/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);
  const contactHref = `/fale-conosco?produto=${encodeURIComponent(product.name)}&codigo=${encodeURIComponent(product.code)}`;

  return (
    <div className="institutional-shell product-detail-shell">
      <InstitutionalHeader />
      <main className="product-detail-main">
        <nav className="product-breadcrumb" aria-label="Navegação estrutural">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/produtos">Produtos</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.shortName}</span>
        </nav>

        <section className="product-sales-hero" aria-labelledby="product-sales-title">
          <div className="product-sales-media">
            <ProductTechnicalVisual
              mark={product.visualMark}
              category={product.categoryLabel}
              image={product.image}
              imageAlt={product.imageAlt}
            />
            <div className="product-media-caption">
              <span>Imagem de apresentação</span>
              <span>Confirme código, medida e aplicação antes do pedido.</span>
            </div>
          </div>

          <aside className="product-purchase-panel" aria-label="Comprar este produto">
            <div className="product-sales-badges">
              <span>{product.categoryLabel}</span>
              <span>Venda sob consulta</span>
            </div>
            <p className="product-sales-code">Código {product.code}</p>
            <h1 id="product-sales-title">{product.name}</h1>
            <p className="product-sales-description">{product.description}</p>

            <dl className="product-sales-data">
              <div>
                <dt>Aplicação</dt>
                <dd>{product.application}</dd>
              </div>
              <div>
                <dt>Medidas</dt>
                <dd>{product.dimensions}</dd>
              </div>
              <div>
                <dt>Referência</dt>
                <dd>{product.reference}</dd>
              </div>
            </dl>

            <div className="product-sales-offer">
              <span>Condição comercial</span>
              <strong>Preço sob consulta</strong>
              <p>Quantidade, prazo e condição de pagamento confirmados no orçamento.</p>
            </div>

            <div className="product-sales-actions">
              <Link href={contactHref}>Solicitar cotação deste item</Link>
              <Link href="/vendedores">Falar com um vendedor</Link>
            </div>

            <ul className="product-sales-assurances" aria-label="Diferenciais da compra">
              <li>Aplicação conferida antes do faturamento</li>
              <li>Atendimento para todo o Brasil</li>
              <li>Suporte por foto, medida ou referência</li>
            </ul>
          </aside>
        </section>

        <section className="product-operation-strip" aria-label="Como comprar este produto">
          <p>Como comprar</p>
          <ol>
            <li><span>01</span> Solicite a cotação</li>
            <li><span>02</span> Confirme a aplicação</li>
            <li><span>03</span> Receba prazo e condição</li>
          </ol>
        </section>

        <section className="product-data" aria-labelledby="product-data-title">
          <div className="product-section-heading">
            <span>01</span>
            <div>
              <p className="catalog-kicker">Ficha técnica</p>
              <h2 id="product-data-title">Dados para conferência</h2>
            </div>
          </div>
          <dl className="product-data-grid">
            <div>
              <dt>Categoria</dt>
              <dd>{product.categoryLabel}</dd>
            </div>
            <div>
              <dt>Código</dt>
              <dd>{product.code}</dd>
            </div>
            <div>
              <dt>Aplicação</dt>
              <dd>{product.application}</dd>
            </div>
            <div>
              <dt>Medidas</dt>
              <dd>{product.dimensions}</dd>
            </div>
            <div>
              <dt>Referência</dt>
              <dd>{product.reference}</dd>
            </div>
            <div>
              <dt>Disponibilidade</dt>
              <dd>{product.availability}</dd>
            </div>
          </dl>
        </section>

        <section className="product-guidance">
          <article>
            <div className="product-section-heading">
              <span>02</span>
              <div>
                <p className="catalog-kicker">Aplicação</p>
                <h2>O que conferir</h2>
              </div>
            </div>
            <ul>
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
          <article>
            <div className="product-section-heading">
              <span>03</span>
              <div>
                <p className="catalog-kicker">Identificação</p>
                <h2>Antes de solicitar</h2>
              </div>
            </div>
            <ol>
              {product.identification.map((instruction) => (
                <li key={instruction}>{instruction}</li>
              ))}
            </ol>
          </article>
        </section>

        <section className="product-cta">
          <div>
            <p className="catalog-kicker">Fale com quem entende de carroceria</p>
            <h2>A peça não pode parar a operação.</h2>
          </div>
          <div>
            <p>Envie o código, uma foto e o modelo do ônibus. A equipe Center Ônibus confere a aplicação.</p>
            <Link href={contactHref}>Consultar este item</Link>
          </div>
        </section>

        <section className="related-products" aria-labelledby="related-title">
          <div className="related-products-heading">
            <div>
              <p className="catalog-kicker">Outras linhas</p>
              <h2 id="related-title">Continue no catálogo</h2>
            </div>
            <Link href="/produtos">Ver todos os produtos</Link>
          </div>
          <div className="related-products-grid">
            {relatedProducts.map((related) => (
              <article key={related.slug}>
                <ProductTechnicalVisual
                  mark={related.visualMark}
                  category={related.categoryLabel}
                  compact
                  image={related.image}
                  imageAlt={related.imageAlt}
                />
                <span>{related.code}</span>
                <h3>{related.shortName}</h3>
                <Link href={`/produtos/${related.slug}`}>Ver ficha técnica →</Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <InstitutionalFooter />
    </div>
  );
}
