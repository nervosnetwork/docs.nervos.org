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

use ckb_std::ckb_constants::Source;
use ckb_std::ckb_types::prelude::Pack;
use ckb_std::error::SysError;

fn ckb_main() -> Result<(), ckb_std::error::SysError> {
    let script = ckb_std::high_level::load_script()?;
    let script_hash = ckb_std::high_level::load_script_hash()?;

    assert_eq!(script.calc_script_hash(), script_hash.pack());

    let lock_hash = ckb_std::high_level::load_cell_lock_hash(0, Source::GroupInput)?;
    let input_type_hash = match ckb_std::high_level::load_cell_type_hash(0, Source::GroupInput) {
        Ok(v) => v,
        Err(SysError::IndexOutOfBound) => None,
        Err(err) => return Err(err),
    };

    let output_type_hash: Option<[u8; 32]> =
        match ckb_std::high_level::load_cell_type_hash(0, Source::GroupOutput) {
            Ok(v) => v,
            Err(SysError::IndexOutOfBound) => None,
            Err(err) => return Err(err),
        };

    if script_hash == lock_hash {
        ckb_std::debug!("Lock Script");
    } else if Some(script_hash) == input_type_hash {
        ckb_std::debug!("Input Type Script");
    } else if Some(script_hash) == output_type_hash {
        ckb_std::debug!("Output Type Script");
    } else {
        panic!("Unknow Error")
    }

    Ok(())
}

pub fn program_entry() -> i8 {
    let ret = ckb_main();
    match ret {
        Ok(_) => 0,
        Err(error) => {
            ckb_std::debug!("script-hash failed: {:?}", error);
            -1
        }
    }
}
