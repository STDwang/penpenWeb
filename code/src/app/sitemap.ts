import type { MetadataRoute } from "next";
import { projects, projectPath } from "@/content/projects";
import { indexable, productionUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable || !productionUrl) return [];
  return [
    "/",
    "/work",
    "/lab",
    "/about",
    "/resume",
    ...projects.map(projectPath),
  ].map((path) => ({ url: new URL(path, productionUrl).href }));
}
