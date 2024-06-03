import offCKB from "@/offckb.config";
import { helpers, Address, Script, hd, commons, BI } from '@ckb-lumos/lumos';

const {indexer, rpc, lumosConfig} = offCKB;
offCKB.initializeLumosConfig();

type Account = {
  lockScript: Script;
  address: Address;
  pubKey: string;
};
export const generateAccountFromPrivateKey = (privKey: string): Account => {
  const pubKey = hd.key.privateToPublic(privKey);
  const args = hd.key.publicKeyToBlake160(pubKey);
  const template = lumosConfig.SCRIPTS['SECP256K1_BLAKE160']!;
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

export async function transfer(fromAddress: string, toAddress: string, amountInShannon: string, signerPrivateKey: string): Promise<string> {
  let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
  txSkeleton = await commons.common.transfer(txSkeleton, [fromAddress], toAddress, amountInShannon);

  // https://github.com/nervosnetwork/ckb/blob/develop/util/app-config/src/legacy/tx_pool.rs#L9
  // const DEFAULT_MIN_FEE_RATE: FeeRate = FeeRate::from_u64(1000);
  txSkeleton = await commons.common.payFeeByFeeRate(txSkeleton, [fromAddress], 1000 /*fee_rate*/);

  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);

  const signatures = txSkeleton
    .get("signingEntries")
    .map((entry) => hd.key.signRecoverable(entry.message, signerPrivateKey))
    .toArray();

  const signedTx = helpers.sealTransaction(txSkeleton, signatures);
  const txHash = await rpc.sendTransaction(signedTx);
  console.log(`Go to explorer to check the sent transaction https://pudge.explorer.nervos.org/transaction/${txHash}`);

  return txHash;
}
