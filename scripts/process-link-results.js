#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const WEBSITE_DIR = path.join(REPO_ROOT, 'website');
const REPORTS_DIR = path.join(WEBSITE_DIR, 'reports', 'link-check');
const RAW_RESULTS_FILE = path.join(REPORTS_DIR, 'dead-links-raw.json');
const DEAD_LINKS_FILE = path.join(REPORTS_DIR, 'dead-links.json');
const SUMMARY_FILE = path.join(REPORTS_DIR, 'summary.json');
const HISTORY_FILE = path.join(REPORTS_DIR, 'history.jsonl');
const KNOWN_FAILURES_FILE = path.join(REPORTS_DIR, 'known-failures.json');
const IGNORED_TRANSIENT_STATUSES = new Set([429]);
const now = new Date().toISOString();

function readJson(filePath, fallbackValue) {
  if (!fs.existsSync(filePath)) {
    return fallbackValue;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.trim()) {
      return fallbackValue;
    }
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Could not read ${path.basename(filePath)}, using defaults`);
    return fallbackValue;
  }
}

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Read raw lychee results and previous outputs
const rawResults = readJson(RAW_RESULTS_FILE, {});
const previousDeadLinks = readJson(DEAD_LINKS_FILE, []);
const knownFailures = readJson(KNOWN_FAILURES_FILE, []);

// Build previous-link index so firstSeenAt is preserved.
const previousByUrl = new Map(
  previousDeadLinks
    .filter(link => link && typeof link.url === 'string')
    .map(link => [link.url, link])
);

const deadLinksByUrl = new Map();
let ignoredTransientTotal = 0;
let rawErrorTotal = 0;

if (rawResults.error_map && typeof rawResults.error_map === 'object') {
  Object.entries(rawResults.error_map).forEach(([source, errors]) => {
    if (!Array.isArray(errors)) {
      return;
    }

    errors.forEach(error => {
      rawErrorTotal += 1;
      const url = error?.url;
      if (!url) {
        return;
      }

      const statusCode = error?.status?.code ?? 'unknown';
      if (typeof statusCode === 'number' && IGNORED_TRANSIENT_STATUSES.has(statusCode)) {
        ignoredTransientTotal += 1;
        return;
      }

      if (deadLinksByUrl.has(url)) {
        return;
      }

      const previous = previousByUrl.get(url);
      deadLinksByUrl.set(url, {
        url,
        status: statusCode,
        sourceHint: source,
        firstSeenAt: previous?.firstSeenAt || now,
        lastSeenAt: now,
        note: error?.status?.text || null
      });
    });
  });
}

const deadLinks = Array.from(deadLinksByUrl.values());

// Calculate new failures (not in baseline)
const knownUrls = new Set(knownFailures.map(kf => kf.url));
const newFailures = deadLinks.filter(link => !knownUrls.has(link.url));

// Calculate recovered (in baseline but not failing now)
const currentFailingUrls = new Set(deadLinks.map(link => link.url));
const recovered = knownFailures.filter(kf => !currentFailingUrls.has(kf.url));

// Update summary
const summary = {
  runAt: now,
  scannedTotal: rawResults.total || 0,
  failedTotal: deadLinks.length,
  rawErrorTotal,
  ignoredTransientTotal,
  newFailedTotal: newFailures.length,
  recoveredTotal: recovered.length
};

// Write results
fs.writeFileSync(DEAD_LINKS_FILE, `${JSON.stringify(deadLinks, null, 2)}\n`);
fs.writeFileSync(SUMMARY_FILE, `${JSON.stringify(summary, null, 2)}\n`);

// Append to history
const historyEntry = JSON.stringify({
  timestamp: summary.runAt,
  scannedTotal: summary.scannedTotal,
  failedTotal: summary.failedTotal,
  rawErrorTotal: summary.rawErrorTotal,
  ignoredTransientTotal: summary.ignoredTransientTotal,
  newFailedTotal: summary.newFailedTotal,
  recoveredTotal: summary.recoveredTotal
});
fs.appendFileSync(HISTORY_FILE, historyEntry + '\n');

console.log(`📊 Results processed:`);
console.log(`   - Total scanned: ${summary.scannedTotal}`);
console.log(`   - Failed links: ${summary.failedTotal}`);
console.log(`   - Raw errors: ${summary.rawErrorTotal}`);
console.log(`   - Ignored transient: ${summary.ignoredTransientTotal}`);
console.log(`   - New failures: ${summary.newFailedTotal}`);
console.log(`   - Recovered: ${summary.recoveredTotal}`);