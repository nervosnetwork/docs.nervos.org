import offCKB from "@/offckb.config";
import { bytes } from "@ckb-lumos/codec";
import { helpers, Cell, WitnessArgs, BI } from "@ckb-lumos/lumos";
import { blockchain } from "@ckb-lumos/base";

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

export function generateAccount(hash: string) {
  const lockArgs = "0x" + hash;
  const lockScript = {
    codeHash: offCKB.lumosConfig.SCRIPTS.HASH_LOCK!.CODE_HASH,
    hashType: offCKB.lumosConfig.SCRIPTS.HASH_LOCK!.HASH_TYPE,
    args: lockArgs,
  };
  const address = helpers.encodeToAddress(lockScript, {
    config: offCKB.lumosConfig,
  });
  return {
    address,
    lockScript,
  };
}

export async function unlock(
  fromAddr: string,
  toAddr: string,
  amountInShannon: string,
): Promise<string> {
  const { lumosConfig, indexer, rpc } = offCKB;
  let txSkeleton = helpers.TransactionSkeleton({});
  const fromScript = helpers.parseAddress(fromAddr, {
    config: lumosConfig,
  });
  const toScript = helpers.parseAddress(toAddr, { config: lumosConfig });

  if (BI.from(amountInShannon).lt(BI.from("6100000000"))) {
    throw new Error(
      `every cell's capacity must be at least 61 CKB, see https://medium.com/nervosnetwork/understanding-the-nervos-dao-and-cell-model-d68f38272c24`
    );
  }

  // additional 0.001 ckb for tx fee
  // the tx fee could calculated by tx size
  // this is just a simple example
  const neededCapacity = BI.from(amountInShannon).add(100000);
  let collectedSum = BI.from(0);
  const collected: Cell[] = [];
  const collector = indexer.collector({ lock: fromScript, type: "empty" });
  for await (const cell of collector.collect()) {
    collectedSum = collectedSum.add(cell.cellOutput.capacity);
    collected.push(cell);
    if (collectedSum.gte(neededCapacity)) break;
  }

  if (collectedSum.lt(neededCapacity)) {
    throw new Error(`Not enough CKB, ${collectedSum} < ${neededCapacity}`);
  }

  const transferOutput: Cell = {
    cellOutput: {
      capacity: BI.from(amountInShannon).toHexString(),
      lock: toScript,
    },
    data: "0x",
  };

  txSkeleton = txSkeleton.update("inputs", (inputs) =>
    inputs.push(...collected)
  );
  txSkeleton = txSkeleton.update("outputs", (outputs) =>
    outputs.push(transferOutput)
  );
  txSkeleton = txSkeleton.update("cellDeps", (cellDeps) =>
    cellDeps.push({
      outPoint: {
        txHash: lumosConfig.SCRIPTS.HASH_LOCK!.TX_HASH,
        index: lumosConfig.SCRIPTS.HASH_LOCK!.INDEX,
      },
      depType: lumosConfig.SCRIPTS.HASH_LOCK!.DEP_TYPE,
    })
  );

  const preimageAnswer = window.prompt("please enter the preimage: ");
  if (preimageAnswer == null) {
    throw new Error("user abort input!");
  }

  const newWitnessArgs: WitnessArgs = {
    lock: stringToBytesHex(preimageAnswer),
  };
  console.log("newWitnessArgs: ",newWitnessArgs);
  const witness = bytes.hexify(blockchain.WitnessArgs.pack(newWitnessArgs));
  txSkeleton = txSkeleton.update('witnesses', (witnesses) => witnesses.set(0, witness));
  
  const tx = helpers.createTransactionFromSkeleton(txSkeleton);
  const hash = await rpc.sendTransaction(tx, "passthrough");
  console.log("Full transaction: ", JSON.stringify(tx, null, 2));

  return hash;
}
