import type { MetadataRoute } from "next";
import { absoluteUrl, indexable } from "@/lib/site";

// 静态导出（output: "export"）要求元数据路由显式声明为静态
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(indexable ? { allow: "/" } : { disallow: "/" }),
    },
    sitemap: indexable ? absoluteUrl("/sitemap.xml") : undefined,
  };
}
