#![cfg_attr(not(any(feature = "library", test)), no_std)]
#![cfg_attr(not(test), no_main)]

use ckb_std::ckb_types::prelude::Entity;

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

use ckb_std::debug;

fn ckb_hash(data: &[u8]) -> [u8; 32] {
    const HASH_SIZE: usize = 32;
    const CKB_HASH_PERSONALIZATION: &[u8] = b"ckb-default-hash";
    let mut hasher = blake2b_ref::Blake2bBuilder::new(HASH_SIZE)
        .personal(CKB_HASH_PERSONALIZATION)
        .build();
    // hasher.update(&tx.len().to_le_bytes());
    hasher.update(data);
    let mut hash = [0u8; HASH_SIZE];
    hasher.finalize(&mut hash);

    hash
}

fn program_entry2() -> Result<(), ckb_std::error::SysError> {
    let tx_hash = ckb_std::high_level::load_tx_hash()?;
    debug!("tx hash by load_tx_hash : {:02x?}", tx_hash);

    let tx = ckb_std::high_level::load_transaction()?;
    let tx_hash2 = ckb_hash(tx.raw().as_slice());
    debug!("tx hash cal by load_transaction : {:02x?}", tx_hash2);

    assert_eq!(tx_hash, tx_hash2);

    let witness = ckb_std::high_level::load_witness(0, ckb_std::ckb_constants::Source::Input)?;
    debug!("witness[0] data: {:02x?}", witness);
    assert_eq!(tx_hash.to_vec(), witness);

    Ok(())
}

pub fn program_entry() -> i8 {
    let res = program_entry2();
    match res {
        Ok(()) => 0,
        Err(err) => {
            debug!("error: {:?}", err);
            -1
        }
    }
}
