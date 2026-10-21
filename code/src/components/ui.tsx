import Link from "next/link";
import type { ReactNode } from "react";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`arrow ${className}`}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 14 14 4M4 4h10v10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
export function TextLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      className="text-link"
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
      <Arrow />
    </Link>
  );
}
export function SectionTitle({
  number,
  label,
  title,
  href,
  action,
}: {
  number: string;
  label: string;
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          <span>{number}</span>
          {label}
        </p>
        <h2>{title}</h2>
      </div>
      {href && action ? <TextLink href={href}>{action}</TextLink> : null}
    </div>
  );
}
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="王帅鹏，返回首页">
      <svg
        width="20"
        height="28"
        viewBox="0 0 20 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1 25V3h8M19 3v22h-8M7 19l6-10"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
      <strong>王帅鹏</strong>
      <span>/ ENGINEER</span>
    </Link>
  );
}
