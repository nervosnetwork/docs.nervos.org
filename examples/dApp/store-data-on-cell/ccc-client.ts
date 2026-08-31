import { ccc, CellDepInfoLike, KnownScript, Script } from "@ckb-ccc/core";
import systemScripts from "./system-scripts.json";

export type Network = "devnet" | "testnet";

export const NETWORK_RPC_URLS: Record<Network, string> = {
  devnet: "http://127.0.0.1:28114",
  testnet: "https://testnet.ckb.dev",
};

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
    network === "testnet"
      ? new ccc.ClientPublicTestnet()
      : new ccc.ClientPublicTestnet({
          url: NETWORK_RPC_URLS.devnet,
          scripts: DEVNET_SCRIPTS as any,
        });

  return client;
}

export function readEnvNetwork(): Network {
  const network = process.env.NETWORK;
  const defaultNetwork = "devnet";
  if (!network) return defaultNetwork;

  if (network === "mainnet") {
    throw new Error(
      "Mainnet is not available for this tutorial example. Use Devnet or Testnet.",
    );
  }

  if (!['devnet', 'testnet'].includes(network)) {
    throw new Error(
      `Unsupported NETWORK "${network}". Supported values are devnet and testnet.`,
    );
  }

  return network as Network;
}

export const activeNetwork = readEnvNetwork();
export const activeRpcUrl = NETWORK_RPC_URLS[activeNetwork];
export const cccClient = buildCccClient(activeNetwork);
