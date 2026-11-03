import "server-only";
import { cache } from "react";
import { blogPosts, type BlogPost } from "./blog-posts";
import { products, type Product } from "./products";

const origin = process.env.CENTER_ECOSYSTEM_ORIGIN || "https://intranet.centeronibus.com.br";

async function readFeed(path: string): Promise<unknown> {
  try {
    const response = await fetch(new URL(path, origin), { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    console.error(`Fonte da Center indisponível: ${path}`);
    return null;
  }
}

type PublishedPost = { id: string; at: string; article: { title: string; description: string; paragraphs: string[]; sources?: { title: string; url: string }[] } };
function isPost(value: unknown): value is PublishedPost {
  if (!value || typeof value !== "object") return false;
  const p = value as PublishedPost;
  return /^[a-f0-9-]{36}$/.test(p.id) && Number.isFinite(Date.parse(p.at)) &&
    typeof p.article?.title === "string" && typeof p.article.description === "string" &&
    Array.isArray(p.article.paragraphs) && p.article.paragraphs.length > 0 && p.article.paragraphs.every(t => typeof t === "string");
}

export const listBlogPosts = cache(async (): Promise<readonly BlogPost[]> => {
  const feed = await readFeed("/public/posts") as { version?: number; posts?: unknown[] } | null;
  const published: BlogPost[] = feed?.version === 1 && Array.isArray(feed.posts) ? feed.posts.filter(isPost).map(p => ({
    slug: p.id, title: p.article.title, excerpt: p.article.description, category: "Operação",
    publishedAt: p.at, publishedLabel: new Date(p.at).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }),
    readingTime: `${Math.max(1, Math.ceil(p.article.paragraphs.join(" ").split(/\s+/).length / 200))} min de leitura`,
    image: "/blog/conferencia-estoque.webp", imageAlt: "Conferência de estoque da Center Ônibus",
    intro: p.article.paragraphs[0], sections: p.article.paragraphs.length > 1 ? [{ id: "artigo", title: p.article.title, paragraphs: p.article.paragraphs.slice(1) }] : [],
    callout: "Confirme código, medida e aplicação com a equipe Center Ônibus.",
    sources: Array.isArray(p.article.sources) ? p.article.sources.filter(s => typeof s.title === "string" && typeof s.url === "string" && /^https:\/\//.test(s.url)) : [],
  })) : [];
  return [...published, ...blogPosts].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
});

export const listProducts = cache(async (): Promise<readonly Product[]> => {
  const feed = await readFeed("/public/catalog") as { version?: number; connected?: boolean; updatedAt?: string; products?: Product[] } | null;
  if (feed?.version !== 1 || !feed.connected || !Array.isArray(feed.products)) return products;
  // Never advertise old prices or availability after a prolonged synchronization failure.
  const fresh = !!feed.updatedAt && Date.now() - Date.parse(feed.updatedAt) < 30 * 60 * 1000;
  return feed.products.filter(p => /^mlb\d+$/.test(p.slug) && typeof p.name === "string" &&
    typeof p.image === "string" && /^https:\/\/[a-z0-9.-]+\.mlstatic\.com\//i.test(p.image) &&
    typeof p.marketplaceUrl === "string" && /^https:\/\/(?:[a-z0-9-]+\.)?mercadolivre\.com\.br\//i.test(p.marketplaceUrl)
  ).map(p => ({ ...p, price: fresh ? p.price : undefined, availability: fresh ? p.availability : "Consulte disponibilidade no Mercado Livre" }));
});
