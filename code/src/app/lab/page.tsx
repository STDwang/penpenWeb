import Link from "next/link";
import { labProjects } from "@/content/projects";
import { FeatureCarousel } from "@/components/feature-carousel";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta(
  "个人实验室",
  "GPUView 性能可视化、Dreamscape 程序化场景、MISTLOOP 交互原型与 ImagePlayer 图像工具。",
  "/lab",
);

export default function LabPage() {
  return (
    <main id="main" className="container showcase-page">
      <div className="stage-heading">
        <div><p className="future-overline">02 / PERSONAL LAB</p><h1>个人项目<span>，把想法做成作品。</span></h1></div>
        <Link href="/#work">继续看工作成果 ↗</Link>
      </div>
      <FeatureCarousel projects={labProjects} label="个人项目" />
      <p className="showcase-note">个人项目展示实现范围、公开源码与演示入口；图像说明见每个项目详情。</p>
    </main>
  );
}
