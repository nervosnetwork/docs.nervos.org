import { Resource, Verifier, } from "ckb-testtool";
import { HasherCkb, hexFrom, Transaction, WitnessArgs } from "@ckb-ccc/core";
import { readFileSync } from "fs";

import { createJSScript, createScript, SCRIPT_ALWAYS_SUCCESS } from "./misc";

const SCRIPT_CHECK_TYPE_ID = readFileSync('../../contracts/check-type-id/dist/index.bc')

test('check type-id minting success', () => {
    const resource = Resource.default();
    const tx = Transaction.default();
    const lockScript = createScript(resource, tx, hexFrom(SCRIPT_ALWAYS_SUCCESS), "0x0102");

    // mock a input cell with the created script as lock script
    const inputCell = Resource.createCellInput(resource.mockCell(lockScript));

    const hasher = new HasherCkb();
    hasher.update(inputCell.toBytes());
    hasher.update(new Uint8Array(new BigUint64Array([0n]).buffer))
    const typeId = hasher.digest();
    const typeScript = createJSScript(resource, tx, hexFrom(SCRIPT_CHECK_TYPE_ID), typeId);

    const outputCell = Resource.createCellOutput(lockScript, typeScript);

    // add input cell to the transaction
    tx.inputs.push(inputCell);
    // add output cell to the transaction
    tx.outputs.push(outputCell);
    // add output data to the transaction
    tx.outputsData.push(hexFrom("0x"));

    // verify the transaction
    const verifier = Verifier.from(resource, tx);
    verifier.verifySuccess(true);
});

test('check type-id minting failed', () => {
    const resource = Resource.default();
    const tx = Transaction.default();
    const lockScript = createScript(resource, tx, hexFrom(SCRIPT_ALWAYS_SUCCESS), "0x0102");

    // mock a input cell with the created script as lock script
    const inputCell = Resource.createCellInput(resource.mockCell(lockScript));

    const typeId = "0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f";
    const typeScript = createJSScript(resource, tx, hexFrom(SCRIPT_CHECK_TYPE_ID), typeId);

    const outputCell = Resource.createCellOutput(lockScript, typeScript);

    // add input cell to the transaction
    tx.inputs.push(inputCell);
    // add output cell to the transaction
    tx.outputs.push(outputCell);
    // add output data to the transaction
    tx.outputsData.push(hexFrom("0x"));

    // verify the transaction
    const verifier = Verifier.from(resource, tx);
    verifier.verifyFailure();
    verifier.verifyFailure();
});

test('check type-id transaction success', () => {
    const resource = Resource.default();
    const tx = Transaction.default();
    const lockScript = createScript(resource, tx, hexFrom(SCRIPT_ALWAYS_SUCCESS), "0x0102");

    const typeId = "0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f";
    const typeScript = createJSScript(resource, tx, hexFrom(SCRIPT_CHECK_TYPE_ID), typeId);

    // mock a input cell with the created script as lock script
    const inputCell = resource.mockCell(lockScript, typeScript);
    const outputCell = Resource.createCellOutput(lockScript, typeScript);

    // add input cell to the transaction
    tx.inputs.push(Resource.createCellInput(inputCell));
    // add output cell to the transaction
    tx.outputs.push(outputCell);
    // add output data to the transaction
    tx.outputsData.push(hexFrom("0x"));

    // verify the transaction
    const verifier = Verifier.from(resource, tx);
    verifier.verifySuccess(true);
});
