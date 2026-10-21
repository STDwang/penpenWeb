import Image from "next/image";
import Link from "next/link";
import { type Project, projectPath } from "@/content/projects";
import { Arrow, TextLink } from "./ui";
import { CaseDiagram, ExperimentDiagram } from "./diagrams";

export function ProjectVisual({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  if (project.image)
    return (
      <div className={`project-image image-${project.slug}`}>
        <Image
          src={project.image}
          alt={project.imageAlt || project.title}
          width={1600}
          height={1000}
          priority={priority}
          sizes="(max-width: 767px) 90vw, (max-width: 1199px) 60vw, 620px"
        />
      </div>
    );
  if (project.diagram) return <CaseDiagram kind={project.diagram} />;
  return <ExperimentDiagram type={project.slug} />;
}

export function ImageCredit({ project }: { project: Project }) {
  if (!project.imageSource) return null;
  return (
    <p className="image-credit">
      {project.imageCaption} ·{" "}
      <a
        href={project.imageSource}
        aria-label={`${project.title}的图片来源：${project.imageSourceLabel}`}
        target="_blank"
        rel="noreferrer"
      >
        来源 ↗
      </a>
    </p>
  );
}

export function WorkCard({ project }: { project: Project }) {
  return (
    <article className="work-card portfolio-card">
      <Link
        href={projectPath(project)}
        className="visual-link"
        aria-label={`查看${project.title}`}
      >
        <ProjectVisual project={project} />
        <span className="visual-badge">商业研发 · TESSNG</span>
        <span className="visual-open" aria-hidden="true">
          <Arrow />
        </span>
      </Link>
      <ImageCredit project={project} />
      <div className="card-copy">
        <p className="eyebrow accent">{project.focus}</p>
        <h3>
          <Link href={projectPath(project)}>{project.title}</Link>
        </h3>
        <p className="card-summary">{project.summary}</p>
        <dl className="card-evidence">
          <div>
            <dt>我的职责</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>交付链路</dt>
            <dd>{project.outcome}</dd>
          </div>
        </dl>
        <div className="card-bottom">
          <div className="tech-tags">
            {project.stack.slice(0, 3).map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <TextLink href={projectPath(project)}>案例详情</TextLink>
        </div>
      </div>
    </article>
  );
}

export function LabCard({ project }: { project: Project }) {
  return (
    <article className="lab-card portfolio-card">
      <Link
        href={projectPath(project)}
        aria-label={`查看${project.title}`}
        className="visual-link"
      >
        <ProjectVisual project={project} />
        <span className="visual-badge">
          {project.image ? "实际项目画面" : "功能示意 · 非实机"}
        </span>
        <span className="visual-open" aria-hidden="true">
          <Arrow />
        </span>
      </Link>
      <div className="lab-card-copy card-copy">
        <p className="eyebrow accent">{project.focus}</p>
        <h3>
          <Link href={projectPath(project)}>{project.title}</Link>
        </h3>
        <p className="card-summary">{project.summary}</p>
        <p className="lab-outcome">{project.outcome}</p>
        <div className="tech-tags">
          {project.stack.slice(0, 3).map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="lab-card-actions">
          <TextLink href={projectPath(project)}>项目详情</TextLink>
          {project.source ? (
            <a href={project.source} target="_blank" rel="noreferrer">
              源码 ↗
            </a>
          ) : null}
          {project.demo ? (
            <a
              className="demo-link"
              href={project.demo}
              target="_blank"
              rel="noreferrer"
            >
              {project.demoLabel || "演示"} ↗
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
