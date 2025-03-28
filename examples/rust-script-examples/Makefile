# We cannot use $(shell pwd), which will return unix path format on Windows,
# making it hard to use.
cur_dir = $(dir $(abspath $(firstword $(MAKEFILE_LIST))))

TOP := $(cur_dir)
# RUSTFLAGS that are likely to be tweaked by developers. For example,
# while we enable debug logs by default here, some might want to strip them
# for minimal code size / consumed cycles.
CUSTOM_RUSTFLAGS := -C debug-assertions
# Additional cargo args to append here. For example, one can use
# make test CARGO_ARGS="-- --nocapture" so as to inspect data emitted to
# stdout in unit tests
CARGO_ARGS :=
MODE := release
# Tweak this to change the clang version to use for building C code. By default
# we use a bash script with somes heuristics to find clang in current system.
CLANG := $(shell $(TOP)/scripts/find_clang)
# When this is set, a single contract will be built instead of all contracts
CONTRACT :=
# By default, we would clean build/{release,debug} folder first, in case old
# contracts are mixed together with new ones, if for some reason you want to
# revert this behavior, you can change this to anything other than true
CLEAN_BUILD_DIR_FIRST := true
BUILD_DIR := build/$(MODE)

ifeq (release,$(MODE))
	MODE_ARGS := --release
endif

# Pass setups to child make processes
export CUSTOM_RUSTFLAGS
export TOP
export CARGO_ARGS
export MODE
export CLANG
export BUILD_DIR

default: build test

build:
	@if [ "x$(CLEAN_BUILD_DIR_FIRST)" = "xtrue" ]; then \
		echo "Cleaning $(BUILD_DIR) directory..."; \
		rm -rf $(BUILD_DIR); \
	fi
	mkdir -p $(BUILD_DIR)
	@set -eu; \
	if [ "x$(CONTRACT)" = "x" ]; then \
		for contract in $(wildcard contracts/*); do \
			$(MAKE) -e -C $$contract build; \
		done; \
		for crate in $(wildcard crates/*); do \
			cargo build -p $$(basename $$crate) $(MODE_ARGS) $(CARGO_ARGS); \
		done; \
		for sim in $(wildcard native-simulators/*); do \
			cargo build -p $$(basename $$sim) $(CARGO_ARGS); \
		done; \
	else \
		$(MAKE) -e -C contracts/$(CONTRACT) build; \
		cargo build -p $(CONTRACT)-sim; \
	fi;

# Run a single make task for a specific contract. For example:
#
# make run CONTRACT=stack-reorder TASK=adjust_stack_size STACK_SIZE=0x200000
TASK :=
run:
	$(MAKE) -e -C contracts/$(CONTRACT) $(TASK)

# test, check, clippy and fmt here are provided for completeness,
# there is nothing wrong invoking cargo directly instead of make.
test:
	cargo test $(CARGO_ARGS)

check:
	cargo check $(CARGO_ARGS)

clippy:
	cargo clippy $(CARGO_ARGS)

fmt:
	cargo fmt $(CARGO_ARGS)

# Arbitrary cargo command is supported here. For example:
#
# make cargo CARGO_CMD=expand CARGO_ARGS="--ugly"
#
# Invokes:
# cargo expand --ugly
CARGO_CMD :=
cargo:
	cargo $(CARGO_CMD) $(CARGO_ARGS)

clean:
	rm -rf build
	cargo clean

TEMPLATE_TYPE := --git
TEMPLATE_REPO := https://github.com/cryptape/ckb-script-templates
CRATE :=
TEMPLATE := contract
DESTINATION := contracts
generate:
	@set -eu; \
	if [ "x$(CRATE)" = "x" ]; then \
		mkdir -p $(DESTINATION); \
		cargo generate $(TEMPLATE_TYPE) $(TEMPLATE_REPO) $(TEMPLATE) \
			--destination $(DESTINATION); \
		GENERATED_DIR=$$(ls -dt $(DESTINATION)/* | head -n 1); \
		if [ -f "$$GENERATED_DIR/.cargo-generate/tests.rs" ]; then \
			cat $$GENERATED_DIR/.cargo-generate/tests.rs >> tests/src/tests.rs; \
			rm -rf $$GENERATED_DIR/.cargo-generate/; \
		fi; \
		sed "s,@@INSERTION_POINT@@,@@INSERTION_POINT@@\n  \"$$GENERATED_DIR\"\,," Cargo.toml > Cargo.toml.new; \
		mv Cargo.toml.new Cargo.toml; \
	else \
		mkdir -p $(DESTINATION); \
		cargo generate $(TEMPLATE_TYPE) $(TEMPLATE_REPO) $(TEMPLATE) \
			--destination $(DESTINATION) \
			--name $(CRATE); \
		if [ -f "$(DESTINATION)/$(CRATE)/.cargo-generate/tests.rs" ]; then \
			cat $(DESTINATION)/$(CRATE)/.cargo-generate/tests.rs >> tests/src/tests.rs; \
			rm -rf $(DESTINATION)/$(CRATE)/.cargo-generate/; \
		fi; \
		sed '/@@INSERTION_POINT@@/s/$$/\n  "$(DESTINATION)\/$(CRATE)",/' Cargo.toml > Cargo.toml.new; \
		mv Cargo.toml.new Cargo.toml; \
	fi;

generate-native-simulator:
	@set -eu; \
	if [ -z "$(CRATE)" ]; then \
		echo "Error: Must have CRATE=<Contract Name>"; \
		exit 1; \
	fi; \
	mkdir -p native-simulators; \
	cargo generate $(TEMPLATE_TYPE) $(TEMPLATE_REPO) native-simulator \
		-n $(CRATE)-sim \
		--destination native-simulators; \
	sed '/@@INSERTION_POINT@@/s/$$/\n  "native-simulators\/$(CRATE)-sim",/' Cargo.toml > Cargo.toml.new; \
	mv Cargo.toml.new Cargo.toml; \
	if [ ! -f "contracts/$(CRATE)/Cargo.toml" ]; then \
		echo "Warning: This is a non-existent contract and needs to be processed manually"; \
		echo "		Otherwise compilation may fail."; \
	fi;

prepare:
	rustup target add riscv64imac-unknown-none-elf

# Generate checksum info for reproducible build
CHECKSUM_FILE := build/checksums-$(MODE).txt
checksum: build
	shasum -a 256 build/$(MODE)/* > $(CHECKSUM_FILE)

.PHONY: build test check clippy fmt cargo clean prepare checksum
