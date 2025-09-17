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

use ckb_std::{ckb_constants::Source, debug, error::SysError, high_level::load_cell_data};

const ERROR_CARROT_ATTACK: i8 = 100;

pub fn sys_err_return(err: SysError) -> i8 {
    match err {
        SysError::Unknown(err_code) => err_code as i8,
        _ => {
            ckb_std::debug!("CKB System Error: {:?}", err);
            1
        }
    }
}

pub fn program_entry() -> i8 {
    match carrot_forbidden() {
        Ok(_) => 0,
        Err(err) => sys_err_return(err),
    }
}

fn carrot_forbidden() -> Result<(), SysError> {
    let mut index = 0;
    loop {
        match load_cell_data(index, Source::GroupOutput) {
            Ok(data) => {
                if data.starts_with("carrot".as_bytes()) {
                    ckb_std::debug!("Error: CarrotAttack");
                    return Err(SysError::Unknown(ERROR_CARROT_ATTACK as u64));
                } else {
                    debug!("output #{:} has no carrot! Hooray!", index);
                }
            }
            Err(err) => {
                match err {
                    // we loop out all the output cell
                    SysError::IndexOutOfBound => break,
                    _ => return Err(err),
                }
            }
        }
        // Increment index to process next cell
        index += 1;
    }
    Ok(())
}
