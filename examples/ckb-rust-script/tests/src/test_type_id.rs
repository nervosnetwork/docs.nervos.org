use crate::Loader;
use ckb_testtool::ckb_hash;
use ckb_testtool::ckb_types::{bytes::Bytes, core::TransactionBuilder, packed::*, prelude::*};
use ckb_testtool::context::Context;

#[test]
fn test_type_id_minting() {
    // deploy contract
    let mut context = Context::default();
    let contract_bin: Bytes = Loader::default().load_binary("type-id");
    let out_point = context.deploy_cell(contract_bin);

    let alway_suc = ckb_testtool::builtin::ALWAYS_SUCCESS.clone();
    let alway_suc_out_point = context.deploy_cell(alway_suc);

    // prepare scripts
    let lock_script = context
        .build_script(&alway_suc_out_point, Bytes::from(vec![42]))
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

    let type_id_1 = {
        let mut ctx = ckb_hash::new_blake2b();
        ctx.update(input.as_slice());
        ctx.update(&0u64.to_le_bytes());

        let mut hash = [0u8; 32];
        ctx.finalize(&mut hash);
        hash
    };
    let type_script_1 = context
        .build_script(&out_point, Bytes::from(vec![[0u8; 32], type_id_1].concat()))
        .expect("script");

    let type_id_2 = {
        let mut ctx = ckb_hash::new_blake2b();
        ctx.update(input.as_slice());
        ctx.update(&1u64.to_le_bytes());

        let mut hash = [0u8; 32];
        ctx.finalize(&mut hash);
        hash
    };
    let type_script_2 = context
        .build_script(&out_point, Bytes::from(vec![[0u8; 32], type_id_2].concat()))
        .expect("script");

    let outputs = vec![
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script.clone())
            .type_(Some(type_script_1).pack())
            .build(),
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script)
            .type_(Some(type_script_2).pack())
            .build(),
    ];

    let outputs_data = vec![Bytes::new(); 2];

    // build transaction
    let tx = TransactionBuilder::default()
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .build();
    let tx = context.complete_tx(tx);

    // run
    let cycles = context
        .verify_tx(&tx, 10_000_000)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}
