#![no_std]
#![cfg_attr(not(test), no_main)]

#[cfg(test)]
extern crate alloc;

#[cfg(not(test))]
use ckb_std::default_alloc;
#[cfg(not(test))]
ckb_std::entry!(program_entry);
#[cfg(not(test))]
default_alloc!();

include!(concat!(env!("OUT_DIR"), "/ckb_js_vm_code_hash.rs"));

pub fn program_entry() -> i8 {
    ckb_std::debug!("This is a sample contract!");

    let args = [0u8; 32];
    //ckb_std::syscalls::spawn(index, source, bounds, argv, spgs)
    //ckb_std::high_level::exec_cell(&CKB_JS_VM_CODE_HASH, ckb_std::ckb_types::core::ScriptHashType::Data1, args);
    0
}
