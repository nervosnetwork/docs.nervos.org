import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import React, { ReactNode } from "react";
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

const Tooltip: React.FC<TooltipProps> = ({ className, children }) => {
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
  const tooltipContent = glossaryEntry.content || "";
  const tooltipLink =
    glossaryEntry.link || `/docs/tech-explanation/glossary#${normalizedTerm}`;

  return (
    <Link to={tooltipLink} className={clsx(styles.tooltipContainer, className)}>
      {children}
      {tooltipContent && (
        <div className={styles.tooltipContent}>{tooltipContent}</div>
      )}
    </Link>
  );
};

export default Tooltip;
