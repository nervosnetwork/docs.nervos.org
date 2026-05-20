#!/usr/bin/env node

const fs = require("fs");

function githubToApi(url) {
  const cleaned = url.trim().replace(/[),.;]+$/, "");

  // Skip obvious truncated link-text artifacts.
  if (cleaned.includes("…") || cleaned.includes("\\u2026")) {
    return null;
  }

  let parsed;
  try {
    parsed = new URL(cleaned);
  } catch {
    return null;
  }

  if (parsed.hostname !== "github.com") {
    return null;
  }

  const parts = parsed.pathname.split("/").filter(Boolean);
  if (parts.length < 3) {
    return null;
  }

  const [org, repo, kind, ...rest] = parts;

  // Legacy edit links pointing to docs-new are not content links we validate.
  if (org === "nervosnetwork" && repo === "docs-new") {
    return null;
  }

  if (kind === "commit") {
    const sha = rest[0];
    return sha
      ? `https://api.github.com/repos/${org}/${repo}/commits/${sha}`
      : null;
  }

  if (kind === "tree" || kind === "blob") {
    const [ref, ...path] = rest;
    if (!ref || path.length === 0) {
      return null;
    }
    return `https://api.github.com/repos/${org}/${repo}/contents/${path.join(
      "/"
    )}?ref=${ref}`;
  }

  if (kind === "issues") {
    const num = rest[0];
    return num ? `https://api.github.com/repos/${org}/${repo}/issues/${num}` : null;
  }

  if (kind === "pull") {
    const num = rest[0];
    return num ? `https://api.github.com/repos/${org}/${repo}/pulls/${num}` : null;
  }

  // Convert release tag pages to tag refs, so tags without GitHub Releases won't false-fail.
  if (kind === "releases" && rest[0] === "tag") {
    const rawTag = rest.slice(1).join("/");
    if (!rawTag) {
      return null;
    }
    let normalizedTag = rawTag;
    try {
      normalizedTag = decodeURIComponent(rawTag);
    } catch {
      normalizedTag = rawTag;
    }
    return `https://api.github.com/repos/${org}/${repo}/git/ref/tags/${encodeURIComponent(
      normalizedTag
    )}`;
  }

  return null;
}

function main() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error("Usage: node convert-github-urls.js <input.txt>");
    process.exit(1);
  }

  const lines = fs.readFileSync(inputFile, "utf-8").split(/\r?\n/);

  const converted = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map(githubToApi)
    .filter(Boolean);

  console.log([...new Set(converted)].join("\n"));
}

main();
