use crate::Loader;
use ckb_testtool::{
    builtin::ALWAYS_SUCCESS,
    ckb_error::Error,
    ckb_types::{
        bytes::Bytes,
        core::TransactionBuilder,
        packed::{CellDep, CellInput, CellOutput},
        prelude::*,
    },
    context::Context,
};

const MAX_CYCLES: u64 = 10_000_000;

const ERROR_CARROT_ATTACK: i8 = 100;

#[test]
fn test_no_carrot() {
    // deploy contract
    let mut context = Context::default();
    let loader = Loader::default();
    let carrot_bin = loader.load_binary("carrot");
    let carrot_out_point = context.deploy_cell(carrot_bin);
    let carrot_cell_dep = CellDep::new_builder()
        .out_point(carrot_out_point.clone())
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
    let cell_deps: Vec<CellDep> = vec![lock_script_dep, carrot_cell_dep];

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

    let type_script = context
        .build_script(&carrot_out_point, Bytes::new())
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
fn test_carrot_attack() {
    // deploy contract
    let mut context = Context::default();
    let loader = Loader::default();
    let carrot_bin = loader.load_binary("carrot");
    let carrot_out_point = context.deploy_cell(carrot_bin);
    let carrot_cell_dep = CellDep::new_builder()
        .out_point(carrot_out_point.clone())
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
    let cell_deps: Vec<CellDep> = vec![lock_script_dep, carrot_cell_dep];

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

    let type_script = context
        .build_script(&carrot_out_point, Bytes::new())
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
    let outputs_data = vec![Bytes::from("carrot"), Bytes::from("tomato")];

    // build transaction
    let tx = TransactionBuilder::default()
        .cell_deps(cell_deps)
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .build();

    let tx = tx.as_advanced_builder().build();

    // run
    let err = context.verify_tx(&tx, MAX_CYCLES).unwrap_err();
    assert_script_error(err, ERROR_CARROT_ATTACK);
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
