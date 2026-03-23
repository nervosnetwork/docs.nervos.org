#!/bin/bash

set -e

# Configuration via environment variables
LINK_CHECK_CONCURRENCY=${LINK_CHECK_CONCURRENCY:-1}
LINK_CHECK_TIMEOUT=${LINK_CHECK_TIMEOUT:-30}
LINK_CHECK_RETRIES=${LINK_CHECK_RETRIES:-2}
LINK_CHECK_ACCEPT=${LINK_CHECK_ACCEPT:-"200..=299,403"}
GITHUB_TOKEN=${GITHUB_TOKEN:-""}

cd website

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
LYCHEE_CMD="lychee --config .lychee.toml --cache-exclude-status=\"400..=699\" --format json --output reports/link-check/dead-links-raw.json"

if [ -n "$GITHUB_TOKEN" ]; then
    LYCHEE_CMD="$LYCHEE_CMD --header \"Authorization: Bearer $GITHUB_TOKEN\""
fi

# Override config with environment variables
LYCHEE_CMD="$LYCHEE_CMD --max-concurrency $LINK_CHECK_CONCURRENCY"
LYCHEE_CMD="$LYCHEE_CMD --timeout $LINK_CHECK_TIMEOUT"
LYCHEE_CMD="$LYCHEE_CMD --max-retries $LINK_CHECK_RETRIES"
LYCHEE_CMD="$LYCHEE_CMD --accept \"$LINK_CHECK_ACCEPT\""

echo "🚀 Running link check with concurrency=$LINK_CHECK_CONCURRENCY, timeout=${LINK_CHECK_TIMEOUT}s, retries=$LINK_CHECK_RETRIES..."
echo "Command: $LYCHEE_CMD build"

# Run lychee and capture both output and exit code
set +e
eval "$LYCHEE_CMD build" 2>&1 | grep --color=never -v 'InvalidPathToUri'
LYCHEE_EXIT_CODE=$?
set -e

echo "📊 Processing results..."

# Process the raw JSON output into our structured format
node ../scripts/process-link-results.js

echo "✅ Link check completed. Results saved to website/reports/link-check/"
echo "📋 Summary: $(cat reports/link-check/summary.json | jq -r '.failedTotal') failed links found"
