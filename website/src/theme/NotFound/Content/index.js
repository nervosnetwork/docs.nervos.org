import React, { useEffect } from "react";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";
import redirects from "./redirect.json";

// according to docusaurus, unwrap NotFoundContent is danger
// we can undo this after there is no broken link from v1
export default function ContentWrapper(props) {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const oldDocUrl = siteConfig.customFields.oldDocSiteUrl;

  const handleRedirect = (pathname) => {
    const shouldRedirect = redirects.some((pattern) =>
      pathname.includes(pattern)
    );

    if (shouldRedirect) {
      // send to analytics
      window.gtag &&
        window.gtag("event", "auto-redirect", {
          event_category: "Site Auto Redirects",
          event_label: pathname,
        });

      // redirect to old docs
      window.location.href = `${oldDocUrl}${pathname}`;
    }
  };

  useEffect(() => {
    handleRedirect(location.pathname);
  }, [location.pathname, oldDocUrl]);

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
