import type { MetadataRoute } from "next";
import { listBlogPosts, listProducts } from "./_content/ecosystem";
import { SITE_ORIGIN, INDEXABLE } from "./_content/site";
import { aboutPages } from "./_content/institutional-pages";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!INDEXABLE) return [];
  const origin = SITE_ORIGIN;
  const [posts, products] = await Promise.all([listBlogPosts(), listProducts()]);
  return [
    ...["", "/blog", "/produtos", "/vendedores", "/fale-conosco", "/troca-e-instalacao-de-vidros", ...Object.keys(aboutPages).map(slug => `/sobre/${slug}`)].map(path => ({ url: origin + path })),
    ...posts.map(post => ({ url: `${origin}/blog/${post.slug}`, lastModified: post.publishedAt })),
    ...products.map(product => ({ url: `${origin}/produtos/${product.slug}` })),
  ];
}
