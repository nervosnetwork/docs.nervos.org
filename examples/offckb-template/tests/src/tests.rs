// Include your tests here
// See https://github.com/xxuejie/ckb-native-build-sample/blob/main/tests/src/tests.rs for examples

use super::*;
use ckb_testtool::{
    ckb_types::{bytes::Bytes, core::TransactionBuilder, packed::*, prelude::*},
    context::Context,
};

const MAX_CYCLES: u64 = 10_000_000;

#[test]
fn test_always_success() {
    // deploy contract
    let mut context = Context::default();
    let loader = Loader::default();
    let my_contract_bin = loader.load_binary("always-success");
    let my_contract_out_point = context.deploy_cell(my_contract_bin);

    // prepare scripts
    let lock_script = context
        .build_script(&my_contract_out_point.clone(), Default::default())
        .expect("script");

    // prepare cell deps
    let my_contract_dep = CellDep::new_builder()
        .out_point(my_contract_out_point.clone())
        .build();
    let cell_deps = vec![my_contract_dep].pack();

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

    // prepare output cell data
    let outputs_data = vec![Bytes::new(), Bytes::new()];

    // build transaction
    let tx = TransactionBuilder::default()
        .cell_deps(cell_deps)
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .build();

    // add witness
    let witness_builder = WitnessArgs::new_builder();
    let zero_lock: Bytes = {
        let mut buf = Vec::new();
        buf.resize(65, 0);
        buf.into()
    };
    let witness = witness_builder
        .lock(Some(zero_lock).pack())
        .build();

    let tx = tx
        .as_advanced_builder()
        .witness(witness.as_bytes().pack())
        .build();

    // run
    let cycles = context
        .verify_tx(&tx, MAX_CYCLES)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}
