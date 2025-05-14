import { Resource, Verifier } from "ckb-testtool";
import { hashCkb, hexFrom, Hex, Transaction, WitnessArgs } from "@ckb-ccc/core";
import { readFileSync } from "fs";


const CKB_JS_VM_SCRIPT = readFileSync('../deps/ckb-js-vm');
const SCRIPT_HELLO_WORLD = readFileSync('../dist/hello-world.bc')
const SCRIPT_SIMPLE_PRINT_ARGS = readFileSync('../dist/simple-print-args.bc')

function createJSScript(resource: Resource, tx: Transaction, jsCode: Hex, args: Hex) {
    const lockScript = resource.deployCell(
        hexFrom(CKB_JS_VM_SCRIPT),
        tx,
        false,
    );

    const cell = resource.mockCell(
        resource.createScriptUnused(), undefined,
        jsCode,
    );
    tx.cellDeps.push(resource.createCellDep(cell, "code"));

    let code_hash = hashCkb(jsCode);
    lockScript.args = hexFrom('0x0000' + code_hash.slice(2) + '04' + args.slice(2));

    return lockScript;
}

test('hello-world success', () => {
    const resource = Resource.default();
    const tx = Transaction.default();
    const lockScript = createJSScript(resource, tx, hexFrom(SCRIPT_HELLO_WORLD), "0x");

    // mock a input cell with the created script as lock script
    const inputCell = resource.mockCell(lockScript);

    // add input cell to the transaction
    tx.inputs.push(Resource.createCellInput(inputCell));
    // add output cell to the transaction
    tx.outputs.push(Resource.createCellOutput(lockScript));
    // add output data to the transaction
    tx.outputsData.push(hexFrom("0x"));

    // verify the transaction
    const verifier = Verifier.from(resource, tx);
    verifier.verifySuccess(true);
});

test('simple-print-args success', () => {
    const resource = Resource.default();
    const tx = Transaction.default();
    const lockScript = createJSScript(resource, tx, hexFrom(SCRIPT_SIMPLE_PRINT_ARGS), "0x010203040506");

    // mock a input cell with the created script as lock script
    const inputCell = resource.mockCell(lockScript);
    const witness = WitnessArgs.from({
        lock: "0x00112233445566"
    });

    // add input cell to the transaction
    tx.inputs.push(Resource.createCellInput(inputCell));
    // add output cell to the transaction
    tx.outputs.push(Resource.createCellOutput(lockScript));
    // add output data to the transaction
    tx.outputsData.push(hexFrom("0x"));
    // add witnesses
    tx.witnesses.push(hexFrom(witness.toBytes()));

    // verify the transaction
    const verifier = Verifier.from(resource, tx);
    verifier.verifySuccess(true);
});
