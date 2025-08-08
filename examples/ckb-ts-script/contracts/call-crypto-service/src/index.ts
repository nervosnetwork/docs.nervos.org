import * as bindings from "@ckb-js-std/bindings";
import { HighLevel, bytesEq } from "@ckb-js-std/core";
import { Channel, RequestPacket, spawnCellServer } from "@ckb-js-std/ipc";

function runFunction(channel: Channel, payload: Object) {
  let payloadHex = new bindings.TextEncoder().encode(JSON.stringify(payload));
  let res = channel.call(new RequestPacket(payloadHex));
  if (res.errorCode() != 0) {
    throw Error(`IPC Error: ${res.errorCode()}`);
  }

  let resPayload = new bindings.TextDecoder().decode(res.payload());
  return Object.values(JSON.parse(resPayload))[0];
}

function resultOk(result: any): any {
  let key = Object.keys(result)[0];
  if (key != "Ok") {
    throw `res is not ok : ${JSON.stringify(result)}`;
  }

  return result[key];
}

function startService(): Channel {
  const args = HighLevel.loadScript().args;
  const codeHash = args.slice(35, 35 + 32);
  const [readPipe, writePipe] = spawnCellServer(
    codeHash,
    bindings.SCRIPT_HASH_TYPE_DATA2,
    [],
  );
  return new Channel(readPipe, writePipe);
}

function ckbBlake2b(channel: Channel, data: number[]) {
  let hasher_ctx = runFunction(channel, {
    HasherNew: { hash_type: "CkbBlake2b" },
  });
  runFunction(channel, { HasherUpdate: { ctx: hasher_ctx, data: data } });
  let hash = new Uint8Array(
    resultOk(runFunction(channel, { HasherFinalize: { ctx: hasher_ctx } })),
  );

  return hash;
}

function main() {
  let channel = startService();

  let hash = ckbBlake2b(channel, [0, 0, 0, 0]);
  let witnesse =
    HighLevel.loadWitnessArgs(0, bindings.SOURCE_GROUP_INPUT).lock ??
    new ArrayBuffer();

  if (bytesEq(witnesse, hash.buffer) != true) {
    return 1;
  }

  return 0;
}

bindings.exit(main());
