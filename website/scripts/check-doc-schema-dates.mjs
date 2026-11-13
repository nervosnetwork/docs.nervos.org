import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const buildDir =
  process.argv[2] ?? fileURLToPath(new URL("../build/", import.meta.url));

async function* htmlFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.isFile() && entry.name.endsWith(".html")) yield path;
  }
}

function* entities(value) {
  if (Array.isArray(value)) {
    for (const item of value) yield* entities(item);
  } else if (value && typeof value === "object") {
    yield value;
    if (value["@graph"]) yield* entities(value["@graph"]);
  }
}

let checked = 0;
const failures = [];
for await (const file of htmlFiles(buildDir)) {
  const html = await readFile(file, "utf8");
  const visibleDates = [
    ...html.matchAll(/<time\b[^>]*\bdatetime=["']([^"']+)["']/gi),
  ].map((match) => Date.parse(match[1]));
  const blocks = html.matchAll(
    /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  for (const block of blocks) {
    for (const entity of entities(JSON.parse(block[1]))) {
      const types = Array.isArray(entity["@type"])
        ? entity["@type"]
        : [entity["@type"]];
      if (!types.includes("TechArticle") || entity.dateModified === undefined)
        continue;
      checked++;
      const modified = Date.parse(entity.dateModified);
      if (!Number.isFinite(modified) || !visibleDates.includes(modified)) {
        failures.push(
          `${file}: dateModified ${entity.dateModified} does not match a visible update date`
        );
      }
    }
  }
}

if (checked === 0)
  failures.push("No TechArticle modification dates were checked.");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${checked} TechArticle modification dates against visible update dates.`
  );
}
