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
      <div className="project-image">
        <Image
          src={project.image}
          alt={project.imageAlt || project.title}
          width={1200}
          height={750}
          priority={priority}
          sizes="(max-width: 767px) 100vw, 65vw"
        />
      </div>
    );
  if (project.diagram) return <CaseDiagram kind={project.diagram} />;
  return <ExperimentDiagram type={project.slug} />;
}
export function WorkCard({ project }: { project: Project }) {
  return (
    <article className="work-card">
      <Link
        href={projectPath(project)}
        className="visual-link"
        aria-label={`查看${project.title}`}
      >
        <ProjectVisual project={project} />
      </Link>
      <p className="eyebrow">{project.eyebrow}</p>
      <h3>
        <Link href={projectPath(project)}>{project.title}</Link>
      </h3>
      <p className="muted">{project.summary}</p>
      <TextLink href={projectPath(project)}>查看案例</TextLink>
    </article>
  );
}
export function LabCard({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  return (
    <article className={`lab-card ${compact ? "lab-compact" : ""}`}>
      {!compact ? (
        <Link
          href={projectPath(project)}
          aria-label={`查看${project.title}`}
          className="visual-link"
        >
          <ProjectVisual project={project} />
        </Link>
      ) : null}
      <div className="lab-card-copy">
        <div className="lab-card-title">
          <h3>
            <Link href={projectPath(project)}>{project.title}</Link>
          </h3>
          <Arrow />
        </div>
        <p>{project.summary}</p>
        <span className="mono">{project.stack.slice(0, 3).join(" / ")}</span>
      </div>
    </article>
  );
}
