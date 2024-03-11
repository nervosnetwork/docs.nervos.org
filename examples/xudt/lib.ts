import { helpers, hd, config, Cell, commons, BI, utils } from '@ckb-lumos/lumos';
import { blockchain, HexString } from '@ckb-lumos/base';
import { indexer, lumosConfig, rpc } from './ckb';
import { bytes, number } from '@ckb-lumos/codec';
import { xudtWitnessType } from './scheme';
import { addCellDep, generateAccountFromPrivateKey } from './util';

config.initializeConfig(lumosConfig);

export async function issueToken(privKey: string, amount: string) {
  const { lockScript } = generateAccountFromPrivateKey(privKey);
  const xudtDeps = lumosConfig.SCRIPTS.XUDT;
  const lockDeps = lumosConfig.SCRIPTS.SECP256K1_BLAKE160;

  const xudtArgs = utils.computeScriptHash(lockScript) + '00000000';
  const typeScript = {
    codeHash: xudtDeps.CODE_HASH,
    hashType: xudtDeps.HASH_TYPE,
    args: xudtArgs,
  };

  let txSkeleton = helpers.TransactionSkeleton();
  txSkeleton = addCellDep(txSkeleton, {
    outPoint: {
      txHash: lockDeps.TX_HASH,
      index: lockDeps.INDEX,
    },
    depType: lockDeps.DEP_TYPE,
  });
  txSkeleton = addCellDep(txSkeleton, {
    outPoint: {
      txHash: xudtDeps.TX_HASH,
      index: xudtDeps.INDEX,
    },
    depType: xudtDeps.DEP_TYPE,
  });

  const targetOutput: Cell = {
    cellOutput: {
      capacity: '0x0',
      lock: lockScript,
      type: typeScript,
    },
    data: bytes.hexify(number.Uint128LE.pack(amount)),
  };

  // additional 0.001 ckb for tx fee
  // the tx fee could calculated by tx size
  // this is just a simple example
  const capacity = helpers.minimalCellCapacity(targetOutput);
  targetOutput.cellOutput.capacity = '0x' + capacity.toString(16);
  const neededCapacity = BI.from(capacity.toString(10)).add(100000);
  let collectedSum = BI.from(0);
  const collected: Cell[] = [];
  const collector = indexer.collector({ lock: lockScript, type: 'empty' });
  for await (const cell of collector.collect()) {
    collectedSum = collectedSum.add(cell.cellOutput.capacity);
    collected.push(cell);
    if (collectedSum >= neededCapacity) break;
  }

  if (collectedSum.lt(neededCapacity)) {
    throw new Error(`Not enough CKB, ${collectedSum} < ${neededCapacity}`);
  }

  const changeOutput: Cell = {
    cellOutput: {
      capacity: collectedSum.sub(neededCapacity).toHexString(),
      lock: lockScript,
    },
    data: '0x',
  };

  txSkeleton = txSkeleton.update('inputs', (inputs) => inputs.push(...collected));
  txSkeleton = txSkeleton.update('outputs', (outputs) => outputs.push(targetOutput, changeOutput));
  /* 65-byte zeros in hex */
  const lockWitness =
    '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
  const outputTypeWitness = xudtWitnessType.pack({ extension_data: [] });
  const witnessArgs = blockchain.WitnessArgs.pack({ lock: lockWitness, outputType: outputTypeWitness });
  const witness = bytes.hexify(witnessArgs);
  txSkeleton = txSkeleton.update('witnesses', (witnesses) => witnesses.set(0, witness));

  // signing
  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
  const message = txSkeleton.get('signingEntries').get(0)?.message;
  const Sig = hd.key.signRecoverable(message!, privKey);
  const tx = helpers.sealTransaction(txSkeleton, [Sig]);
  console.log(tx);

  const hash = await rpc.sendTransaction(tx, 'passthrough');
  console.log('The transaction hash is', hash);
  return { hash, targetOutput };
}

export async function queryIssuedTokenCells(xudtArgs: HexString) {
  const xudtDeps = lumosConfig.SCRIPTS.XUDT;
  const typeScript = {
    codeHash: xudtDeps.CODE_HASH,
    hashType: xudtDeps.HASH_TYPE,
    args: xudtArgs,
  };

  const collected: Cell[] = [];
  const collector = indexer.collector({ type: typeScript });
  for await (const cell of collector.collect()) {
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
  const { lockScript: senderLockScript } = generateAccountFromPrivateKey(senderPrivKey);

  const receiverLockScript = helpers.parseAddress(receiverAddress);

  const xudtDeps = lumosConfig.SCRIPTS.XUDT;
  const lockDeps = lumosConfig.SCRIPTS.SECP256K1_BLAKE160;

  const xudtArgs = udtIssuerArgs;
  const typeScript = {
    codeHash: xudtDeps.CODE_HASH,
    hashType: xudtDeps.HASH_TYPE,
    args: xudtArgs,
  };

  let txSkeleton = helpers.TransactionSkeleton();
  txSkeleton = addCellDep(txSkeleton, {
    outPoint: {
      txHash: lockDeps.TX_HASH,
      index: lockDeps.INDEX,
    },
    depType: lockDeps.DEP_TYPE,
  });
  txSkeleton = addCellDep(txSkeleton, {
    outPoint: {
      txHash: xudtDeps.TX_HASH,
      index: xudtDeps.INDEX,
    },
    depType: xudtDeps.DEP_TYPE,
  });

  const targetOutput: Cell = {
    cellOutput: {
      capacity: '0x0',
      lock: receiverLockScript,
      type: typeScript,
    },
    data: bytes.hexify(number.Uint128LE.pack(amount)),
  };

  const capacity = helpers.minimalCellCapacity(targetOutput);
  targetOutput.cellOutput.capacity = '0x' + capacity.toString(16);
  // additional 0.001 ckb for tx fee
  // the tx fee could calculated by tx size
  // this is just a simple example
  const neededCapacity = BI.from(capacity.toString(10)).add(100000);
  let collectedSum = BI.from(0);
  let collectedAmount = BI.from(0);
  const collected: Cell[] = [];
  const collector = indexer.collector({ lock: senderLockScript, type: typeScript });
  for await (const cell of collector.collect()) {
    collectedSum = collectedSum.add(cell.cellOutput.capacity);
    collectedAmount = collectedAmount.add(number.Uint128LE.unpack(cell.data));
    collected.push(cell);
    if (collectedAmount >= BI.from(amount)) break;
  }

  let changeOutputTokenAmount = BI.from(0);
  if (collectedAmount.gt(BI.from(amount))) {
    changeOutputTokenAmount = collectedAmount.sub(BI.from(amount));
  }

  const changeOutput: Cell = {
    cellOutput: {
      capacity: '0x0',
      lock: senderLockScript,
      type: typeScript,
    },
    data: bytes.hexify(number.Uint128LE.pack(changeOutputTokenAmount.toString(10))),
  };

  const changeOutputNeededCapacity = BI.from(helpers.minimalCellCapacity(changeOutput));

  const extraNeededCapacity = collectedSum.lt(neededCapacity)
    ? neededCapacity.sub(collectedSum).add(changeOutputNeededCapacity)
    : collectedSum.sub(neededCapacity).add(changeOutputNeededCapacity);

  if (extraNeededCapacity.gt(0)) {
    let extraCollectedSum = BI.from(0);
    const extraCollectedCells: Cell[] = [];
    const collector = indexer.collector({ lock: senderLockScript, type: 'empty' });
    for await (const cell of collector.collect()) {
      extraCollectedSum = extraCollectedSum.add(cell.cellOutput.capacity);
      extraCollectedCells.push(cell);
      if (extraCollectedSum >= extraNeededCapacity) break;
    }

    if (extraCollectedSum.lt(extraNeededCapacity)) {
      throw new Error(`Not enough CKB for change, ${extraCollectedSum} < ${extraNeededCapacity}`);
    }

    txSkeleton = txSkeleton.update('inputs', (inputs) => inputs.push(...extraCollectedCells));

    const change2Capacity = extraCollectedSum.sub(changeOutputNeededCapacity);
    if (change2Capacity.gt(61000000000)) {
      changeOutput.cellOutput.capacity = changeOutputNeededCapacity.toHexString();
      const changeOutput2: Cell = {
        cellOutput: {
          capacity: change2Capacity.toHexString(),
          lock: senderLockScript,
        },
        data: '0x',
      };
      txSkeleton = txSkeleton.update('outputs', (outputs) => outputs.push(changeOutput2));
    } else {
      changeOutput.cellOutput.capacity = extraCollectedSum.toHexString();
    }
  }

  txSkeleton = txSkeleton.update('inputs', (inputs) => inputs.push(...collected));
  txSkeleton = txSkeleton.update('outputs', (outputs) => outputs.push(targetOutput, changeOutput));
  /* 65-byte zeros in hex */
  const lockWitness =
    '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

  const inputTypeWitness = xudtWitnessType.pack({ extension_data: [] });
  const outputTypeWitness = xudtWitnessType.pack({ extension_data: [] });
  const witnessArgs = blockchain.WitnessArgs.pack({
    lock: lockWitness,
    inputType: inputTypeWitness,
    outputType: outputTypeWitness,
  });
  const witness = bytes.hexify(witnessArgs);
  txSkeleton = txSkeleton.update('witnesses', (witnesses) => witnesses.set(0, witness));

  // signing
  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
  const message = txSkeleton.get('signingEntries').get(0)?.message;
  const Sig = hd.key.signRecoverable(message!, senderPrivKey);
  const tx = helpers.sealTransaction(txSkeleton, [Sig]);
  console.log('tx: ', tx);

  const txHash = await rpc.sendTransaction(tx, 'passthrough');
  console.log('The transaction hash is', txHash);
  return { txHash, tx };
}
