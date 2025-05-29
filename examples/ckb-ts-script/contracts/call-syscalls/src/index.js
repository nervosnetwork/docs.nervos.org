import * as bindings from "@ckb-js-std/bindings";

// ckb-debugger --read-file dist/call-syscalls.js --bin deps/ckb-js-vm -- -r
function main() {
    console.log(bindings.loadScript);
    console.log(new Uint8Array(bindings.loadScript(0, 8)));
    console.log("End");
    return 0;
}

bindings.exit(main());