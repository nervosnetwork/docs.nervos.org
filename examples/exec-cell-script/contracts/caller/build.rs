use ckb_gen_types::{packed::CellOutput, prelude::*};
use std::env;
use std::fs::{read, File};
use std::io::{BufWriter, Write};
use std::path::Path;

fn main() {
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed=../../build/release/callee");

    let auth_binary = read("../../build/release/callee").expect("read auth binary");
    let code_hash = CellOutput::calc_data_hash(&auth_binary);

    let out_path = Path::new(&env::var("OUT_DIR").unwrap()).join("callee_code_hash.rs");
    let mut out_file = BufWriter::new(File::create(out_path).expect("create CALLEE_CODE_HASH.rs"));

    writeln!(
        &mut out_file,
        "pub const CALLEE_CODE_HASH: [u8; 32] = {:#02X?};",
        code_hash.as_slice()
    )
    .expect("write to code_hashes.rs");
}
