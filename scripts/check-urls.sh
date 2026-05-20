#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WEBSITE_DIR="$REPO_ROOT/website"
REPORTS_DIR="reports/link-check"

# Configuration via environment variables
LINK_CHECK_CONCURRENCY=${LINK_CHECK_CONCURRENCY:-1}
LINK_CHECK_TIMEOUT=${LINK_CHECK_TIMEOUT:-30}
LINK_CHECK_RETRIES=${LINK_CHECK_RETRIES:-2}
LINK_CHECK_ACCEPT=${LINK_CHECK_ACCEPT:-"200..=299,403"}
GITHUB_TOKEN=${GITHUB_TOKEN:-""}

cd "$WEBSITE_DIR"

# Pre-flight checks
echo "🔍 Pre-flight checks..."
if ! command -v lychee &> /dev/null; then
    echo "❌ Error: lychee is not installed. Please install it first: https://github.com/lycheeverse/lychee"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Error: node is not installed."
    exit 1
fi

if [ ! -d "build" ]; then
    echo "❌ Error: build directory not found. Please run 'yarn build' first."
    exit 1
fi

echo "✅ Pre-flight checks passed"

# Always regenerate URL lists to ensure freshness
echo "🔄 Extracting GitHub URLs from build directory..."
grep -rho "https://github.com[^\"'<> ]*" build | sort -u > build/github-urls.txt
echo "📝 Found $(wc -l < build/github-urls.txt) unique GitHub URLs"

echo "🔄 Converting GitHub URLs to API endpoints..."
node ../scripts/convert-github-urls.js build/github-urls.txt > build/github-api-urls.txt
echo "📝 Generated $(wc -l < build/github-api-urls.txt) API URLs"

# Prepare lychee command with optional token
lychee_args=(
    --config .lychee.toml
    --cache-exclude-status "400..=699"
    --format json
    --output "$REPORTS_DIR/dead-links-raw.json"
    --max-concurrency "$LINK_CHECK_CONCURRENCY"
    --timeout "$LINK_CHECK_TIMEOUT"
    --max-retries "$LINK_CHECK_RETRIES"
    --accept "$LINK_CHECK_ACCEPT"
)

if [ -n "$GITHUB_TOKEN" ]; then
    lychee_args+=(--header "Authorization: Bearer $GITHUB_TOKEN")
fi

echo "🚀 Running link check with concurrency=$LINK_CHECK_CONCURRENCY, timeout=${LINK_CHECK_TIMEOUT}s, retries=$LINK_CHECK_RETRIES..."
DISPLAY_CMD="lychee --config .lychee.toml --cache-exclude-status \"400..=699\" --format json --output $REPORTS_DIR/dead-links-raw.json --max-concurrency $LINK_CHECK_CONCURRENCY --timeout $LINK_CHECK_TIMEOUT --max-retries $LINK_CHECK_RETRIES --accept \"$LINK_CHECK_ACCEPT\""
if [ -n "$GITHUB_TOKEN" ]; then
    DISPLAY_CMD="$DISPLAY_CMD --header \"Authorization: Bearer ***REDACTED***\""
fi
echo "Command: $DISPLAY_CMD build"

# Run lychee and capture both output and exit code
set +e
lychee "${lychee_args[@]}" build 2>&1 | grep --color=never -v 'InvalidPathToUri'
LYCHEE_EXIT_CODE=${PIPESTATUS[0]}
set -e

echo "📊 Processing results..."

# Process the raw JSON output into our structured format
node "$REPO_ROOT/scripts/process-link-results.js"

echo "✅ Link check completed. Results saved to website/reports/link-check/"
FAILED_TOTAL=$(node -e "const fs=require('fs');const s=JSON.parse(fs.readFileSync('reports/link-check/summary.json','utf8'));process.stdout.write(String(s.failedTotal ?? 0));")
IGNORED_TOTAL=$(node -e "const fs=require('fs');const s=JSON.parse(fs.readFileSync('reports/link-check/summary.json','utf8'));process.stdout.write(String(s.ignoredTransientTotal ?? 0));")
echo "📋 Summary: $FAILED_TOTAL failed links found"
if [ "$IGNORED_TOTAL" -gt 0 ]; then
    echo "ℹ️ Ignored transient errors (e.g. 429): $IGNORED_TOTAL"
fi

if [ "$LYCHEE_EXIT_CODE" -ne 0 ]; then
    echo "⚠️ lychee exited with code $LYCHEE_EXIT_CODE. Processed report artifacts were still generated."
fi
