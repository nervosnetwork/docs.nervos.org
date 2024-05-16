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
  HexString,
} from "@ckb-lumos/lumos";
import { values, blockchain } from "@ckb-lumos/base";
import offCKBConfig from "./offckb.config";
const { ScriptValue } = values;

const { indexer, lumosConfig, rpc } = offCKBConfig;
offCKBConfig.initializeLumosConfig();

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
  let txSkeleton = helpers.TransactionSkeleton({});
  const fromAccount = generateAccountFromPrivateKey(privateKey);
  const onChainMemoHex: HexString = utf8ToHex(onChainMemo);

  const messageOutput: Cell = {
    cellOutput: {
      lock: fromAccount.lockScript,
      capacity: "0x0",
    },
    data: onChainMemoHex,
  };
  const minimalCapacity = helpers.minimalCellCapacity(messageOutput);
  messageOutput.cellOutput.capacity = BI.from(minimalCapacity).toHexString();

  // additional 0.001 ckb for tx fee
  // the tx fee could calculated by tx size
  // this is just a simple example
  const neededCapacity = BI.from(minimalCapacity).add(100000);
  let collectedSum = BI.from(0);
  const collected: Cell[] = [];
  const collector = indexer.collector({
    lock: fromAccount.lockScript,
    type: "empty",
    // filter cells by output data len range, [inclusive, exclusive)
    // data length range: [0, 1), which means the data length is 0
    outputDataLenRange: ["0x0", "0x1"],
  });
  for await (const cell of collector.collect()) {
    collectedSum = collectedSum.add(cell.cellOutput.capacity);
    collected.push(cell);
    if (collectedSum.gte(neededCapacity)) break;
  }

  if (collectedSum.lt(neededCapacity)) {
    throw new Error(`Not enough CKB, ${collectedSum} < ${neededCapacity}`);
  }

  const changeOutput: Cell = {
    cellOutput: {
      capacity: collectedSum.sub(neededCapacity).toHexString(),
      lock: fromAccount.lockScript,
    },
    data: "0x",
  };

  txSkeleton = txSkeleton.update("inputs", (inputs) =>
    inputs.push(...collected)
  );
  txSkeleton = txSkeleton.update("outputs", (outputs) =>
    outputs.push(messageOutput, changeOutput)
  );
  txSkeleton = txSkeleton.update("cellDeps", (cellDeps) =>
    cellDeps.push({
      outPoint: {
        txHash: lumosConfig.SCRIPTS.SECP256K1_BLAKE160.TX_HASH,
        index: lumosConfig.SCRIPTS.SECP256K1_BLAKE160.INDEX,
      },
      depType: lumosConfig.SCRIPTS.SECP256K1_BLAKE160.DEP_TYPE,
    })
  );

  const firstIndex = txSkeleton
    .get("inputs")
    .findIndex((input) =>
      new ScriptValue(input.cellOutput.lock, { validate: false }).equals(
        new ScriptValue(fromAccount.lockScript, { validate: false })
      )
    );
  if (firstIndex !== -1) {
    while (firstIndex >= txSkeleton.get("witnesses").size) {
      txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
        witnesses.push("0x")
      );
    }
    let witness: string = txSkeleton.get("witnesses").get(firstIndex)!;
    const newWitnessArgs: WitnessArgs = {
      /* 65-byte zeros in hex */
      lock: "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    };
    if (witness !== "0x") {
      const witnessArgs = blockchain.WitnessArgs.unpack(bytes.bytify(witness));
      const lock = witnessArgs.lock;
      if (
        !!lock &&
        !!newWitnessArgs.lock &&
        !bytes.equal(lock, newWitnessArgs.lock)
      ) {
        throw new Error(
          "Lock field in first witness is set aside for signature!"
        );
      }
      const inputType = witnessArgs.inputType;
      if (inputType) {
        newWitnessArgs.inputType = inputType;
      }
      const outputType = witnessArgs.outputType;
      if (outputType) {
        newWitnessArgs.outputType = outputType;
      }
    }
    witness = bytes.hexify(blockchain.WitnessArgs.pack(newWitnessArgs));
    txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
      witnesses.set(firstIndex, witness)
    );
  }

  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
  const message = txSkeleton.get("signingEntries").get(0)!.message;
  const Sig = hd.key.signRecoverable(message!, privateKey);
  const tx = helpers.sealTransaction(txSkeleton, [Sig]);

  const txHash = await rpc.sendTransaction(tx, "passthrough");
  console.log("Full transaction: ", JSON.stringify(tx, null, 2));
  alert(`The transaction hash is ${txHash}`);

  return txHash;
}

export async function readOnChainMessage(txHash: string, index = "0x0") {
  const { cell } = await rpc.getLiveCell({ txHash, index }, true);
  if (cell == null) {
    return alert("cell not found, please retry later");
  }
  const data = cell.data.content;
  const msg = hexToUtf8(data);
  alert("read msg: " + msg);
  return msg;
}
