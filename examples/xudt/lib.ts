import { ccc, Hex, Script } from "@ckb-ccc/core";
import { cccClient } from "./ccc-client";

type Account = {
  lockScript: Script;
  address: string;
  pubKey: string;
};

export const generateAccountFromPrivateKey = async (
  privKey: string
): Promise<Account> => {
  const signer = new ccc.SignerCkbPrivateKey(cccClient, privKey);
  const lock = await signer.getAddressObjSecp256k1();
  return {
    lockScript: lock.script,
    address: lock.toString(),
    pubKey: signer.publicKey,
  };
};

export async function capacityOf(address: string): Promise<bigint> {
  const addr = await ccc.Address.fromString(address, cccClient);
  let balance = await cccClient.getBalance([addr.script]);
  return balance;
}

export async function issueToken(privKey: string, amount: string) {
  const signer = new ccc.SignerCkbPrivateKey(cccClient, privKey);
  const lockScript = (await signer.getAddressObjSecp256k1()).script;
  const xudtArgs = lockScript.hash() + "00000000";

  const typeScript = await ccc.Script.fromKnownScript(
    signer.client,
    ccc.KnownScript.XUdt,
    xudtArgs
  );

  // Build the full transaction
  const tx = ccc.Transaction.from({
    outputs: [{ lock: lockScript, type: typeScript }],
    outputsData: [ccc.numLeToBytes(amount, 16)],
  });

  await tx.addCellDepsOfKnownScripts(signer.client, ccc.KnownScript.XUdt);

  // additional 0.001 ckb for tx fee
  // Complete missing parts for transaction
  await tx.completeInputsByCapacity(signer);
  await tx.completeFeeBy(signer, 1000);
  const txHash = await signer.sendTransaction(tx);
  console.log(
    `Go to explorer to check the sent transaction https://pudge.explorer.nervos.org/transaction/${txHash}`
  );

  return { hash: txHash, targetOutput: tx.outputs[0] };
}

export async function queryIssuedTokenCells(xudtArgs: Hex) {
  const typeScript = await ccc.Script.fromKnownScript(
    cccClient,
    ccc.KnownScript.XUdt,
    xudtArgs
  );

  const collected: ccc.Cell[] = [];
  const collector = cccClient.findCellsByType(typeScript, true);
  for await (const cell of collector) {
    collected.push(cell);
  }
  return collected;
}

export async function transferTokenToAddress(
  udtIssuerArgs: string,
  senderPrivKey: string,
  amount: string,
  receiverAddress: string
) {
  const signer = new ccc.SignerCkbPrivateKey(cccClient, senderPrivKey);
  const senderLockScript = (await signer.getAddressObjSecp256k1()).script;
  const receiverLockScript = (
    await ccc.Address.fromString(receiverAddress, cccClient)
  ).script;

  const xudtArgs = udtIssuerArgs;
  const xUdtType = await ccc.Script.fromKnownScript(
    cccClient,
    ccc.KnownScript.XUdt,
    xudtArgs
  );

  const tx = ccc.Transaction.from({
    outputs: [{ lock: receiverLockScript, type: xUdtType }],
    outputsData: [ccc.numLeToBytes(amount, 16)],
  });
  await tx.completeInputsByUdt(signer, xUdtType);

  const balanceDiff =
    (await tx.getInputsUdtBalance(signer.client, xUdtType)) -
    tx.getOutputsUdtBalance(xUdtType);
  console.log("balanceDiff: ", balanceDiff);
  if (balanceDiff > ccc.Zero) {
    tx.addOutput(
      {
        lock: senderLockScript,
        type: xUdtType,
      },
      ccc.numLeToBytes(balanceDiff, 16)
    );
  }
  await tx.addCellDepsOfKnownScripts(signer.client, ccc.KnownScript.XUdt);

  // Complete missing parts for transaction
  await tx.completeInputsByCapacity(signer);
  await tx.completeFeeBy(signer, 1000);

  const txHash = await signer.sendTransaction(tx);
  console.log("The transaction hash is", txHash);
  return { txHash, tx };
}

export function shannonToCKB(amount: bigint){
  return amount / 100000000n;
}
