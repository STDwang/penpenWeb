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

/** One eyebrow format for the whole site: optional index number plus label. */
export function Eyebrow({
  number,
  label,
  className = "",
}: {
  number?: string;
  label: string;
  className?: string;
}) {
  return (
    <p className={`eyebrow ${className}`.trim()}>
      {number ? <span>{number}</span> : null}
      {label}
    </p>
  );
}
export function SectionTitle({
  number,
  label,
  title,
  href,
  action,
  id,
}: {
  number: string;
  label: string;
  title: string;
  href?: string;
  action?: string;
  id?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <Eyebrow number={number} label={label} />
        <h2 id={id}>{title}</h2>
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
