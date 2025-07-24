CC := clang
AR := llvm-ar

OPT_LEVEL ?= -O2
ENABLE_PRINTF ?= 1

CFLAGS = --target=riscv64 -march=rv64imc_zba_zbb_zbc_zbs
CFLAGS += -fno-builtin-printf -fno-builtin-memcmp -nostdinc
CFLAGS += $(OPT_LEVEL) -fdata-sections -ffunction-sections
CFLAGS += -I deps/ckb-c-stdlib/libc -I deps/ckb-c-stdlib
CFLAGS += -I ./
ifeq ($(ENABLE_PRINTF),1)
CFLAGS += -DCKB_C_STDLIB_PRINTF
endif
CFLAGS_DECLARATION_ONLY = -DCKB_STDLIB_NO_SYSCALL_IMPL -DCKB_DECLARATION_ONLY

LDFLAGS := -Wl,-static -Wl,--gc-sections -nostdlib

all: out lib examples tests


lib: out build/libckb_script_ipc.a

