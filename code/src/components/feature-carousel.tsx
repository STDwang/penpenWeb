"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Project, projectPath } from "@/content/projects";
import { asset } from "@/lib/asset";
import { Arrow } from "./ui";

export function FeatureCarousel({
  projects,
  label,
  active = true,
  integrated = false,
  onIndexChange,
}: {
  projects: Project[];
  label: string;
  active?: boolean;
  integrated?: boolean;
  onIndexChange?: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const project = projects[index];

  function select(next: number) {
    const result = (next + projects.length) % projects.length;
    setIndex(result);
    onIndexChange?.(result);
  }

  return (
    <div
      className={`feature-carousel${integrated ? " feature-carousel-integrated" : ""}`}
      role="region"
      aria-roledescription="轮播图"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          select(index + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
    >
      <div
        className="feature-deck"
        onPointerDown={(event) => { dragStart.current = { x: event.clientX, y: event.clientY }; }}
        onPointerUp={(event) => {
          const start = dragStart.current;
          dragStart.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.25) select(index + (dx < 0 ? 1 : -1));
        }}
        onPointerCancel={() => { dragStart.current = null; }}
      >
        {projects.map((item, position) => {
          let offset = position - index;
          if (offset > projects.length / 2) offset -= projects.length;
          if (offset < -projects.length / 2) offset += projects.length;
          const isCurrent = position === index;
          const cardStyle = {
            "--move": `${offset * (integrated ? 104 : 72)}%`,
            "--mobile-move": `${offset * (integrated ? 77 : 95)}%`,
            "--drop": `${offset * offset * 7}px`,
            "--tilt": `${offset * (integrated ? -4 : -16)}deg`,
            "--roll": `${offset * (integrated ? -1 : -2)}deg`,
            "--scale": 1 - offset * offset * (integrated ? 0.035 : 0.075),
            zIndex: projects.length - Math.abs(offset),
            opacity: integrated && Math.abs(offset) > 1 ? 0 : 1 - Math.abs(offset) * (integrated ? 0.08 : 0.2),
          } as CSSProperties;
          const media = (
              <span className="feature-media">
                {item.image ? (
                  <Image
                    src={asset(item.image)}
                    alt={item.imageAlt || item.title}
                    width={item.imageSize?.[0] ?? 1600}
                    height={item.imageSize?.[1] ?? 900}
                    sizes="(max-width: 800px) 55vw, 26vw"
                    priority={active && position === 0}
                    draggable={false}
                  />
                ) : <span className="feature-placeholder">{item.title}</span>}
              </span>
          );
          if (integrated) return (
            <div
              key={item.slug}
              className={`feature-card${isCurrent ? " is-current" : offset < 0 ? " is-before" : " is-after"}`}
              style={cardStyle}
              onPointerMove={(event) => {
                if (event.pointerType === "touch") return;
                const rect = event.currentTarget.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                event.currentTarget.style.setProperty("--hover-x", `${((x - 0.5) * 10).toFixed(2)}deg`);
                event.currentTarget.style.setProperty("--hover-y", `${((0.5 - y) * 10).toFixed(2)}deg`);
                event.currentTarget.style.setProperty("--glint-x", `${(x * 100).toFixed(1)}%`);
                event.currentTarget.style.setProperty("--glint-y", `${(y * 100).toFixed(1)}%`);
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.setProperty("--hover-x", "0deg");
                event.currentTarget.style.setProperty("--hover-y", "0deg");
              }}
            >
              <span className="feature-card-glint" aria-hidden="true" />
              <button
                type="button"
                className="feature-card-select"
                aria-label={`显示${item.title}`}
                aria-pressed={isCurrent}
                tabIndex={isCurrent || Math.abs(offset) === 1 ? 0 : -1}
                onClick={() => { if (!isCurrent) select(position); }}
              >
                {media}
                <span className="feature-card-copy">
                  <span className="feature-card-eyebrow mono">{String(position + 1).padStart(2, "0")} / {item.eyebrow}</span>
                  <strong role="heading" aria-level={3}>{item.title}</strong>
                  <span className="feature-card-summary">{item.summary}</span>
                  <span className="feature-card-stack mono">{item.stack.slice(0, 3).join(" / ")}</span>
                </span>
              </button>
              <Link className="feature-card-detail" href={projectPath(item)} aria-label={`查看${item.title}详情`} tabIndex={Math.abs(offset) <= 1 ? 0 : -1}>查看项目详情 <Arrow /></Link>
            </div>
          );
          return (
            <button
              type="button"
              key={item.slug}
              className={`feature-card${isCurrent ? " is-current" : ""}`}
              style={cardStyle}
              aria-label={`显示${item.title}`}
              aria-pressed={isCurrent}
              tabIndex={isCurrent || Math.abs(offset) === 1 ? 0 : -1}
              onClick={() => { if (!isCurrent) select(position); }}
            >
              {media}
              <span className="feature-card-shade" />
              <span className="feature-card-index mono">{String(position + 1).padStart(2, "0")}</span>
              <span className="feature-card-title">{item.title}</span>
              <span className="feature-card-type mono">{item.category === "work" ? "ENGINEERING" : "PERSONAL LAB"}</span>
            </button>
          );
        })}
        <div className="feature-deck-axis" aria-hidden="true" />
      </div>

      {!integrated && <div className="feature-caption" aria-live="polite" aria-atomic="true">
        <div className="feature-caption-main">
          <p className="future-overline">{project.eyebrow}</p>
          <h2>{project.title}</h2>
          <p>{project.summary}</p>
          <div className="feature-caption-meta">
            <span>{project.role}</span>
            <span>{project.stack.slice(0, 3).join(" / ")}</span>
          </div>
          {project.source || project.demo ? <div className="feature-external">
            {project.source ? <a href={project.source} target="_blank" rel="noreferrer">查看源码 ↗</a> : null}
            {project.demo ? <a href={project.demo} target="_blank" rel="noreferrer">{project.demoLabel || "项目演示"} ↗</a> : null}
          </div> : null}
        </div>
        <Link className="feature-open" href={projectPath(project)} aria-label={`查看${project.title}详情`}>
          <span>探索案例</span><Arrow />
        </Link>
      </div>}

      {!integrated && <div className="feature-bottom">
        <p className="feature-credit">{project.imageCaption || "个人作品画面"}</p>
        <div className="feature-controls">
          <button type="button" aria-label={`上一项${label}`} onClick={() => select(index - 1)}>←</button>
          <span className="mono">{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
          <button type="button" aria-label={`下一项${label}`} onClick={() => select(index + 1)}>→</button>
        </div>
      </div>}
      <noscript>
        <style>{".feature-deck,.feature-controls{display:none}"}</style>
        <div className="feature-noscript">
          {projects.map((item) => <Link key={item.slug} href={projectPath(item)}>{item.title} ↗</Link>)}
        </div>
      </noscript>
    </div>
  );
}
