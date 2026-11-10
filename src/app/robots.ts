import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_ORIGIN } from "./_content/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: INDEXABLE ? "/" : undefined, disallow: INDEXABLE ? ["/scroll-lab", "/webgpu-lab", "/troca-e-instalacao-de-vidros/obrigado", "/troca-de-parabrisa/obrigado"] : "/" }, sitemap: `${SITE_ORIGIN}/sitemap.xml` };
}
