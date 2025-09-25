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

pub fn program_entry() -> i8 {
    let script = ckb_std::high_level::load_script();
    match script {
        Ok(script) => {
            let args = script.args().raw_data().to_vec();
            ckb_std::debug!("Args Len: {}", args.len());
            ckb_std::debug!("Args Data: {:02x?}", args);
            0
        }
        Err(err) => {
            ckb_std::debug!("load script failed: {:?}", err);
            -1
        }
    }
}
