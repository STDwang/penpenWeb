import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { indexable, siteUrl } from "@/lib/site";
import "./globals.css";

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
    images: ["/social-card.png"],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
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
