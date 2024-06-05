// Include your tests here
// See https://github.com/xxuejie/ckb-native-build-sample/blob/main/tests/src/tests.rs for examples

use super::*;
use ckb_testtool::{
    builtin::ALWAYS_SUCCESS,
    ckb_hash::blake2b_256,
    ckb_types::{bytes::Bytes, core::TransactionBuilder, packed::*, prelude::*},
    context::Context,
};

const MAX_CYCLES: u64 = 10_000_000;

#[test]
fn test_hash_lock() {
    // deploy contract
    let mut context = Context::default();
    let loader = Loader::default();
    let hash_lock_bin = loader.load_binary("hash-lock");
    let hash_lock_out_point = context.deploy_cell(hash_lock_bin);
    let hash_lock_cell_dep = CellDep::new_builder()
        .out_point(hash_lock_out_point.clone())
        .build();

    // prepare scripts
    let always_success_out_point = context.deploy_cell(ALWAYS_SUCCESS.clone());
    let always_success_lock_script = context
        .build_script(&always_success_out_point.clone(), Default::default())
        .expect("script");
    let lock_script_dep = CellDep::new_builder()
        .out_point(always_success_out_point)
        .build();

    let preimage: Bytes = Bytes::from("this is my secret preimage");
    let expected_hash = blake2b_256(preimage.clone().to_vec());
    println!(
        "preimage: {:?}, hash: {:?}",
        preimage.to_vec(),
        expected_hash
    );

    let hash_lock_script = context
        .build_script(&hash_lock_out_point, Bytes::copy_from_slice(&expected_hash))
        .expect("script");

    // prepare cell deps
    let cell_deps: Vec<CellDep> = vec![lock_script_dep, hash_lock_cell_dep];

    // prepare cells
    let input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(1000u64.pack())
            .lock(hash_lock_script.clone())
            .build(),
        Bytes::new(),
    );
    let input = CellInput::new_builder()
        .previous_output(input_out_point.clone())
        .build();

    let outputs = vec![
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(always_success_lock_script.clone())
            .build(),
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(always_success_lock_script)
            .build(),
    ];

    // prepare output cell data
    let outputs_data = vec![Bytes::from(""), Bytes::from("")];

    // prepare witness for hash_lock
    let witness_builder = WitnessArgs::new_builder();
    let witness = witness_builder.lock(Some(preimage).pack()).build();

    // build transaction
    let tx = TransactionBuilder::default()
        .cell_deps(cell_deps)
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .witness(witness.as_bytes().pack())
        .build();

    let tx = tx.as_advanced_builder().build();

    // run
    let cycles = context
        .verify_tx(&tx, MAX_CYCLES)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}

#[test]
fn test_invalid_hash_lock() {
    // deploy contract
    let mut context = Context::default();
    let loader = Loader::default();
    let hash_lock_bin = loader.load_binary("hash-lock");
    let hash_lock_out_point = context.deploy_cell(hash_lock_bin);
    let hash_lock_cell_dep = CellDep::new_builder()
        .out_point(hash_lock_out_point.clone())
        .build();

    // prepare scripts
    let always_success_out_point = context.deploy_cell(ALWAYS_SUCCESS.clone());
    let always_success_lock_script = context
        .build_script(&always_success_out_point.clone(), Default::default())
        .expect("script");
    let lock_script_dep = CellDep::new_builder()
        .out_point(always_success_out_point)
        .build();

    let preimage: Bytes = Bytes::from("this is my preimage");
    let expected_hash = blake2b_256(preimage.clone().to_vec());

    let hash_lock_script = context
        .build_script(&hash_lock_out_point, Bytes::copy_from_slice(&expected_hash))
        .expect("script");

    // prepare cell deps
    let cell_deps: Vec<CellDep> = vec![lock_script_dep, hash_lock_cell_dep];

    // prepare cells
    let input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(1000u64.pack())
            .lock(hash_lock_script.clone())
            .build(),
        Bytes::new(),
    );
    let input = CellInput::new_builder()
        .previous_output(input_out_point.clone())
        .build();

    let outputs = vec![
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(always_success_lock_script.clone())
            .build(),
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(always_success_lock_script)
            .build(),
    ];

    // prepare output cell data
    let outputs_data = vec![Bytes::from(""), Bytes::from("")];

    // prepare witness for hash_lock
    let invalid_preimage: Bytes = Bytes::from("this is invalid preimage");
    let witness_builder = WitnessArgs::new_builder();
    let witness = witness_builder.lock(Some(invalid_preimage).pack()).build();

    // build transaction
    let tx = TransactionBuilder::default()
        .cell_deps(cell_deps)
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .witness(witness.as_bytes().pack())
        .build();

    let tx = tx.as_advanced_builder().build();

    // run
    let err = context.verify_tx(&tx, MAX_CYCLES).unwrap_err();
    assert_script_error(err, 6);
}

fn assert_script_error(err: Error, err_code: i8) {
    let error_string = err.to_string();
    assert!(
        error_string.contains(format!("error code {} ", err_code).as_str()),
        "error_string: {}, expected_error_code: {}",
        error_string,
        err_code
    );
}
