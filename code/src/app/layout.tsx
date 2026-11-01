import type { Metadata } from "next";
import { Bodoni_Moda, Inter, Noto_Serif_SC } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { indexable, siteUrl, absoluteUrl } from "@/lib/site";
import { asset } from "@/lib/asset";
import "./globals.css";
import "./future.css";
import "./theme-paper.css";
import "./scene.css";
import "./theme-dark.css";

// Editorial display type: a high-contrast serif for Latin, a light Song for
// Chinese, and a neutral grotesque for the interface.
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
    <html lang="zh-CN" data-scroll-behavior="smooth" suppressHydrationWarning className={`${display.variable} ${displayCn.variable} ${sans.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}" }} /></head>
      <body>
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
