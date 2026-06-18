import { useEffect } from "react";
import {
  getDeveloperDestination,
  getLlmsFileName,
  sendAnalyticsEvent,
} from "@site/src/components/AnalyticsTracking/utils";

const TRACKED_LINK_PROTOCOLS = new Set(["http:", "https:"]);

export default function LinkClickTracker(): null {
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
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

      const llmsFile = getLlmsFileName(linkUrl.href);

      sendAnalyticsEvent("link_click", {
        ...getDeveloperDestination(linkUrl),
      });

      if (llmsFile && link.dataset.llmsActionTracked !== "true") {
        sendAnalyticsEvent("llms_file_action", {
          llms_action: link.hasAttribute("download") ? "download" : "open",
        });
      }
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  return null;
}
