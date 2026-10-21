import { labProjects } from "@/content/projects";
import { LabCard } from "@/components/projects";
import { Contact } from "@/components/footer";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta(
  "个人实验室",
  "GPUView 性能可视化、Dreamscape 程序化场景、MISTLOOP 交互原型与 ImagePlayer 图像工具。",
  "/lab",
);
export default function LabPage() {
  return (
    <main id="main" className="container">
      <div className="page-intro">
        <p className="eyebrow accent">PERSONAL LAB / 02</p>
        <h1>
          把想法，
          <br />
          做成可运行的作品。
        </h1>
        <p>
          从 C++
          性能工具到程序化场景，用公开代码、测量记录与实际画面保留探索过程。这里既有工程练习，也有使用
          AI 辅助开发的个人实验。
        </p>
      </div>
      <div className="lab-grid lab-collection">
        {labProjects.map((p) => (
          <LabCard key={p.slug} project={p} />
        ))}
      </div>
      <Contact />
    </main>
  );
}
