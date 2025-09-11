use ckb_testtool::{
    ckb_error::Error,
    ckb_types::{
        bytes::Bytes,
        core::{Cycle, TransactionView},
    },
    context::Context,
};
use std::env;
use std::fs;
use std::path::PathBuf;
use std::str::FromStr;

#[cfg(test)]
mod tests;

pub struct Loader(PathBuf);

impl Default for Loader {
    fn default() -> Self {
        Self(PathBuf::from_str("../build").unwrap())
    }
}

impl Loader {
    pub fn load_binary(&self, name: &str) -> Bytes {
        let mut path = self.0.clone();
        path.push(name);
        let result = fs::read(&path);
        if result.is_err() {
            panic!("Binary {:?} is missing!", path);
        }
        result.unwrap().into()
    }

    pub fn load_crypto_service() -> Bytes {
        const CKB_CRYPTO_SERVICE_PATH: &str = "../../ckb-ts-script/deps/ckb-crypto-service";

        let result = fs::read(CKB_CRYPTO_SERVICE_PATH);
        if result.is_err() {
            panic!("Binary {:?} is missing!", CKB_CRYPTO_SERVICE_PATH);
        }
        result.unwrap().into()
    }
}

// This helper method runs Context::verify_tx, but in case error happens,
// it also dumps current transaction to failed_txs folder.
pub fn verify_and_dump_failed_tx(
    context: &Context,
    tx: &TransactionView,
    max_cycles: u64,
) -> Result<Cycle, Error> {
    let result = context.verify_tx(tx, max_cycles);
    if result.is_err() {
        let mut path = env::current_dir().expect("current dir");
        path.push("failed_txs");
        std::fs::create_dir_all(&path).expect("create failed_txs dir");
        let mock_tx = context.dump_tx(tx).expect("dump failed tx");
        let json = serde_json::to_string_pretty(&mock_tx).expect("json");
        path.push(format!("0x{:x}.json", tx.hash()));
        println!("Failed tx written to {:?}", path);
        std::fs::write(path, json).expect("write");
    }
    result
}
