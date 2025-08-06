#!/bin/bash
SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR/../cd examples/ckb-ts-script/"

pnpm install
if [ $? -ne 0 ]; then
    exit 1
fi

pnpm build
if [ $? -ne 0 ]; then
    exit 1
fi

pnpm test
if [ $? -ne 0 ]; then
    exit 1
fi
