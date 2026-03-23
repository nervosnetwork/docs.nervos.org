#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REPORTS_DIR = 'reports/link-check';
const RAW_RESULTS_FILE = path.join(REPORTS_DIR, 'dead-links-raw.json');
const DEAD_LINKS_FILE = path.join(REPORTS_DIR, 'dead-links.json');
const SUMMARY_FILE = path.join(REPORTS_DIR, 'summary.json');
const HISTORY_FILE = path.join(REPORTS_DIR, 'history.jsonl');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Read raw lychee results
let rawResults = {};
if (fs.existsSync(RAW_RESULTS_FILE)) {
  try {
    const content = fs.readFileSync(RAW_RESULTS_FILE, 'utf-8');
    if (content.trim()) {
      rawResults = JSON.parse(content);
    }
  } catch (error) {
    console.error('Error parsing raw results:', error.message);
    process.exit(1);
  }
}

// Extract failed links from error_map
const deadLinks = [];
if (rawResults.error_map) {
  Object.entries(rawResults.error_map).forEach(([source, errors]) => {
    errors.forEach(error => {
      deadLinks.push({
        url: error.url,
        status: error.status?.code || 'unknown',
        sourceHint: source,
        firstSeenAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        note: error.status?.text || null
      });
    });
  });
}

// Read previous summary to calculate deltas
let previousSummary = { failedTotal: 0 };
if (fs.existsSync(SUMMARY_FILE)) {
  try {
    previousSummary = JSON.parse(fs.readFileSync(SUMMARY_FILE, 'utf-8'));
  } catch (error) {
    console.warn('Could not read previous summary, using defaults');
  }
}

// Read known failures baseline
let knownFailures = [];
if (fs.existsSync(path.join(REPORTS_DIR, 'known-failures.json'))) {
  try {
    knownFailures = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, 'known-failures.json'), 'utf-8'));
  } catch (error) {
    console.warn('Could not read known failures, using empty list');
  }
}

// Calculate new failures (not in baseline)
const knownUrls = new Set(knownFailures.map(kf => kf.url));
const newFailures = deadLinks.filter(link => !knownUrls.has(link.url));

// Calculate recovered (in baseline but not failing now)
const currentFailingUrls = new Set(deadLinks.map(link => link.url));
const recovered = knownFailures.filter(kf => !currentFailingUrls.has(kf.url));

// Update summary
const summary = {
  runAt: new Date().toISOString(),
  scannedTotal: rawResults.total || 0,
  failedTotal: deadLinks.length,
  newFailedTotal: newFailures.length,
  recoveredTotal: recovered.length
};

// Write results
fs.writeFileSync(DEAD_LINKS_FILE, JSON.stringify(deadLinks, null, 2));
fs.writeFileSync(SUMMARY_FILE, JSON.stringify(summary, null, 2));

// Append to history
const historyEntry = JSON.stringify({
  timestamp: summary.runAt,
  scannedTotal: summary.scannedTotal,
  failedTotal: summary.failedTotal,
  newFailedTotal: summary.newFailedTotal,
  recoveredTotal: summary.recoveredTotal
});
fs.appendFileSync(HISTORY_FILE, historyEntry + '\n');

console.log(`📊 Results processed:`);
console.log(`   - Total scanned: ${summary.scannedTotal}`);
console.log(`   - Failed links: ${summary.failedTotal}`);
console.log(`   - New failures: ${summary.newFailedTotal}`);
console.log(`   - Recovered: ${summary.recoveredTotal}`);