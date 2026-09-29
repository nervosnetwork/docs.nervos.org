// Both CCC and the Spore SDK use the same refreshed OffCKB export.
function buildDevnetLumosConfig(devnet) {
  const names = {
    SECP256K1_BLAKE160: "secp256k1_blake160_sighash_all",
    SECP256K1_BLAKE160_MULTISIG: "secp256k1_blake160_multisig_all",
    DAO: "dao",
    SUDT: "sudt",
    XUDT: "xudt",
    OMNILOCK: "omnilock",
    ANYONE_CAN_PAY: "anyone_can_pay",
    SPORE: "spore",
    SPORE_CLUSTER: "spore_cluster",
    ALWAYS_SUCCESS: "always_success",
    SPORE_CLUSTER_AGENT: "spore_cluster_agent",
    SPORE_CLUSTER_PROXY: "spore_cluster_proxy",
    SPORE_LUA: "spore_extension_lua",
  };
  const SCRIPTS = {};
  for (const [name, key] of Object.entries(names)) {
    const script = devnet[key]?.script;
    if (!script) continue;
    const dep = script.cellDeps[0].cellDep;
    SCRIPTS[name] = {
      CODE_HASH: script.codeHash,
      HASH_TYPE: script.hashType,
      TX_HASH: dep.outPoint.txHash,
      INDEX: `0x${BigInt(dep.outPoint.index).toString(16)}`,
      DEP_TYPE: dep.depType,
      ...(name === "SECP256K1_BLAKE160" ? { SHORT_ID: 1 } : {}),
      ...(name === "DAO" ? { SHORT_ID: 2 } : {}),
    };
  }
  return { PREFIX: "ckt", SCRIPTS };
}

module.exports = { buildDevnetLumosConfig };
