import * as bindings from "@ckb-js-std/bindings";
import { HighLevel, bytesEq } from "@ckb-js-std/core";

const ERROR_AMOUNT = -52;
const ERROR_ARGS_FAILED = -53;

function get_amount(source: bindings.SourceType): bigint {
  let amount = 0n;
  let iter = new HighLevel.QueryIter(HighLevel.loadCellData, source);
  for (let data of iter) {
    if (data.byteLength != 16) {
      throw `Invalid data length: ${data.byteLength}`;
    }
    let n = new BigUint64Array(data);
    let current_amount = n[0] | (n[1] << 64n);
    amount += current_amount;
  }
  return amount;
}

function main() {
  console.log("simple UDT ...");
  // ckb-js-vm has leading 35 bytes args
  let args = HighLevel.loadScript().args.slice(35);
  if (args.byteLength != 32) {
    return ERROR_ARGS_FAILED;
  }

  let owner_mode = false;
  for (let item of new HighLevel.QueryIter(
    HighLevel.loadCellLockHash,
    bindings.SOURCE_INPUT,
  )) {
    if (bytesEq(item, args)) {
      owner_mode = true;
      break;
    }
  }
  if (owner_mode) {
    return 0;
  }

  let input_amount = get_amount(bindings.SOURCE_GROUP_INPUT);
  let output_amount = get_amount(bindings.SOURCE_GROUP_OUTPUT);

  console.log(`verifying amount: ${input_amount} and ${output_amount}`);
  if (input_amount < output_amount) {
    return ERROR_AMOUNT;
  }
  console.log("Simple UDT quit successfully");
  return 0;
}

let exit_code = main();
if (exit_code != 0) {
  bindings.exit(exit_code);
}
