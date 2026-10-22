import { workProjects } from "@/content/projects";
import { WorkCard } from "@/components/projects";
import { ProjectRail } from "@/components/project-rail";
import { Contact } from "@/components/footer";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta(
  "工程案例",
  "交通仿真平台的轨道模块、专业编辑系统、排放可视化与微中观协同：实际界面、个人职责和验证。",
  "/work",
);
export default function WorkPage() {
  return (
    <main id="main" className="container">
      <div className="page-intro">
        <p className="eyebrow accent">SELECTED ENGINEERING / 01</p>
        <h1>
          在复杂系统里，
          <br />
          把问题做透。
        </h1>
        <p>
          来自商业交通仿真平台的工程实践。沿着问题、架构与验证，说明我负责的工作，以及每项设计背后的取舍。
        </p>
      </div>
      <ProjectRail label="工程案例">
        {workProjects.map((p) => (
          <WorkCard key={p.slug} project={p} />
        ))}
      </ProjectRail>
      <Contact />
    </main>
  );
}
