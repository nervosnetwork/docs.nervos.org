import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyPullRequest,
  evaluateCommitValidation,
  renderReleaseNotes,
  resolveTargetVersion,
} from "./release-lib.mjs";

test("resolves semantic version bumps", () => {
  assert.equal(
    resolveTargetVersion({
      currentVersion: "2.49.0",
      bumpType: "minor",
      customVersion: "",
    }),
    "2.50.0"
  );
  assert.equal(
    resolveTargetVersion({
      currentVersion: "2.49.0",
      bumpType: "patch",
      customVersion: "",
    }),
    "2.49.1"
  );
  assert.equal(
    resolveTargetVersion({
      currentVersion: "2.49.0",
      bumpType: "custom",
      customVersion: "v3.0.0",
    }),
    "3.0.0"
  );
});

test("rejects an older custom version", () => {
  assert.throws(
    () =>
      resolveTargetVersion({
        currentVersion: "2.49.0",
        bumpType: "custom",
        customVersion: "2.48.0",
      }),
    /must be newer/
  );
});

test("classifies release notes from labels and conventional titles", () => {
  assert.equal(
    classifyPullRequest({ title: "docs: add a guide", labels: [] }),
    "newContent"
  );
  assert.equal(
    classifyPullRequest({ title: "fix: repair a redirect", labels: [] }),
    "fixes"
  );
  assert.equal(
    classifyPullRequest({
      title: "chore: update dependencies",
      labels: [{ name: "release:fix" }],
    }),
    "fixes"
  );
  assert.equal(
    classifyPullRequest({
      title: "chore: bump version",
      labels: [],
    }),
    "other"
  );
});

test("renders the three required release note sections", () => {
  const notes = renderReleaseNotes({
    repository: "nervosnetwork/docs.nervos.org",
    previousTag: "v2.49.0",
    tag: "v2.50.0",
    pullRequests: [
      {
        title: "fix: repair a redirect",
        labels: [],
        merged_at: "2026-07-24T01:00:00Z",
        html_url: "https://github.com/nervosnetwork/docs.nervos.org/pull/1",
        user: { login: "maintainer" },
      },
      {
        title: "chore: bump version",
        labels: [],
        merged_at: "2026-07-24T02:00:00Z",
        html_url: "https://github.com/nervosnetwork/docs.nervos.org/pull/2",
        user: { login: "release-bot" },
      },
    ],
  });

  assert.match(notes, /## New Content/);
  assert.match(notes, /No new content in this release/);
  assert.match(notes, /## Fixes/);
  assert.match(notes, /fix: repair a redirect/);
  assert.match(notes, /## Other/);
  assert.match(notes, /chore: bump version/);
  assert.match(notes, /v2\.49\.0\.\.\.v2\.50\.0/);
});

test("waits for the expected checks and fails fast on errors", () => {
  assert.deepEqual(
    evaluateCommitValidation({
      checkRuns: [
        {
          name: "node-js",
          status: "completed",
          conclusion: "success",
        },
      ],
      statuses: [{ context: "Vercel", state: "success" }],
      minimumNodeRuns: 1,
    }).state,
    "success"
  );

  assert.deepEqual(
    evaluateCommitValidation({
      checkRuns: [
        {
          name: "node-js",
          status: "completed",
          conclusion: "failure",
        },
      ],
      statuses: [{ context: "Vercel", state: "success" }],
      minimumNodeRuns: 1,
    }).state,
    "failure"
  );

  assert.deepEqual(
    evaluateCommitValidation({
      checkRuns: [
        {
          name: "node-js",
          status: "in_progress",
          conclusion: null,
        },
      ],
      statuses: [],
      minimumNodeRuns: 2,
    }).state,
    "pending"
  );
});
