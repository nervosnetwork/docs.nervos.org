import { Resource, DEFAULT_SCRIPT_ALWAYS_SUCCESS } from "ckb-testtool";
import { hashCkb, hexFrom, Hex, Transaction, Script } from "@ckb-ccc/core";
import { readFileSync } from "fs";

const CKB_JS_VM_SCRIPT = readFileSync('node_modules/ckb-testtool/src/unittest/defaultScript/ckb-js-vm');

export const SCRIPT_ALWAYS_SUCCESS = readFileSync(DEFAULT_SCRIPT_ALWAYS_SUCCESS)

export function createJSScript(resource: Resource, tx: Transaction, jsCode: Hex, args: Hex): Script {
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

export function createScript(resource: Resource, tx: Transaction, scriptBin: Hex, args: Hex): Script {
    const lockScript = resource.deployCell(
        scriptBin,
        tx,
        false,
    );
    lockScript.args = args;
    return lockScript;
}
