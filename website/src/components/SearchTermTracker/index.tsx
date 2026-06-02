import { useEffect, useRef } from "react";
import { useLocation } from "@docusaurus/router";
import {
  getSafePagePath,
  getSafeUrl,
} from "@site/src/components/AnalyticsTracking/utils";

const SEARCH_INPUT_SELECTOR = ".aa-Input";
const SEARCH_EVENT_DELAY = 1000;
const MAX_SEARCH_TERM_LENGTH = 100;
const SENSITIVE_SEARCH_PATTERNS = [
  /\b0x[a-fA-F0-9]{40,}\b/g,
  /\b[a-fA-F0-9]{64,}\b/g,
  /\bckb1[023456789acdefghjklmnpqrstuvwxyz]{20,}\b/gi,
];

function getSafeSearchTerm(value: string): string {
  return SENSITIVE_SEARCH_PATTERNS.reduce(
    (searchTerm, pattern) => searchTerm.replace(pattern, "[redacted]"),
    value.trim().replace(/\s+/g, " ")
  ).slice(0, MAX_SEARCH_TERM_LENGTH);
}

export default function SearchTermTracker(): null {
  const location = useLocation();
  const trackedSearchTerms = useRef<Set<string>>(new Set());
  const searchEventTimer = useRef<number | null>(null);

  useEffect(() => {
    const sendSearchTermEvent = (searchTerm: string) => {
      if (!window.gtag || !searchTerm) {
        return;
      }

      const pagePath = getSafePagePath(location);
      const trackingKey = `${pagePath}:${searchTerm.toLowerCase()}`;

      if (trackedSearchTerms.current.has(trackingKey)) {
        return;
      }

      trackedSearchTerms.current.add(trackingKey);
      window.gtag("event", "view_search_results", {
        search_term: searchTerm,
        page_path: pagePath,
        page_title: document.title,
      });
    };

    const handleSearchInput = (event: Event) => {
      const target = event.target;

      if (
        !(target instanceof HTMLInputElement) ||
        !target.matches(SEARCH_INPUT_SELECTOR)
      ) {
        return;
      }

      const searchTerm = getSafeSearchTerm(target.value);

      if (searchEventTimer.current !== null) {
        window.clearTimeout(searchEventTimer.current);
      }

      searchEventTimer.current = window.setTimeout(() => {
        sendSearchTermEvent(searchTerm);
      }, SEARCH_EVENT_DELAY);
    };

    const handleSearchSelection = (event: MouseEvent | KeyboardEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (
        event instanceof KeyboardEvent &&
        (event.key !== "Enter" || !target.matches(SEARCH_INPUT_SELECTOR))
      ) {
        return;
      }

      const selectedLink =
        event instanceof MouseEvent
          ? target.closest<HTMLAnchorElement>(".aa-ItemLink")
          : document.querySelector<HTMLAnchorElement>(
              ".aa-Item[aria-selected='true'] .aa-ItemLink, .aa-Item[aria-current='true'] .aa-ItemLink, .aa-ItemLink"
            );
      const searchInput = document.querySelector<HTMLInputElement>(
        SEARCH_INPUT_SELECTOR
      );
      const searchTerm = getSafeSearchTerm(searchInput?.value || "");

      if (!selectedLink || !window.gtag || !searchTerm) {
        return;
      }

      window.gtag("event", "select_search_result", {
        search_term: searchTerm,
        page_path: getSafePagePath(location),
        page_title: document.title,
        link_url: getSafeUrl(selectedLink.href),
      });
    };

    document.addEventListener("input", handleSearchInput);
    document.addEventListener("click", handleSearchSelection);
    document.addEventListener("keydown", handleSearchSelection);

    return () => {
      if (searchEventTimer.current !== null) {
        window.clearTimeout(searchEventTimer.current);
      }

      document.removeEventListener("input", handleSearchInput);
      document.removeEventListener("click", handleSearchSelection);
      document.removeEventListener("keydown", handleSearchSelection);
    };
  }, [location.pathname, location.hash]);

  return null;
}
