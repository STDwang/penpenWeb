"use client";

import { useState } from "react";
import Link from "next/link";
import { type Project, projectPath } from "@/content/projects";
import { asset } from "@/lib/asset";
import { Arrow } from "../ui";

/** 工程案例索引：行悬停或聚焦时，右侧窗口切换到对应截图。 */
export function HomeWork({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const current = projects[active];

  return (
    <div className="hm-work">
      <ol className="hm-work-list" data-reveal-group>
        {projects.map((project, index) => (
          <li key={project.slug} data-reveal>
            <Link
              href={projectPath(project)}
              className={`hm-row${index === active ? " is-active" : ""}`}
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              <span className="hm-row-index mono">{String(index + 1).padStart(2, "0")}</span>
              <span className="hm-row-main">
                <span className="hm-row-eyebrow mono">{project.eyebrow}</span>
                <strong role="heading" aria-level={3}>{project.title}</strong>
                <span className="hm-row-summary">{project.summary}</span>
                {project.image ? (
                  <img className="hm-row-thumb" src={asset(project.image)} alt="" width={project.imageSize?.[0] ?? 1600} height={project.imageSize?.[1] ?? 900} loading="lazy" />
                ) : null}
                <span className="hm-row-tags mono">{project.stack.slice(0, 3).map((item) => <i key={item}>{item}</i>)}</span>
              </span>
              <Arrow />
            </Link>
          </li>
        ))}
      </ol>

      <aside className="hm-preview" aria-hidden="true" data-reveal>
        <div className="hm-preview-bar mono">
          <span className="hm-preview-dots"><i /><i /><i /></span>
          <span>{current.slug}.png</span>
          <span>{String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
        </div>
        <div className="hm-preview-stage">
          {projects.map((project, index) => project.image ? (
            <img key={project.slug} className={index === active ? "is-active" : ""} src={asset(project.image)} alt="" width={project.imageSize?.[0] ?? 1600} height={project.imageSize?.[1] ?? 900} loading={index === 0 ? "eager" : "lazy"} />
          ) : null)}
        </div>
        <dl className="hm-preview-meta" key={current.slug}>
          <div><dt className="mono">ROLE</dt><dd>{current.role}</dd></div>
          <div><dt className="mono">DELIVERY</dt><dd>{current.outcome}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
