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
