const { test } = require("node:test");
const assert = require("node:assert/strict");
const { buildDevnetLumosConfig } = require("../devnet-lumos-config.cjs");
const { devnet } = require("../system-scripts.json");

test("Spore and signing dependencies follow the refreshed export", () => {
  const updated = structuredClone(devnet);
  const signingTx = "0x" + "33".repeat(32);
  const sporeTx = "0x" + "44".repeat(32);
  updated.secp256k1_blake160_sighash_all.script.cellDeps[0].cellDep.outPoint.txHash =
    signingTx;
  updated.spore.script.cellDeps[0].cellDep.outPoint = {
    txHash: sporeTx,
    index: 10,
  };
  updated.spore.script.codeHash = "0x" + "55".repeat(32);
  const config = buildDevnetLumosConfig(updated);
  assert.equal(config.SCRIPTS.SECP256K1_BLAKE160.TX_HASH, signingTx);
  assert.equal(config.SCRIPTS.SPORE.TX_HASH, sporeTx);
  assert.equal(config.SCRIPTS.SPORE.INDEX, "0xa");
  assert.equal(config.SCRIPTS.SPORE.CODE_HASH, "0x" + "55".repeat(32));
  assert.equal(config.SCRIPTS.SPORE.HASH_TYPE, "data2");
  assert.equal(config.SCRIPTS.SPORE.DEP_TYPE, "code");
  for (const name of [
    "SPORE_CLUSTER",
    "SPORE_CLUSTER_AGENT",
    "SPORE_CLUSTER_PROXY",
    "SPORE_LUA",
  ]) {
    assert.ok(config.SCRIPTS[name]);
  }
});
