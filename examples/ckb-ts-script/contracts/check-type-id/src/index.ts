import * as bindings from "@ckb-js-std/bindings";
import { HighLevel } from "@ckb-js-std/core";

function main() {
    HighLevel.checkTypeId(35);

    console.log("Checked");
    return 0;
}

bindings.exit(main());