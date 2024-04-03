import { molecule, number } from '@ckb-lumos/codec';
import { BytesOpt, Byte32, Bytes } from '@ckb-lumos/codec/lib/blockchain';
const { vector, option, table } = molecule;

const { Uint8 } = number;

const Script = table(
  {
    codeHash: Byte32,
    hashType: Uint8,
    args: Bytes,
  },
  ['codeHash', 'hashType', 'args'],
);
const ScriptOpt = option(Script);
const ScriptVecOpt = option(vector(Script));

// specs: https://github.com/XuJiandong/rfcs/blob/xudt/rfcs/0052-extensible-udt/0052-extensible-udt.md#xudt-witness
export const xudtWitnessType = table(
  {
    owner_script: ScriptOpt,
    owner_signature: BytesOpt,
    raw_extension_data: ScriptVecOpt,
    extension_data: vector(Bytes),
  },
  ['owner_script', 'owner_signature', 'raw_extension_data', 'extension_data'],
);
