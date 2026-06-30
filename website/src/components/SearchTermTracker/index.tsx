import { useEffect, useRef } from "react";
import { useLocation } from "@docusaurus/router";
import {
  getDeveloperDestination,
  getSafePagePath,
  getSafeUrl,
  sendAnalyticsEvent,
} from "@site/src/components/AnalyticsTracking/utils";

const SEARCH_INPUT_SELECTOR = ".DocSearch-Input";
const SEARCH_RESULT_LINK_SELECTOR = ".DocSearch-Hit a";
const SELECTED_SEARCH_RESULT_SELECTOR =
  ".DocSearch-Hit[aria-selected='true'] a, .DocSearch-Hit[aria-current='true'] a";
const SEARCH_NO_RESULTS_SELECTOR = ".DocSearch-NoResults";
const SEARCH_ERROR_SELECTOR = ".DocSearch-ErrorScreen";
const SEARCH_EVENT_DELAY = 500;
const SEARCH_EVENT_MAX_WAIT = 4000;
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

function getSearchResultLinks(): HTMLAnchorElement[] {
  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>(SEARCH_RESULT_LINK_SELECTOR)
  );
}

function isSearchResultStateReady(): boolean {
  return Boolean(
    document.querySelector(SEARCH_RESULT_LINK_SELECTOR) ||
      document.querySelector(SEARCH_NO_RESULTS_SELECTOR) ||
      document.querySelector(SEARCH_ERROR_SELECTOR)
  );
}

function hasSearchError(): boolean {
  return Boolean(document.querySelector(SEARCH_ERROR_SELECTOR));
}

function getSearchResultStateSignature(): string {
  const resultLinks = getSearchResultLinks()
    .map((link) => `${link.href}:${link.textContent?.trim() || ""}`)
    .join("|");
  const noResults = document.querySelector(
    SEARCH_NO_RESULTS_SELECTOR
  )?.textContent;
  const error = document.querySelector(SEARCH_ERROR_SELECTOR)?.textContent;

  return [resultLinks, noResults, error].join("::");
}

export default function SearchTermTracker(): null {
  const location = useLocation();
  const trackedSearchTerms = useRef<Set<string>>(new Set());
  const searchEventTimer = useRef<number | null>(null);

  useEffect(() => {
    const sendSearchTermEvent = (
      searchTerm: string,
      startedAt: number,
      initialResultStateSignature: string
    ) => {
      if (!searchTerm) {
        return;
      }

      const resultStateSignature = getSearchResultStateSignature();
      const hasFreshResultState =
        resultStateSignature !== initialResultStateSignature;

      if (!hasFreshResultState || !isSearchResultStateReady()) {
        if (Date.now() - startedAt < SEARCH_EVENT_MAX_WAIT) {
          scheduleSearchTermEvent(
            searchTerm,
            startedAt,
            initialResultStateSignature
          );
        }

        return;
      }

      if (hasSearchError()) {
        return;
      }

      const pagePath = getSafePagePath(location);
      const trackingKey = `${pagePath}:${searchTerm.toLowerCase()}`;

      if (trackedSearchTerms.current.has(trackingKey)) {
        return;
      }

      trackedSearchTerms.current.add(trackingKey);
      const resultCount = getSearchResultLinks().length;
      const searchParams = {
        search_term: searchTerm,
        result_count: resultCount,
        no_results: resultCount === 0,
      };

      sendAnalyticsEvent("view_search_results", searchParams);

      if (resultCount === 0) {
        sendAnalyticsEvent("search_no_results", {
          search_term: searchTerm,
          no_results: true,
        });
      }
    };

    const scheduleSearchTermEvent = (
      searchTerm: string,
      startedAt = Date.now(),
      initialResultStateSignature = getSearchResultStateSignature()
    ) => {
      if (searchEventTimer.current !== null) {
        window.clearTimeout(searchEventTimer.current);
      }

      searchEventTimer.current = window.setTimeout(() => {
        sendSearchTermEvent(searchTerm, startedAt, initialResultStateSignature);
      }, SEARCH_EVENT_DELAY);
    };

    const handleSearchInput = (event: Event) => {
      const target = event.target;

      if (
        !(target instanceof HTMLInputElement) ||
        !target.matches(SEARCH_INPUT_SELECTOR)
      ) {
        return;
      }

      scheduleSearchTermEvent(getSafeSearchTerm(target.value));
    };

    const sendSearchSelectionEvent = (selectedLink: HTMLAnchorElement) => {
      const searchInput = document.querySelector<HTMLInputElement>(
        SEARCH_INPUT_SELECTOR
      );
      const searchTerm = getSafeSearchTerm(searchInput?.value || "");

      if (!searchTerm) {
        return;
      }

      const resultLinks = getSearchResultLinks();
      const resultRank = resultLinks.indexOf(selectedLink) + 1;
      const selectedUrl = new URL(selectedLink.href, window.location.href);

      sendAnalyticsEvent("select_search_result", {
        search_term: searchTerm,
        result_count: resultLinks.length,
        result_rank: resultRank || undefined,
        search_result_url: getSafeUrl(selectedUrl.href),
        ...getDeveloperDestination(selectedUrl),
      });
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
          ? target.closest<HTMLAnchorElement>(SEARCH_RESULT_LINK_SELECTOR)
          : document.querySelector<HTMLAnchorElement>(
              SELECTED_SEARCH_RESULT_SELECTOR
            );

      if (!selectedLink) {
        return;
      }

      sendSearchSelectionEvent(selectedLink);
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
