use super::*;
use crate::Loader;
use ckb_testtool::builtin::ALWAYS_SUCCESS;
use ckb_testtool::ckb_types::{bytes::Bytes, core::TransactionBuilder, packed::*, prelude::*};
use ckb_testtool::context::Context;

// Include your tests here
// See https://github.com/xxuejie/ckb-native-build-sample/blob/main/tests/src/tests.rs for more examples

// generated unit test for contract sudt
#[test]
fn test_transfer_sudt() {
    let mut context = Context::default();

    // build lock script
    let always_success_out_point = context.deploy_cell(ALWAYS_SUCCESS.clone());
    let lock_script = context
        .build_script(&always_success_out_point, Default::default())
        .expect("script");
    let lock_script_dep = CellDep::new_builder()
        .out_point(always_success_out_point)
        .build();

    // prepare scripts
    let contract_bin: Bytes = Loader::default().load_binary("sudt");
    let out_point = context.deploy_cell(contract_bin);
    let type_script = context
        .build_script(&out_point, Bytes::from(vec![42]))
        .expect("script");
    let type_script_dep = CellDep::new_builder().out_point(out_point).build();

    let input_token: u128 = 400;
    let output_token1: u128 = 300;
    let output_token2: u128 = 100;

    // prepare cells
    let input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(1000u64.pack())
            .lock(lock_script.clone())
            .type_(Some(type_script.clone()).pack())
            .build(),
        input_token.to_le_bytes().to_vec().into(),
    );
    let input = CellInput::new_builder()
        .previous_output(input_out_point)
        .build();
    let outputs = vec![
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script.clone())
            .type_(Some(type_script.clone()).pack())
            .build(),
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script)
            .type_(Some(type_script).pack())
            .build(),
    ];

    let outputs_data = vec![
        Bytes::from(output_token1.to_le_bytes().to_vec()),
        Bytes::from(output_token2.to_le_bytes().to_vec()),
    ];

    // build transaction
    let tx = TransactionBuilder::default()
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .cell_dep(lock_script_dep)
        .cell_dep(type_script_dep)
        .build();
    let tx = context.complete_tx(tx);

    // run
    let cycles = context
        .verify_tx(&tx, 10_000_000)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}

#[test]
fn test_owner_mode_sudt() {
    let mut context = Context::default();

    // build lock script
    let always_success_out_point = context.deploy_cell(ALWAYS_SUCCESS.clone());
    let lock_script = context
        .build_script(&always_success_out_point, Default::default())
        .expect("script");
    let lock_script_dep = CellDep::new_builder()
        .out_point(always_success_out_point)
        .build();

    // prepare scripts
    let contract_bin: Bytes = Loader::default().load_binary("sudt");
    let out_point = context.deploy_cell(contract_bin);
    let type_script = context
        .build_script(&out_point, lock_script.calc_script_hash().as_bytes())
        .expect("script");
    let type_script_dep = CellDep::new_builder().out_point(out_point).build();

    let input_token: u128 = 400;
    let output_token1: u128 = 300;
    let output_token2: u128 = 500;

    // prepare cells
    let input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(1000u64.pack())
            .lock(lock_script.clone())
            .type_(Some(type_script.clone()).pack())
            .build(),
        input_token.to_le_bytes().to_vec().into(),
    );
    let input = CellInput::new_builder()
        .previous_output(input_out_point)
        .build();
    let outputs = vec![
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script.clone())
            .type_(Some(type_script.clone()).pack())
            .build(),
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script)
            .type_(Some(type_script).pack())
            .build(),
    ];

    let outputs_data = vec![
        Bytes::from(output_token1.to_le_bytes().to_vec()),
        Bytes::from(output_token2.to_le_bytes().to_vec()),
    ];

    // build transaction
    let tx = TransactionBuilder::default()
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .cell_dep(lock_script_dep)
        .cell_dep(type_script_dep)
        .build();
    let tx = context.complete_tx(tx);

    // run
    let cycles = context
        .verify_tx(&tx, 10_000_000)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}

#[test]
fn test_overissue_sudt() {
    let mut context = Context::default();

    // build lock script
    let always_success_out_point = context.deploy_cell(ALWAYS_SUCCESS.clone());
    let lock_script = context
        .build_script(&always_success_out_point, Default::default())
        .expect("script");
    let lock_script_dep = CellDep::new_builder()
        .out_point(always_success_out_point)
        .build();

    // prepare scripts
    let contract_bin: Bytes = Loader::default().load_binary("sudt");
    let out_point = context.deploy_cell(contract_bin);
    let type_script = context
        .build_script(&out_point, Bytes::from(vec![42]))
        .expect("script");
    let type_script_dep = CellDep::new_builder().out_point(out_point).build();

    let input_token: u128 = 400;
    let output_token1: u128 = 300;
    let output_token2: u128 = 500;

    // prepare cells
    let input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(1000u64.pack())
            .lock(lock_script.clone())
            .type_(Some(type_script.clone()).pack())
            .build(),
        input_token.to_le_bytes().to_vec().into(),
    );
    let input = CellInput::new_builder()
        .previous_output(input_out_point)
        .build();
    let outputs = vec![
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script.clone())
            .type_(Some(type_script.clone()).pack())
            .build(),
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script)
            .type_(Some(type_script).pack())
            .build(),
    ];

    let outputs_data = vec![
        Bytes::from(output_token1.to_le_bytes().to_vec()),
        Bytes::from(output_token2.to_le_bytes().to_vec()),
    ];

    // build transaction
    let tx = TransactionBuilder::default()
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .cell_dep(lock_script_dep)
        .cell_dep(type_script_dep)
        .build();
    let tx = context.complete_tx(tx);

    // run
    let err = context.verify_tx(&tx, 10_000_000).unwrap_err();
    assert_script_error(err, 13);
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
