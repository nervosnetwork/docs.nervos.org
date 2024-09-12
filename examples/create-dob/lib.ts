import { setSporeConfig, createSpore } from "@spore-sdk/core";
import { SPORE_CONFIG } from "./spore-config";
import { createDefaultLockWallet } from "./helper";
import { unpackToRawSporeData } from "@spore-sdk/core";
import offCKB, { Network } from "./offckb.config";
import { ccc, CellDepInfoLike, KnownScript, Script } from "@ckb-ccc/core";

setSporeConfig(SPORE_CONFIG);

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

export async function createSporeDOB(
  privkey: string,
  content: Uint8Array
): Promise<{ txHash: string; outputIndex: number }> {
  const wallet = createDefaultLockWallet(privkey);

  const { txSkeleton, outputIndex } = await createSpore({
    data: {
      contentType: "image/jpeg",
      content,
    },
    toLock: wallet.lock,
    fromInfos: [wallet.address],
    config: SPORE_CONFIG,
  });

  const txHash = await wallet.signAndSendTransaction(txSkeleton);
  console.log(`Spore created at transaction: ${txHash}`);
  console.log(
    `Spore ID: ${
      txSkeleton.get("outputs").get(outputIndex)!.cellOutput.type!.args
    }`
  );
  return { txHash, outputIndex };
}

// maybe change this to spore id
export async function showSporeContent(txHash: string, index = 0) {
  const indexHex = "0x" + index.toString(16);
  const cell = await cccClient.getCellLive({ txHash, index: indexHex }, true);
  if (cell == null) {
    return alert("cell not found, please retry later");
  }
  const sporeData = unpackToRawSporeData(cell.outputData);
  console.log("spore data: ", sporeData);
  return sporeData;
}
