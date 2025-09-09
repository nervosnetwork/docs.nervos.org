import * as bindings from "@ckb-js-std/bindings";
import { HighLevel, bytesEq } from "@ckb-js-std/core";

const ERROR_AMOUNT = -52;

function assert(cond: boolean, obj1: string) {
  if (!cond) {
    throw Error(obj1);
  }
}

function unpack_script(buf: ArrayBuffer) {
  let script = new Uint32Array(buf);
  let raw_data = new Uint8Array(buf);

  let full_size = script[0];
  assert(full_size == buf.byteLength, 'full_size == buf.byteLength');
  let code_hash_offset = script[1];
  let code_hash = buf.slice(code_hash_offset, code_hash_offset + 32);
  let hash_type_offset = script[2];
  let hash_type = raw_data[hash_type_offset];
  let args_offset = script[3];
  let args = buf.slice(args_offset + 4);
  return { 'code_hash': code_hash, 'hash_type': hash_type, 'args': args };
}

function main() {
  console.log('simple UDT ...');
  let buf = bindings.loadScript();
  let script = unpack_script(buf);
  let owner_mode = false;
  // ckb-js-vm has leading 35 bytes args
  let real_args = script.args.slice(35);
  for (let item of new HighLevel.QueryIter(HighLevel.loadCellLockHash, bindings.SOURCE_INPUT)) {
    if (bytesEq(item, real_args)) {
      owner_mode = true;
      break;
    }
  }
  if (owner_mode) {
    return 0;
  }
  let input_amount = 0n;
  for (let data of new HighLevel.QueryIter(HighLevel.loadCellData, bindings.SOURCE_GROUP_INPUT)) {
    if (data.byteLength != 16) {
      throw `Invalid data length: ${data.byteLength}`;
    }
    let n = new BigUint64Array(data);
    let current_amount = n[0] | (n[1] << 64n);
    input_amount += current_amount;
  }

  let output_amount = 0n;
  for (let data of new HighLevel.QueryIter(HighLevel.loadCellData, bindings.SOURCE_GROUP_OUTPUT)) {
    if (data.byteLength != 16) {
      throw `Invalid data length: ${data.byteLength}`;
    }
    let n = new BigUint64Array(data);
    let current_amount = n[0] | (n[1] << 64n);
    output_amount += current_amount;
  }
  console.log(`verifying amount: ${input_amount} and ${output_amount}`);
  if (input_amount < output_amount) {
    return ERROR_AMOUNT;
  }
  console.log('Simple UDT quit successfully');
  return 0;
}

let exit_code = main();
if (exit_code != 0) {
  bindings.exit(exit_code);
}
