#!/bin/bash
SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR/../examples/ckb-rust-script/"

rustup component add rustfmt
rustup target add riscv64imac-unknown-none-elf

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
