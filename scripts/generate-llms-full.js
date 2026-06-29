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

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return { frontmatter: null, body: content, meta: {} };

  const raw = match[1];
  const meta = {};
  let currentArrayKey = null;

  function cleanValue(value) {
    value = value.trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    if (value.startsWith("'") && value.endsWith("'")) {
      return value.slice(1, -1);
    }
    return value;
  }

  for (const line of raw.split("\n")) {
    const arrayItemMatch = line.match(/^\s+-\s+(.*)$/);
    if (currentArrayKey && arrayItemMatch) {
      meta[currentArrayKey].push(cleanValue(arrayItemMatch[1]));
      continue;
    }

    const m = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (m) {
      const key = m[1];
      const value = m[2].trim();
      if (value === "") {
        meta[key] = [];
        currentArrayKey = key;
      } else {
        meta[key] = cleanValue(value);
        currentArrayKey = null;
      }
      continue;
    }

    currentArrayKey = null;
  }
  return { frontmatter: match[0], body: content.slice(match[0].length), meta };
}

function removeImportsOutsideCodeBlocks(content) {
  const lines = content.split("\n");
  let inFence = false;
  let fenceChar = "";
  const result = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const fenceMatch = trimmed.match(/^(```+|~~~+)\s*(\S*)/);
    if (fenceMatch) {
      if (!inFence) {
        inFence = true;
        fenceChar = fenceMatch[1];
      } else if (fenceMatch[1].startsWith(fenceChar)) {
        inFence = false;
        fenceChar = "";
      }
    }

    if (!inFence && /^import\s+.*?\s+from\s+["'].*?["'];?\s*$/.test(line)) {
      continue;
    }
    result.push(line);
  }

  return result.join("\n");
}

function extractCodeTabs(content) {
  // Match CodeTabs with cmd and response props.
  // Handles both backtick and brace-wrapped values, possibly spanning multiple lines.
  const re = /<CodeTabs\b[\s\S]*?\/>/g;
  return content.replace(re, (match) => {
    const cmdMatch = match.match(/cmd\s*=\s*(?:\{`([\s\S]*?)`\}|\{\s*`([\s\S]*?)`\s*\})/);
    const responseMatch = match.match(/response\s*=\s*(?:\{`([\s\S]*?)`\}|\{\s*`([\s\S]*?)`\s*\})/);
    const cmd = cmdMatch ? (cmdMatch[1] || cmdMatch[2]) : null;
    const response = responseMatch ? (responseMatch[1] || responseMatch[2]) : null;

    let out = "";
    if (cmd !== null) {
      out += `**Command:**\n\n\`\`\`bash\n${cmd.trim()}\n\`\`\`\n`;
    }
    if (response !== null) {
      if (out) out += "\n";
      out += `**Response:**\n\n\`\`\`\n${response.trim()}\n\`\`\`\n`;
    }
    return out || "";
  });
}

function extractTutorialHeader(content) {
  const re = /<TutorialHeader\b[\s\S]*?\/>/g;
  return content.replace(re, (match) => {
    const timeMatch = match.match(/time\s*=\s*\{?\s*["']([^"']+)["']\s*\}?/);
    const toolsMatch = match.match(/tools\s*=\s*\{?\s*["']([^"']+)["']\s*\}?/);
    const time = timeMatch ? timeMatch[1].trim() : null;
    const tools = toolsMatch ? toolsMatch[1].trim() : null;

    let out = "";
    if (time) {
      out += `**Estimated Time:** ${time}\n`;
    }
    if (tools) {
      out += `**Tools:** ${tools}\n`;
    }
    return out || "";
  });
}

function extractImgContainer(content) {
  const re = /<ImgContainer\b[\s\S]*?\/>/g;
  return content.replace(re, (match) => {
    const srcMatch = match.match(/src\s*=\s*\{?\s*useBaseUrl\(["']([^"']+)["']\)\s*\}?/) || match.match(/src\s*=\s*["']([^"']+)["']/);
    const altMatch = match.match(/alt\s*=\s*["']([^"']+)["']/);
    const src = srcMatch ? srcMatch[1] : null;
    const alt = altMatch ? altMatch[1] : "";
    if (src && !src.includes("props.")) {
      return `![${alt}](${src})`;
    }
    return "";
  });
}

function extractCopyLink(content) {
  const re = /<CopyLink\s+[^>]*>([\s\S]*?)<\/CopyLink>/g;
  return content.replace(re, (match, text) => {
    const urlMatch = match.match(/url\s*=\s*["']([^"']+)["']/);
    const url = urlMatch ? urlMatch[1] : "";
    const cleanText = text.replace(/\n\s*/g, " ").trim();
    return `[${cleanText}](${url})`;
  });
}

function unwrapTabs(content) {
  // Remove mdx-code-block fences and their closing backticks, line-by-line
  const lines = content.split("\n");
  const result = [];
  let inMdxBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("```mdx-code-block")) {
      inMdxBlock = true;
      continue;
    }
    if (inMdxBlock && line.trim() === "```") {
      inMdxBlock = false;
      continue;
    }
    if (inMdxBlock) {
      // Keep the inner content (Tabs/TabItem tags) — they will be cleaned below
      result.push(line);
      continue;
    }
    result.push(line);
  }

  content = result.join("\n");

  // Remove <Tabs> and </Tabs>
  content = content.replace(new RegExp("^[ \\t]*</?Tabs>\\s*\\n?", "gm"), "");

  // Convert <TabItem value="..." label="Label"> to **Label:**
  content = content.replace(/^[ \t]*<TabItem\s+[^>]*label\s*=\s*["']([^"']+)["'][^>]*>\s*\n?/gm, "**$1:**\n\n");
  content = content.replace(/^[ \t]*<TabItem\s+[^>]*>\s*\n?/gm, "");

  // Remove </TabItem>
  content = content.replace(/^[ \t]*<\/TabItem>\s*\n?/gm, "");

  return content;
}

function removeEmptyCardLayout(content) {
  // Remove CardLayout blocks that are effectively empty after inner JSX stripping
  const re = /<CardLayout\b[^>]*>[\s\S]*?<\/CardLayout>/g;
  return content.replace(re, (match) => {
    const inner = match.replace(/<CardLayout\b[^>]*>/, "").replace(/<\/CardLayout>/, "").trim();
    // If the inner content is just a map expression with no readable text in the callback body, drop it
    if (/^\{\s*\w+\.(map|slice)\s*\(/.test(inner)) {
      // Extract the callback body inside the map
      const bodyMatch = inner.match(/=>\s*\(\s*\)\s*\)/);
      if (bodyMatch) {
        return "";
      }
      // Also handle cases where the callback body is just empty after JSX stripping
      const body = inner.replace(/^\{\s*\w+\.(map|slice)\s*\([\s\S]*?=>\s*\(/, "").replace(/\)\s*\)\s*\}\s*$/, "").trim();
      if (body.length === 0 || !/[a-zA-Z]{2,}/.test(body)) {
        return "";
      }
    }
    return match;
  });
}

function cleanContent(content) {
  const { body, meta } = parseFrontmatter(content);
  let cleaned = body;

  // Remove imports, but only outside fenced code blocks
  cleaned = removeImportsOutsideCodeBlocks(cleaned);

  // Extract CodeTabs cmd/response into labeled code blocks
  cleaned = extractCodeTabs(cleaned);

  // Extract TutorialHeader metadata
  cleaned = extractTutorialHeader(cleaned);

  // Extract ImgContainer into markdown images
  cleaned = extractImgContainer(cleaned);

  // Extract CopyLink into markdown links
  cleaned = extractCopyLink(cleaned);

  // Remove multi-line self-closing components
  const multiLineSelfClosing = [
    "SetupProject",
    "SwitchToTestnet",
    "HardForkTime",
    "ScriptTools",
    "StartDevnet",
    "ConnectWallet",
    "Card",
    "TagFilter",
  ];
  for (const name of multiLineSelfClosing) {
    const re = new RegExp(`<${name}\\b[\\s\\S]*?\\/>`, "g");
    cleaned = cleaned.replace(re, "");
  }

  // Remove remaining JSX component calls that are standalone on their own line
  cleaned = cleaned.replace(/^[ \t]*<[A-Z][A-Za-z0-9]*\b[^>]*\/>[ \t]*\n?/gm, "");

  // Remove self-closing lowercase JSX tags on their own line
  cleaned = cleaned.replace(/^[ \t]*<[a-z][A-Za-z0-9]*\b[^>]*\/>[ \t]*\n?/gm, "");

  // Replace inline JSX wrappers with their text content
  cleaned = cleaned.replace(/<Tooltip>(.*?)<\/Tooltip>/g, "$1");
  cleaned = cleaned.replace(/<Tooltip\s+[^>]*>(.*?)<\/Tooltip>/g, "$1");
  cleaned = cleaned.replace(/<ExampleLink\s+[^>]*>(.*?)<\/ExampleLink>/g, "$1");
  cleaned = cleaned.replace(/<Link\s+[^>]*>(.*?)<\/Link>/g, "$1");
  cleaned = cleaned.replace(/<div\s+[^>]*>(.*?)<\/div>/gs, "$1");
  cleaned = cleaned.replace(/<span\s+[^>]*>(.*?)<\/span>/gs, "$1");

  // Replace <HardForkTime ... /> with empty string
  cleaned = cleaned.replace(/<HardForkTime\b[^>]*\/>/g, "");

  // Remove Docusaurus Admonition wrappers
  cleaned = cleaned.replace(/^[ \t]*:::\s*(tip|note|warning|info|caution|danger|Attention)\s*$/gim, "");
  cleaned = cleaned.replace(/^[ \t]*:::\s*$/gm, "");

  // Unwrap Tabs/TabItem and mdx-code-block
  cleaned = unwrapTabs(cleaned);

  // Remove empty CardLayout blocks
  cleaned = removeEmptyCardLayout(cleaned);

  // Remove empty lines at start/end and collapse multiple blank lines
  cleaned = cleaned.trim();
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return { cleaned, meta };
}

function getDocUrl(filePath, meta) {
  const relative = path.relative(DOCS_DIR, filePath);
  let withoutExt = relative.replace(/\.(md|mdx)$/, "");
  // Normalize path separators to forward slashes
  withoutExt = withoutExt.replace(/\\/g, "/");

  if (meta.slug) {
    const slug = meta.slug.replace(/^\//, "").replace(/\/$/, "");
    return `https://docs.nervos.org/docs/${slug}`;
  }

  if (meta.id) {
    const parts = withoutExt.split("/");
    parts[parts.length - 1] = meta.id;
    withoutExt = parts.join("/");
  }

  return `https://docs.nervos.org/docs/${withoutExt}`;
}

function formatPageMetadata(meta) {
  const fields = [
    ["description", "Description"],
    ["tags", "Tags"],
    ["audience", "Audience"],
    ["related", "Related"],
    ["difficulty", "Difficulty"],
    ["last_reviewed", "Last reviewed"],
  ];
  const lines = [];

  for (const [key, label] of fields) {
    const value = meta[key];
    if (Array.isArray(value) && value.length > 0) {
      lines.push(`${label}: ${value.join(", ")}`);
    } else if (typeof value === "string" && value.length > 0) {
      lines.push(`${label}: ${value}`);
    }
  }

  return lines.length > 0 ? `${lines.join("\n")}\n\n` : "";
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
    const { cleaned, meta } = cleanContent(raw);
    if (!cleaned.trim()) {
      continue;
    }

    const url = getDocUrl(file, meta);
    const relative = path.relative(DOCS_DIR, file);

    output += `---\n\n`;
    output += `## Source: ${relative}\n`;
    output += `URL: ${url}\n\n`;
    output += formatPageMetadata(meta);
    output += cleaned;
    output += "\n\n";
  }

  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
  console.log(`Generated ${OUTPUT_FILE} (${files.length} files)`);
}

main();
