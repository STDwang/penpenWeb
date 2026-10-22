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
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
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
      <Link className="header-resume" href="/resume">
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
