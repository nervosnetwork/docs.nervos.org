import { SporeConfig, predefinedSporeConfigs } from "@spore-sdk/core";
import { readEnvNetwork } from "./ccc-client";

import systemScripts from "./system-scripts.json";
import { buildDevnetLumosConfig } from "./devnet-lumos-config.cjs";

const lumosConfig = buildDevnetLumosConfig(systemScripts.devnet);

export type PredefinedDevnetSporeScriptName =
  | "Spore"
  | "Cluster"
  | "ClusterProxy"
  | "ClusterAgent"
  | "Lua";

//@ts-ignore
export const SPORE_CONFIG: SporeConfig<PredefinedDevnetSporeScriptName> =
  readEnvNetwork() === "testnet"
    ? predefinedSporeConfigs.Testnet
    : {
        lumos: lumosConfig,
        ckbNodeUrl: "http://localhost:28114", // the default offckb devnet proxy rpc url
        ckbIndexerUrl: "http://localhost:28114",
        defaultTags: ["latest"],
        scripts: {
          Spore: {
            versions: [
              {
                tags: ["v2", "latest"],
                script: {
                  codeHash: lumosConfig.SCRIPTS["SPORE"].CODE_HASH,
                  hashType: lumosConfig.SCRIPTS["SPORE"].HASH_TYPE,
                },
                cellDep: {
                  outPoint: {
                    txHash: lumosConfig.SCRIPTS["SPORE"].TX_HASH,
                    index: lumosConfig.SCRIPTS["SPORE"].INDEX,
                  },
                  depType: lumosConfig.SCRIPTS["SPORE"].DEP_TYPE,
                },
                behaviors: {
                  lockProxy: true,
                  cobuild: true,
                },
              },
            ],
          },
          Cluster: {
            versions: [
              {
                tags: ["v2", "latest"],
                script: {
                  codeHash: lumosConfig.SCRIPTS["SPORE_CLUSTER"].CODE_HASH,
                  hashType: lumosConfig.SCRIPTS["SPORE_CLUSTER"].HASH_TYPE,
                },
                cellDep: {
                  outPoint: {
                    txHash: lumosConfig.SCRIPTS["SPORE_CLUSTER"].TX_HASH,
                    index: lumosConfig.SCRIPTS["SPORE_CLUSTER"].INDEX,
                  },
                  depType: lumosConfig.SCRIPTS["SPORE_CLUSTER"].DEP_TYPE,
                },
                behaviors: {
                  lockProxy: true,
                  cobuild: true,
                },
              },
            ],
          },
          ClusterProxy: {
            versions: [
              {
                tags: ["v2", "latest"],
                script: {
                  codeHash:
                    lumosConfig.SCRIPTS["SPORE_CLUSTER_PROXY"].CODE_HASH,
                  hashType:
                    lumosConfig.SCRIPTS["SPORE_CLUSTER_PROXY"].HASH_TYPE,
                },
                cellDep: {
                  outPoint: {
                    txHash: lumosConfig.SCRIPTS["SPORE_CLUSTER_PROXY"].TX_HASH,
                    index: lumosConfig.SCRIPTS["SPORE_CLUSTER_PROXY"].INDEX,
                  },
                  depType: lumosConfig.SCRIPTS["SPORE_CLUSTER_PROXY"].DEP_TYPE,
                },
                behaviors: {
                  lockProxy: true,
                  cobuild: true,
                },
              },
            ],
          },
          ClusterAgent: {
            versions: [
              {
                tags: ["v2", "latest"],
                script: {
                  codeHash:
                    lumosConfig.SCRIPTS["SPORE_CLUSTER_AGENT"].CODE_HASH,
                  hashType:
                    lumosConfig.SCRIPTS["SPORE_CLUSTER_AGENT"].HASH_TYPE,
                },
                cellDep: {
                  outPoint: {
                    txHash: lumosConfig.SCRIPTS["SPORE_CLUSTER_AGENT"].TX_HASH,
                    index: lumosConfig.SCRIPTS["SPORE_CLUSTER_AGENT"].INDEX,
                  },
                  depType: lumosConfig.SCRIPTS["SPORE_CLUSTER_AGENT"].DEP_TYPE,
                },
                behaviors: {
                  lockProxy: true,
                  cobuild: true,
                },
              },
            ],
          },
          Lua: {
            versions: [
              {
                tags: ["v2", "latest"],
                script: {
                  codeHash: lumosConfig.SCRIPTS["SPORE_LUA"].CODE_HASH,
                  hashType: lumosConfig.SCRIPTS["SPORE_LUA"].HASH_TYPE,
                },
                cellDep: {
                  outPoint: {
                    txHash: lumosConfig.SCRIPTS["SPORE_LUA"].TX_HASH,
                    index: lumosConfig.SCRIPTS["SPORE_LUA"].INDEX,
                  },
                  depType: lumosConfig.SCRIPTS["SPORE_LUA"].DEP_TYPE,
                },
              },
            ],
          },
        },
      };
