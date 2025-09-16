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
