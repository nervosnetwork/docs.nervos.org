// Include our tests here
// See https://github.com/xxuejie/ckb-native-build-sample/blob/main/tests/src/tests.rs for examples

use super::*;
use ckb_testtool::{
    builtin::ALWAYS_SUCCESS,
    ckb_types::{bytes::Bytes, core::TransactionBuilder, packed::*, prelude::*},
    context::Context,
};

const MAX_CYCLES: u64 = 10_000_000;

#[test]
fn hello_script() {
    // deploy contract
    let mut context = Context::default();
    let loader = Loader::default();
    let js_vm_bin = loader.load_binary("../../deps/ckb-js-vm");
    let js_vm_out_point = context.deploy_cell(js_vm_bin);
    let js_vm_cell_dep = CellDep::new_builder()
        .out_point(js_vm_out_point.clone())
        .build();

    let js_script_bin = loader.load_binary("../../js/build/hello.bc");
    let js_script_out_point = context.deploy_cell(js_script_bin.clone());
    let js_script_cell_dep = CellDep::new_builder()
        .out_point(js_script_out_point.clone())
        .build();

    // prepare scripts
    let always_success_out_point = context.deploy_cell(ALWAYS_SUCCESS.clone());
    let lock_script = context
        .build_script(&always_success_out_point.clone(), Default::default())
        .expect("script");
    let lock_script_dep = CellDep::new_builder()
        .out_point(always_success_out_point)
        .build();

    // prepare cell deps
    let cell_deps: Vec<CellDep> = vec![lock_script_dep, js_vm_cell_dep, js_script_cell_dep];

    // prepare cells
    let input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(1000u64.pack())
            .lock(lock_script.clone())
            .build(),
        Bytes::new(),
    );
    let input = CellInput::new_builder()
        .previous_output(input_out_point.clone())
        .build();

    // args: <ckb-js-vm args, 2 bytes> <code_hash to JavaScript code cell, 32 bytes> <hash_type to JavaScript code cell, 1 byte> <JavaScript code args, variable length>
    let mut type_script_args: [u8; 35] = [0u8; 35];
    let reserved = [0u8; 2];
    let (js_cell, _) = context.get_cell(&js_script_out_point.clone()).unwrap();
    let js_type_script = js_cell.type_().to_opt().unwrap();
    let code_hash = js_type_script.calc_script_hash();
    let hash_type = js_type_script.hash_type();
    type_script_args[..2].copy_from_slice(&reserved);
    type_script_args[2..34].copy_from_slice(code_hash.as_slice());
    type_script_args[34..35].copy_from_slice(&hash_type.as_slice());

    let type_script = context
        .build_script(&js_vm_out_point, type_script_args.to_vec().into())
        .expect("script");

    let outputs = vec![
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script.clone())
            .type_(Some(type_script.clone()).pack())
            .build(),
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script)
            .build(),
    ];

    // prepare output cell data
    let outputs_data = vec![Bytes::from("apple"), Bytes::from("tomato")];

    // build transaction
    let tx = TransactionBuilder::default()
        .cell_deps(cell_deps)
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .build();

    let tx = tx.as_advanced_builder().build();

    // run
    let cycles = context
        .verify_tx(&tx, MAX_CYCLES)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}

#[test]
fn fib_script() {
    // deploy contract
    let mut context = Context::default();
    let loader = Loader::default();
    let js_vm_bin = loader.load_binary("../../deps/ckb-js-vm");
    let js_vm_out_point = context.deploy_cell(js_vm_bin);
    let js_vm_cell_dep = CellDep::new_builder()
        .out_point(js_vm_out_point.clone())
        .build();

    let js_script_bin = loader.load_binary("../../js/build/fib.bc");
    let js_script_out_point = context.deploy_cell(js_script_bin.clone());
    let js_script_cell_dep = CellDep::new_builder()
        .out_point(js_script_out_point.clone())
        .build();

    // prepare scripts
    let always_success_out_point = context.deploy_cell(ALWAYS_SUCCESS.clone());
    let lock_script = context
        .build_script(&always_success_out_point.clone(), Default::default())
        .expect("script");
    let lock_script_dep = CellDep::new_builder()
        .out_point(always_success_out_point)
        .build();

    // prepare cell deps
    let cell_deps: Vec<CellDep> = vec![lock_script_dep, js_vm_cell_dep, js_script_cell_dep];

    // prepare cells
    let input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(1000u64.pack())
            .lock(lock_script.clone())
            .build(),
        Bytes::new(),
    );
    let input = CellInput::new_builder()
        .previous_output(input_out_point.clone())
        .build();

    // args: <ckb-js-vm args, 2 bytes> <code_hash to JavaScript code cell, 32 bytes> <hash_type to JavaScript code cell, 1 byte> <JavaScript code args, variable length>
    let mut type_script_args: [u8; 35] = [0u8; 35];
    let reserved = [0u8; 2];
    let (js_cell, _) = context.get_cell(&js_script_out_point.clone()).unwrap();
    let js_type_script = js_cell.type_().to_opt().unwrap();
    let code_hash = js_type_script.calc_script_hash();
    let hash_type = js_type_script.hash_type();
    type_script_args[..2].copy_from_slice(&reserved);
    type_script_args[2..34].copy_from_slice(code_hash.as_slice());
    type_script_args[34..35].copy_from_slice(&hash_type.as_slice());

    let type_script = context
        .build_script(&js_vm_out_point, type_script_args.to_vec().into())
        .expect("script");

    let outputs = vec![
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script.clone())
            .type_(Some(type_script.clone()).pack())
            .build(),
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script)
            .build(),
    ];

    // prepare output cell data
    let outputs_data = vec![Bytes::new(), Bytes::new()];

    // build transaction
    let tx = TransactionBuilder::default()
        .cell_deps(cell_deps)
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .build();

    let tx = tx.as_advanced_builder().build();

    // run
    let cycles = context
        .verify_tx(&tx, MAX_CYCLES)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}

#[test]
fn sudt_script() {
    // deploy contract
    let mut context = Context::default();
    let loader = Loader::default();
    let js_vm_bin = loader.load_binary("../../deps/ckb-js-vm");
    let js_vm_out_point = context.deploy_cell(js_vm_bin);
    let js_vm_cell_dep = CellDep::new_builder()
        .out_point(js_vm_out_point.clone())
        .build();

    let js_script_bin = loader.load_binary("../../js/build/sudt.bc");
    let js_script_out_point = context.deploy_cell(js_script_bin.clone());
    let js_script_cell_dep = CellDep::new_builder()
        .out_point(js_script_out_point.clone())
        .build();

    // prepare scripts
    let always_success_out_point = context.deploy_cell(ALWAYS_SUCCESS.clone());
    let lock_script = context
        .build_script(&always_success_out_point.clone(), Default::default())
        .expect("script");
    let lock_script_dep = CellDep::new_builder()
        .out_point(always_success_out_point)
        .build();

    // prepare cell deps
    let cell_deps: Vec<CellDep> = vec![lock_script_dep, js_vm_cell_dep, js_script_cell_dep];

    // prepare cells
    let input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(1000u64.pack())
            .lock(lock_script.clone())
            .build(),
        Bytes::new(),
    );
    let input = CellInput::new_builder()
        .previous_output(input_out_point.clone())
        .build();

    // args: <ckb-js-vm args, 2 bytes> <code_hash to JavaScript code cell, 32 bytes> <hash_type to JavaScript code cell, 1 byte> <JavaScript code args, variable length>
    let mut type_script_args: [u8; 35] = [0u8; 35];
    let reserved = [0u8; 2];
    let (js_cell, _) = context.get_cell(&js_script_out_point.clone()).unwrap();
    let js_type_script = js_cell.type_().to_opt().unwrap();
    let code_hash = js_type_script.calc_script_hash();
    let hash_type = js_type_script.hash_type();
    type_script_args[..2].copy_from_slice(&reserved);
    type_script_args[2..34].copy_from_slice(code_hash.as_slice());
    type_script_args[34..35].copy_from_slice(&hash_type.as_slice());

    let type_script = context
        .build_script(&js_vm_out_point, type_script_args.to_vec().into())
        .expect("script");

    let outputs = vec![
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script.clone())
            .type_(Some(type_script.clone()).pack())
            .build(),
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script)
            .build(),
    ];

    // prepare output cell data
    let outputs_data = vec![Bytes::new(), Bytes::new()];

    // build transaction
    let tx = TransactionBuilder::default()
        .cell_deps(cell_deps)
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .build();

    let tx = tx.as_advanced_builder().build();

    // run
    let cycles = context
        .verify_tx(&tx, MAX_CYCLES)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}

fn _assert_script_error(err: Error, err_code: i8) {
    let error_string = err.to_string();
    assert!(
        error_string.contains(format!("error code {} ", err_code).as_str()),
        "error_string: {}, expected_error_code: {}",
        error_string,
        err_code
    );
}
