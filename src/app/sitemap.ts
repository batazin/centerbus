import type { MetadataRoute } from "next";
import { listBlogPosts, listProducts } from "./_content/ecosystem";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.CENTER_SITE_ORIGIN || "https://centerbus.netlify.app";
  const [posts, products] = await Promise.all([listBlogPosts(), listProducts()]);
  return [
    ...["", "/blog", "/produtos", "/fale-conosco"].map(path => ({ url: origin + path })),
    ...posts.map(post => ({ url: `${origin}/blog/${post.slug}`, lastModified: post.publishedAt })),
    ...products.map(product => ({ url: `${origin}/produtos/${product.slug}` })),
  ];
}
