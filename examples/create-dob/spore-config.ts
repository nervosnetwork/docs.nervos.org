import { lumosConfig, CKB_RPC_URL } from "./ckb";
import { SporeConfig, predefinedSporeConfigs } from "@spore-sdk/core";

export type PredefinedDevnetSporeScriptName =
  | "Spore"
  | "Cluster"
  | "ClusterProxy"
  | "ClusterAgent"
  | "Lua";

//@ts-ignore
export const SPORE_CONFIG: SporeConfig<PredefinedDevnetSporeScriptName> = CKB_RPC_URL === "https://testnet.ckb.dev/rpc" ? predefinedSporeConfigs.Testnet :  {
  lumos: lumosConfig,
  ckbNodeUrl: CKB_RPC_URL,
  ckbIndexerUrl: CKB_RPC_URL,
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
            codeHash: lumosConfig.SCRIPTS["SPORE_CLUSTER_PROXY"].CODE_HASH,
            hashType: lumosConfig.SCRIPTS["SPORE_CLUSTER_PROXY"].HASH_TYPE,
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
            codeHash: lumosConfig.SCRIPTS["SPORE_CLUSTER_AGENT"].CODE_HASH,
            hashType: lumosConfig.SCRIPTS["SPORE_CLUSTER_AGENT"].HASH_TYPE,
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
