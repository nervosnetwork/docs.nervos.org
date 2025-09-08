import {
  hexFrom,
  ccc,
  hashTypeToBytes,
  hashCkb,
  WitnessArgs,
} from "@ckb-ccc/core";
import scripts from "../deployment/scripts.json";
import systemScripts from "../deployment/system-scripts.json";
import { buildClient, buildSigner } from "./helper";

describe("hash-lock contract", () => {
  let client: ccc.Client;
  let signer: ccc.SignerCkbPrivateKey;

  beforeAll(() => {
    // Create global devnet client and signer for all tests in this describe block
    client = buildClient("devnet");
    signer = buildSigner(client);
  });

  test("should execute successfully", async () => {
    const ckbJsVmScript = systemScripts.devnet["ckb_js_vm"];
    const contractScript = scripts.devnet["hash-lock.bc"];

    const preimage = "Hello World";
    const hash = hashCkb(Array.from(preimage).map((c) => c.charCodeAt(0)));

    const mainScript = {
      codeHash: ckbJsVmScript.script.codeHash,
      hashType: ckbJsVmScript.script.hashType,
      args: hexFrom(
        "0x0000" +
          contractScript.codeHash.slice(2) +
          hexFrom(hashTypeToBytes(contractScript.hashType)).slice(2) +
          hash.slice(2),
      ),
    };

    const tx = ccc.Transaction.from({
      outputs: [
        {
          lock: mainScript,
        },
      ],
      cellDeps: [
        ...ckbJsVmScript.script.cellDeps.map((c) => c.cellDep),
        ...contractScript.cellDeps.map((c) => c.cellDep),
      ],
    });

    await tx.completeInputsByCapacity(signer);
    await tx.completeFeeBy(signer, 1000);
    const txHash = await signer.sendTransaction(tx);
    console.log(`Transaction sent: ${txHash}`);

    // construct second tx to consume the cell we just created
    const secondTx = ccc.Transaction.from({
      inputs: [
        {
          previousOutput: {
            txHash: txHash,
            index: 0,
          },
        },
      ],
      outputs: [{ lock: mainScript }],
      cellDeps: [
        ...ckbJsVmScript.script.cellDeps.map((c) => c.cellDep),
        ...contractScript.cellDeps.map((c) => c.cellDep),
      ],
    });
    // fill the witness with preimage
    secondTx.witnesses.push(
      hexFrom(
        new WitnessArgs(
          hexFrom(Array.from(preimage).map((c) => c.charCodeAt(0))),
        ).toBytes(),
      ),
    );
    await secondTx.completeInputsByCapacity(signer);
    await secondTx.completeFeeBy(signer, 1000);
    const secondTxHash = await signer.sendTransaction(secondTx);
    console.log(`Second Transaction sent: ${secondTxHash}`);
  });
});
