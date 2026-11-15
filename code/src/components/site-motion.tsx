"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * 全站交互层：滚动揭示、顶部阅读进度、桌面端方块光标。
 * 所有效果只在支持动效且使用精确指针的设备上启用，触屏与减少动效偏好自动降级。
 */
export function SiteMotion() {
  const cursor = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const root = document.documentElement;
    const reveal = !reduce && "IntersectionObserver" in window;
    if (reveal) root.classList.add("nb-motion");
    // 兜底：观察器在 1.2s 内一次都没回调（脚本环境异常）时强制显示所有内容。
    // 观察器正常工作后不再触发，否则首屏以下的元素会在滚动到之前就被提前显示，揭示动效形同虚设。
    let observed = false;
    const fallback = window.setTimeout(() => { if (!observed) root.classList.remove("nb-motion"); }, 1200);
    let observer: IntersectionObserver | null = null;
    let raf = 0;

    // 入场揭示：路由切换后重新扫描，隐藏的舞台面板不参与观察。
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
    if (!reveal) {
      nodes.forEach((node) => node.classList.add("is-visible"));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          observed = true;
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
      );
      nodes.forEach((node) => observer?.observe(node));
    }

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const range = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = range > 0 ? Math.min(1, window.scrollY / range) : 0;
        document.documentElement.style.setProperty("--nb-scroll", ratio.toFixed(4));
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const onMove = (event: PointerEvent) => {
      const el = cursor.current;
      if (!el) return;
      el.style.transform = `translate3d(${event.clientX - 7}px, ${event.clientY - 7}px, 0)`;
      const target = event.target as HTMLElement | null;
      el.classList.toggle("is-hot", Boolean(target?.closest("a, button, [role='button']")));
    };
    if (fine && !reduce) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      observer?.disconnect();
      window.clearTimeout(fallback);
      root.classList.remove("nb-motion");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <>
      <div className="nb-progress" aria-hidden="true" />
      <div className="nb-cursor" ref={cursor} aria-hidden="true" />
    </>
  );
}
