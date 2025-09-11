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

use alloc::{ffi::CString, vec::Vec};
use ckb_crypto_interface::{CkbCryptoClient, HasherType};
use ckb_script_ipc_common::spawn::spawn_cell_server;
use ckb_std::ckb_types::prelude::Unpack;

fn main() -> Result<(), i8> {
    let args: Vec<u8> = ckb_std::high_level::load_script()
        .unwrap()
        .args()
        .into_iter()
        .map(|f| f.into())
        .collect();

    let witness: Vec<u8> =
        ckb_std::high_level::load_witness_args(0, ckb_std::ckb_constants::Source::GroupInput)
            .unwrap()
            .lock()
            .to_opt()
            .unwrap()
            .unpack();

    let (read_pipe, write_pipe) = spawn_cell_server(
        &args[..32],
        ckb_std::ckb_types::core::ScriptHashType::Type,
        &[CString::new("").unwrap().as_ref()],
    )
    .unwrap();

    let mut crypto_cli = CkbCryptoClient::new(read_pipe, write_pipe);

    let ctx = crypto_cli.hasher_new(HasherType::CkbBlake2b);
    crypto_cli
        .hasher_update(
            ctx.clone(),
            alloc::vec![
                0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00,
            ],
        )
        .expect("update ckb blake2b");
    let hash = crypto_cli
        .hasher_finalize(ctx)
        .expect("ckb blake2b finallize");

    // Check
    assert_eq!(hash, witness);

    Ok(())
}

pub fn program_entry() -> i8 {
    match main() {
        Ok(()) => 0,
        Err(code) => code,
    }
}
