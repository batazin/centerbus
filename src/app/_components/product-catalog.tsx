"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { productCategories, products } from "../_content/products";
import { ProductTechnicalVisual } from "./product-technical-visual";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export function ProductCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todos");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return products.filter((product) => {
      const matchesCategory = category === "todos" || product.category === category;
      const searchable = normalize(
        [
          product.name,
          product.shortName,
          product.code,
          product.categoryLabel,
          product.application,
          product.reference,
        ].join(" "),
      );

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, query]);

  return (
    <section className="catalog-section" aria-labelledby="catalog-heading">
      <div className="catalog-heading-row">
        <div>
          <p className="catalog-kicker">Consulta técnica</p>
          <h2 id="catalog-heading">Encontre pela peça ou aplicação</h2>
        </div>
        <p>
          Não encontrou o código? Envie uma foto. A equipe confere carroceria, aplicação e medida antes do pedido.
        </p>
      </div>

      <div className="catalog-tools" role="search">
        <label className="catalog-search">
          <span>Buscar no catálogo</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Peça, código, aplicação ou referência"
          />
        </label>
        <label className="catalog-select">
          <span>Categoria</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="todos">Todas as categorias</option>
            {productCategories.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="catalog-result-bar" aria-live="polite">
        <strong>{String(filteredProducts.length).padStart(2, "0")}</strong>
        <span>{filteredProducts.length === 1 ? "item encontrado" : "itens encontrados"}</span>
        {(query || category !== "todos") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("todos");
            }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="catalog-grid">
          {filteredProducts.map((product, index) => (
            <Link
              className="catalog-card-link"
              href={`/produtos/${product.slug}`}
              aria-label={`Ver ficha técnica de ${product.shortName}, código ${product.code}`}
              key={product.slug}
            >
              <article className="catalog-card">
                <ProductTechnicalVisual
                  mark={product.visualMark}
                  category={product.categoryLabel}
                  compact
                  image={product.image}
                  imageAlt={product.imageAlt}
                />
                <div className="catalog-card-copy">
                  <div className="catalog-card-meta">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{product.categoryLabel}</span>
                  </div>
                  <p className="catalog-card-code">{product.code}</p>
                  <h3>{product.shortName}</h3>
                  <p>{product.description}</p>
                  <dl>
                    <div>
                      <dt>Aplicação</dt>
                      <dd>{product.application}</dd>
                    </div>
                    <div>
                      <dt>Disponibilidade</dt>
                      <dd>{product.availability}</dd>
                    </div>
                  </dl>
                  <span className="catalog-card-action">
                    Ver ficha técnica <span aria-hidden="true">→</span>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <strong>Nenhum item com esses filtros.</strong>
          <p>Limpe a busca ou fale com a equipe para identificar a peça por foto.</p>
          <Link href="/fale-conosco">Falar com quem entende de carroceria</Link>
        </div>
      )}
    </section>
  );
}
