// Include your tests here
// See https://github.com/xxuejie/ckb-native-build-sample/blob/main/tests/src/tests.rs for examples

use super::*;
use ckb_testtool::{
    ckb_hash::blake2b_256,
    ckb_types::{
        bytes::Bytes,
        core::{ScriptHashType, TransactionBuilder},
        packed::*,
        prelude::*,
    },
    context::Context,
};

const MAX_CYCLES: u64 = 10_000_000;

#[test]
fn test_hash_lock() {
    // deploy contract
    let mut context = Context::default();
    let loader = Loader::default();
    let hash_lock_out_point = context.deploy_cell(loader.load_binary("simple-lock"));

    let preimage: Bytes = Bytes::from("this is my secret preimage");
    let expected_hash = blake2b_256(preimage.clone().to_vec());

    let hash_lock_script = context
        .build_script_with_hash_type(
            &hash_lock_out_point,
            ScriptHashType::Data2,
            Bytes::copy_from_slice(&expected_hash),
        )
        .expect("script");

    // prepare cells
    let input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(1000u64.pack())
            .lock(hash_lock_script.clone())
            .build(),
        Bytes::new(),
    );
    let input: CellInput = CellInput::new_builder()
        .previous_output(input_out_point.clone())
        .build();

    let output = CellOutput::new_builder()
        .capacity(900u64.pack())
        .lock(hash_lock_script)
        .build();

    // prepare output cell data
    let output_data = Bytes::from("");

    // prepare witness for hash_lock
    let witness_builder = WitnessArgs::new_builder();
    let witness = witness_builder.lock(Some(preimage).pack()).build();

    // build transaction
    let tx = TransactionBuilder::default()
        .input(input)
        .output(output)
        .output_data(output_data.pack())
        .witness(witness.as_bytes().pack())
        .build();
    let tx = context.complete_tx(tx);

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
    let hash_lock_out_point = context.deploy_cell(loader.load_binary("simple-lock"));

    let preimage: Bytes = Bytes::from("this is my secret preimage");
    let expected_hash = blake2b_256(preimage.clone().to_vec());

    let hash_lock_script = context
        .build_script_with_hash_type(
            &hash_lock_out_point,
            ScriptHashType::Data2,
            Bytes::copy_from_slice(&expected_hash),
        )
        .expect("script");

    // prepare cells
    let input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(1000u64.pack())
            .lock(hash_lock_script.clone())
            .build(),
        Bytes::new(),
    );
    let input: CellInput = CellInput::new_builder()
        .previous_output(input_out_point.clone())
        .build();

    let output = CellOutput::new_builder()
        .capacity(900u64.pack())
        .lock(hash_lock_script)
        .build();

    // prepare output cell data
    let output_data = Bytes::from("");

    // prepare witness for hash_lock
    let invalid_preimage: Bytes = Bytes::from("this is invalid preimage");
    let witness_builder = WitnessArgs::new_builder();
    let witness = witness_builder.lock(Some(invalid_preimage).pack()).build();

    // build transaction
    let tx = TransactionBuilder::default()
        .input(input)
        .output(output)
        .output_data(output_data.pack())
        .witness(witness.as_bytes().pack())
        .build();
    let tx = context.complete_tx(tx);

    // run
    let err = context.verify_tx(&tx, MAX_CYCLES).unwrap_err();
    assert_script_error(err, 11);
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
