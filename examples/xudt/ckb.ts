import { Indexer, RPC, config } from "@ckb-lumos/lumos";
import { deepCopy } from "./util";
//import devConfig from './config.json';

let updateConfig = deepCopy(config.predefined.AGGRON4);
// add xudt testnet info
updateConfig["SCRIPTS"]["XUDT"] = {
  CODE_HASH:
    "0x25c29dc317811a6f6f3985a7a9ebc4838bd388d19d0feeecf0bcd60f6c0975bb",
  HASH_TYPE: "type",
  TX_HASH: "0xbf6fb538763efec2a70a6a3dcb7242787087e1030c4e7d86585bc63a9d337f5f",
  INDEX: "0x0",
  DEP_TYPE: "code",
};
//export const lumosConfig: config.Config = devConfig as config.Config;
export const lumosConfig = updateConfig as config.Config;

//export const CKB_RPC_URL = 'http://localhost:8114';
export const CKB_RPC_URL = "https://testnet.ckb.dev/rpc";

export const rpc = new RPC(CKB_RPC_URL);
export const indexer = new Indexer(CKB_RPC_URL);
