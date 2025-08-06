#!/bin/bash
SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR/../cd examples/rust-script-examples/"

make fmt
if [ $? -ne 0 ]; then
    exit 1
fi

make clippy
if [ $? -ne 0 ]; then
    exit 1
fi

make build
if [ $? -ne 0 ]; then
    exit 1
fi

make test
if [ $? -ne 0 ]; then
    exit 1
fi
