import { ccc, CellDepInfoLike, KnownScript, Script } from "@ckb-ccc/core";
import offCKB, { Network } from "./offckb.config";

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

export function utf8ToHex(utf8String: string): string {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(utf8String);
  return (
    "0x" +
    Array.prototype.map
      .call(uint8Array, (byte: number) => {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
      })
      .join("")
  );
}

export function hexToUtf8(hexString: string): string {
  const decoder = new TextDecoder("utf-8");
  const uint8Array = new Uint8Array(
    hexString.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16))
  );
  return decoder.decode(uint8Array);
}

export async function buildMessageTx(
  onChainMemo: string,
  privateKey: string
): Promise<string> {
  const onChainMemoHex = utf8ToHex(onChainMemo);
  const signer = new ccc.SignerCkbPrivateKey(cccClient, privateKey);
  const signerAddress = await signer.getAddressObjSecp256k1();
  // Build the full transaction to estimate the fee
  const tx = ccc.Transaction.from({
    outputs: [{ lock: signerAddress.script }],
    outputsData: [onChainMemoHex],
  });

  // Complete missing parts for transaction
  await tx.completeInputsAll(signer);
  await tx.completeFeeBy(signer, 1000);
  const txHash = await signer.sendTransaction(tx);
  alert(`The transaction hash is ${txHash}`);

  return txHash;
}

export async function readOnChainMessage(txHash: string, index = "0x0") {
  const cell = await cccClient.getCellLive({ txHash, index }, true);
  if (cell == null) {
    return alert("cell not found, please retry later");
  }
  const data = cell.outputData;
  const msg = hexToUtf8(data);
  alert("read msg: " + msg);
  return msg;
}
