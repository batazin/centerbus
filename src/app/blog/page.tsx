import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InstitutionalFooter } from "../_components/institutional-footer";
import { InstitutionalHeader } from "../_components/institutional-header";
import { blogPosts } from "../_content/blog-posts";

export const metadata: Metadata = {
  title: "Blog técnico | Center Ônibus",
  description:
    "Guias sobre identificação, aplicação e manutenção de peças para carrocerias de ônibus. Informação prática para manter a frota em operação.",
};

const [featuredPost, ...otherPosts] = blogPosts;

export default function BlogPage() {
  return (
    <div className="institutional-shell blog-shell">
      <InstitutionalHeader />
      <main className="blog-main">
        <section className="blog-hero">
          <div className="blog-hero-inner">
            <div>
              <p className="blog-kicker">Conhecimento de operação</p>
              <h1>Informação técnica para o ônibus voltar à rua.</h1>
            </div>
            <p>
              Guias diretos para identificar aplicações, reduzir retrabalho e tomar decisões melhores na manutenção da
              carroceria.
            </p>
          </div>
        </section>

        <div className="blog-index">
          <section className="blog-featured" aria-labelledby="blog-featured-title">
            <div className="blog-section-heading">
              <div>
                <p className="blog-kicker">Leitura recomendada</p>
                <h2 id="blog-featured-title">Destaque</h2>
              </div>
              <span>Atualizado em agosto de 2026</span>
            </div>

            <Link className="blog-featured-card" href={`/blog/${featuredPost.slug}`}>
              <div className="blog-card-image">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.imageAlt}
                  width={1536}
                  height={1024}
                  sizes="(max-width: 900px) 100vw, 1120px"
                  priority
                />
              </div>
              <div className="blog-featured-copy">
                <div className="blog-card-meta">
                  <span>{featuredPost.category}</span>
                  <time dateTime={featuredPost.publishedAt}>{featuredPost.publishedLabel}</time>
                  <span>{featuredPost.readingTime}</span>
                </div>
                <h3>{featuredPost.title}</h3>
                <p>{featuredPost.excerpt}</p>
                <span className="blog-card-action">Ler guia completo <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          </section>

          <section className="blog-latest" aria-labelledby="blog-latest-title">
            <div className="blog-section-heading">
              <div>
                <p className="blog-kicker">Da oficina ao estoque</p>
                <h2 id="blog-latest-title">Guias recentes</h2>
              </div>
              <p>Conteúdo objetivo, técnico e próximo de quem mantém a frota em movimento.</p>
            </div>

            <div className="blog-card-grid">
              {otherPosts.map((post, index) => (
                <Link className="blog-card" href={`/blog/${post.slug}`} key={post.slug}>
                  <div className="blog-card-image">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      width={1536}
                      height={1024}
                      sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 360px"
                    />
                    <span className="blog-card-number">0{index + 2}</span>
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span>{post.category}</span>
                      <time dateTime={post.publishedAt}>{post.publishedLabel}</time>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="blog-card-action">Ler artigo <span aria-hidden="true">→</span></span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="blog-commercial-cta">
            <div>
              <p className="blog-kicker">Conhecimento antes do catálogo</p>
              <h2>Já sabe qual peça precisa?</h2>
            </div>
            <div>
              <p>Consulte o catálogo ou envie código, foto e modelo da carroceria para nossa equipe.</p>
              <div className="blog-commercial-actions">
                <Link href="/produtos">Consultar produtos</Link>
                <Link href="/fale-conosco">Identificar uma peça</Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <InstitutionalFooter />
    </div>
  );
}
