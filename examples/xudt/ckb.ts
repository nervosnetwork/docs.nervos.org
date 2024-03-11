import { Indexer, RPC, config } from "@ckb-lumos/lumos";
//import devConfig from './config.json';

//export const lumosConfig: config.Config = devConfig as config.Config;
export const lumosConfig = config.predefined.AGGRON4 as config.Config;

//add xudt testnet info
lumosConfig["XUDT"] = {
  CODE_HASH:
    "0xf329effd1c475a2978453c8600e1eaf0bc2087ee093c3ee64cc96ec6847752cb",
  HASH_TYPE: "type",
  TX_HASH: "0x27b62d8be8ed80b9f56ee0fe41355becdb6f6a40aeba82d3900434f43b1c8b60",
  INDEX: "0x0",
  DEP_TYPE: "code",
};

//export const CKB_RPC_URL = 'http://localhost:8114';
export const CKB_RPC_URL = "https://testnet.ckb.dev/rpc";

export const rpc = new RPC(CKB_RPC_URL);
export const indexer = new Indexer(CKB_RPC_URL);
