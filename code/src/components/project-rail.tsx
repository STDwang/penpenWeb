"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export function ProjectRail({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const count = Children.count(children);
  const [position, setPosition] = useState({
    index: 1,
    start: true,
    end: count < 2,
  });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const step =
      (el.firstElementChild?.getBoundingClientRect().width || 1) +
      parseFloat(getComputedStyle(el).columnGap || "0");
    const end = el.scrollLeft >= max - 2;
    const start = el.scrollLeft <= 2;
    const index =
      end && max > 0
        ? count
        : Math.min(count, Math.round(el.scrollLeft / step) + 1);
    setPosition((old) =>
      old.index === index && old.start === start && old.end === end
        ? old
        : { index, start, end },
    );
  }, [count]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    return () => observer.disconnect();
  }, [measure]);

  function move(direction: number) {
    const el = track.current;
    if (!el) return;
    const step =
      (el.firstElementChild?.getBoundingClientRect().width || el.clientWidth) +
      parseFloat(getComputedStyle(el).columnGap || "0");
    el.scrollBy({
      left: direction * step,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <div className="project-rail" role="region" aria-label={label}>
      <noscript>
        <style>{".rail-controls button,.rail-instruction{display:none}"}</style>
      </noscript>
      <div className="rail-toolbar">
        <p>
          <span className="rail-hint">向右探索</span>
          <span className="rail-instruction">触屏滑动 / 触控板 / 方向键</span>
        </p>
        <div className="rail-controls">
          <span className="mono" aria-live="polite" aria-atomic="true">
            {String(position.index).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label={`上一项${label}`}
            disabled={position.start}
            onClick={() => move(-1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label={`下一项${label}`}
            disabled={position.end}
            onClick={() => move(1)}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={track}
        className="rail-track"
        role="list"
        aria-label={`${label}卡片，使用左右方向键浏览`}
        tabIndex={0}
        onScroll={measure}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            event.currentTarget.scrollTo({
              left: event.key === "Home" ? 0 : event.currentTarget.scrollWidth,
              behavior: "instant",
            });
          }
        }}
      >
        {Children.map(children, (child) => (
          <div className="rail-slide" role="listitem">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
