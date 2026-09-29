const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const source = fs.readFileSync(
  path.join(__dirname, "sync-devnet-system-scripts.cjs"),
  "utf8"
);

function fixture(t, exported, result = { status: 0 }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "xudt-sync-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, "system-scripts.json");
  const original = {
    devnet: { xudt: { file: "existing-path", script: { codeHash: "old" } } },
    testnet: { preserved: true },
    mainnet: { preserved: true },
  };
  fs.writeFileSync(file, JSON.stringify(original));
  const before = fs.readFileSync(file, "utf8");
  let exportPath;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    __dirname: path.join(root, "scripts"),
    module,
    process,
    console: { log() {} },
    require(name) {
      if (name !== "cross-spawn") return require(name);
      return {
        sync(command, args) {
          assert.equal(command, "offckb");
          assert.deepEqual(Array.from(args.slice(0, 5)), [
            "system-scripts",
            "--network",
            "devnet",
            "--export-style",
            "ccc",
          ]);
          exportPath = args[args.indexOf("--output") + 1];
          fs.writeFileSync(
            exportPath,
            typeof exported === "string" ? exported : JSON.stringify(exported)
          );
          return result;
        },
      };
    },
  });
  t.after(() => assert.equal(fs.existsSync(path.dirname(exportPath)), false));
  return {
    file,
    original,
    before,
    sync: module.exports.syncDevnetSystemScripts,
  };
}

const exported = {
  devnet: {
    secp256k1_blake160_sighash_all: { script: { codeHash: "signing" } },
    xudt: { file: "local-path", script: { codeHash: "new" } },
  },
};

test("refreshes Devnet scripts and preserves other networks and existing file metadata", (t) => {
  const f = fixture(t, exported);
  f.sync();
  const updated = JSON.parse(fs.readFileSync(f.file, "utf8"));
  assert.deepEqual(updated.devnet.xudt.script, exported.devnet.xudt.script);
  assert.deepEqual(
    updated.devnet.secp256k1_blake160_sighash_all,
    exported.devnet.secp256k1_blake160_sighash_all
  );
  assert.equal(updated.devnet.xudt.file, "existing-path");
  assert.deepEqual(updated.testnet, f.original.testnet);
  assert.deepEqual(updated.mainnet, f.original.mainnet);
});

for (const name of ["secp256k1_blake160_sighash_all", "xudt"]) {
  test(`rejects missing ${name} without changing the existing file`, (t) => {
    const incomplete = structuredClone(exported);
    delete incomplete.devnet[name];
    const f = fixture(t, incomplete);
    assert.throws(f.sync, /does not contain/);
    assert.equal(fs.readFileSync(f.file, "utf8"), f.before);
  });
}

for (const [name, data, result] of [
  ["failed export", exported, { status: 1 }],
  ["missing CLI", exported, { error: new Error("ENOENT"), status: null }],
  ["invalid JSON", "not JSON", { status: 0 }],
]) {
  test(`rejects ${name} without changing the existing file`, (t) => {
    const f = fixture(t, data, result);
    assert.throws(f.sync);
    assert.equal(fs.readFileSync(f.file, "utf8"), f.before);
  });
}
