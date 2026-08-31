import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InstitutionalFooter } from "../../_components/institutional-footer";
import { InstitutionalHeader } from "../../_components/institutional-header";
import { blogPosts, getBlogPost, getRelatedBlogPosts } from "../../_content/blog-posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Center Ônibus`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post);

  return (
    <div className="institutional-shell blog-shell">
      <InstitutionalHeader />
      <main className="article-main">
        <nav className="article-breadcrumb" aria-label="Navegação estrutural">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog">Blog</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{post.category}</span>
        </nav>

        <article>
          <header className="article-header">
            <p className="blog-kicker">{post.category}</p>
            <h1>{post.title}</h1>
            <p className="article-lead">{post.excerpt}</p>
            <div className="article-meta">
              <span>Equipe técnica Center Ônibus</span>
              <time dateTime={post.publishedAt}>{post.publishedLabel}</time>
              <span>{post.readingTime}</span>
            </div>
          </header>

          <figure className="article-cover">
            <Image
              src={post.image}
              alt={post.imageAlt}
              width={1536}
              height={1024}
              sizes="(max-width: 1200px) 100vw, 1160px"
              priority
            />
            <figcaption>Referência visual. A aplicação deve ser confirmada para cada veículo.</figcaption>
          </figure>

          <div className="article-layout">
            <aside className="article-index" aria-label="Neste guia">
              <span>Neste guia</span>
              <ol>
                {post.sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>
                      <span>0{index + 1}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <div className="article-content">
              <p className="article-intro">{post.intro}</p>

              {post.sections.map((section, index) => (
                <section id={section.id} key={section.id}>
                  <span className="article-section-number">0{index + 1}</span>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.checklist ? (
                    <ul className="article-checklist">
                      {section.checklist.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              <blockquote>{post.callout}</blockquote>

              <div className="article-help">
                <span>Precisa confirmar uma aplicação?</span>
                <p>Envie fotos, medidas, código e dados da carroceria. A equipe ajuda a identificar o item.</p>
                <Link href="/fale-conosco">Falar com a equipe</Link>
              </div>
            </div>
          </div>
        </article>

        <section className="article-related" aria-labelledby="article-related-title">
          <div className="blog-section-heading">
            <div>
              <p className="blog-kicker">Continue a leitura</p>
              <h2 id="article-related-title">Outros guias técnicos</h2>
            </div>
            <Link href="/blog">Ver todos</Link>
          </div>
          <div className="article-related-grid">
            {relatedPosts.map((related) => (
              <Link href={`/blog/${related.slug}`} key={related.slug}>
                <span>{related.category}</span>
                <h3>{related.title}</h3>
                <p>{related.readingTime}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <InstitutionalFooter />
    </div>
  );
}
