#!/usr/bin/env node

const fs = require("fs");

function githubToApi(url) {
  const m = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(.*)$/);
  if (!m) return null;

  const [, org, repo, rest] = m;

  // commit
  if (rest.startsWith("commit/")) {
    const sha = rest.split("/")[1];
    return `https://api.github.com/repos/${org}/${repo}/commits/${sha}`;
  }

  // tree (目录)
  if (rest.startsWith("tree/")) {
    const [, ref, ...path] = rest.split("/");
    return `https://api.github.com/repos/${org}/${repo}/contents/${path.join(
      "/"
    )}?ref=${ref}`;
  }

  // blob (文件)
  if (rest.startsWith("blob/")) {
    const [, ref, ...path] = rest.split("/");
    return `https://api.github.com/repos/${org}/${repo}/contents/${path.join(
      "/"
    )}?ref=${ref}`;
  }

  // issue
  if (rest.startsWith("issues/")) {
    const num = rest.split("/")[1];
    return `https://api.github.com/repos/${org}/${repo}/issues/${num}`;
  }

  // pull request
  if (rest.startsWith("pull/")) {
    const num = rest.split("/")[1];
    return `https://api.github.com/repos/${org}/${repo}/pulls/${num}`;
  }

  // release by tag
  if (rest.startsWith("releases/tag/")) {
    const tag = rest.split("/")[2];
    return `https://api.github.com/repos/${org}/${repo}/releases/tags/${tag}`;
  }

  return null; // 不支持的格式就跳过
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
