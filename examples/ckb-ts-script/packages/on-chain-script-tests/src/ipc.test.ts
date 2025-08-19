import { Resource, Verifier } from "ckb-testtool";
import {
  hashCkb,
  hexFrom,
  Hex,
  Transaction,
  WitnessArgs,
  Script,
} from "@ckb-ccc/core";
import { readFileSync } from "fs";

import { createJSScript, CKB_JS_VM_SCRIPT } from "./misc";

const SCRIPT_CALL_CRYPTO_SERVICE = readFileSync(
  "../../contracts/call-crypto-service/dist/index.bc",
);
const SCRIPT_IPC_PARENT = readFileSync(
  "../../contracts/ipc-parent/dist/index.bc",
);
const SCRIPT_IPC_CHILD = readFileSync(
  "../../contracts/ipc-child/dist/index.bc",
);

test("call-crypto-service success", () => {
  const resource = Resource.default();
  const tx = Transaction.default();

  // child
  const ckbCryptaService = resource.deployCell(
    hexFrom(readFileSync("../../deps/ckb-crypto-service")),
    tx,
    false,
  );

  const lockScript = createJSScript(
    resource,
    tx,
    hexFrom(SCRIPT_CALL_CRYPTO_SERVICE),
    hexFrom("0x" + ckbCryptaService.codeHash.slice(2)),
  );
  const inputCell = resource.mockCell(
    lockScript,
    undefined,
    "0xFF000000000000000000000000000000",
  );
  tx.inputs.push(Resource.createCellInput(inputCell));

  tx.outputs.push(Resource.createCellOutput(lockScript, undefined));
  tx.outputsData.push(hexFrom("0x"));
  tx.witnesses.push(
    hexFrom(
      new WitnessArgs(hashCkb([0, 0, 0, 0]), undefined, undefined).toBytes(),
    ),
  );

  let verifier = Verifier.from(resource, tx);
  verifier.verifySuccess(true);
});

test("ipc-parent success", () => {
  const resource = Resource.default();
  const tx = Transaction.default();

  // child
  const ipcChild = resource.deployCell(hexFrom(SCRIPT_IPC_CHILD), tx, false);

  const lockScript = createJSScript(
    resource,
    tx,
    hexFrom(SCRIPT_IPC_PARENT),
    hexFrom(
      "0x" + ipcChild.codeHash.slice(2) + hashCkb(CKB_JS_VM_SCRIPT).slice(2),
    ),
  );

  const inputCell = resource.mockCell(
    lockScript,
    undefined,
    "0xFF000000000000000000000000000000",
  );
  tx.inputs.push(Resource.createCellInput(inputCell));

  tx.outputs.push(Resource.createCellOutput(lockScript, undefined));
  tx.outputsData.push(hexFrom("0x"));
  tx.witnesses.push(
    hexFrom(
      new WitnessArgs(hashCkb([0, 0, 0, 0]), undefined, undefined).toBytes(),
    ),
  );

  let verifier = Verifier.from(resource, tx);
  verifier.verifySuccess(true);
});
