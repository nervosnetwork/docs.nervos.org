use crate::Loader;
use ckb_testtool::ckb_hash;
use ckb_testtool::ckb_types::{bytes::Bytes, core::TransactionBuilder, packed::*, prelude::*};
use ckb_testtool::context::Context;

// Include your tests here
// See https://github.com/xxuejie/ckb-native-build-sample/blob/main/tests/src/tests.rs for more examples

// generated unit test for contract hello-world
#[test]
fn test_hello_world() {
    // deploy contract
    let mut context = Context::default();
    let contract_bin: Bytes = Loader::default().load_binary("hello-world");
    let out_point = context.deploy_cell(contract_bin);

    // prepare scripts
    let lock_script = context
        .build_script(&out_point, Bytes::from(vec![42]))
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

#[test]
fn test_empty() {
    // deploy contract
    let mut context = Context::default();
    let contract_bin: Bytes = Loader::default().load_binary("empty");
    let out_point = context.deploy_cell(contract_bin);

    // prepare scripts
    let lock_script = context
        .build_script(&out_point, Bytes::from(vec![42]))
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

// generated unit test for contract simple-print-args
#[test]
fn test_simple_print_args() {
    // deploy contract
    let mut context = Context::default();
    let contract_bin: Bytes = Loader::default().load_binary("simple-print-args");
    let out_point = context.deploy_cell(contract_bin);

    // prepare scripts
    let args_data = ckb_testtool::context::random_hash().as_bytes();
    let lock_script = context.build_script(&out_point, args_data).unwrap();

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

    // build transaction
    let tx = TransactionBuilder::default()
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .build();
    let tx = context.complete_tx(tx);

    println!(
        "{}",
        &serde_json::to_string(&context.dump_tx(&tx).expect("dump tx info"))
            .expect("tx format json")
    );

    // run
    let cycles = context
        .verify_tx(&tx, 10_000_000)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}

// generated unit test for contract log
#[test]
fn test_log() {
    // deploy contract
    let mut context = Context::default();
    let contract_bin: Bytes = Loader::default().load_binary("log");
    let out_point = context.deploy_cell(contract_bin);

    // prepare scripts
    let lock_script = context
        .build_script(&out_point, Bytes::from(vec![42]))
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

#[test]
fn test_spawn() {
    let mut context = Context::default();

    // deploy contract
    let (parent_out_point, child_out_point) = {
        let loader = Loader::default();
        let parent_contract_bin: Bytes = loader.load_binary("spawn-parent");
        let child_contract_bin: Bytes = loader.load_binary("spawn-child");
        (
            context.deploy_cell(parent_contract_bin),
            context.deploy_cell(child_contract_bin),
        )
    };

    // get child type id
    let (cell, _) = context.get_cell(&child_out_point).unwrap();
    let code_hash = cell.type_().to_opt().unwrap().calc_script_hash();

    // prepare scripts
    let lock_script = context
        .build_script(
            &parent_out_point,
            Bytes::from(
                vec![
                    code_hash.as_slice(),
                    &[ckb_testtool::ckb_types::core::ScriptHashType::Type.into()],
                ]
                .concat(),
            ),
        )
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

    // build transaction
    let tx = TransactionBuilder::default()
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .build();
    let tx = context.complete_tx(tx);
    let tx = tx
        .as_advanced_builder()
        .cell_dep({
            CellDep::new_builder()
                .out_point(child_out_point)
                .dep_type(ckb_testtool::ckb_types::core::DepType::Code.into())
                .build()
        })
        .build();

    // run
    let cycles = context
        .verify_tx(&tx, 10_000_000)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}

#[test]
fn test_ipc() {
    let mut context = Context::default();

    // deploy contract
    let (parent_out_point, child_out_point) = {
        let loader = Loader::default();
        let parent_contract_bin: Bytes = loader.load_binary("ipc-parent");
        let child_contract_bin: Bytes = loader.load_binary("ipc-child");
        (
            context.deploy_cell(parent_contract_bin),
            context.deploy_cell(child_contract_bin),
        )
    };

    // get child type id
    let (cell, _) = context.get_cell(&child_out_point).unwrap();
    let code_hash = cell.type_().to_opt().unwrap().calc_script_hash();

    // prepare scripts
    let lock_script = context
        .build_script(
            &parent_out_point,
            Bytes::from(code_hash.as_slice().to_vec()),
        )
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

    // build transaction
    let tx = TransactionBuilder::default()
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .build();
    let tx = context.complete_tx(tx);
    let tx = tx
        .as_advanced_builder()
        .cell_dep({
            CellDep::new_builder()
                .out_point(child_out_point)
                .dep_type(ckb_testtool::ckb_types::core::DepType::Code.into())
                .build()
        })
        .build();

    // run
    let cycles = context
        .verify_tx(&tx, 10_000_000)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}

#[test]
fn test_crypto_service_hash() {
    // deploy contract
    let mut context = Context::default();
    let contract_bin: Bytes = Loader::default().load_binary("crypto-service-hash");
    let out_point = context.deploy_cell(contract_bin);

    let crypto_service_out_point = context.deploy_cell(Loader::load_crypto_service());
    let (cell, _) = context.get_cell(&crypto_service_out_point).unwrap();
    let crypto_service_code_hash = cell.type_().to_opt().unwrap().calc_script_hash();

    // prepare scripts
    let lock_script = context
        .build_script(&out_point, Bytes::from(crypto_service_code_hash.as_slice().to_vec()))
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

    let witness = WitnessArgsBuilder::default()
        .lock({
            let hash = ckb_hash::blake2b_256(vec![
                0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00,
            ])
            .to_vec();
            Some(Bytes::from(hash)).pack()
        })
        .build();

    // build transaction
    let tx = TransactionBuilder::default()
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .witness(witness.as_bytes().pack())
        .build();
    let tx = context.complete_tx(tx);
    let tx = tx
        .as_advanced_builder()
        .cell_dep({
            CellDep::new_builder()
                .out_point(crypto_service_out_point)
                .dep_type(ckb_testtool::ckb_types::core::DepType::Code.into())
                .build()
        })
        .build();

    // run
    let cycles = context
        .verify_tx(&tx, 10_000_000)
        .expect("pass verification");
    println!("consume cycles: {}", cycles);
}
