#!/bin/bash
SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR/../examples/dApp/simple-lock"

pnpm install
if [ $? -ne 0 ]; then
    exit 1
fi

pnpm format:check || exit 1

pnpm build
if [ $? -ne 0 ]; then
    exit 1
fi

pnpm test -- mock
if [ $? -ne 0 ]; then
    exit 1
fi

# Run build for frontend
cd frontend
pnpm run build
if [ $? -ne 0 ]; then
    exit 1
fi
