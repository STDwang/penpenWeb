import type { Metadata } from "next";
import { asset } from "@/lib/asset";

export const person = {
  name: "王帅鹏",
  role: "C++ / 仿真平台工程师",
  phone: "138 4948 9395",
  email: "1946262980@qq.com",
  github: "https://github.com/STDwang",
  blog: "https://blog.csdn.net/qq_47898198",
  resume: asset("/resume/wang-shuaipeng.pdf"),
};

// Only a verified production domain enables indexing. Preview builds stay noindex.
export const productionUrl = process.env.SITE_URL;
export const indexable =
  process.env.VERCEL_ENV === "production" && Boolean(productionUrl);
export const siteUrl =
  productionUrl ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export function pageMeta(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: productionUrl
      ? { canonical: new URL(path, productionUrl).href }
      : undefined,
    openGraph: {
      title: `${title} · 王帅鹏`,
      description,
      url: new URL(path, siteUrl).href,
      type: "website",
      locale: "zh_CN",
      images: [{ url: asset("/social-card.png"), width: 1200, height: 630 }],
    },
  };
}
