"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; label: string };

/**
 * In-page table of contents that marks the section currently under the header.
 * The server-rendered list stays intact; only the active marker is client state.
 */
export function DetailToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const key = JSON.stringify(items);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // The reading line sits below the sticky header, with room for the
      // section heading itself.
      const line = window.scrollY + 190;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.offsetTop <= line) current = section.id;
      }
      setActive((old) => (old === current ? old : current));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <nav className="detail-toc" aria-label="本页目录">
      <span className="eyebrow">ON THIS PAGE</span>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "true" : undefined}
          className={active === item.id ? "is-active" : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
