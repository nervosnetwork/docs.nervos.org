import { DEFAULT_SCRIPT_ALWAYS_SUCCESS, Resource, Verifier } from "ckb-testtool";
import { hashCkb, hexFrom, Hex, Transaction } from "@ckb-ccc/core";
import { readFileSync } from "fs";


const CKB_JS_VM_SCRIPT = readFileSync('../deps/ckb-js-vm');
const SCRIPT_HELLO_WORLD = readFileSync('../dist/hello-world.bc')

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

    let code_hash = hashCkb(SCRIPT_HELLO_WORLD);
    lockScript.args = hexFrom('0x0000' + code_hash.slice(2) + '04' + args.slice(2));

    return lockScript;
}

test('hello-world check', () => {
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
