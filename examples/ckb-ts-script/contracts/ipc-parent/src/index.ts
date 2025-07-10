import * as bindings from "@ckb-js-std/bindings";
import { HighLevel, log } from "@ckb-js-std/core";
import { Channel, RequestPacket, spawnCellServer } from "@ckb-js-std/ipc";

function main() {
  const args = HighLevel.loadScript().args;
  let codeHash = args.slice(35, 35 + 32);
  let jsVmCodeHash = args.slice(35 + 32, 35 + 32 + 32);
  let serverCellLocation = bindings.hex.encode(codeHash) + "04";
  // spawn server
  let [readPipe, writePipe] = spawnCellServer(
    jsVmCodeHash,
    bindings.SCRIPT_HASH_TYPE_DATA2,
    ["-t", serverCellLocation],
  );

  let channel = new Channel(readPipe, writePipe);
  let req = new RequestPacket(new Uint8Array([1, 2, 3]));
  for (let i = 0; i < 3; i++) {
    log.debug("[CLIENT]: send request %s", req.toString());
    let res = channel.call(req);
    log.debug("[CLIENT]: receive response %s", res.toString());
    console.assert(res.payload()[0] === 42);
  }
}

log.setLevel(log.LogLevel.Debug);
main();
