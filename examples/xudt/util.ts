import { helpers, Address, Script, hd, BI, CellDep } from '@ckb-lumos/lumos';
import { values } from '@ckb-lumos/base';
import { TransactionSkeletonType } from '@ckb-lumos/helpers';
import { number } from '@ckb-lumos/codec';
import offCKBConfig from './offckb.config';

const { indexer, lumosConfig } = offCKBConfig;
 
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

export function addCellDep(txSkeleton: TransactionSkeletonType, newCellDep: CellDep): TransactionSkeletonType {
  const cellDep = txSkeleton.get('cellDeps').find((cellDep) => {
    return (
      cellDep.depType === newCellDep.depType &&
      new values.OutPointValue(cellDep.outPoint, { validate: false }).equals(
        new values.OutPointValue(newCellDep.outPoint, { validate: false }),
      )
    );
  });

  if (!cellDep) {
    txSkeleton = txSkeleton.update('cellDeps', (cellDeps) => {
      return cellDeps.push({
        outPoint: newCellDep.outPoint,
        depType: newCellDep.depType,
      });
    });
  }

  return txSkeleton;
}

export function readTokenAmount(amount: string) {
  return number.Uint128LE.unpack(amount);
}

export function deepCopy<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
      return obj; // If obj is not an object, return it as it is (primitive type or null)
  }

  if (Array.isArray(obj)) {
      // If obj is an array, deep copy each element of the array
      return obj.map(item => deepCopy(item)) as any;
  }

  // If obj is an object, deep copy each property of the object
  const copiedObj: any = {};
  for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
          copiedObj[key] = deepCopy(obj[key]);
      }
  }
  return copiedObj as T;
}
