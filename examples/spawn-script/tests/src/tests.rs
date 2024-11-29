use crate::Loader;
use ckb_testtool::ckb_types::{
    bytes::Bytes,
    core::TransactionBuilder,
    packed::*,
    prelude::*,
};
use ckb_testtool::context::Context;

// Include your tests here
// See https://github.com/xxuejie/ckb-native-build-sample/blob/main/tests/src/tests.rs for more examples

// generated unit test for contract caller
#[test]
fn test_spawn() {
    // deploy contract
    let mut context = Context::default();
    let caller_contract_bin: Bytes = Loader::default().load_binary("caller");
    let caller_out_point = context.deploy_cell(caller_contract_bin);
    let callee_contract_bin: Bytes = Loader::default().load_binary("callee");
    let callee_out_point = context.deploy_cell(callee_contract_bin);
   
    // prepare scripts
    let lock_script = context
        .build_script(&caller_out_point, Bytes::from(vec![42]))
        .expect("script");

    // prepare cells
    let input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(1000u64.pack())
            .lock(lock_script.clone())
            .build(),
        Bytes::new(),
    );
    let input = CellInput::new_builder()
        .previous_output(input_out_point)
        .build();
    let outputs = vec![
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script.clone())
            .build(),
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script)
            .build(),
    ];

    let outputs_data = vec![Bytes::new(); 2];

    // prepare cell deps
    let callee_dep = CellDep::new_builder()
        .out_point(callee_out_point)
        .build();
    let caller_dep = CellDep::new_builder()
        .out_point(caller_out_point)
        .build();
    let cell_deps: Vec<CellDep> = vec![callee_dep, caller_dep];

    // build transaction
    let tx = TransactionBuilder::default()
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .cell_deps(cell_deps)
        .build();
    let tx = context.complete_tx(tx);

    // run
    let cycles = context
        .verify_tx(&tx, 10_000_000)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}
