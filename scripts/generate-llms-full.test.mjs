import assert from "node:assert/strict";
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import test from "node:test";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const generatorPath = join(repositoryRoot, "scripts", "generate-llms-full.js");

test("paired TutorialHeader preserves its body and following documentation", () => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "llms-full-test-"));

  try {
    mkdirSync(join(fixtureRoot, "scripts"), { recursive: true });
    mkdirSync(join(fixtureRoot, "website", "docs"), { recursive: true });
    mkdirSync(join(fixtureRoot, "website", "static"), { recursive: true });
    copyFileSync(
      generatorPath,
      join(fixtureRoot, "scripts", "generate-llms-full.js")
    );
    writeFileSync(
      join(fixtureRoot, "website", "static", "llms.txt"),
      "# Index\n"
    );
    writeFileSync(
      join(fixtureRoot, "website", "docs", "wrapped-header.mdx"),
      `---
id: wrapped-header
title: Wrapped Header
---

# Wrapped Header

<TutorialHeader
  time={"10 min"}
  requiredTools={[<div key="node">Node.js</div>]}
>
  <details>Setup marker</details>
</TutorialHeader>

## Following section

Following marker

<StartDevnet />

<CodeTabs cmd={\`pnpm test\`} response={\`PASS\`} />
`
    );

    const result = spawnSync(
      process.execPath,
      [join(fixtureRoot, "scripts", "generate-llms-full.js")],
      { cwd: fixtureRoot, encoding: "utf8" }
    );
    assert.equal(result.status, 0, result.stderr);

    const output = readFileSync(
      join(fixtureRoot, "website", "static", "llms-full.txt"),
      "utf8"
    );
    assert.match(output, /\*\*Estimated Time:\*\* 10 min/);
    assert.match(output, /\*\*Required Tools:\*\* Node\.js/);
    assert.match(output, /Setup marker/);
    assert.match(output, /## Following section/);
    assert.match(output, /Following marker/);
    assert.match(output, /\*\*Command:\*\*[\s\S]*pnpm test/);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
