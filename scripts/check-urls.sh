#!/bin/bash

cd website
# yarn build

# Used by Lychee to check if URLs are valid.
# Because there are a large number of GitHub URLs, a direct check would fail (returning a 429 error due to too many requests in a short period of time).
# This function converts GitHub URLs to api.github.com. GitHub's API can support more requests.
if [ ! -f build/github-api-urls.txt ]; then
  grep -rho "https://github.com[^\"'<> ]*" build | sort -u > build/github-urls.txt
  node ../scripts/convert-github-urls.js build/github-urls.txt > build/github-api-urls.txt
fi

# lychee current version: 0.20.1
lychee \
    --config .lychee.toml \
    --cache-exclude-status="400..=699" \
    build 2>&1 \
  | grep --color=never -v 'InvalidPathToUri'