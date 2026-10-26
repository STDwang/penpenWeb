import Link from "next/link";
import { workProjects } from "@/content/projects";
import { FeatureCarousel } from "@/components/feature-carousel";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta(
  "工程案例",
  "交通仿真平台的轨道模块、专业编辑系统、排放可视化与微中观协同：实际界面、个人职责和验证。",
  "/work",
);

export default function WorkPage() {
  return (
    <main id="main" className="container showcase-page">
      <div className="stage-heading">
        <div><p className="future-overline">01 / SELECTED ENGINEERING</p><h1>工作成果<span>，从问题到交付。</span></h1></div>
        <Link href="/#lab">继续看个人项目 ↗</Link>
      </div>
      <FeatureCarousel projects={workProjects} label="工程案例" />
      <p className="showcase-note">画面由本人提供，对应负责的模块；具体职责、验证范围与素材说明见各案例详情。</p>
    </main>
  );
}
