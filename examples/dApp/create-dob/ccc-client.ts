import { ccc, CellDepInfoLike, KnownScript, Script } from "@ckb-ccc/core";
import systemScripts from "./system-scripts.json";

export type Network = 'devnet' | 'testnet' | 'mainnet';

export type ScriptInfo = Pick<Script, "codeHash" | "hashType"> & { cellDeps: CellDepInfoLike[] };

export const DEVNET_SCRIPTS: Record<
  string,
  ScriptInfo
> = {
  [KnownScript.Secp256k1Blake160]:
    systemScripts["devnet"].secp256k1_blake160_sighash_all!.script as ScriptInfo,
  [KnownScript.Secp256k1Multisig]:
    systemScripts["devnet"].secp256k1_blake160_multisig_all!.script as ScriptInfo,
  [KnownScript.AnyoneCanPay]: systemScripts["devnet"].anyone_can_pay!.script as ScriptInfo,
  [KnownScript.OmniLock]: systemScripts["devnet"].omnilock!.script as ScriptInfo,
  [KnownScript.XUdt]: systemScripts["devnet"].xudt!.script as ScriptInfo,
  [KnownScript.NervosDao]: systemScripts["devnet"].dao!.script as ScriptInfo,
};

export function buildCccClient(network: Network) {
  const client =
    network === "mainnet"
      ? new ccc.ClientPublicMainnet()
      : network === "testnet"
      ? new ccc.ClientPublicTestnet()
      : new ccc.ClientPublicTestnet({
          url: "http://localhost:28114", // the default offckb devnet proxy rpc url
          scripts: DEVNET_SCRIPTS as any,
        });

  return client;
}

export function readEnvNetwork(): Network {
  const network = process.env.NETWORK;
  const defaultNetwork = 'testnet';
  if (!network) return defaultNetwork;

  if (!['devnet', 'testnet', 'mainnet'].includes(network)) {
    return defaultNetwork;
  }

  return network as Network;
}

export const cccClient = buildCccClient(readEnvNetwork());
