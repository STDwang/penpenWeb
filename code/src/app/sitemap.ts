import type { MetadataRoute } from "next";
import { projects, projectPath } from "@/content/projects";
import { absoluteUrl, indexable } from "@/lib/site";

// 静态导出（output: "export"）要求元数据路由显式声明为静态
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];
  return [
    "/",
    "/work",
    "/lab",
    "/about",
    "/resume",
    ...projects.map(projectPath),
  ].map((path) => ({ url: absoluteUrl(path) }));
}
