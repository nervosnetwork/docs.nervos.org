import * as bindings from "@ckb-js-std/bindings";
import { HighLevel, log, hashCkb, bytesEq } from "@ckb-js-std/core";

function main(): number {
  log.setLevel(log.LogLevel.Debug);
  let script = bindings.loadScript();
  log.debug(`hash-lock script loaded: ${JSON.stringify(script)}`);

  // contract logic
  let expect_hash = new Uint8Array(HighLevel.loadScript().args).slice(35);

  let witness_args = HighLevel.loadWitnessArgs(0, bindings.SOURCE_GROUP_INPUT);
  let preimage = witness_args.lock!;

  let hash = hashCkb(preimage);

  if (!bytesEq(hash, expect_hash.buffer)) {
    log.error(`Check hash failed: ${new Uint8Array(hash)}, ${expect_hash}`);
    return 11;
  } else {
    return 0;
  }
}

bindings.exit(main());
