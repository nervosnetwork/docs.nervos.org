/**
 * Original source:
 * @link https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/NotFound/Content/index.tsx
 *
 * Reason for overriding:
 * - Replace contents
 */
import { useEffect } from "react";
import type { Props } from "@theme/NotFound/Content";
import { suggestedLinks } from "./linkContents";
import ThemedImage from "@theme/ThemedImage";
import styles from "./styles.module.css";
import Button from "@site/src/components/Button";
import Link from "@docusaurus/Link";

export default function NotFoundContent({ className }: Props): JSX.Element {
  const sendEvent = () => {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_title: "404 Page Not Found",
        page_location: window.location.href, // URL of the current page
        referrer: document.referrer, // URL of the previous page
      });
    }
  };

  useEffect(() => {
    sendEvent();
  }, []);

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.bgContainer}>
        <ThemedImage
          alt={"404 Error Page"}
          width={852}
          height={322}
          sources={{
            light: `/svg/404-light.svg`,
            dark: `/svg/404-dark.svg`,
          }}
        />
      </div>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.description}>
        The page you were looking for doesn’t exit. You may have mistyped the
        address or the page may have moved.
      </p>
      <Button link="/" type="primary" className={styles.priButton}>
        Back to Home Page
      </Button>
      <div className={styles.btmContent}>
        <p className={styles.description}>
          You might be interested in these sections:
        </p>
        <div className={styles.links}>
          {suggestedLinks.map((each, index) => (
            <Link className={styles.eachLink} key={index} to={each.link}>
              {each.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
