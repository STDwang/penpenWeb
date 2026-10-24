"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Arrow, Logo } from "./ui";
import { person } from "@/lib/site";

const nav = [
  { href: "/work", label: "工程案例" },
  { href: "/lab", label: "实验室" },
  { href: "/about", label: "关于" },
  { href: person.blog, label: "博客", external: true },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // A route change must never leave the mobile panel open behind the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && !header.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    // Keep the page behind the panel still while it covers the viewport.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header className="site-header" ref={header}>
      <Logo />
      <nav
        className={`main-nav ${open ? "is-open" : ""}`}
        id="main-navigation"
        aria-label="主导航"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              !item.external && pathname.startsWith(item.href)
                ? "page"
                : undefined
            }
            onClick={() => setOpen(false)}
            {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {item.label}
            {item.external ? <Arrow /> : null}
          </Link>
        ))}
      </nav>
      <Link className="header-resume" href="/resume" onClick={() => setOpen(false)}>
        简历
        <Arrow />
      </Link>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-label={open ? "关闭导航" : "打开导航"}
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}
