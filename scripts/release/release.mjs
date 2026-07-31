#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

import {
  adminMergeArguments,
  compareVersions,
  evaluateCommitValidation,
  parseVersion,
  renderReleaseNotes,
  resolveTargetVersion,
  selectReusablePullRequest,
  shouldRetryGitHubRequest,
} from "./release-lib.mjs";

const DEVELOP_BRANCH = "develop";
const MASTER_BRANCH = "master";
const PACKAGE_PATH = "website/package.json";
const DEFAULT_TIMEOUT_SECONDS = 20 * 60;
const DEFAULT_POLL_SECONDS = 15;
const DEFAULT_GET_ATTEMPTS = 4;

function requiredEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function shellQuote(value) {
  const text = String(value);
  return /^[A-Za-z0-9_./:@=-]+$/.test(text)
    ? text
    : `'${text.replaceAll("'", "'\\''")}'`;
}

function run(command, args, options = {}) {
  const { allowFailure = false, capture = true, cwd = process.cwd() } = options;
  console.log(`$ ${[command, ...args].map(shellQuote).join(" ")}`);

  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: process.env,
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0 && !allowFailure) {
    const details = [result.stdout, result.stderr]
      .filter(Boolean)
      .join("\n")
      .trim();
    throw new Error(
      `${command} exited with ${result.status}${details ? `:\n${details}` : ""}`
    );
  }

  return {
    status: result.status,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? "",
  };
}

function git(args, options = {}) {
  return run("git", args, options);
}

function readPackageVersion(filePath = PACKAGE_PATH) {
  const contents = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return parseVersion(contents.version).value;
}

function writePackageVersion(version, filePath = PACKAGE_PATH) {
  const contents = JSON.parse(fs.readFileSync(filePath, "utf8"));
  contents.version = parseVersion(version).value;
  fs.writeFileSync(filePath, `${JSON.stringify(contents, null, 2)}\n`);
}

function appendSummary(markdown) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    fs.appendFileSync(summaryPath, `${markdown.trim()}\n`);
  }
}

function encodeQuery(parameters) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(parameters)) {
    if (value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  }
  return search.toString();
}

class GitHubClient {
  constructor({ repository, token }) {
    this.repository = repository;
    this.token = token;
    this.apiUrl = process.env.GITHUB_API_URL ?? "https://api.github.com";
  }

  async request(method, endpoint, options = {}) {
    const { allow404 = false, body } = options;
    const maxAttempts = method === "GET" ? DEFAULT_GET_ATTEMPTS : 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      let response;
      try {
        response = await fetch(`${this.apiUrl}${endpoint}`, {
          method,
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${this.token}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        });
      } catch (error) {
        if (
          !shouldRetryGitHubRequest({
            attempt,
            maxAttempts,
            method,
            status: undefined,
          })
        ) {
          throw error;
        }
        console.warn(
          `${method} ${endpoint} failed (${error.message}); retrying ${attempt}/${maxAttempts}`
        );
        await delay(1000 * 2 ** (attempt - 1));
        continue;
      }

      const responseText = await response.text();
      let data = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = responseText;
        }
      }

      if (response.status === 404 && allow404) {
        return null;
      }

      if (
        shouldRetryGitHubRequest({
          attempt,
          maxAttempts,
          method,
          status: response.status,
        })
      ) {
        console.warn(
          `${method} ${endpoint} failed (${response.status}); retrying ${attempt}/${maxAttempts}`
        );
        await delay(1000 * 2 ** (attempt - 1));
        continue;
      }

      if (!response.ok) {
        const message =
          typeof data === "object" && data?.message
            ? data.message
            : responseText;
        throw new Error(
          `${method} ${endpoint} failed (${response.status}): ${message}`
        );
      }

      return data;
    }

    throw new Error(`${method} ${endpoint} exhausted all retry attempts`);
  }

  get(endpoint, options) {
    return this.request("GET", endpoint, options);
  }

  post(endpoint, body) {
    return this.request("POST", endpoint, { body });
  }

  put(endpoint, body) {
    return this.request("PUT", endpoint, { body });
  }

  async commit(ref) {
    return this.get(
      `/repos/${this.repository}/commits/${encodeURIComponent(ref)}`
    );
  }

  async ref(kind, name) {
    return this.get(`/repos/${this.repository}/git/ref/${kind}/${name}`, {
      allow404: true,
    });
  }

  async packageVersion(ref) {
    const query = encodeQuery({ ref });
    const response = await this.get(
      `/repos/${this.repository}/contents/${PACKAGE_PATH}?${query}`
    );
    const contents = Buffer.from(
      response.content.replaceAll("\n", ""),
      "base64"
    ).toString("utf8");
    return parseVersion(JSON.parse(contents).version).value;
  }

  async latestRelease() {
    return this.get(`/repos/${this.repository}/releases/latest`, {
      allow404: true,
    });
  }

  async releaseByTag(tag) {
    return this.get(
      `/repos/${this.repository}/releases/tags/${encodeURIComponent(tag)}`,
      { allow404: true }
    );
  }

  async pulls({ base, head, state = "all" }) {
    const owner = this.repository.split("/")[0];
    const normalizedHead =
      head && !head.includes(":") ? `${owner}:${head}` : head;
    const query = encodeQuery({
      base,
      head: normalizedHead,
      state,
      per_page: 100,
      sort: "updated",
      direction: "desc",
    });
    return this.get(`/repos/${this.repository}/pulls?${query}`);
  }

  async findPull({ base, head, title }) {
    const pulls = await this.pulls({ base, head });
    return selectReusablePullRequest(pulls, title);
  }

  async findMergedPullByTitle({ base, title }) {
    const pulls = await this.pulls({ base, state: "closed" });
    return (
      pulls.find(
        (pullRequest) => pullRequest.title === title && pullRequest.merged_at
      ) ?? null
    );
  }

  createPull({ base, body, head, title }) {
    return this.post(`/repos/${this.repository}/pulls`, {
      base,
      body,
      head,
      title,
    });
  }

  async mergePull(pullRequest, expectedHeadSha) {
    run(
      "gh",
      adminMergeArguments({
        expectedHeadSha,
        pullNumber: pullRequest.number,
        repository: this.repository,
      }),
      { capture: false }
    );

    const mergedPull = await this.get(
      `/repos/${this.repository}/pulls/${pullRequest.number}`
    );
    if (!mergedPull.merged_at || !mergedPull.merge_commit_sha) {
      throw new Error(
        `PR #${pullRequest.number} did not report a merge commit after gh completed`
      );
    }

    return mergedPull.merge_commit_sha;
  }

  async waitForValidation(
    sha,
    {
      minimumNodeRuns,
      pollSeconds = DEFAULT_POLL_SECONDS,
      timeoutSeconds = DEFAULT_TIMEOUT_SECONDS,
    }
  ) {
    const deadline = Date.now() + timeoutSeconds * 1000;
    let lastMessage = "";

    while (Date.now() < deadline) {
      const [checkRunsResponse, statusesResponse] = await Promise.all([
        this.get(
          `/repos/${this.repository}/commits/${sha}/check-runs?per_page=100`
        ),
        this.get(`/repos/${this.repository}/commits/${sha}/status`),
      ]);
      const evaluation = evaluateCommitValidation({
        checkRuns: checkRunsResponse.check_runs,
        statuses: statusesResponse.statuses,
        minimumNodeRuns,
      });

      if (evaluation.message !== lastMessage) {
        console.log(`Validation ${sha.slice(0, 7)}: ${evaluation.message}`);
        lastMessage = evaluation.message;
      }

      if (evaluation.state === "success") {
        return;
      }

      if (evaluation.state === "failure") {
        throw new Error(
          `Validation failed for ${sha.slice(0, 7)}: ${evaluation.message}`
        );
      }

      await delay(pollSeconds * 1000);
    }

    throw new Error(
      `Timed out after ${timeoutSeconds}s waiting for validation of ${sha}`
    );
  }

  async associatedPullRequests(commitShas) {
    const pullRequests = new Map();
    const batchSize = 10;

    for (let index = 0; index < commitShas.length; index += batchSize) {
      const batch = commitShas.slice(index, index + batchSize);
      const responses = await Promise.all(
        batch.map((sha) =>
          this.get(
            `/repos/${this.repository}/commits/${sha}/pulls?per_page=100`
          )
        )
      );

      for (const response of responses) {
        for (const pullRequest of response) {
          if (
            pullRequest.merged_at &&
            pullRequest.base?.ref === DEVELOP_BRANCH
          ) {
            pullRequests.set(pullRequest.number, pullRequest);
          }
        }
      }
    }

    return [...pullRequests.values()];
  }

  createTag(tag, sha) {
    return this.post(`/repos/${this.repository}/git/refs`, {
      ref: `refs/tags/${tag}`,
      sha,
    });
  }

  createRelease({ body, tag }) {
    return this.post(`/repos/${this.repository}/releases`, {
      body,
      draft: false,
      make_latest: "true",
      name: tag,
      prerelease: false,
      tag_name: tag,
      target_commitish: MASTER_BRANCH,
    });
  }
}

function versionPullTitle(version) {
  return `chore: bump version to ${version}`;
}

function masterPullTitle(version) {
  return `Merge ${version} into master`;
}

function runLocalReleaseValidation() {
  run("yarn", ["install", "--frozen-lockfile"], {
    capture: false,
    cwd: path.join(process.cwd(), "website"),
  });
  run("yarn", ["prettier", "--check", "package.json"], {
    capture: false,
    cwd: path.join(process.cwd(), "website"),
  });
  run("yarn", ["build"], {
    capture: false,
    cwd: path.join(process.cwd(), "website"),
  });
  git(["diff", "--check"]);

  const changedFiles = git(["diff", "--name-only"])
    .stdout.split("\n")
    .filter(Boolean);
  if (changedFiles.length !== 1 || changedFiles[0] !== PACKAGE_PATH) {
    throw new Error(
      `Version preparation changed unexpected files: ${
        changedFiles.join(", ") || "(none)"
      }`
    );
  }
}

function hasReleaseContentChanges() {
  const result = git(
    [
      "diff",
      "--quiet",
      "origin/master",
      "origin/develop",
      "--",
      ".",
      ":(exclude)website/package.json",
    ],
    { allowFailure: true }
  );

  if (![0, 1].includes(result.status)) {
    throw new Error("Unable to compare master and develop");
  }
  return result.status === 1;
}

function releaseRunMarker(runId) {
  return `<!-- release-run-id: ${runId} -->`;
}

function masterBaseMarker(sha) {
  return `<!-- release-master-base: ${sha} -->`;
}

function logPlan({
  currentVersion,
  developSha,
  developVersion,
  previousTag,
  repository,
  targetVersion,
}) {
  const tag = `v${targetVersion}`;
  appendSummary(`## Release plan: ${tag}

| Field | Value |
| --- | --- |
| Repository | \`${repository}\` |
| Previous release | \`${previousTag}\` |
| Released version | \`${currentVersion}\` |
| Develop version | \`${developVersion}\` |
| Develop snapshot | \`${developSha}\` |
| Target version | \`${targetVersion}\` |
| Release branch | \`release/${tag}\` |`);
}

async function collectReleaseNotes({
  client,
  previousTag,
  repository,
  runId,
  tag,
  targetSha,
}) {
  git(["fetch", "origin", MASTER_BRANCH, DEVELOP_BRANCH, "--tags"]);
  const commitShas = git(["rev-list", `${previousTag}..${targetSha}`])
    .stdout.split("\n")
    .filter(Boolean);
  const pullRequests = await client.associatedPullRequests(commitShas);
  const notes = renderReleaseNotes({
    previousTag,
    pullRequests,
    repository,
    tag,
  });
  return `${notes}\n\n${releaseRunMarker(runId)}`;
}

async function waitForRef(client, kind, name, timeoutSeconds = 60) {
  const deadline = Date.now() + timeoutSeconds * 1000;
  while (Date.now() < deadline) {
    const ref = await client.ref(kind, name);
    if (ref) {
      return ref;
    }
    await delay(2000);
  }
  throw new Error(`Timed out waiting for ${kind}/${name}`);
}

async function ensureVersionBranch({
  client,
  developSha,
  releaseBranch,
  targetVersion,
}) {
  const remoteRef = await client.ref("heads", releaseBranch);

  if (remoteRef) {
    const remoteVersion = await client.packageVersion(releaseBranch);
    if (remoteVersion !== targetVersion) {
      throw new Error(
        `${releaseBranch} contains version ${remoteVersion}, expected ${targetVersion}`
      );
    }
    const commit = await client.commit(remoteRef.object.sha);
    const baseSha = commit.parents?.[0]?.sha;
    if (!baseSha) {
      throw new Error(`Cannot determine the base commit of ${releaseBranch}`);
    }
    return {
      baseSha,
      headSha: remoteRef.object.sha,
      reused: true,
    };
  }

  git(["switch", "--create", releaseBranch, developSha]);
  writePackageVersion(targetVersion);
  runLocalReleaseValidation();
  git(["add", PACKAGE_PATH]);
  git(["commit", "-m", versionPullTitle(targetVersion)]);
  git(["push", "--set-upstream", "origin", releaseBranch], {
    capture: false,
  });

  const createdRef = await waitForRef(client, "heads", releaseBranch);
  return {
    baseSha: developSha,
    headSha: createdRef.object.sha,
    reused: false,
  };
}

async function ensureVersionPull({ client, releaseBranch, targetVersion }) {
  const title = versionPullTitle(targetVersion);
  let pullRequest = await client.findPull({
    base: DEVELOP_BRANCH,
    head: releaseBranch,
    title,
  });

  if (!pullRequest) {
    const otherVersionPull = (
      await client.pulls({
        base: DEVELOP_BRANCH,
        state: "open",
      })
    ).find((candidate) =>
      candidate.title.startsWith("chore: bump version to ")
    );
    if (otherVersionPull) {
      throw new Error(
        `Another version PR is already open: #${otherVersionPull.number}`
      );
    }

    pullRequest = await client.createPull({
      base: DEVELOP_BRANCH,
      body: `Automated version bump for v${targetVersion}.`,
      head: releaseBranch,
      title,
    });
  }

  return pullRequest;
}

async function ensureVersionMerged({
  branchState,
  client,
  targetVersion,
  versionPull,
}) {
  if (versionPull.merged_at) {
    return versionPull.merge_commit_sha;
  }

  const currentDevelopSha = (await client.commit(DEVELOP_BRANCH)).sha;
  if (currentDevelopSha !== branchState.baseSha) {
    throw new Error(
      `develop moved from ${branchState.baseSha} to ${currentDevelopSha} during the release. Close the version PR, delete its branch, and start a new release.`
    );
  }

  await client.waitForValidation(branchState.headSha, {
    minimumNodeRuns: 2,
  });
  return client.mergePull(versionPull, branchState.headSha);
}

async function ensureMasterPull({
  client,
  releaseDevelopSha,
  repository,
  targetVersion,
}) {
  const title = masterPullTitle(targetVersion);
  const owner = repository.split("/")[0];
  let pullRequest = await client.findPull({
    base: MASTER_BRANCH,
    head: `${owner}:${DEVELOP_BRANCH}`,
    title,
  });

  if (pullRequest) {
    return pullRequest;
  }

  const openMasterPulls = await client.pulls({
    base: MASTER_BRANCH,
    state: "open",
  });
  if (openMasterPulls.length > 0) {
    throw new Error(
      `Another PR to master is already open: #${openMasterPulls[0].number}`
    );
  }

  const masterSha = (await client.commit(MASTER_BRANCH)).sha;
  return client.createPull({
    base: MASTER_BRANCH,
    body: [
      `Automated production release for v${targetVersion}.`,
      "",
      masterBaseMarker(masterSha),
    ].join("\n"),
    head: DEVELOP_BRANCH,
    title,
  });
}

function masterBaseFromPull(pullRequest) {
  const match = /<!-- release-master-base: ([0-9a-f]{40}) -->/.exec(
    pullRequest.body ?? ""
  );
  return match?.[1] ?? pullRequest.base?.sha;
}

async function ensureMasterMerged({ client, masterPull, releaseDevelopSha }) {
  if (masterPull.merged_at) {
    return masterPull.merge_commit_sha;
  }

  const currentDevelopSha = (await client.commit(DEVELOP_BRANCH)).sha;
  if (
    currentDevelopSha !== releaseDevelopSha ||
    masterPull.head.sha !== releaseDevelopSha
  ) {
    throw new Error(
      "develop changed after the version merge; refusing to release an unvalidated snapshot"
    );
  }

  const expectedMasterSha = masterBaseFromPull(masterPull);
  const currentMasterSha = (await client.commit(MASTER_BRANCH)).sha;
  if (currentMasterSha !== expectedMasterSha) {
    throw new Error(
      `master moved from ${expectedMasterSha} to ${currentMasterSha}; recreate the release PR`
    );
  }

  await client.waitForValidation(releaseDevelopSha, {
    minimumNodeRuns: 2,
  });
  return client.mergePull(masterPull, releaseDevelopSha);
}

async function ensureTag(client, tag, targetSha) {
  const existing = await client.ref("tags", tag);
  if (!existing) {
    await client.createTag(tag, targetSha);
    return;
  }

  if (existing.object.type !== "commit" || existing.object.sha !== targetSha) {
    throw new Error(`${tag} already exists and does not point to ${targetSha}`);
  }
}

async function main() {
  const repository = requiredEnvironment("GITHUB_REPOSITORY");
  const token = requiredEnvironment("GH_TOKEN");
  const runId = requiredEnvironment("GITHUB_RUN_ID");
  const bumpType = process.env.RELEASE_BUMP?.trim() || "minor";
  const customVersion = process.env.RELEASE_VERSION?.trim() || "";
  const dryRun = process.env.RELEASE_DRY_RUN === "true";
  const refName = process.env.GITHUB_REF_NAME;

  if (refName && refName !== DEVELOP_BRANCH) {
    throw new Error(
      `The release workflow must run from ${DEVELOP_BRANCH}, not ${refName}`
    );
  }

  const client = new GitHubClient({ repository, token });
  const latestRelease = await client.latestRelease();
  if (!latestRelease) {
    throw new Error("The repository has no previous GitHub Release");
  }

  const marker = releaseRunMarker(runId);
  if (latestRelease.body?.includes(marker)) {
    console.log(
      `This workflow run already published ${latestRelease.tag_name}: ${latestRelease.html_url}`
    );
    appendSummary(`## Release already complete\n\n${latestRelease.html_url}`);
    return;
  }

  git(["fetch", "origin", DEVELOP_BRANCH, MASTER_BRANCH, "--tags"]);
  const developCommit = await client.commit(DEVELOP_BRANCH);
  const developVersion = await client.packageVersion(DEVELOP_BRANCH);
  const masterVersion = await client.packageVersion(MASTER_BRANCH);
  const previousTag = latestRelease.tag_name;
  const currentVersion = parseVersion(previousTag).value;

  if (masterVersion !== currentVersion && masterVersion !== developVersion) {
    throw new Error(
      `master version ${masterVersion} matches neither the latest Release ${currentVersion} nor develop ${developVersion}`
    );
  }

  const versionComparison = compareVersions(developVersion, currentVersion);
  if (versionComparison < 0) {
    throw new Error(
      `develop version ${developVersion} is older than ${previousTag}`
    );
  }

  let targetVersion;
  const resuming = versionComparison > 0;
  if (resuming) {
    targetVersion = developVersion;
    if (
      bumpType === "custom" &&
      parseVersion(customVersion).value !== targetVersion
    ) {
      throw new Error(
        `An in-progress release targets ${targetVersion}, not ${customVersion}`
      );
    }
    console.log(`Resuming the in-progress v${targetVersion} release`);
  } else {
    targetVersion = resolveTargetVersion({
      bumpType,
      currentVersion,
      customVersion,
    });
  }

  const tag = `v${targetVersion}`;
  const releaseBranch = `release/${tag}`;
  logPlan({
    currentVersion,
    developSha: developCommit.sha,
    developVersion,
    previousTag,
    repository,
    targetVersion,
  });

  const existingRelease = await client.releaseByTag(tag);
  if (existingRelease) {
    throw new Error(
      `${tag} already exists from another workflow run: ${existingRelease.html_url}`
    );
  }

  if (!resuming && !hasReleaseContentChanges()) {
    throw new Error(
      "develop has no unreleased content changes relative to master"
    );
  }

  if (dryRun) {
    const notes = await collectReleaseNotes({
      client,
      previousTag,
      repository,
      runId,
      tag,
      targetSha: developCommit.sha,
    });
    appendSummary(`## Dry run complete

No branches, pull requests, tags, or releases were created.

### Proposed release notes

${notes.replace(marker, "").trim()}`);
    return;
  }

  let branchState;
  let versionPull;

  if (resuming) {
    const remoteRef = await client.ref("heads", releaseBranch);
    if (remoteRef) {
      branchState = await ensureVersionBranch({
        client,
        developSha: developCommit.sha,
        releaseBranch,
        targetVersion,
      });
      versionPull = await ensureVersionPull({
        client,
        releaseBranch,
        targetVersion,
      });
    } else {
      versionPull = await client.findMergedPullByTitle({
        base: DEVELOP_BRANCH,
        title: versionPullTitle(targetVersion),
      });
      if (!versionPull) {
        throw new Error(
          `develop is already ${targetVersion}, but no matching automated version PR or release branch exists`
        );
      }
    }
  } else {
    branchState = await ensureVersionBranch({
      client,
      developSha: developCommit.sha,
      releaseBranch,
      targetVersion,
    });
    versionPull = await ensureVersionPull({
      client,
      releaseBranch,
      targetVersion,
    });
  }

  let releaseDevelopSha;
  if (versionPull.merged_at) {
    releaseDevelopSha = versionPull.merge_commit_sha;
  } else {
    releaseDevelopSha = await ensureVersionMerged({
      branchState,
      client,
      targetVersion,
      versionPull,
    });
  }

  const currentDevelopSha = (await client.commit(DEVELOP_BRANCH)).sha;
  if (currentDevelopSha !== releaseDevelopSha) {
    throw new Error(
      `develop moved after the version merge (${releaseDevelopSha} -> ${currentDevelopSha})`
    );
  }
  await client.waitForValidation(releaseDevelopSha, {
    minimumNodeRuns: 1,
  });

  const masterPull = await ensureMasterPull({
    client,
    releaseDevelopSha,
    repository,
    targetVersion,
  });
  const masterMergeSha = await ensureMasterMerged({
    client,
    masterPull,
    releaseDevelopSha,
  });

  if ((await client.packageVersion(masterMergeSha)) !== targetVersion) {
    throw new Error(
      `master merge ${masterMergeSha} does not contain version ${targetVersion}`
    );
  }

  await client.waitForValidation(masterMergeSha, {
    minimumNodeRuns: 1,
  });
  await ensureTag(client, tag, masterMergeSha);

  const notes = await collectReleaseNotes({
    client,
    previousTag,
    repository,
    runId,
    tag,
    targetSha: masterMergeSha,
  });
  const release = await client.createRelease({ body: notes, tag });
  const verifiedRelease = await client.releaseByTag(tag);
  const verifiedTag = await client.ref("tags", tag);
  const latest = await client.latestRelease();

  if (
    !verifiedRelease ||
    verifiedRelease.draft ||
    verifiedRelease.prerelease ||
    verifiedTag?.object.sha !== masterMergeSha ||
    latest?.tag_name !== tag
  ) {
    throw new Error("Final GitHub Release verification failed");
  }

  appendSummary(`## Released ${tag}

- Release: ${release.html_url}
- Version PR: ${versionPull.html_url}
- Production PR: ${masterPull.html_url}
- Commit: \`${masterMergeSha}\`
- CI and Vercel: passed`);
}

main().catch((error) => {
  console.error(error.stack ?? error.message);
  appendSummary(`## Release failed

\`\`\`
${error.message}
\`\`\`

The workflow stopped before performing any later release step. Fix the reported condition and re-run this workflow.`);
  process.exitCode = 1;
});
