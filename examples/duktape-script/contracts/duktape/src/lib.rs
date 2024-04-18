#![cfg_attr(not(test), no_std)]

#[cfg(target_arch = "riscv64")]
#[link(name = "c-impl", kind = "static")]
extern "C" {
    fn bar() -> core::ffi::c_int;
}

#[cfg(not(target_arch = "riscv64"))]
unsafe fn bar() -> core::ffi::c_int {
    unreachable!()
}

pub fn value() -> u32 {
    (unsafe { bar() }) as u32
}
