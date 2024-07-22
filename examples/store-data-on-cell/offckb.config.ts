import { Indexer, RPC, config } from '@ckb-lumos/lumos';

export interface NetworkConfig {
  lumosConfig: config.Config;
  rpc_url: string;
  rpc: RPC;
  indexer: Indexer;
}

export interface OffCKBConfig {
  version: string;
  lumosVersion: string;
  contractBinFolder: string;
  network: {
    devnet: NetworkConfig;
    testnet: NetworkConfig;
    mainnet: NetworkConfig;
  };
  initializeLumosConfig: () => void;
  readonly rpc: RPC;
  readonly indexer: Indexer;
  readonly lumosConfig: config.Config;
}

function readEnvNetwork(): 'devnet' | 'testnet' | 'mainnet' {
  // you may need to update the env method
  // according to your frontend framework
  const network = process.env.NETWORK;
  const defaultNetwork = 'testnet';
  if (!network) return defaultNetwork;

  if (!['devnet', 'testnet', 'mainnet'].includes(network)) {
    return defaultNetwork;
  }

  return network as 'devnet' | 'testnet' | 'mainnet';
}

// please do not alter the following structure
// we use it as a check point in offCKB
// ---devnet lumos config---
const lumosConfig: config.Config = {
  "PREFIX": "ckt",
  "SCRIPTS": {
    "SECP256K1_BLAKE160": {
      "CODE_HASH": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      "HASH_TYPE": "type",
      "TX_HASH": "0x75be96e1871693f030db27ddae47890a28ab180e88e36ebb3575d9f1377d3da7",
      "INDEX": "0x0",
      "DEP_TYPE": "depGroup",
      "SHORT_ID": 1
    },
    "SECP256K1_BLAKE160_MULTISIG": {
      "CODE_HASH": "0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8",
      "HASH_TYPE": "type",
      "TX_HASH": "0x75be96e1871693f030db27ddae47890a28ab180e88e36ebb3575d9f1377d3da7",
      "INDEX": "0x1",
      "DEP_TYPE": "depGroup"
    },
    "DAO": {
      "CODE_HASH": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
      "HASH_TYPE": "type",
      "TX_HASH": "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
      "INDEX": "0x2",
      "DEP_TYPE": "code",
      "SHORT_ID": 2
    },
    "SUDT": {
      "CODE_HASH": "0x6283a479a3cf5d4276cd93594de9f1827ab9b55c7b05b3d28e4c2e0a696cfefd",
      "HASH_TYPE": "type",
      "TX_HASH": "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
      "INDEX": "0x5",
      "DEP_TYPE": "code"
    },
    "XUDT": {
      "CODE_HASH": "0x1a1e4fef34f5982906f745b048fe7b1089647e82346074e0f32c2ece26cf6b1e",
      "HASH_TYPE": "type",
      "TX_HASH": "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
      "INDEX": "0x6",
      "DEP_TYPE": "code"
    },
    "OMNILOCK": {
      "CODE_HASH": "0x9c6933d977360f115a3e9cd5a2e0e475853681b80d775d93ad0f8969da343e56",
      "HASH_TYPE": "type",
      "TX_HASH": "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
      "INDEX": "0x7",
      "DEP_TYPE": "code"
    },
    "ANYONE_CAN_PAY": {
      "CODE_HASH": "0xe09352af0066f3162287763ce4ddba9af6bfaeab198dc7ab37f8c71c9e68bb5b",
      "HASH_TYPE": "type",
      "TX_HASH": "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
      "INDEX": "0x8",
      "DEP_TYPE": "code"
    },
    "ALWAYS_SUCCESS": {
      "CODE_HASH": "0xbb4469004225b39e983929db71fe2253cba1d49a76223e9e1d212cdca1f79f28",
      "HASH_TYPE": "type",
      "TX_HASH": "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
      "INDEX": "0x9",
      "DEP_TYPE": "code"
    },
    "SPORE": {
      "CODE_HASH": "0x7e8bf78a62232caa2f5d47e691e8db1a90d05e93dc6828ad3cb935c01ec6d208",
      "HASH_TYPE": "data1",
      "TX_HASH": "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
      "INDEX": "0xa",
      "DEP_TYPE": "code"
    },
    "SPORE_CLUSTER": {
      "CODE_HASH": "0x7366a61534fa7c7e6225ecc0d828ea3b5366adec2b58206f2ee84995fe030075",
      "HASH_TYPE": "data1",
      "TX_HASH": "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
      "INDEX": "0xb",
      "DEP_TYPE": "code"
    },
    "SPORE_CLUSTER_AGENT": {
      "CODE_HASH": "0xc986099b41d79ca1b2a56ce5874bcda8175440a17298ea5e2bbc3897736b8c21",
      "HASH_TYPE": "data1",
      "TX_HASH": "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
      "INDEX": "0xc",
      "DEP_TYPE": "code"
    },
    "SPORE_CLUSTER_PROXY": {
      "CODE_HASH": "0xbe8b9ce3d05a32c4bb26fe71cd5fc1407ce91e3a8b9e8719be2ab072cef1454b",
      "HASH_TYPE": "data1",
      "TX_HASH": "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
      "INDEX": "0xd",
      "DEP_TYPE": "code"
    },
    "SPORE_LUA": {
      "CODE_HASH": "0x94a9b875911ace20f1f0d063a26495d14e4b04e32fd218261bb747f34e71ae47",
      "HASH_TYPE": "data1",
      "TX_HASH": "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
      "INDEX": "0xe",
      "DEP_TYPE": "code"
    }
  }
} as config.Config;
// ---end of devnet lumos config---
// ---testnet lumos config---
const testnetLumosConfig: config.Config = {
  "PREFIX": "ckt",
  "SCRIPTS": {
    "SECP256K1_BLAKE160": {
      "CODE_HASH": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      "HASH_TYPE": "type",
      "TX_HASH": "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
      "INDEX": "0x0",
      "DEP_TYPE": "depGroup",
      "SHORT_ID": 0
    },
    "SECP256K1_BLAKE160_MULTISIG": {
      "CODE_HASH": "0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8",
      "HASH_TYPE": "type",
      "TX_HASH": "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
      "INDEX": "0x1",
      "DEP_TYPE": "depGroup",
      "SHORT_ID": 1
    },
    "DAO": {
      "CODE_HASH": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
      "HASH_TYPE": "type",
      "TX_HASH": "0x8f8c79eb6671709633fe6a46de93c0fedc9c1b8a6527a18d3983879542635c9f",
      "INDEX": "0x2",
      "DEP_TYPE": "code"
    },
    "SUDT": {
      "CODE_HASH": "0xc5e5dcf215925f7ef4dfaf5f4b4f105bc321c02776d6e7d52a1db3fcd9d011a4",
      "HASH_TYPE": "type",
      "TX_HASH": "0xe12877ebd2c3c364dc46c5c992bcfaf4fee33fa13eebdf82c591fc9825aab769",
      "INDEX": "0x0",
      "DEP_TYPE": "code"
    },
    "ANYONE_CAN_PAY": {
      "CODE_HASH": "0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356",
      "HASH_TYPE": "type",
      "TX_HASH": "0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6",
      "INDEX": "0x0",
      "DEP_TYPE": "depGroup",
      "SHORT_ID": 2
    },
    "OMNILOCK": {
      "CODE_HASH": "0xf329effd1c475a2978453c8600e1eaf0bc2087ee093c3ee64cc96ec6847752cb",
      "HASH_TYPE": "type",
      "TX_HASH": "0x27b62d8be8ed80b9f56ee0fe41355becdb6f6a40aeba82d3900434f43b1c8b60",
      "INDEX": "0x0",
      "DEP_TYPE": "code"
    }
  }
} as config.Config;
// ---end of testnet lumos config---
// ---mainnet lumos config---
const mainnetLumosConfig: config.Config = {
  "PREFIX": "ckb",
  "SCRIPTS": {
    "SECP256K1_BLAKE160": {
      "CODE_HASH": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      "HASH_TYPE": "type",
      "TX_HASH": "0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c",
      "INDEX": "0x0",
      "DEP_TYPE": "depGroup",
      "SHORT_ID": 0
    },
    "SECP256K1_BLAKE160_MULTISIG": {
      "CODE_HASH": "0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8",
      "HASH_TYPE": "type",
      "TX_HASH": "0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c",
      "INDEX": "0x1",
      "DEP_TYPE": "depGroup",
      "SHORT_ID": 1
    },
    "DAO": {
      "CODE_HASH": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
      "HASH_TYPE": "type",
      "TX_HASH": "0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c",
      "INDEX": "0x2",
      "DEP_TYPE": "code"
    },
    "SUDT": {
      "CODE_HASH": "0x5e7a36a77e68eecc013dfa2fe6a23f3b6c344b04005808694ae6dd45eea4cfd5",
      "HASH_TYPE": "type",
      "TX_HASH": "0xc7813f6a415144643970c2e88e0bb6ca6a8edc5dd7c1022746f628284a9936d5",
      "INDEX": "0x0",
      "DEP_TYPE": "code"
    },
    "ANYONE_CAN_PAY": {
      "CODE_HASH": "0xd369597ff47f29fbc0d47d2e3775370d1250b85140c670e4718af712983a2354",
      "HASH_TYPE": "type",
      "TX_HASH": "0x4153a2014952d7cac45f285ce9a7c5c0c0e1b21f2d378b82ac1433cb11c25c4d",
      "INDEX": "0x0",
      "DEP_TYPE": "depGroup",
      "SHORT_ID": 2
    },
    "OMNILOCK": {
      "CODE_HASH": "0x9b819793a64463aed77c615d6cb226eea5487ccfc0783043a587254cda2b6f26",
      "HASH_TYPE": "type",
      "TX_HASH": "0xdfdb40f5d229536915f2d5403c66047e162e25dedd70a79ef5164356e1facdc8",
      "INDEX": "0x0",
      "DEP_TYPE": "code"
    }
  }
} as config.Config;
// ---end of mainnet lumos config---

const offCKBConfig: OffCKBConfig = {
  version: '0.2.2',
  lumosVersion: '0.21.1',
  contractBinFolder: '../../build/release',
  network: {
    devnet: {
      lumosConfig,
      rpc_url: 'http://127.0.0.1:8114',
      rpc: new RPC('http://127.0.0.1:8114'),
      indexer: new Indexer('http://127.0.0.1:8114'),
    },
    testnet: {
      lumosConfig: testnetLumosConfig,
      rpc_url: 'https://testnet.ckb.dev/rpc',
      rpc: new RPC('https://testnet.ckb.dev/rpc'),
      indexer: new Indexer('https://testnet.ckb.dev/rpc'),
    },
    mainnet: {
      lumosConfig: mainnetLumosConfig,
      rpc_url: 'https://mainnet.ckb.dev/rpc',
      rpc: new RPC('https://mainnet.ckb.dev/rpc'),
      indexer: new Indexer('https://mainnet.ckb.dev/rpc'),
    },
  },
  initializeLumosConfig: () => {
    const network = readEnvNetwork();
    const lumosConfig = offCKBConfig.network[network].lumosConfig;
    return config.initializeConfig(lumosConfig);
  },
  get rpc() {
    const network = readEnvNetwork();
    return offCKBConfig.network[network].rpc;
  },

  get indexer() {
    const network = readEnvNetwork();
    return offCKBConfig.network[network].indexer;
  },

  get lumosConfig() {
    const network = readEnvNetwork();
    return offCKBConfig.network[network].lumosConfig;
  },
};

export default offCKBConfig;
