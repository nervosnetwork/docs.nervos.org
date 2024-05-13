import { helpers, Address, Script, hd, config, BI } from "@ckb-lumos/lumos";
import { setSporeConfig, createSpore } from "@spore-sdk/core";
import { SPORE_CONFIG } from "./spore-config";
import { createDefaultLockWallet } from "./helper";
import { unpackToRawSporeData } from "@spore-sdk/core";
import offCKBConfig from "./offckb.config";

const { indexer, lumosConfig, rpc } = offCKBConfig;
offCKBConfig.initializeLumosConfig();
setSporeConfig(SPORE_CONFIG);

type Account = {
  lockScript: Script;
  address: Address;
  pubKey: string;
};
export const generateAccountFromPrivateKey = (privKey: string): Account => {
  const pubKey = hd.key.privateToPublic(privKey);
  const args = hd.key.publicKeyToBlake160(pubKey);
  const template = lumosConfig.SCRIPTS["SECP256K1_BLAKE160"]!;
  const lockScript = {
    codeHash: template.CODE_HASH,
    hashType: template.HASH_TYPE,
    args: args,
  };
  const address = helpers.encodeToAddress(lockScript, { config: lumosConfig });
  return {
    lockScript,
    address,
    pubKey,
  };
};

export async function capacityOf(address: string): Promise<BI> {
  const collector = indexer.collector({
    lock: helpers.parseAddress(address, { config: lumosConfig }),
  });

  let balance = BI.from(0);
  for await (const cell of collector.collect()) {
    balance = balance.add(cell.cellOutput.capacity);
  }

  return balance;
}

export async function createSporeDOB(privkey: string, content: Uint8Array): Promise<{txHash: string, outputIndex: number}> {
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
  const { cell } = await rpc.getLiveCell({ txHash, index: indexHex }, true);
  if (cell == null) {
    return alert("cell not found, please retry later");
  }
  const data = cell.data.content;
  const msg = unpackToRawSporeData(data);
  console.log("spore data: ", msg);
  return msg;
}
