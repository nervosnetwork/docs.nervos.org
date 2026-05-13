#!/usr/bin/env node
/**
 * Generate llms-full.txt from all docs source files.
 *
 * This script walks through website/docs/, reads every .md and .mdx file
 * (excluding partials that start with "_"), cleans up Docusaurus-specific
 * syntax, and concatenates them into website/static/llms-full.txt.
 */

const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "..", "website", "docs");
const OUTPUT_FILE = path.join(__dirname, "..", "website", "static", "llms-full.txt");
const LLMS_TXT = path.join(__dirname, "..", "website", "static", "llms.txt");

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) &&
      !entry.name.startsWith("_")
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

function cleanContent(content) {
  // Remove frontmatter
  content = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "");

  // Remove import statements
  content = content.replace(/^import\s+.*?\s+from\s+["'].*?["'];?\s*$/gm, "");

  // Remove multi-line self-closing components (e.g. <TutorialHeader ... \n ... />)
  const multiLineSelfClosing = [
    "TutorialHeader",
    "SetupProject",
    "SwitchToTestnet",
    "HardForkTime",
    "ScriptTools",
    "StartDevnet",
    "ConnectWallet",
    "WalletCard",
    "ImgContainer",
    "Card",
    "CardLayout",
    "TagFilter",
  ];
  for (const name of multiLineSelfClosing) {
    const re = new RegExp(`<${name}\\b[\\s\\S]*?\\/>`, "g");
    content = content.replace(re, "");
  }

  // Remove JSX component calls that are standalone on their own line
  content = content.replace(/^[ \t]*<[A-Z][A-Za-z0-9]*\b[^>]*\/>[ \t]*\n?/gm, "");

  // Remove self-closing lowercase JSX tags on their own line
  content = content.replace(/^[ \t]*<[a-z][A-Za-z0-9]*\b[^>]*\/>[ \t]*\n?/gm, "");

  // Replace inline JSX wrappers with their text content
  content = content.replace(/<Tooltip>(.*?)<\/Tooltip>/g, "$1");
  content = content.replace(/<Tooltip\s+[^>]*>(.*?)<\/Tooltip>/g, "$1");
  content = content.replace(/<ExampleLink\s+[^>]*>(.*?)<\/ExampleLink>/g, "$1");
  content = content.replace(/<Link\s+[^>]*>(.*?)<\/Link>/g, "$1");
  content = content.replace(/<div\s+[^>]*>(.*?)<\/div>/gs, "$1");
  content = content.replace(/<span\s+[^>]*>(.*?)<\/span>/gs, "$1");

  // Replace <HardForkTime ... /> with empty string
  content = content.replace(/<HardForkTime\b[^>]*\/>/g, "");

  // Remove Docusaurus Admonition wrappers
  content = content.replace(/^[ \t]*:::\s*(tip|note|warning|info|caution|danger|Attention)\s*$/gim, "");
  content = content.replace(/^[ \t]*:::\s*$/gm, "");

  // Remove empty lines at start/end and collapse multiple blank lines
  content = content.trim();
  content = content.replace(/\n{3,}/g, "\n\n");

  return content;
}

function getDocUrl(filePath) {
  const relative = path.relative(DOCS_DIR, filePath);
  const withoutExt = relative.replace(/\.(md|mdx)$/, "");
  return `https://docs.nervos.org/docs/${withoutExt}`;
}

function main() {
  const files = walk(DOCS_DIR).sort();

  let output = "# Nervos CKB Documentation — Full Corpus\n\n";
  output += "> This file contains the complete text of the Nervos CKB documentation.\n";
  output += "> It is automatically generated from the source files in the docs repository.\n";
  output += "> For a curated, selective index, see https://docs.nervos.org/llms.txt\n\n";

  // Include the curated llms.txt content at the top
  if (fs.existsSync(LLMS_TXT)) {
    const llmsContent = fs.readFileSync(LLMS_TXT, "utf-8").trim();
    output += llmsContent;
    output += "\n\n";
    output += "---\n\n";
  }

  output += "## Full Documentation Content\n\n";
  output += "The sections below contain the complete text of every documentation page,\n";
  output += "listed in alphabetical order by file path.\n\n";

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const cleaned = cleanContent(raw);
    if (!cleaned.trim()) {
      continue;
    }

    const url = getDocUrl(file);
    const relative = path.relative(DOCS_DIR, file);

    output += `---\n\n`;
    output += `## Source: ${relative}\n`;
    output += `URL: ${url}\n\n`;
    output += cleaned;
    output += "\n\n";
  }

  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
  console.log(`Generated ${OUTPUT_FILE} (${files.length} files)`);
}

main();
