import dynamic from "next/dynamic";
import Link from "next/link";
import { pageMeta, person } from "@/lib/site";
import { workProjects, labProjects } from "@/content/projects";
import { SectionTitle, Arrow, TextLink } from "@/components/ui";
import { WorkCard, LabCard, ProjectVisual } from "@/components/projects";
import { Contact } from "@/components/footer";

const SimulationPlayer = dynamic(
  () => import("@/components/simulation-player"),
);
export const metadata = pageMeta(
  "C++ / 仿真平台工程师",
  "四年交通仿真平台研发经验，关注机器人与智驾仿真工具链。让复杂系统可建模、可运行、可验证。",
  "/",
);

export default function Home() {
  const main = workProjects[0];
  return (
    <main id="main" className="container">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow accent">SIMULATION / SYSTEMS / VISUALIZATION</p>
          <p className="hero-identity">王帅鹏 · C++ / 仿真平台工程师</p>
          <h1 id="hero-title">
            让复杂系统
            <br />
            可建模、可运行、
            <br />
            可验证。
          </h1>
          <p className="hero-intro">
            四年交通仿真平台研发经验，
            <br />
            关注机器人与智驾仿真工具链。
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/work">
              查看工程案例
              <Arrow />
            </Link>
            <a className="button" href={person.resume} download>
              下载简历
              <Arrow />
            </a>
          </div>
          <p className="mono hero-stack">
            C++17 / Qt / 仿真建模 / 性能与稳定性
          </p>
        </div>
        <SimulationPlayer />
      </section>
      <section className="experience-strip" aria-label="经验摘要">
        {[
          { v: "04", t: "年商业仿真研发", d: "从专业编辑器到仿真结果链路" },
          {
            v: "跨模块",
            t: "平台闭环交付",
            d: "UI · 路网 · 数据 · 模型 · 仿真 · 接口",
          },
          {
            v: "可靠性",
            t: "贯穿设计与发布",
            d: "生命周期 · 兼容性 · 回归验证",
          },
        ].map((a) => (
          <div key={a.v}>
            <strong>{a.v}</strong>
            <p>{a.t}</p>
            <span>{a.d}</span>
          </div>
        ))}
      </section>
      <section className="section" aria-labelledby="engineering-title">
        <SectionTitle
          number="01"
          label="SELECTED ENGINEERING"
          title="在复杂系统里，把问题做透。"
          href="/work"
          action="全部案例"
        />
        <article className="featured-work">
          <Link
            href="/work/rail-transit"
            className="visual-link"
            aria-label="查看轨道交通仿真模块"
          >
            <ProjectVisual project={main} />
          </Link>
          <div className="featured-copy">
            <p className="eyebrow accent">{main.eyebrow}</p>
            <h3 id="engineering-title">
              <Link href="/work/rail-transit">{main.title}</Link>
            </h3>
            <p className="muted">{main.summary}</p>
            <div className="responsibility">
              <span className="mono">我的职责</span>
              <p>{main.role}</p>
            </div>
            <p className="mono muted">{main.stack.join(" / ")}</p>
            <TextLink href="/work/rail-transit">查看架构与技术取舍</TextLink>
          </div>
        </article>
        <div className="work-grid">
          {workProjects.slice(1).map((p) => (
            <WorkCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
      <section className="section capability-section">
        <SectionTitle
          number="02"
          label="ENGINEERING PRACTICE"
          title="技术能力，有具体问题作证。"
        />
        <div className="capability-grid">
          {[
            {
              title: "建模与运行时",
              skills: "状态机 / 模型接入 / 仿真输出",
              label: "轨道交通模块",
              href: "/work/rail-transit",
            },
            {
              title: "专业编辑与可视化",
              skills: "Qt / QML / Graphics View",
              label: "图层与拾取系统",
              href: "/work/layers-picking",
            },
            {
              title: "性能与并发",
              skills: "区间索引 / LOD / 异步快照",
              label: "GPUView",
              href: "/lab/gpuview",
            },
            {
              title: "工程质量与交付",
              skills: "回归矩阵 / 数据兼容 / 发布",
              label: "产品研发经历",
              href: "/about",
            },
          ].map((c, i) => (
            <article key={c.title}>
              <span className="mono accent">0{i + 1}</span>
              <h3>{c.title}</h3>
              <p>{c.skills}</p>
              <TextLink href={c.href}>{c.label}</TextLink>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <SectionTitle
          number="03"
          label="PERSONAL LAB"
          title="把想法，做成可运行的作品。"
          href="/lab"
          action="进入实验室"
        />
        <div className="lab-grid featured-lab">
          {labProjects.slice(0, 2).map((p) => (
            <LabCard key={p.slug} project={p} />
          ))}
        </div>
        <div className="lab-grid compact-grid">
          {labProjects.slice(2).map((p) => (
            <LabCard key={p.slug} project={p} compact />
          ))}
        </div>
      </section>
      <section className="section experience-section">
        <SectionTitle
          number="04"
          label="EXPERIENCE & NEXT"
          title="下一站，深入智能系统仿真。"
        />
        <div className="experience-row">
          <span className="mono accent">2022.09 — 2026.08</span>
          <div>
            <h3>上海济达交通科技有限公司</h3>
            <p>C++ / Qt 研发工程师 · TESSNG 核心产品研发</p>
          </div>
        </div>
        <div className="experience-row">
          <span className="mono muted">2026 / PERSONAL PRACTICE</span>
          <div>
            <h3>性能可视化与交互项目</h3>
            <p>通过公开代码、测量记录与项目说明，持续积累工程证据。</p>
          </div>
        </div>
      </section>
      <Contact />
    </main>
  );
}
