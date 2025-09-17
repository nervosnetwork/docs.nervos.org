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

use alloc::vec::Vec;
use ckb_std::ckb_types::prelude::Unpack;
use ckb_std::error::SysError;

fn ckb_main() -> Result<(), SysError> {
    let args: Vec<u8> = ckb_std::high_level::load_script()?.args().unpack();
    assert_eq!(args.len(), 33);
    let code_hash = &args[0..32];
    let hash_type = {
        let v = args[32];
        use ckb_std::ckb_types::core::ScriptHashType;
        match v {
            0 => ScriptHashType::Data,
            1 => ScriptHashType::Type,
            2 => ScriptHashType::Data1,
            4 => ScriptHashType::Data2,
            _ => panic!("unknow script hash type: {}", v),
        }
    };

    let (fd_r, fd_w) = ckb_std::syscalls::pipe()?;

    ckb_std::high_level::spawn_cell(code_hash, hash_type, &[], &[fd_w])?;

    let mut io_buf = [0u8; 128];
    let readed = ckb_std::syscalls::read(fd_r, &mut io_buf)?;

    const CHECKED_DATA: &[u8] = b"Hello World";

    assert_eq!(CHECKED_DATA, &io_buf[0..readed]);
    ckb_std::debug!("Checked");

    Ok(())
}

pub fn program_entry() -> i8 {
    ckb_std::debug!("Spawn Parent PID: {} !", ckb_std::syscalls::process_id());
    let ret = ckb_main();
    match ret {
        Ok(()) => 0,
        Err(err) => {
            ckb_std::debug!("Spawn parent failed: {:?}", err);
            -1
        }
    }
}
