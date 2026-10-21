import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  // 静态导出：挂到 WorkBuddy 应用 /portfolio/ 子路径下托管
  output: "export",
  basePath: "/portfolio",
  trailingSlash: true,
  images: { unoptimized: true },
};
export default config;
