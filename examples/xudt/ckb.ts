import { Indexer, RPC, config } from '@ckb-lumos/lumos';
import devConfig from './config.json';

export const lumosConfig: config.Config = devConfig as config.Config;
//export const lumosConfig: config.Config = config.predefined.AGGRON4;

export const CKB_RPC_URL = 'http://localhost:8114';
//export const CKB_RPC_URL = "https://testnet.ckb.dev/rpc";

export const rpc = new RPC(CKB_RPC_URL);
export const indexer = new Indexer(CKB_RPC_URL);
