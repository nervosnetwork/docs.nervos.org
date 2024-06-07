import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import React, { useState, useEffect, ReactNode } from "react";
import { keywordList, GlossaryTerm } from "./keywordList";

interface TooltipProps {
  className?: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ className, children }) => {
  const term = children?.toString();
  const normalizedTerm = term?.toLowerCase().replace(/\s+/g, "-");
  const [tooltipContent, setTooltipContent] = useState<string>("");
  // Default link points to the Glossary
  const [tooltipLink, setTooltipLink] = useState<string>(
    `/docs/tech-explanation/glossary#${normalizedTerm}`
  );

  useEffect(() => {
    if (term) {
      let childText = term;
      // Address the plural situation
      if (childText.endsWith("s")) {
        childText = childText.slice(0, -1);
      }
      const glossaryEntry: GlossaryTerm | undefined =
        keywordList[childText] || keywordList[term];
      if (glossaryEntry) {
        setTooltipContent(glossaryEntry.content);
        if (glossaryEntry.link) {
          setTooltipLink(glossaryEntry.link);
        }
      }
    }
  }, [children]);

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
