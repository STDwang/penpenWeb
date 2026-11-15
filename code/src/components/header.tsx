"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Arrow, Logo } from "./ui";
import { person } from "@/lib/site";

const nav = [
  { href: "/work", homeHref: "/#work", label: "工作成果", index: "01" },
  { href: "/lab", homeHref: "/#lab", label: "个人项目", index: "02" },
  { href: "/games", homeHref: "/#games", label: "游戏橱窗", index: "03" },
  { href: "/about", homeHref: "/#contact", label: "关于", index: "04" },
  { href: person.blog, label: "博客", external: true, index: "05" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [section, setSection] = useState("");
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

  // 首页是一张长页：滚动到哪一段，导航里对应的那一项亮起。
  useEffect(() => {
    if (pathname !== "/" || !("IntersectionObserver" in window)) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setSection(entry.target.id);
          else setSection((current) => (current === entry.target.id ? "" : current));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      setSection("");
    };
  }, [pathname]);

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
          <a key={item.href} href={`#${item.homeHref.split("#")[1]}`} aria-current={section === item.homeHref.split("#")[1] ? "true" : undefined} onClick={() => setOpen(false)}><span className="mono nb-nav-index">{item.index}</span>{item.label}</a>
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
            <span className="mono nb-nav-index">{item.index}</span>
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
