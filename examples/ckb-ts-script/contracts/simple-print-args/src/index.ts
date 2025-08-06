import * as bindings from "@ckb-js-std/bindings";
import { HighLevel } from "@ckb-js-std/core";

function main() {
  const scritpArgs = HighLevel.loadScript().args.slice(35);
  console.log(`Script Args: ${new Uint8Array(scritpArgs)}`);

  let witness =
    HighLevel.loadWitnessArgs(0, bindings.SOURCE_GROUP_INPUT).lock ??
    new ArrayBuffer(0);
  console.log(`Witness: ${new Uint8Array(witness)}`);

  return 0;
}

bindings.exit(main());
