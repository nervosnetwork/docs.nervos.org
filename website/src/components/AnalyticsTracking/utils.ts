export function getSafePagePath(location: {
  pathname: string;
  hash?: string;
}): string {
  return `${location.pathname}${location.hash || ""}`;
}

export function getSafeUrl(value: string): string {
  const url = new URL(value, window.location.href);
  return `${url.origin}${url.pathname}${url.hash}`;
}

type AnalyticsEventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

const CURRENT_PAGE_PATH_KEY = "ckb_docs_current_page_path";
const PREVIOUS_PAGE_PATH_KEY = "ckb_docs_previous_page_path";

function isLocalAnalyticsHost(): boolean {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "::1"
  );
}

export function getCurrentPagePath(): string {
  return `${window.location.pathname}${window.location.hash || ""}`;
}

function getSessionStorageValue(key: string): string | undefined {
  try {
    return window.sessionStorage.getItem(key) || undefined;
  } catch {
    return undefined;
  }
}

function setSessionStorageValue(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Ignore storage failures from private browsing or blocked storage.
  }
}

function removeSessionStorageValue(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignore storage failures from private browsing or blocked storage.
  }
}

export function rememberCurrentPagePath(
  pagePath: string,
  { updatePreviousPagePath = true }: { updatePreviousPagePath?: boolean } = {}
): void {
  const currentPagePath = getSessionStorageValue(CURRENT_PAGE_PATH_KEY);

  if (
    updatePreviousPagePath &&
    currentPagePath &&
    currentPagePath !== pagePath
  ) {
    setSessionStorageValue(PREVIOUS_PAGE_PATH_KEY, currentPagePath);
  } else if (!updatePreviousPagePath) {
    removeSessionStorageValue(PREVIOUS_PAGE_PATH_KEY);
  }

  setSessionStorageValue(CURRENT_PAGE_PATH_KEY, pagePath);
}

export function getPageNotFoundSourceParams(): AnalyticsEventParams {
  const pagePath = getCurrentPagePath();
  const previousPagePath = getSessionStorageValue(PREVIOUS_PAGE_PATH_KEY);
  const referrer = document.referrer;

  if (!referrer) {
    return {
      page_not_found_path: pagePath,
      previous_page_path: previousPagePath,
      referrer_type: previousPagePath ? "internal" : "direct",
    };
  }

  let referrerUrl: URL;

  try {
    referrerUrl = new URL(referrer);
  } catch {
    return {
      page_not_found_path: pagePath,
      previous_page_path: previousPagePath,
      referrer_type: previousPagePath ? "internal" : "unknown",
    };
  }

  const isInternalReferrer = referrerUrl.origin === window.location.origin;

  return {
    page_not_found_path: pagePath,
    previous_page_path: previousPagePath,
    referrer_type: isInternalReferrer ? "internal" : "external",
    referrer_url: referrerUrl.href,
  };
}

export function sendAnalyticsEvent(
  eventName: string,
  params: AnalyticsEventParams
): void {
  if (
    typeof window === "undefined" ||
    typeof window.gtag !== "function" ||
    isLocalAnalyticsHost()
  ) {
    return;
  }

  window.gtag(
    "event",
    eventName,
    Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    )
  );
}

export function getLlmsFileName(value: string): string | undefined {
  const url = new URL(value, window.location.href);
  const fileName = url.pathname.split("/").pop();

  if (fileName === "llms.txt" || fileName === "llms-full.txt") {
    return fileName;
  }

  return undefined;
}

export function getLlmsFileNameFromText(value: string): string | undefined {
  const hasLlms = /\/llms\.txt\b|https?:\/\/[^\s]+\/llms\.txt\b/.test(value);
  const hasLlmsFull =
    /\/llms-full\.txt\b|https?:\/\/[^\s]+\/llms-full\.txt\b/.test(value);

  if (hasLlms && hasLlmsFull) {
    return "multiple";
  }

  if (hasLlmsFull) {
    return "llms-full.txt";
  }

  if (hasLlms) {
    return "llms.txt";
  }

  return undefined;
}

const DOC_DESTINATION_CATEGORIES: Array<{
  destination_category: string;
  prefixes: string[];
}> = [
  {
    destination_category: "getting_started",
    prefixes: [
      "getting-started/how-ckb-works",
      "getting-started/quick-start",
      "getting-started/ckb-networks",
      "getting-started/rpcs",
    ],
  },
  {
    destination_category: "sdk_devtools",
    prefixes: ["sdk-and-devtool"],
  },
  {
    destination_category: "ai_agents",
    prefixes: ["ai-agents"],
  },
  {
    destination_category: "build_dapp",
    prefixes: ["dapp"],
  },
  {
    destination_category: "integrate_wallets",
    prefixes: ["integrate-wallets"],
  },
  {
    destination_category: "serialization",
    prefixes: ["serialization"],
  },
  {
    destination_category: "how_tos",
    prefixes: ["how-tos"],
  },
  {
    destination_category: "script",
    prefixes: ["script"],
  },
  {
    destination_category: "script",
    prefixes: ["ecosystem-scripts"],
  },
  {
    destination_category: "what_makes_ckb_unique",
    prefixes: ["ckb-features"],
  },
  {
    destination_category: "ckb_fundamentals",
    prefixes: ["ckb-fundamentals"],
  },
  {
    destination_category: "resources",
    prefixes: ["tech-explanation/glossary"],
  },
  {
    destination_category: "core_structures",
    prefixes: ["tech-explanation"],
  },
  {
    destination_category: "assets_token_standards",
    prefixes: ["assets-token-standards"],
  },
  {
    destination_category: "ecosystem",
    prefixes: ["ecosystem/projects", "ecosystem/organizations"],
  },
  {
    destination_category: "contribution",
    prefixes: ["ecosystem/contribute"],
  },
  {
    destination_category: "run_a_node",
    prefixes: ["node"],
  },
  {
    destination_category: "history_hard_forks",
    prefixes: ["history-and-hard-forks"],
  },
  {
    destination_category: "mining",
    prefixes: ["mining"],
  },
];

function getDocDestinationCategory(pathname: string): string | undefined {
  const docPath = pathname.replace(/^\/docs\/?/, "").replace(/\/$/, "");

  return DOC_DESTINATION_CATEGORIES.find(({ prefixes }) =>
    prefixes.some(
      (prefix) => docPath === prefix || docPath.startsWith(`${prefix}/`)
    )
  )?.destination_category;
}

export function getDeveloperDestination(url: URL): {
  destination_category: string;
} {
  const hostname = url.hostname.replace(/^www\./, "");
  const pathname = url.pathname.toLowerCase();
  const isInternalDocsLink = hostname === window.location.hostname;

  if (
    getLlmsFileName(url.href) ||
    hostname === "ckb-ai.ckbdev.com" ||
    hostname === "mcp.ckbdev.com"
  ) {
    return {
      destination_category: "ai_agents",
    };
  }

  if (isInternalDocsLink && pathname.startsWith("/docs")) {
    return {
      destination_category: getDocDestinationCategory(pathname) || "other",
    };
  }

  if (hostname === "github.com") {
    return {
      destination_category: pathname.includes("/discussions")
        ? "community"
        : "source_repository",
    };
  }

  if (
    hostname === "discord.gg" ||
    hostname === "t.me" ||
    hostname === "talk.nervos.org"
  ) {
    return {
      destination_category: "community",
    };
  }

  return {
    destination_category: "other",
  };
}
