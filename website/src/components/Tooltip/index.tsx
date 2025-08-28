import { createPortal } from "react-dom";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import keyTerms from "./key-terms.json";

interface TooltipProps {
  className?: string;
  children: ReactNode;
}
interface GlossaryTerm {
  content: string;
  link: string;
}
interface GlossaryTerms {
  [key: string]: GlossaryTerm;
}

const terms: GlossaryTerms = keyTerms as GlossaryTerms;

// simple ID generator for aria-describedby
let tooltipIdCounter = 0;
function getUniqueId() {
  tooltipIdCounter += 1;
  return `tooltip-${tooltipIdCounter}`;
}

export default function Tooltip({ className, children }: TooltipProps) {
  if (!children) return null;

  const term = children.toString();
  const normalizedTerm = term
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "");
  let childText = term.toLowerCase();
  if (childText.endsWith("s")) {
    childText = childText.slice(0, -1);
  }

  const glossaryEntry = terms[childText] || terms[normalizedTerm];
  const tooltipContent = glossaryEntry?.content || "";
  const tooltipLink =
    glossaryEntry?.link || `/docs/tech-explanation/glossary#${normalizedTerm}`;

  const spanRef = useRef<HTMLSpanElement | null>(null);
  const lastIndexRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const tipIdRef = useRef(getUniqueId());

  const OFFSET = 8;

  function pickFragmentRect(el: HTMLElement, clientX: number, clientY: number) {
    const rects = Array.from(el.getClientRects());
    if (!rects.length) return null;
    const hitIndex = rects.findIndex(
      (r) => clientY >= r.top && clientY <= r.bottom
    );
    if (hitIndex >= 0) {
      lastIndexRef.current = hitIndex;
      return rects[hitIndex];
    }
    let best = 0,
      bestDist = Infinity;
    rects.forEach((r, i) => {
      const dy = clientY < r.top ? r.top - clientY : clientY - r.bottom;
      const dx = clientX < r.left ? r.left - clientX : clientX - r.right;
      const d = dy * dy + dx * dx;
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    lastIndexRef.current = best;
    return rects[best];
  }

  const updateFromPointer = (e: React.PointerEvent) => {
    const el = spanRef.current;
    if (!el) return;
    const rect = pickFragmentRect(el, e.clientX, e.clientY);
    if (!rect) return;
    setPos({
      top: rect.top + window.scrollY - OFFSET,
      left: rect.left + window.scrollX,
    });
  };

  const onEnter = (e: React.PointerEvent) => {
    updateFromPointer(e);
    setOpen(true);
  };
  const onMove = (e: React.PointerEvent) => {
    if (open) updateFromPointer(e);
  };
  const onLeave = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const h = () => {
      const el = spanRef.current;
      if (!el) return;
      const rects = el.getClientRects();
      const r = rects[lastIndexRef.current] || rects[0];
      if (r)
        setPos({
          top: r.top + window.scrollY - OFFSET,
          left: r.left + window.scrollX,
        });
    };
    window.addEventListener("resize", h);
    window.addEventListener("scroll", h, true);
    return () => {
      window.removeEventListener("resize", h);
      window.removeEventListener("scroll", h, true);
    };
  }, [open]);

  if (!tooltipContent) {
    return (
      <Link
        to={tooltipLink}
        className={clsx(styles.tooltipContainer, className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <>
      <Link
        to={tooltipLink}
        className={clsx(styles.tooltipContainer, className)}
      >
        <span
          ref={spanRef}
          className={styles.tooltipHit}
          onPointerEnter={onEnter}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          aria-describedby={open ? tipIdRef.current : undefined}
        >
          {children}
        </span>
      </Link>

      {createPortal(
        <div
          id={tipIdRef.current}
          role="tooltip"
          className={clsx(
            styles.tooltipPortal,
            open && styles.tooltipPortalOpen
          )}
          style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            transform: "translateY(-100%)",
          }}
          onPointerEnter={() => setOpen(true)}
          onPointerLeave={() => setOpen(false)}
        >
          {tooltipContent}
        </div>,
        document.body
      )}
    </>
  );
}
