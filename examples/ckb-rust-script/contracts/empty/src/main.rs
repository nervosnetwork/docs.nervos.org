#![cfg_attr(target_arch = "riscv64", no_std, no_main)]

#[cfg(target_arch = "riscv64")]
mod ckb_script {
    #[cfg(feature = "allocator")]
    extern crate alloc;

    #[cfg(feature = "allocator")]
    #[global_allocator]
    static ALLOC: buddy_alloc::NonThreadsafeAlloc = unsafe {
        #[repr(align(64))]
        struct _AlignedHeap<const N: usize>([u8; N]);

        const FIXED_BLOCK_HEAP_SIZE: usize = 4 * 1024;
        const HEAP_SIZE: usize = 516 * 1024;
        const MIN_BLOCK_SIZE: usize = 64;

        static mut _BUDDY_HEAP: _AlignedHeap<HEAP_SIZE> = _AlignedHeap([0u8; HEAP_SIZE]);
        static mut _FIXED_BLOCK_HEAP: _AlignedHeap<FIXED_BLOCK_HEAP_SIZE> =
            _AlignedHeap([0u8; FIXED_BLOCK_HEAP_SIZE]);

        use buddy_alloc::{BuddyAllocParam, FastAllocParam, NonThreadsafeAlloc};
        #[allow(static_mut_refs)]
        NonThreadsafeAlloc::new(
            FastAllocParam::new(_FIXED_BLOCK_HEAP.0.as_ptr(), FIXED_BLOCK_HEAP_SIZE),
            BuddyAllocParam::new_with_zero_filled(
                _BUDDY_HEAP.0.as_ptr(),
                HEAP_SIZE,
                MIN_BLOCK_SIZE,
            ),
        )
    };

    #[panic_handler]
    fn panic_handler(_panic_info: &core::panic::PanicInfo) -> ! {
        loop {}
    }

    // Use global_asm so the compiler won't insert function prologue in _start.
    core::arch::global_asm!(
        ".global _start",
        "_start:",
        // Argc.
        "lw a0, 0(sp)",
        // Argv.
        "addi a1, sp, 8",
        // Envp.
        "li a2, 0",
        "call __ckb_std_main",
        // Exit.
        "li a7, 93",
        "ecall",
    );

    #[no_mangle]
    unsafe extern "C" fn __ckb_std_main(
        _argc: core::ffi::c_int,
        _argv: *const core::ffi::c_void,
    ) -> i8 {
        #[cfg(feature = "allocator")]
        let c_str = {
            let mut data = alloc::string::String::from("hello world (alloc)");
            data.push('\0');
            data.into_bytes()
        };

        #[cfg(not(feature = "allocator"))]
        let c_str = b"hello world\0";

        let mut _a0 = c_str.as_ptr() as u64;
        core::arch::asm!(
          "ecall",
          inout("a0") _a0,
          in("a1") 0,
          in("a2") 0,
          in("a3") 0,
          in("a4") 0,
          in("a5") 0,
          in("a6") 0,
          in("a7") 2177, // const SYS_DEBUG: u64 = 2177;
        );
        0
    }
}

#[cfg(not(target_arch = "riscv64"))]
fn main() {
    panic!("Unsupport")
}
