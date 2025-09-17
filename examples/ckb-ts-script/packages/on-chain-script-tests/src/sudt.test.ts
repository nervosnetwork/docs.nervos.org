import { Resource, Verifier } from "ckb-testtool";
import { hashCkb, hexFrom, Hex, Transaction, WitnessArgs } from "@ckb-ccc/core";
import { readFileSync } from "fs";

import { createJSScript, createScript, SCRIPT_ALWAYS_SUCCESS } from "./misc";
const SCRIPT_SUDT = readFileSync("../../contracts/sudt/dist/index.bc");

function bigintToHex(value: bigint): Hex {
  const buf = new Uint8Array(16);
  let tmp = value;
  for (let i = 0; i < 16; i++) {
    buf[i] = Number(tmp & 0xffn);
    tmp >>= 8n;
  }
  const hex = Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hex}` as Hex;
}

test("sudt-simple success", () => {
  const resource = Resource.default();
  const tx = Transaction.default();
  const lockScript = createScript(
    resource,
    tx,
    hexFrom(SCRIPT_ALWAYS_SUCCESS),
    "0x01",
  );
  const sudtScript = createJSScript(
    resource,
    tx,
    hexFrom(SCRIPT_SUDT),
    "0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f",
  );

  // mock a input cell with the created script as lock script
  const inputCell = resource.mockCell(
    lockScript,
    sudtScript,
    bigintToHex(100n),
  );

  // add input cell to the transaction
  tx.inputs.push(Resource.createCellInput(inputCell));
  // add output cell to the transaction
  tx.outputs.push(Resource.createCellOutput(lockScript, sudtScript));
  // add output data to the transaction
  tx.outputsData.push(bigintToHex(90n));

  // verify the transaction
  const verifier = Verifier.from(resource, tx);
  verifier.verifySuccess(true);
});

test("sudt multi success", () => {
  const resource = Resource.default();
  const tx = Transaction.default();
  const lockScript = createScript(
    resource,
    tx,
    hexFrom(SCRIPT_ALWAYS_SUCCESS),
    "0x01",
  );
  const sudtScript = createJSScript(
    resource,
    tx,
    hexFrom(SCRIPT_SUDT),
    "0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f",
  );

  tx.inputs.push(
    Resource.createCellInput(
      resource.mockCell(lockScript, sudtScript, bigintToHex(100n)),
    ),
  );
  tx.inputs.push(
    Resource.createCellInput(
      resource.mockCell(lockScript, sudtScript, bigintToHex(100n)),
    ),
  );
  tx.inputs.push(
    Resource.createCellInput(
      resource.mockCell(lockScript, sudtScript, bigintToHex(100n)),
    ),
  );

  tx.outputs.push(Resource.createCellOutput(lockScript, sudtScript));
  tx.outputsData.push(bigintToHex(150n));
  tx.outputs.push(Resource.createCellOutput(lockScript, sudtScript));
  tx.outputsData.push(bigintToHex(150n));

  // verify the transaction
  const verifier = Verifier.from(resource, tx);
  verifier.verifySuccess(true);
});

test("sudt multi failed", () => {
  const resource = Resource.default();
  const tx = Transaction.default();
  const lockScript = createScript(
    resource,
    tx,
    hexFrom(SCRIPT_ALWAYS_SUCCESS),
    "0x01",
  );
  const sudtScript = createJSScript(
    resource,
    tx,
    hexFrom(SCRIPT_SUDT),
    "0x000102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f",
  );

  tx.inputs.push(
    Resource.createCellInput(
      resource.mockCell(lockScript, sudtScript, bigintToHex(100n)),
    ),
  );
  tx.inputs.push(
    Resource.createCellInput(
      resource.mockCell(lockScript, sudtScript, bigintToHex(100n)),
    ),
  );
  tx.inputs.push(
    Resource.createCellInput(
      resource.mockCell(lockScript, sudtScript, bigintToHex(100n)),
    ),
  );

  tx.outputs.push(Resource.createCellOutput(lockScript, sudtScript));
  tx.outputsData.push(bigintToHex(160n));
  tx.outputs.push(Resource.createCellOutput(lockScript, sudtScript));
  tx.outputsData.push(bigintToHex(150n));

  // verify the transaction
  const verifier = Verifier.from(resource, tx);
  verifier.verifyFailure();
});

test("sudt owner", () => {
  const resource = Resource.default();
  const tx = Transaction.default();
  const lockScript = createScript(
    resource,
    tx,
    hexFrom(SCRIPT_ALWAYS_SUCCESS),
    "0x01",
  );
  const ownerLockScript = createScript(
    resource,
    tx,
    hexFrom(SCRIPT_ALWAYS_SUCCESS),
    "0x02",
  );

  const sudtScript = createJSScript(
    resource,
    tx,
    hexFrom(SCRIPT_SUDT),
    ownerLockScript.hash(),
  );

  const inputCell = resource.mockCell(
    lockScript,
    sudtScript,
    bigintToHex(100n),
  );
  tx.inputs.push(Resource.createCellInput(inputCell));

  tx.inputs.push(Resource.createCellInput(resource.mockCell(ownerLockScript)));

  // add output cell to the transaction
  tx.outputs.push(Resource.createCellOutput(lockScript, sudtScript));
  // add output data to the transaction
  tx.outputsData.push(bigintToHex(500n));

  // verify the transaction
  const verifier = Verifier.from(resource, tx);
  verifier.verifySuccess(true);
});
