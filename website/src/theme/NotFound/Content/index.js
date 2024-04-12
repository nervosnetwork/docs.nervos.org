import React from "react";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

// according to docusaurus, unwrap NotFoundContent is danger
// we can undo this after there is no broken link from v1
export default function ContentWrapper(props) {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const oldDocUrl = siteConfig.customFields.oldDocSiteUrl;
  return (
    <div className={styles.notFoundContainer}>
      <h1>Page Not Found</h1>
      <p>Are you trying to visit broken links from old doc website?</p>
      <h2>
        Try{" "}
        <a href={oldDocUrl + location.pathname}>
          {oldDocUrl + location.pathname}
        </a>{" "}
      </h2>
      <div>
        Or get help from <a href="https://discord.gg/nervosnetwork">discord</a>
      </div>
    </div>
  );
}
