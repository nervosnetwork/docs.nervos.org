import { Resource, Verifier } from "ckb-testtool";
import { hashCkb, hexFrom, Hex, Transaction, WitnessArgs } from "@ckb-ccc/core";
import { readFileSync } from "fs";

import { createJSScript } from "./misc";

const SCRIPT_HELLO_WORLD = readFileSync(
  "../../contracts/hello-wrold/dist/index.bc",
);
const SCRIPT_SIMPLE_PRINT_ARGS = readFileSync(
  "../../contracts/simple-print-args/dist/index.bc",
);

test("hello-world success", () => {
  const resource = Resource.default();
  const tx = Transaction.default();
  const lockScript = createJSScript(
    resource,
    tx,
    hexFrom(SCRIPT_HELLO_WORLD),
    "0x",
  );

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

test("simple-print-args success", () => {
  const resource = Resource.default();
  const tx = Transaction.default();
  const lockScript = createJSScript(
    resource,
    tx,
    hexFrom(SCRIPT_SIMPLE_PRINT_ARGS),
    "0x010203040506",
  );

  // mock a input cell with the created script as lock script
  const inputCell = resource.mockCell(lockScript);
  const witness = WitnessArgs.from({
    lock: "0x00112233445566",
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
