#!/bin/bash
SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR/../website/"

yarn
yarn run fmt

git diff --exit-code
if [ $? -ne 0 ]; then
    echo "Check if there are any changes after formatting";
    exit 1
fi

yarn build

# Used by Lychee to check if URLs are valid.
# Because there are a large number of GitHub URLs, a direct check would fail (returning a 429 error due to too many requests in a short period of time).
# This function converts GitHub URLs to api.github.com. GitHub's API can support more requests.
grep -rho "https://github.com[^\"'<> ]*" build | sort -u > build/github-urls.txt
node ../scripts/convert-github-urls.js build/github-urls.txt > build/github-api-urls.txt
