#!/bin/bash
SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR/../examples/dApp/simple-lock"

pnpm install
if [ $? -ne 0 ]; then
    exit 1
fi

pnpm format
git diff --exit-code
if [ $? -ne 0 ]; then
    echo "Check if there are any changes after formatting";
    exit 1
fi

pnpm build
if [ $? -ne 0 ]; then
    exit 1
fi

pnpm test -- mock
if [ $? -ne 0 ]; then
    exit 1
fi
