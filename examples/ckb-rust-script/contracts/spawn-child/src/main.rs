#![cfg_attr(not(any(feature = "library", test)), no_std)]
#![cfg_attr(not(test), no_main)]

#[cfg(any(feature = "library", test))]
extern crate alloc;

#[cfg(not(any(feature = "library", test)))]
ckb_std::entry!(program_entry);
#[cfg(not(any(feature = "library", test)))]
// By default, the following heap configuration is used:
// * 16KB fixed heap
// * 1.2MB(rounded up to be 16-byte aligned) dynamic heap
// * Minimal memory block in dynamic heap is 64 bytes
// For more details, please refer to ckb-std's default_alloc macro
// and the buddy-alloc alloc implementation.
ckb_std::default_alloc!(16384, 1258306, 64);

use ckb_std::error::SysError;

fn ckb_main() -> Result<(), SysError> {
    let fds = ckb_std::high_level::inherited_fds();

    if fds.is_empty() {
        return Err(SysError::Unknown(1));
    }

    let buf = b"Hello World";
    ckb_std::syscalls::write(fds[0], buf)?;

    Ok(())
}

pub fn program_entry() -> i8 {
    ckb_std::debug!("Spawn Child PID: {} !", ckb_std::syscalls::process_id());
    let ret = ckb_main();
    match ret {
        Ok(()) => 0,
        Err(err) => {
            ckb_std::debug!("Spawn child failed: {:?}", err);
            -1
        }
    }
}
