import offCKB, { Network } from "./offckb.config";
import { ccc, CellDepInfoLike, Hex, KnownScript, Script } from "@ckb-ccc/core";

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
  await tx.completeInputsAll(signer);
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
  receiverAddress: string,
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
    console.log("balanceDiff: ", balanceDiff)
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
