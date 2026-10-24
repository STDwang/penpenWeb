import Link from "next/link";
import Image from "next/image";
import { asset } from "@/lib/asset";
import { type Project, projects, projectPath } from "@/content/projects";
import { ProjectVisual, ImageCredit } from "./projects";
import { CaseDiagram } from "./diagrams";
import { Arrow, TextLink } from "./ui";
import { Contact } from "./footer";
import { ProjectRail } from "./project-rail";
import { DetailToc } from "./detail-toc";
import { Lightbox } from "./lightbox";

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
        {p.image ? (
          <Lightbox
            src={asset(p.image)}
            alt={p.imageAlt || p.title}
            label={`${p.title} 完整截图`}
          >
            <div className="detail-shot">
              <ProjectVisual project={p} priority />
              <span className="zoom-hint">放大查看 ↗</span>
            </div>
          </Lightbox>
        ) : (
          <ProjectVisual project={p} priority />
        )}
        {p.imageSource || p.imageCaption ? (
          <ImageCredit project={p} />
        ) : (
          <span className="caption">
            {p.image
              ? "本人项目实际截图"
              : "原创结构 / 功能示意 · 非公司实机界面或测量结果"}
          </span>
        )}
        {p.image ? (
          <a className="text-link" href={asset(p.image)} target="_blank" rel="noreferrer">
            在新窗口打开原图 ↗
          </a>
        ) : null}
      </div>
      {p.screenshots?.length ? (
        <section className="screenshot-gallery" aria-labelledby="screenshots-title">
          <h2 id="screenshots-title">更多运行画面</h2>
          <ProjectRail label={`${p.title} 运行截图`}>
            {p.screenshots.map((shot) => (
              <figure className="screenshot-card" key={shot.image}>
                <a href={asset(shot.image)} target="_blank" rel="noreferrer" aria-label={`查看完整截图：${shot.alt}`}>
                  <Image src={asset(shot.image)} alt={shot.alt} width={1600} height={900} sizes="(max-width: 767px) 90vw, 620px" />
                </a>
                <figcaption>{shot.caption} <a href={asset(shot.image)} target="_blank" rel="noreferrer">查看完整截图 ↗</a></figcaption>
              </figure>
            ))}
          </ProjectRail>
        </section>
      ) : null}
      <div className="detail-grid">
        <DetailToc
          items={[
            ...p.sections.map((s, i) => ({
              id: `section-${i + 1}`,
              label: s.title,
            })),
            { id: "boundary", label: "范围与说明" },
          ]}
        />
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
