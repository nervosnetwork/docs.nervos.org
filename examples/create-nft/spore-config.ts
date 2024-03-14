import { lumosConfig, CKB_RPC_URL } from "./ckb";
import { SporeConfig } from "@spore-sdk/core";

export type PredefinedDevnetSporeScriptName =
  | "Spore"
  | "Cluster"
  | "ClusterProxy"
  | "ClusterAgent"
  | "Lua";

export const SPORE_CONFIG: SporeConfig<PredefinedDevnetSporeScriptName> = {
  lumos: lumosConfig,
  ckbNodeUrl: CKB_RPC_URL,
  ckbIndexerUrl: CKB_RPC_URL,
  scripts: {
    Spore: {
      versions: [
        {
          tags: ["v2", "latest"],
          script: {
            codeHash: lumosConfig["SPORE"].CODE_HASH,
            hashType: lumosConfig["SPORE"].HASH_TYPE,
          },
          cellDep: {
            outPoint: {
              txHash: lumosConfig["SPORE"].TX_HASH,
              index: lumosConfig["SPORE"].INDEX,
            },
            depType: lumosConfig["SPORE"].DEP_TYPE,
          },
        },
      ],
    },
    Cluster: {
      versions: [
        {
          tags: ["v2", "latest"],
          script: {
            codeHash: lumosConfig["SPORE_CLUSTER"].CODE_HASH,
            hashType: lumosConfig["SPORE_CLUSTER"].HASH_TYPE,
          },
          cellDep: {
            outPoint: {
              txHash: lumosConfig["SPORE_CLUSTER"].TX_HASH,
              index: lumosConfig["SPORE_CLUSTER"].INDEX,
            },
            depType: lumosConfig["SPORE_CLUSTER"].DEP_TYPE,
          },
          behaviors: {
            lockProxy: true,
            cobuild: false,
          },
        },
      ],
    },
    ClusterProxy: {
      versions: [
        {
          tags: ["v2", "latest"],
          script: {
            codeHash: lumosConfig["SPORE_CLUSTER_PROXY"].CODE_HASH,
            hashType: lumosConfig["SPORE_CLUSTER_PROXY"].HASH_TYPE,
          },
          cellDep: {
            outPoint: {
              txHash: lumosConfig["SPORE_CLUSTER_PROXY"].TX_HASH,
              index: lumosConfig["SPORE_CLUSTER_PROXY"].INDEX,
            },
            depType: lumosConfig["SPORE_CLUSTER_PROXY"].DEP_TYPE,
          },
          behaviors: {
            lockProxy: true,
            cobuild: false,
          },
        },
      ],
    },
    ClusterAgent: {
      versions: [
        {
          tags: ["v2", "latest"],
          script: {
            codeHash: lumosConfig["SPORE_CLUSTER_AGENT"].CODE_HASH,
            hashType: lumosConfig["SPORE_CLUSTER_AGENT"].HASH_TYPE,
          },
          cellDep: {
            outPoint: {
              txHash: lumosConfig["SPORE_CLUSTER_AGENT"].TX_HASH,
              index: lumosConfig["SPORE_CLUSTER_AGENT"].INDEX,
            },
            depType: lumosConfig["SPORE_CLUSTER_AGENT"].DEP_TYPE,
          },
          behaviors: {
            lockProxy: true,
            cobuild: false,
          },
        },
      ],
    },
    Lua: {
      versions: [
        {
          tags: ["v2", "latest"],
          script: {
            codeHash: lumosConfig["SPORE_LUA"].CODE_HASH,
            hashType: lumosConfig["SPORE_LUA"].HASH_TYPE,
          },
          cellDep: {
            outPoint: {
              txHash: lumosConfig["SPORE_LUA"].TX_HASH,
              index: lumosConfig["SPORE_LUA"].INDEX,
            },
            depType: lumosConfig["SPORE_LUA"].DEP_TYPE,
          },
        },
      ],
    },
  },
};
