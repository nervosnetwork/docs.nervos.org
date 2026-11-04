import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const rules = JSON.parse(await readFile("redirects.json", "utf8"));
const config = JSON.parse(await readFile("vercel.json", "utf8"));
assert.deepEqual(
  config,
  JSON.parse(await readFile("../vercel.json", "utf8")),
  "Vercel configs must agree for either project root"
);
const sources = new Map();
for (const rule of rules) {
  for (const source of [].concat(rule.from)) {
    assert.ok(!sources.has(source), `Duplicate redirect: ${source}`);
    sources.set(source, rule.to);
    const escaped = source.replace(/[()]/g, "\\$&");
    assert.ok(
      config.redirects.some(
        (r) => r.source === escaped && r.destination === rule.to && r.permanent
      ),
      `Missing HTTP redirect: ${source}`
    );
  }
  let target = rule.to;
  const visited = new Set([].concat(rule.from));
  while (sources.has(target)) {
    assert.ok(!visited.has(target), `Redirect cycle: ${target}`);
    visited.add(target);
    target = sources.get(target);
  }
}
assert.equal(
  sources.get("/docs/concepts/cell-model"),
  "/docs/ckb-fundamentals/cell-model"
);
assert.equal(
  sources.get("/docs/basics/guides/get-ckb"),
  "/docs/node/install-ckb"
);
const sitemap = await readFile("build/sitemap.xml", "utf8");
assert.ok(!sitemap.includes("/search<") && !sitemap.includes("/homeContents<"));
assert.ok(sitemap.includes("<lastmod>"));
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const titles = new Set();
for (const url of urls) {
  const pathname = new URL(url).pathname.replace(/\/$/, "");
  const html = await readFile(`build${pathname}/index.html`, "utf8");
  const title = html.match(/<title[^>]*>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `Missing/duplicate title: ${url}`);
  titles.add(title);
  const description = html.match(
    /<meta[^>]*name="description"[^>]*content="([^"]*)"/
  )?.[1];
  assert.ok(
    description &&
      ![
        "Introduction",
        "Structure",
        "&lt;TutorialHeader",
        "<TutorialHeader",
      ].includes(description),
    `Invalid description: ${url}`
  );
  assert.match(
    html,
    /property="og:image"[^>]*content="https:\/\/docs.nervos.org\/img\/social-card.png"/
  );
}
await access("build/img/social-card.png");
for (const route of ["search", "homeContents"]) {
  assert.match(
    await readFile(`build/${route}/index.html`, "utf8"),
    /name="robots"[^>]*content="noindex, follow"/
  );
}
console.log(
  `SEO checks passed for ${urls.length} sitemap pages and ${config.redirects.length} HTTP redirects.`
);
