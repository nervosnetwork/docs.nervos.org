CC := clang-18
LD := ld.lld-18
OBJCOPY := llvm-objcopy-18
AR := llvm-ar-18
RANLIB := llvm-ranlib-18
LLVM_CFLAGS := --target=riscv64 -march=rv64imc_zba_zbb_zbc_zbs \
		-Wno-error=unused-but-set-variable \
		-Wno-error=unused-command-line-argument \
		-Wno-error=bitwise-instead-of-logical
LDFLAGS := -static -Wl,--gc-sections -nostdlib

CFLAGS := -g -O3 -fPIC \
		-Wall -Werror -Wno-nonnull -Wno-unused-function \
		-fno-builtin-printf -fno-builtin-memcmp \
		-nostdinc -fvisibility=hidden \
		-fdata-sections -ffunction-sections \
		-I c -I build \
		-I deps/ckb-c-stdlib -I deps/ckb-c-stdlib/libc -I deps/ckb-c-stdlib/molecule \
		-I deps/ckb-script-ipc/c \
		-I deps/cjson \
		$(LLVM_CFLAGS)

CFLAGS_DECLARATION_ONLY = -DCKB_STDLIB_NO_SYSCALL_IMPL -DCKB_DECLARATION_ONLY

all: \
	build/crypto-service-hash

build/ckb_script_ipc.o: deps/ckb-script-ipc/c/ckb_script_ipc.c deps/ckb-script-ipc/c/ckb_script_ipc.h
	mkdir -p build
	$(CC) $(CFLAGS) $(CFLAGS_DECLARATION_ONLY) -c deps/ckb-script-ipc/c/ckb_script_ipc.c -o build/ckb_script_ipc.o

build/libckb_script_ipc.a: build/ckb_script_ipc.o
	$(AR) rcs build/libckb_script_ipc.a build/ckb_script_ipc.o

build/crypto-service-hash: c/crypto-service-hash.c build/libckb_script_ipc.a
	mkdir -p build
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ $< build/libckb_script_ipc.a
	$(OBJCOPY) --only-keep-debug $@ $@.debug
	$(OBJCOPY) --strip-debug --strip-all $@

clean:
	rm -r build
