import assert from "node:assert/strict";
import test from "node:test";

import {
  adminMergeArguments,
  classifyPullRequest,
  evaluateCommitValidation,
  releaseSummary,
  renderReleaseNotes,
  resolveTargetVersion,
  selectReusablePullRequest,
  shouldRetryGitHubRequest,
  shouldSkipPullRequest,
} from "./release-lib.mjs";

test("builds a guarded administrator merge command", () => {
  assert.deepEqual(
    adminMergeArguments({
      expectedHeadSha: "a".repeat(40),
      pullNumber: 877,
      repository: "nervosnetwork/docs.nervos.org",
    }),
    [
      "pr",
      "merge",
      "877",
      "--repo",
      "nervosnetwork/docs.nervos.org",
      "--admin",
      "--merge",
      "--match-head-commit",
      "a".repeat(40),
    ]
  );
});

test("ignores closed unmerged pull requests when resuming", () => {
  const closed = {
    number: 877,
    title: "chore: bump version to 2.50.0",
    state: "closed",
    merged_at: null,
  };
  const open = {
    number: 880,
    title: "chore: bump version to 2.50.0",
    state: "open",
    merged_at: null,
  };
  const merged = {
    number: 881,
    title: "chore: bump version to 2.50.0",
    state: "closed",
    merged_at: "2026-07-31T15:30:00Z",
  };

  assert.equal(
    selectReusablePullRequest([closed], closed.title),
    null
  );
  assert.equal(
    selectReusablePullRequest([closed, merged, open], closed.title),
    open
  );
  assert.equal(
    selectReusablePullRequest([closed, merged], closed.title),
    merged
  );
});

test("retries only transient read requests", () => {
  assert.equal(
    shouldRetryGitHubRequest({
      attempt: 1,
      maxAttempts: 4,
      method: "GET",
      status: undefined,
    }),
    true
  );
  assert.equal(
    shouldRetryGitHubRequest({
      attempt: 1,
      maxAttempts: 4,
      method: "GET",
      status: 502,
    }),
    true
  );
  assert.equal(
    shouldRetryGitHubRequest({
      attempt: 4,
      maxAttempts: 4,
      method: "GET",
      status: 502,
    }),
    false
  );
  assert.equal(
    shouldRetryGitHubRequest({
      attempt: 1,
      maxAttempts: 4,
      method: "POST",
      status: 502,
    }),
    false
  );
});

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

test("uses a reader-facing release note with a cleaned-title fallback", () => {
  assert.equal(
    releaseSummary({
      title: "docs(guide): add a CKB debugging guide",
      body: `## Summary

Internal implementation details.

## Release note

<!-- Optional guidance is ignored. -->
Added a CKB debugging guide with
common troubleshooting steps.

## Testing

Built the website locally.`,
    }),
    "Added a CKB debugging guide with common troubleshooting steps."
  );

  assert.equal(
    releaseSummary({
      title: "docs(guide): add a CKB debugging guide",
      body: `## Release note

<!-- Leave blank to use the pull request title. -->`,
    }),
    "add a CKB debugging guide"
  );
});

test("skips explicitly excluded and automated version pull requests", () => {
  assert.equal(
    shouldSkipPullRequest({
      title: "ci: reorganize workflows",
      labels: [{ name: "release:skip" }],
    }),
    true
  );
  assert.equal(
    shouldSkipPullRequest({
      title: "chore: bump version to 2.50.0",
      labels: [],
    }),
    true
  );
  assert.equal(
    shouldSkipPullRequest({
      title: "docs: add a guide",
      labels: [],
    }),
    false
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
        body: `## Release note

Repaired the redirect from the legacy quick-start URL.`,
        labels: [],
        merged_at: "2026-07-24T01:00:00Z",
        number: 1,
        html_url: "https://github.com/nervosnetwork/docs.nervos.org/pull/1",
        user: { login: "maintainer" },
      },
      {
        title: "chore: bump version to 2.50.0",
        labels: [],
        merged_at: "2026-07-24T02:00:00Z",
        number: 2,
        html_url: "https://github.com/nervosnetwork/docs.nervos.org/pull/2",
        user: { login: "release-bot" },
      },
    ],
  });

  assert.match(notes, /## New Content/);
  assert.match(notes, /No new content in this release/);
  assert.match(notes, /## Fixes/);
  assert.match(notes, /Repaired the redirect from the legacy quick-start URL/);
  assert.match(notes, /## Other/);
  assert.match(notes, /No other changes in this release/);
  assert.doesNotMatch(notes, /bump version/);
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
