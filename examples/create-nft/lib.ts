import { bytes } from "@ckb-lumos/codec";
import {
  helpers,
  Address,
  Script,
  hd,
  config,
  Cell,
  commons,
  WitnessArgs,
  BI,
} from "@ckb-lumos/lumos";
import { values, blockchain } from "@ckb-lumos/base";
import { setSporeConfig, createSpore } from "@spore-sdk/core";
import { indexer, lumosConfig, rpc } from "./ckb";
import { SPORE_CONFIG } from "./spore-config";
import{createDefaultLockWallet} from "./helper";
const { ScriptValue } = values;

config.initializeConfig(lumosConfig);
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

export async function createSporeNFT(privkey: string, content: Uint8Array) {
  const wallet = createDefaultLockWallet(privkey);

  const { txSkeleton, outputIndex } = await createSpore({
    data: {
      contentType: 'image/jpeg',
      content,
    },
    toLock: wallet.lock,
    fromInfos: [wallet.address],
    config: SPORE_CONFIG
  });

  const hash = await wallet.signAndSendTransaction(txSkeleton);
  console.log(`Spore created at transaction: ${hash}`);
  console.log(`Spore ID: ${txSkeleton.get('outputs').get(outputIndex)!.cellOutput.type!.args}`);
  return hash;
}
