import { hexFrom, Transaction, hashTypeToBytes, WitnessArgs, hashCkb } from "@ckb-ccc/core";
import { readFileSync } from "fs";
import {
  Resource,
  Verifier,
  DEFAULT_SCRIPT_ALWAYS_SUCCESS,
  DEFAULT_SCRIPT_CKB_JS_VM,
} from "ckb-testtool";

async function main() {
  const resource = Resource.default();
  const tx = Transaction.default();

  const mainScript = resource.deployCell(
    hexFrom(readFileSync(DEFAULT_SCRIPT_CKB_JS_VM)),
    tx,
    false,
  );

  const preimage = "Hello World";

  const jsScript = resource.deployCell(
    hexFrom(readFileSync("../on-chain-script/dist/index.bc")),
    tx,
    false,
  );
  mainScript.args = hexFrom(
    "0x0000" +
    jsScript.codeHash.slice(2) +
    hexFrom(hashTypeToBytes(jsScript.hashType)).slice(2) +
    hashCkb(Array.from(preimage).map(c => c.charCodeAt(0))).slice(2),
  );
  const inputCell = resource.mockCell(
    mainScript,
    undefined,
    "0x",
  );
  tx.inputs.push(Resource.createCellInput(inputCell));

  const alwaysSuccessScript = resource.deployCell(
    hexFrom(readFileSync(DEFAULT_SCRIPT_ALWAYS_SUCCESS)),
    tx,
    false,
  );
  tx.outputs.push(Resource.createCellOutput(alwaysSuccessScript, undefined));
  tx.outputsData.push(hexFrom("0x"));

  tx.witnesses.push(
    hexFrom(
      new WitnessArgs(
        hexFrom(Array.from(preimage).map(c => c.charCodeAt(0))),
        undefined,
        undefined,
      ).toBytes(),
    )
  );

  const verifier = Verifier.from(resource, tx);
  verifier.verifySuccess(true);
}

describe("unit test", () => {
  test("success", () => {
    main();
  });
});
