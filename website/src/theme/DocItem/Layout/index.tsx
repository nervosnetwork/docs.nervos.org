/**
 * Original source:
 * @link https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/DocItem/Layout/index.tsx
 *
 * Reason for overriding:
 * - Move the Sidebar component to this layout
 */

import React, { useState } from "react";
import clsx from "clsx";
import { useWindowSize } from "@docusaurus/theme-common";
import { useDoc, useDocsSidebar } from "@docusaurus/theme-common/internal";
import DocRootLayoutSidebar from "@theme/DocRoot/Layout/Sidebar";
import DocItemPaginator from "@theme/DocItem/Paginator";
import DocVersionBanner from "@theme/DocVersionBanner";
import DocVersionBadge from "@theme/DocVersionBadge";
import DocItemFooter from "@theme/DocItem/Footer";
import DocItemTOCMobile from "@theme/DocItem/TOC/Mobile";
import DocItemTOCDesktop from "@theme/DocItem/TOC/Desktop";
import DocItemContent from "@theme/DocItem/Content";
import DocBreadcrumbs from "@theme/DocBreadcrumbs";
import Unlisted from "@theme/Unlisted";
import type { Props } from "@theme/DocItem/Layout";

import styles from "./styles.module.css";

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
function useDocTOC() {
  const { frontMatter, toc } = useDoc();
  const windowSize = useWindowSize();

  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;

  const mobile = canRender ? <DocItemTOCMobile /> : undefined;

  const desktop =
    canRender && windowSize === "desktop" ? <DocItemTOCDesktop /> : undefined;

  return {
    hidden,
    mobile,
    desktop,
  };
}

export default function DocItemLayout({ children }: Props): JSX.Element {
  const docTOC = useDocTOC();
  const {
    metadata: { unlisted },
  } = useDoc();
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  return (
    <div className={styles.customLayout}>
      {sidebar && (
        <DocRootLayoutSidebar
          sidebar={sidebar.items}
          hiddenSidebarContainer={hiddenSidebarContainer}
          setHiddenSidebarContainer={setHiddenSidebarContainer}
        />
      )}
      <div className={clsx(!docTOC.hidden && styles.docItemCol)}>
        {unlisted && <Unlisted />}
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      <div
        className={clsx(
          { [styles.tocDesktopInvisible]: !docTOC.desktop },
          styles.tocDesktop
        )}
      >
        {docTOC.desktop}
      </div>
    </div>
  );
}
