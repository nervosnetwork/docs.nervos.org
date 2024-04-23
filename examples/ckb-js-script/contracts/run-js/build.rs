use ckb_gen_types::{packed::CellOutput, prelude::*};
use std::env;
use std::fs::{read, File};
use std::io::{BufWriter, Write};
use std::path::Path;

fn main() {
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed=../../deps/ckb-js-vm");

    let auth_binary = read("../../deps/ckb-js-vm").expect("read js-vm binary");
    let code_hash = CellOutput::calc_data_hash(&auth_binary);

    let out_path = Path::new(&env::var("OUT_DIR").unwrap()).join("ckb_js_vm_code_hash.rs");
    let mut out_file =
        BufWriter::new(File::create(out_path).expect("create ckb_js_vm_code_hash.rs"));

    writeln!(
        &mut out_file,
        "pub const CKB_JS_VM_CODE_HASH: [u8; 32] = {:#02X?};",
        code_hash.as_slice()
    )
    .expect("write to code_hashes.rs");
}
