import offCKB, { Network } from "@/offckb.config";
import { ccc, CellDepInfoLike, KnownScript, Script } from "@ckb-ccc/core";

export const DEVNET_SCRIPTS: Record<
  string,
  Pick<Script, "codeHash" | "hashType"> & { cellDeps: CellDepInfoLike[] }
> = {
  [KnownScript.Secp256k1Blake160]:
    offCKB.systemScripts.secp256k1_blake160_sighash_all!.script,
  [KnownScript.Secp256k1Multisig]:
    offCKB.systemScripts.secp256k1_blake160_multisig_all!.script,
  [KnownScript.AnyoneCanPay]: offCKB.systemScripts.anyone_can_pay!.script,
  [KnownScript.OmniLock]: offCKB.systemScripts.omnilock!.script,
  [KnownScript.XUdt]: offCKB.systemScripts.xudt!.script,
};

export function buildCccClient(network: Network) {
  const client =
    network === "mainnet"
      ? new ccc.ClientPublicMainnet()
      : network === "testnet"
      ? new ccc.ClientPublicTestnet()
      : new ccc.ClientPublicTestnet({
          url: offCKB.rpcUrl,
          scripts: DEVNET_SCRIPTS as any,
        });

  return client;
}

export const cccClient = buildCccClient(offCKB.currentNetwork);

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

export function generateAccount(hash: string) {
  const lockArgs = "0x" + hash;
  const lockScript = {
    codeHash: offCKB.myScripts["hash-lock"]!.codeHash,
    hashType: offCKB.myScripts["hash-lock"]!.hashType,
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
  amountInCKB: string
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

  // fill the witness with preimage
  const preimageAnswer = window.prompt("please enter the preimage: ");
  if (preimageAnswer == null) {
    throw new Error("user abort input!");
  }
  const newWitnessArgs = new ccc.WitnessArgs(
    stringToBytesHex(preimageAnswer) as `0x${string}`
  );
  console.log("newWitnessArgs: ", newWitnessArgs);
  tx.setWitnessArgsAt(0, newWitnessArgs);

  // Complete missing parts for transaction
  await tx.addCellDeps(offCKB.myScripts["hash-lock"]!.cellDeps[0].cellDep);
  await tx.completeInputsByCapacity(
    readSigner,
    ccc.fixedPointFrom(amountInCKB)
  );
  const balanceDiff =
    (await tx.getInputsCapacity(cccClient)) - tx.getOutputsCapacity();
  console.log("balanceDiff: ", balanceDiff);
  if (balanceDiff > ccc.Zero) {
    tx.addOutput({
      lock: fromScript,
    });
  }
  //await tx.completeFeeBy(readSigner, 1000);

  const txHash = await cccClient.sendTransaction(tx);
  console.log("Full transaction: ", tx.stringify());
  return txHash;
}

export async function wait(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
