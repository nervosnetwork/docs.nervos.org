import {
  hexFrom,
  Transaction,
  hashTypeToBytes,
  hashCkb,
  WitnessArgs,
} from "@ckb-ccc/core";
import { readFileSync } from "fs";
import {
  Resource,
  Verifier,
  DEFAULT_SCRIPT_ALWAYS_SUCCESS,
  DEFAULT_SCRIPT_CKB_JS_VM,
} from "ckb-testtool";

describe("hash-lock contract", () => {
  test("should execute successfully", async () => {
    const resource = Resource.default();
    const tx = Transaction.default();

    const mainScript = resource.deployCell(
      hexFrom(readFileSync(DEFAULT_SCRIPT_CKB_JS_VM)),
      tx,
      false,
    );
    const alwaysSuccessScript = resource.deployCell(
      hexFrom(readFileSync(DEFAULT_SCRIPT_ALWAYS_SUCCESS)),
      tx,
      false,
    );
    const contractScript = resource.deployCell(
      hexFrom(readFileSync("dist/hash-lock.bc")),
      tx,
      false,
    );

    const preimage = "Hello World";
    const hash = hashCkb(Array.from(preimage).map((c) => c.charCodeAt(0)));

    mainScript.args = hexFrom(
      "0x0000" +
        contractScript.codeHash.slice(2) +
        hexFrom(hashTypeToBytes(contractScript.hashType)).slice(2) +
        hash.slice(2),
    );

    // 1 input cell
    const inputCell = resource.mockCell(mainScript, undefined, "0x");
    tx.inputs.push(Resource.createCellInput(inputCell));

    // 2 output cells
    tx.outputs.push(Resource.createCellOutput(alwaysSuccessScript));
    tx.outputsData.push(hexFrom("0xFE000000000000000000000000000000"));
    tx.outputs.push(Resource.createCellOutput(alwaysSuccessScript));
    tx.outputsData.push(hexFrom("0x01000000000000000000000000000000"));

    // fill the witness with preimage
    tx.witnesses.push(
      hexFrom(
        new WitnessArgs(
          hexFrom(Array.from(preimage).map((c) => c.charCodeAt(0))),
        ).toBytes(),
      ),
    );

    const verifier = Verifier.from(resource, tx);
    verifier.verifySuccess(true);
  });
});
