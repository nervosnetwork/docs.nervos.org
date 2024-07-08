/**
 * Original source:
 * @link https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/DocRoot/Layout/index.tsx
 *
 * Reason for overriding:
 * - Take the Sidebar component out
 */

import React, { useState, useEffect } from "react";
import { useLocation } from "@docusaurus/router";
import BackToTopButton from "@theme/BackToTopButton";
import DocRootLayoutMain from "@theme/DocRoot/Layout/Main";
import ensureActiveTabInView from "/static/js/scrollSidebar";
import type { Props } from "@theme/DocRoot/Layout";

import styles from "./styles.module.css";

export default function DocRootLayout({ children }: Props): JSX.Element {
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  const location = useLocation();

  useEffect(() => {
    ensureActiveTabInView();
  }, [location]);

  return (
    <div className={styles.docsWrapper}>
      <BackToTopButton />
      <div className={styles.docRoot}>
        <DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>
          {children}
        </DocRootLayoutMain>
      </div>
    </div>
  );
}
