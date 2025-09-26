import { ccc, hexFrom, hashTypeToBytes } from "@ckb-ccc/core";
import { cccClient, readEnvNetwork } from "./ccc-client";
import scripts from "../deployment/scripts.json";
import systemScripts from "../deployment/system-scripts.json";

const myScripts = scripts[readEnvNetwork()] as any;
const mySystemScripts = systemScripts[readEnvNetwork()] as any;

export function uint8ArrayToHexString(uint8Array: Uint8Array): string {
  return Array.prototype.map
    .call(uint8Array, (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

export function stringToBytesHex(text: string) {
  const encoder = new TextEncoder();
  const buf: Uint8Array = encoder.encode(text);
  console.log("preimage: ", buf);
  return "0x" + uint8ArrayToHexString(buf);
}

export async function capacityOf(address: string): Promise<bigint> {
  const addr = await ccc.Address.fromString(address, cccClient);
  let balance = await cccClient.getBalance([addr.script]);
  return balance;
}

export async function wait(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function shannonToCKB(amount: bigint) {
  return amount / BigInt(100000000);
}

export function generateAccount(hash: string) {
  const lockArgs =
    "0x0000" +
    myScripts["hash-lock.bc"]!.codeHash.slice(2) +
    hexFrom(hashTypeToBytes(myScripts["hash-lock.bc"]!.hashType)).slice(2) +
    hash;
  const lockScript = {
    codeHash: mySystemScripts["ckb_js_vm"]!.script.codeHash,
    hashType: mySystemScripts["ckb_js_vm"]!.script.hashType,
    args: lockArgs,
  };
  const address = ccc.Address.fromScript(lockScript, cccClient).toString();
  return {
    address,
    lockScript: ccc.Script.from(lockScript),
  };
}

export async function unlock(
  fromAddr: string,
  toAddr: string,
  amountInCKB: string,
): Promise<string> {
  const fromScript = (await ccc.Address.fromString(fromAddr, cccClient)).script;
  const toScript = (await ccc.Address.fromString(toAddr, cccClient)).script;
  const readSigner = new ccc.SignerCkbScriptReadonly(cccClient, fromScript);

  // Build the full transaction
  const tx = ccc.Transaction.from({
    outputs: [{ lock: toScript }],
    outputsData: [],
  });

  // CCC transactions are easy to be edited
  tx.outputs.forEach((output, i) => {
    if (output.capacity > ccc.fixedPointFrom(amountInCKB)) {
      alert(`Insufficient capacity at output ${i} to store data`);
      return;
    }
    output.capacity = ccc.fixedPointFrom(amountInCKB);
  });

  // Complete missing parts for transaction
  await tx.addCellDeps(myScripts["hash-lock.bc"]!.cellDeps[0].cellDep);
  await tx.addCellDeps(
    mySystemScripts["ckb_js_vm"]!.script.cellDeps[0].cellDep,
  );

  // Here calculate the minimum capacity of a single Cell (about 73)
  let occupiedSize = ccc.CellOutput.from({
    capacity: BigInt(1000),
    lock: fromScript,
  }).occupiedSize;
  console.log(`occupiedSize: ${occupiedSize}`);

  await tx.completeInputsByCapacity(
    readSigner,
    ccc.fixedPointFrom(occupiedSize),
  );
  const balanceDiff =
    (await tx.getInputsCapacity(cccClient)) - tx.getOutputsCapacity();
  console.log("balanceDiff: ", balanceDiff);
  if (balanceDiff > ccc.Zero) {
    tx.addOutput({
      lock: fromScript,
      capacity: balanceDiff - BigInt(1000), // Fee 1000
    });
  }

  // fill the witness with preimage
  const preimageAnswer = window.prompt("please enter the preimage: ");
  if (preimageAnswer == null) {
    throw new Error("user abort input!");
  }
  const newWitnessArgs = new ccc.WitnessArgs(
    stringToBytesHex(preimageAnswer) as `0x${string}`,
  );
  console.log(`newWitnessArgs: ${JSON.stringify(newWitnessArgs)}`);
  tx.setWitnessArgsAt(0, newWitnessArgs);

  const txHash = await cccClient.sendTransaction(tx);
  console.log("Full transaction: ", tx.stringify());
  return txHash;
}
