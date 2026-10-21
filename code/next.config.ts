import type { NextConfig } from "next";

// 部署子路径：默认挂到 WorkBuddy 应用 /portfolio/ 子路径下托管；
// GitHub Pages 构建时用 NEXT_PUBLIC_BASE_PATH=/penpenWeb 覆盖。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/portfolio";

const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  // 静态导出：托管在静态站点服务（WorkBuddy / GitHub Pages）的子路径下
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};
export default config;
