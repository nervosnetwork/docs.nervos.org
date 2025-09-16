#![no_std]
extern crate alloc;

use alloc::vec::Vec;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum CryptoError {
    InvalidContext,
    InvalidSig,
    InvalidPrehash,
    InvalidRecoveryId,
    InvalidPubkey,
    RecoveryFailed,
    VerifyFailed,
}

#[derive(Serialize, Deserialize)]
pub enum HasherType {
    CkbBlake2b,
    Blake2b,
    Sha256,
    Ripemd160,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct HasherCtx(pub u64);

#[ckb_script_ipc::service]
pub trait CkbCrypto {
    fn hasher_new(hash_type: HasherType) -> HasherCtx;
    fn hasher_update(ctx: HasherCtx, data: Vec<u8>) -> Result<(), CryptoError>;
    fn hasher_finalize(ctx: HasherCtx) -> Result<Vec<u8>, CryptoError>;

    fn secp256k1_recovery(
        prehash: Vec<u8>,
        signature: Vec<u8>,
        recovery_id: u8,
    ) -> Result<Vec<u8>, CryptoError>;

    fn secp256k1_verify(
        public_key: Vec<u8>,
        prehash: Vec<u8>,
        signature: Vec<u8>,
    ) -> Result<(), CryptoError>;

    fn schnorr_verify(
        public_key: Vec<u8>,
        prehash: Vec<u8>,
        signature: Vec<u8>,
    ) -> Result<(), CryptoError>;

    fn ed25519_verify(
        public_key: Vec<u8>,
        prehash: Vec<u8>,
        signature: Vec<u8>,
    ) -> Result<(), CryptoError>;
}
