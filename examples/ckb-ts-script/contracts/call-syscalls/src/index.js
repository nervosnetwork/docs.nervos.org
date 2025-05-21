import { loadScript } from "@ckb-js-std/bindings";
console.log(loadScript);
console.log(new Uint8Array(loadScript(0, 8)));
console.log("End");
// ckb-debugger --read-file dist/call-syscalls.js --bin deps/ckb-js-vm -- -r
