const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function parseVersion(value) {
  const normalized = String(value ?? "")
    .trim()
    .replace(/^v/, "");
  const match = SEMVER_PATTERN.exec(normalized);

  if (!match) {
    throw new Error(`Invalid semantic version: ${value}`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    value: normalized,
  };
}

export function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);

  return a.major - b.major || a.minor - b.minor || a.patch - b.patch;
}

export function resolveTargetVersion({
  currentVersion,
  bumpType,
  customVersion,
}) {
  const current = parseVersion(currentVersion);
  let target;

  if (bumpType === "custom") {
    target = parseVersion(customVersion);
  } else if (bumpType === "major") {
    target = parseVersion(`${current.major + 1}.0.0`);
  } else if (bumpType === "minor") {
    target = parseVersion(`${current.major}.${current.minor + 1}.0`);
  } else if (bumpType === "patch") {
    target = parseVersion(
      `${current.major}.${current.minor}.${current.patch + 1}`
    );
  } else {
    throw new Error(`Unsupported bump type: ${bumpType}`);
  }

  if (compareVersions(target.value, current.value) <= 0) {
    throw new Error(
      `Target version ${target.value} must be newer than ${current.value}`
    );
  }

  return target.value;
}

function normalizedLabels(pullRequest) {
  return (pullRequest.labels ?? []).map((label) =>
    String(typeof label === "string" ? label : label.name).toLowerCase()
  );
}

export function classifyPullRequest(pullRequest) {
  const labels = normalizedLabels(pullRequest);

  if (
    labels.some((label) =>
      [
        "release:new-content",
        "enhancement",
        "feature",
        "type: feature",
      ].includes(label)
    )
  ) {
    return "newContent";
  }

  if (
    labels.some((label) =>
      ["release:fix", "bug", "bugfix", "fix", "type: bug"].includes(label)
    )
  ) {
    return "fixes";
  }

  if (labels.includes("release:other")) {
    return "other";
  }

  const title = String(pullRequest.title ?? "").trim();

  if (/^(feat|docs)(?:\([^)]*\))?:/i.test(title)) {
    return "newContent";
  }

  if (
    /^(fix|bugfix|hotfix|correct|repair)(?:\([^)]*\))?(?::|\s|-)/i.test(title)
  ) {
    return "fixes";
  }

  return "other";
}

function releaseLine(pullRequest) {
  const author =
    pullRequest.user?.login ??
    pullRequest.author?.login ??
    pullRequest.author ??
    "unknown";
  const url = pullRequest.html_url ?? pullRequest.url;
  return `* ${pullRequest.title} by @${author} in ${url}`;
}

function section(title, pullRequests, emptyText) {
  const lines =
    pullRequests.length > 0
      ? pullRequests.map(releaseLine).join("\n")
      : `(${emptyText})`;
  return `## ${title}\n\n${lines}`;
}

export function renderReleaseNotes({
  pullRequests,
  repository,
  previousTag,
  tag,
}) {
  const categories = {
    newContent: [],
    fixes: [],
    other: [],
  };

  const sorted = [...pullRequests].sort((left, right) =>
    String(left.merged_at ?? "").localeCompare(String(right.merged_at ?? ""))
  );

  for (const pullRequest of sorted) {
    categories[classifyPullRequest(pullRequest)].push(pullRequest);
  }

  return [
    section(
      "New Content",
      categories.newContent,
      "No new content in this release"
    ),
    section("Fixes", categories.fixes, "No fixes in this release"),
    section("Other", categories.other, "No other changes in this release"),
    `**Full Changelog**: https://github.com/${repository}/compare/${previousTag}...${tag}`,
  ].join("\n\n");
}

export function evaluateCommitValidation({
  checkRuns,
  statuses,
  minimumNodeRuns,
}) {
  const nodeRuns = checkRuns.filter((run) => run.name === "node-js");
  const vercel = statuses.find((status) => status.context === "Vercel");

  const failedNodeRun = nodeRuns.find(
    (run) =>
      run.status === "completed" &&
      !["success", "neutral", "skipped"].includes(run.conclusion)
  );

  if (failedNodeRun) {
    return {
      state: "failure",
      message: `node-js concluded with ${failedNodeRun.conclusion}`,
    };
  }

  if (vercel && ["error", "failure"].includes(vercel.state)) {
    return {
      state: "failure",
      message: `Vercel concluded with ${vercel.state}`,
    };
  }

  const enoughNodeRuns = nodeRuns.length >= minimumNodeRuns;
  const nodeRunsPassed =
    enoughNodeRuns &&
    nodeRuns.every(
      (run) =>
        run.status === "completed" &&
        ["success", "neutral", "skipped"].includes(run.conclusion)
    );
  const vercelPassed = vercel?.state === "success";

  if (nodeRunsPassed && vercelPassed) {
    return {
      state: "success",
      message: `${nodeRuns.length} node-js run(s) and Vercel passed`,
    };
  }

  const pending = [];
  if (!enoughNodeRuns) {
    pending.push(`node-js checks ${nodeRuns.length}/${minimumNodeRuns}`);
  } else if (!nodeRunsPassed) {
    pending.push("node-js is still running");
  }

  if (!vercel) {
    pending.push("Vercel status has not appeared");
  } else if (!vercelPassed) {
    pending.push(`Vercel is ${vercel.state}`);
  }

  return {
    state: "pending",
    message: pending.join("; "),
  };
}
