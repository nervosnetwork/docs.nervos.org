import { useEffect } from "react";
import { useLocation } from "@docusaurus/router";
import {
  getSafePagePath,
  getSafeUrl,
} from "@site/src/components/AnalyticsTracking/utils";

const TRACKED_LINK_PROTOCOLS = new Set(["http:", "https:"]);

function getElementLabel(element: HTMLAnchorElement): string {
  const imageAlt = element.querySelector("img")?.getAttribute("alt");
  const label =
    element.innerText ||
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    imageAlt ||
    "";

  return label.trim().replace(/\s+/g, " ").slice(0, 100);
}

function getClickArea(element: Element): string {
  if (element.closest("main article")) {
    return "article";
  }

  if (
    element.closest(
      "aside, nav[aria-label='Docs sidebar'], .theme-doc-sidebar-container"
    )
  ) {
    return "sidebar";
  }

  if (element.closest("header, .navbar")) {
    return "navbar";
  }

  if (element.closest("footer")) {
    return "footer";
  }

  return "page";
}

export default function LinkClickTracker(): null {
  const location = useLocation();

  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element) || !window.gtag) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>("a[href]");

      if (!link) {
        return;
      }

      const linkUrl = new URL(link.href, window.location.href);

      if (!TRACKED_LINK_PROTOCOLS.has(linkUrl.protocol)) {
        return;
      }

      window.gtag("event", "link_click", {
        click_area: getClickArea(link),
        link_text: getElementLabel(link),
        link_url: getSafeUrl(linkUrl.href),
        link_domain: linkUrl.hostname,
        outbound: linkUrl.hostname !== window.location.hostname,
        page_path: getSafePagePath(location),
        page_title: document.title,
      });
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, [location.pathname, location.hash]);

  return null;
}
