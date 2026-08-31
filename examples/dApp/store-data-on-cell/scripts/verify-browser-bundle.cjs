const fs = require("node:fs");
const path = require("node:path");

const distDirectory = path.resolve(__dirname, "../dist");
const html = fs.readFileSync(path.join(distDirectory, "index.html"), "utf8");
const failures = [];

if (!html.includes("<title>Store Data on Cell</title>")) {
  failures.push('generated page title is not "Store Data on Cell"');
}

const scriptMatch = html.match(
  /<script[^>]+src=(?:"([^"]+)"|'([^']+)'|([^\s>]+))[^>]*>/,
);
if (!scriptMatch) {
  failures.push("generated page has no JavaScript entry");
} else {
  const scriptSource = scriptMatch[1] ?? scriptMatch[2] ?? scriptMatch[3];
  const scriptPath = path.join(distDirectory, scriptSource.replace(/^\//, ""));
  if (!fs.existsSync(scriptPath)) {
    failures.push(`generated JavaScript entry does not exist: ${scriptSource}`);
  }
}

const importPatterns = [
  /\bfrom\s*["']([^"']+)["']/g,
  /\bimport\s*["']([^"']+)["']/g,
];
for (const filename of fs
  .readdirSync(distDirectory)
  .filter((entry) => entry.endsWith(".js"))) {
  const script = fs.readFileSync(path.join(distDirectory, filename), "utf8");
  const bareImports = new Set();

  for (const pattern of importPatterns) {
    for (const match of script.matchAll(pattern)) {
      const specifier = match[1];
      if (!specifier.startsWith(".") && !specifier.startsWith("/")) {
        bareImports.add(specifier);
      }
    }
  }

  if (bareImports.size > 0) {
    failures.push(
      `${filename} contains bare imports: ${Array.from(bareImports).join(", ")}`,
    );
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Browser bundle verification passed.");
