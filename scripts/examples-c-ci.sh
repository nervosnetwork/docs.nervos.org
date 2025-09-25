#!/bin/bash
SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR/../examples/ckb-c-script/"

make all
if [ $? -ne 0 ]; then
    exit 1
fi

make tests
if [ $? -ne 0 ]; then
    exit 1
fi
