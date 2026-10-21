// 静态导出子路径助手：与 next.config.ts 的 basePath 保持同一环境变量。
// next/image 在 unoptimized + output: "export" 下不会自动给 src 加 basePath，
// 内容中的绝对路径资源（图片、社交卡片、图标）需手动拼接。
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/portfolio";

export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
