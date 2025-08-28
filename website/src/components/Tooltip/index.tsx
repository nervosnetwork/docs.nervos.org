import { createPortal } from "react-dom";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import keyTerms from "./key-terms.json";
import BrowserOnly from "@docusaurus/BrowserOnly";

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

export default function Tooltip(props: TooltipProps) {
  return (
    <BrowserOnly fallback={<span>{props.children}</span>}>
      {() => <TooltipClient {...props} />}
    </BrowserOnly>
  );
}

const terms: GlossaryTerms = keyTerms as GlossaryTerms;

// simple ID generator for aria-describedby
let tooltipIdCounter = 0;
function getUniqueId() {
  tooltipIdCounter += 1;
  return `tooltip-${tooltipIdCounter}`;
}

function TooltipClient({ className, children }: TooltipProps) {
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

  const spanRef = useRef<HTMLSpanElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const lastIndexRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [placement, setPlacement] = useState<"above" | "below">("above");
  const tipIdRef = useRef(getUniqueId());

  const OFFSET = 8;
  const NAVBAR_HEIGHT = 64;

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

  // Calculate and set position of the tooltip
  function placeFromRect(r: DOMRect) {
    const tipBox = tipRef.current?.getBoundingClientRect();
    const tipW = tipBox?.width || 400;
    const tipH = tipBox?.height || 88;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const TOP_GUARD = OFFSET + NAVBAR_HEIGHT;

    const spaceAbove = r.top - TOP_GUARD;
    const spaceBelow = vh - r.bottom - OFFSET;

    const canFitAbove = spaceAbove >= tipH + OFFSET;
    const canFitBelow = spaceBelow >= tipH + OFFSET;

    let top: number;
    let side: "above" | "below" = "above";

    if (canFitAbove) {
      side = "above";
      const minTopForHeader = TOP_GUARD + tipH;
      top = Math.max(r.top - OFFSET, minTopForHeader);
    } else if (canFitBelow) {
      side = "below";
      top = Math.min(r.bottom + OFFSET, vh - 8);
    } else {
      if (spaceAbove > spaceBelow) {
        side = "above";
        top = Math.max(r.top - OFFSET, TOP_GUARD + tipH);
      } else {
        side = "below";
        top = Math.min(r.bottom + OFFSET, vh - OFFSET);
      }
    }
    let left = r.left;
    const maxLeft = vw - tipW - OFFSET;
    if (left > maxLeft) left = maxLeft;
    if (left < OFFSET) left = OFFSET;

    setPos({ top, left });
    setPlacement(side);
  }

  const updateFromPointer = (e: React.PointerEvent) => {
    const el = spanRef.current;
    if (!el) return;
    const rect = pickFragmentRect(el, e.clientX, e.clientY);
    if (!rect) return;
    setPos({
      top: rect.top - OFFSET,
      left: rect.left,
    });
    setPlacement("above");
    placeFromRect(rect);
  };

  const onEnter = (e: React.PointerEvent) => {
    updateFromPointer(e);
    setOpen(true);
  };
  const onMove = (e: React.PointerEvent) => {
    if (open) updateFromPointer(e);
  };
  const onLeave = () => setOpen(false);
  const openFromFirstFragment = () => {
    const r = spanRef.current?.getClientRects()?.[0];
    if (!r) return;
    placeFromRect(r);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const h = () => {
      const el = spanRef.current;
      if (!el) return;
      const rects = el.getClientRects();
      const r = rects[lastIndexRef.current] || rects[0];
      if (r) placeFromRect(r);
    };
    window.addEventListener("resize", h);
    window.addEventListener("scroll", h, true);
    return () => {
      window.removeEventListener("resize", h);
      window.removeEventListener("scroll", h, true);
    };
  }, [open]);

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
          onFocus={openFromFirstFragment}
          onBlur={() => setOpen(false)}
          aria-describedby={open ? tipIdRef.current : undefined}
        >
          {children}
        </span>
      </Link>

      {createPortal(
        <div
          ref={tipRef}
          id={tipIdRef.current}
          role="tooltip"
          className={clsx(
            styles.tooltipPortal,
            open && styles.tooltipPortalOpen
          )}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            transform:
              placement === "above" ? "translateY(-100%)" : "translateY(0)",
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
