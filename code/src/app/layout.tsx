import type { Metadata } from "next";
import { Archivo_Black, Bodoni_Moda, IBM_Plex_Mono, Inter, Noto_Serif_SC } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SiteMotion } from "@/components/site-motion";
import { indexable, siteUrl, absoluteUrl } from "@/lib/site";
import { asset } from "@/lib/asset";
import "./globals.css";
import "./future.css";
import "./theme-paper.css";
import "./scene.css";
import "./theme-dark.css";
// Blueprint Brutalism：最后引入，覆盖前面主题层的边框、阴影与字体。
import "./brutal.css";

// 原有编辑式字体保留给旧组件；新粗野层使用超粗无衬线展示字与等宽编号。
const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-display",
  display: "swap",
});
const displayCn = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-display-cn",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});
const displayNb = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display-nb",
  display: "swap",
});
const monoNb = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-nb",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "王帅鹏 · C++ / 仿真平台工程师", template: "%s · 王帅鹏" },
  description:
    "四年交通仿真平台研发经验，关注机器人与智驾仿真工具链。工程案例、C++/Qt 性能实践与个人实验室。",
  robots: { index: indexable, follow: indexable },
  openGraph: {
    locale: "zh_CN",
    type: "website",
    title: "王帅鹏 · C++ / 仿真平台工程师",
    url: absoluteUrl("/"),
    images: [absoluteUrl("/social-card.png")],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: asset("/icon.svg") },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth" suppressHydrationWarning className={`${display.variable} ${displayCn.variable} ${sans.variable} ${displayNb.variable} ${monoNb.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}" }} /></head>
      <body>
        <SiteMotion />
        <a className="skip-link" href="#main">
          跳至主要内容
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
