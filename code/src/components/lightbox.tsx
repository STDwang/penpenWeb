"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * In-page lightbox for large screenshots. Keeps the reader on the page instead of
 * opening a raw file in a new tab, and restores focus to the trigger on close.
 */
export function Lightbox({
  src,
  alt,
  label,
  children,
}: {
  src: string;
  alt: string;
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="lightbox-trigger"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      {open ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={() => setOpen(false)}
        >
          <button
            ref={closeButton}
            type="button"
            className="lightbox-close"
            aria-label="关闭大图"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} />
          </figure>
        </div>
      ) : null}
    </>
  );
}
