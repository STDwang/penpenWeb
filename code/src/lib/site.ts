import type { Metadata } from "next";
import { asset, BASE_PATH } from "@/lib/asset";

export const person = {
  name: "王帅鹏",
  role: "C++ / 仿真平台工程师",
  phone: "138 4948 9395",
  email: "1946262980@qq.com",
  github: "https://github.com/STDwang",
  blog: "https://blog.csdn.net/qq_47898198",
  resume: asset("/resume/wang-shuaipeng.pdf"),
};

// Only an explicitly verified production origin enables indexing. The switch is
// deliberately independent of the hosting platform: GitHub Pages builds never set
// VERCEL_ENV, so a Vercel-only condition left the published site permanently
// noindex with localhost share URLs.
const configuredOrigin = process.env.SITE_URL?.trim();

export const productionUrl = configuredOrigin
  ? configuredOrigin.endsWith("/")
    ? configuredOrigin
    : `${configuredOrigin}/`
  : undefined;

export const indexable = Boolean(productionUrl);

// metadataBase needs a bare origin; relative asset paths carry the base path.
export const siteUrl = productionUrl
  ? new URL(productionUrl).origin
  : "http://localhost:3000";

// Absolute page URL that keeps both the host sub path and the trailing slash
// that `trailingSlash: true` produces in the exported build.
export function absoluteUrl(path: string) {
  const isFile = /\.[a-z0-9]+$/i.test(path);
  const suffix = isFile
    ? path
    : path === "/"
      ? "/"
      : `${path.replace(/\/+$/, "")}/`;
  return new URL(`${BASE_PATH}${suffix}`, siteUrl).href;
}

export function pageMeta(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: productionUrl
      ? { canonical: absoluteUrl(path) }
      : undefined,
    openGraph: {
      title: `${title} · 王帅鹏`,
      description,
      url: absoluteUrl(path),
      type: "website",
      locale: "zh_CN",
      images: [
        {
          url: absoluteUrl("/social-card.png"),
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
