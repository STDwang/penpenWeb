import type { MetadataRoute } from "next";
import { indexable, productionUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(indexable ? { allow: "/" } : { disallow: "/" }),
    },
    sitemap: indexable ? `${productionUrl}/sitemap.xml` : undefined,
  };
}
