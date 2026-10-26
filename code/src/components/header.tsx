"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Arrow, Logo } from "./ui";
import { person } from "@/lib/site";

const nav = [
  { href: "/work", homeHref: "/#work", label: "工作成果" },
  { href: "/lab", homeHref: "/#lab", label: "个人项目" },
  { href: "/about", homeHref: "/#contact", label: "关于" },
  { href: person.blog, label: "博客", external: true },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  function switchTheme() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { window.localStorage.setItem("portfolio-theme", next); } catch { /* Storage may be unavailable. */ }
    document.dispatchEvent(new Event("portfolio-theme-change"));
    setTheme(next);
  }

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
        {nav.map((item) => pathname === "/" && item.homeHref ? (
          <a key={item.href} href={`#${item.homeHref.split("#")[1]}`} onClick={() => setOpen(false)}>{item.label}</a>
        ) : (
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
      <button type="button" className="theme-toggle" onClick={switchTheme} aria-label={theme === "light" ? "切换黑色主题" : "切换白色主题"} aria-pressed={theme === "dark"}>
        <span className="theme-toggle-orb" aria-hidden="true" />
        <span>{theme === "light" ? "黑色主题" : "白色主题"}</span>
      </button>
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
