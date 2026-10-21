import Link from "next/link";
import { type Project, projects, projectPath } from "@/content/projects";
import { ProjectVisual, ImageCredit } from "./projects";
import { CaseDiagram } from "./diagrams";
import { Arrow, TextLink } from "./ui";
import { Contact } from "./footer";

export function ProjectDetail({ project: p }: { project: Project }) {
  const category = p.category === "work" ? "工程案例" : "个人实验室";
  return (
    <main id="main" className="container detail-top">
      <nav className="breadcrumb" aria-label="面包屑">
        <Link href="/">首页</Link>
        <span>/</span>
        <Link href={`/${p.category}`}>{category}</Link>
        <span>/</span>
        <span>{p.title}</span>
      </nav>
      <div className="page-intro detail-intro">
        <p className="eyebrow accent">{p.eyebrow}</p>
        <h1>{p.title}</h1>
        <p>{p.summary}</p>
      </div>
      <div className="project-facts">
        <p>
          <b>我的职责</b>
          <span>{p.role}</span>
        </p>
        <p>
          <b>技术</b>
          <span>{p.stack.join(" / ")}</span>
        </p>
      </div>
      <div className="detail-outcome">
        <span className="eyebrow accent">核心交付</span>
        <p>{p.outcome}</p>
      </div>
      <div className="detail-visual">
        <ProjectVisual project={p} priority />
        {p.imageSource ? (
          <ImageCredit project={p} />
        ) : (
          <span className="caption">
            {p.image
              ? "本人项目实际截图"
              : "原创结构 / 功能示意 · 非公司实机界面或测量结果"}
          </span>
        )}
      </div>
      <div className="detail-grid">
        <nav className="detail-toc" aria-label="本页目录">
          <span className="eyebrow">ON THIS PAGE</span>
          {p.sections.map((s, i) => (
            <a key={s.title} href={`#section-${i + 1}`}>
              {s.title}
            </a>
          ))}
          <a href="#boundary">范围与说明</a>
        </nav>
        <div className="prose">
          {p.diagram ? (
            <section className="detail-architecture">
              <h2>我负责的工程链路</h2>
              <CaseDiagram kind={p.diagram} />
              <p className="caption">
                依据个人职责重绘的结构示意，不是公司源代码或性能测量结果。
              </p>
            </section>
          ) : null}
          {p.sections.map((s, i) => (
            <section key={s.title} id={`section-${i + 1}`}>
              <h2>{s.title}</h2>
              {s.paragraphs.map((t) => (
                <p key={t}>{t}</p>
              ))}
              {s.points ? (
                <ul>
                  {s.points.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          <aside id="boundary" className="boundary">
            <p>{p.boundary}</p>
          </aside>
          <div className="project-actions">
            {p.source ? (
              <a
                className="button primary"
                href={p.source}
                target="_blank"
                rel="noreferrer"
              >
                查看 GitHub 源码
                <Arrow />
              </a>
            ) : (
              <Link className="button primary" href="/resume">
                查看完整简历
                <Arrow />
              </Link>
            )}
            {p.demo ? (
              <a
                className="button"
                href={p.demo}
                target="_blank"
                rel="noreferrer"
              >
                {p.demoLabel || "打开外部演示"}
                <Arrow />
              </a>
            ) : null}
            {p.demoNote ? <p className="demo-note">{p.demoNote}</p> : null}
          </div>
        </div>
      </div>
      <section className="related">
        <h2>继续了解</h2>
        <div className="related-links">
          {projects
            .filter((q) => q.category === p.category && q.slug !== p.slug)
            .slice(0, 3)
            .map((q) => (
              <TextLink key={q.slug} href={projectPath(q)}>
                {q.title}
              </TextLink>
            ))}
        </div>
      </section>
      <Contact />
    </main>
  );
}
