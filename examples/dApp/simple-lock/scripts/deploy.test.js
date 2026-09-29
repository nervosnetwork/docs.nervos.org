import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import * as deploy from "./deploy.js";

test("deployment validates supported networks", () => {
  assert.equal(typeof deploy.validateNetwork, "function");
  assert.equal(deploy.validateNetwork("devnet"), "devnet");
  assert.equal(deploy.validateNetwork("testnet"), "testnet");
  assert.throws(
    () => deploy.validateNetwork("mainnet"),
    /current offckb.*does not support direct mainnet deployment/i,
  );
  assert.throws(
    () => deploy.validateNetwork("unknown"),
    /supported networks are devnet and testnet/i,
  );
});

test("deployment validates optional private keys", () => {
  const key = `0x${"ab".repeat(32)}`;
  assert.equal(deploy.validatePrivateKey(null), null);
  assert.equal(deploy.validatePrivateKey(key), key);
  assert.throws(
    () => deploy.validatePrivateKey("not-a-private-key"),
    /32-byte hexadecimal private key/i,
  );
});

test("deployment validates and synchronizes the selected artifact", () => {
  assert.equal(typeof deploy.validateAndSyncDeployment, "function");

  const directory = mkdtempSync(join(tmpdir(), "simple-lock-deploy-"));
  const sourcePath = join(directory, "scripts.json");
  const destinationPath = join(directory, "frontend-scripts.json");
  const deployment = {
    devnet: {
      "hash-lock.bc": {
        codeHash: `0x${"ab".repeat(32)}`,
        hashType: "data1",
        cellDeps: [
          {
            cellDep: {
              outPoint: { txHash: `0x${"cd".repeat(32)}`, index: 0 },
              depType: "code",
            },
          },
        ],
      },
    },
    testnet: {},
  };

  try {
    writeFileSync(sourcePath, `${JSON.stringify(deployment, null, 2)}\n`);
    const result = deploy.validateAndSyncDeployment({
      network: "devnet",
      sourcePath,
      destinationPath,
    });

    assert.equal(result.codeHash, deployment.devnet["hash-lock.bc"].codeHash);
    assert.deepEqual(result.outPoint, {
      txHash: `0x${"cd".repeat(32)}`,
      index: 0,
    });
    assert.equal(
      readFileSync(destinationPath, "utf8"),
      readFileSync(sourcePath, "utf8"),
    );

    deployment.devnet["hash-lock.bc"].cellDeps[0].cellDep.outPoint.index = "0";
    writeFileSync(sourcePath, `${JSON.stringify(deployment, null, 2)}\n`);
    assert.throws(
      () =>
        deploy.validateAndSyncDeployment({
          network: "devnet",
          sourcePath,
          destinationPath,
        }),
      /invalid output index/i,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("deployment validates and synchronizes ckb-js-vm system scripts", () => {
  assert.equal(typeof deploy.validateAndSyncSystemScripts, "function");

  const directory = mkdtempSync(join(tmpdir(), "simple-lock-system-"));
  const sourcePath = join(directory, "system-scripts.json");
  const destinationPath = join(directory, "frontend-system-scripts.json");
  const systemScripts = {
    devnet: {
      ckb_js_vm: {
        script: {
          codeHash: `0x${"12".repeat(32)}`,
          hashType: "type",
          cellDeps: [
            {
              cellDep: {
                outPoint: { txHash: `0x${"34".repeat(32)}`, index: 15 },
                depType: "code",
              },
            },
          ],
        },
      },
    },
  };

  systemScripts.devnet.secp256k1_blake160_sighash_all = structuredClone(
    systemScripts.devnet.ckb_js_vm,
  );

  try {
    writeFileSync(sourcePath, `${JSON.stringify(systemScripts, null, 2)}\n`);
    const result = deploy.validateAndSyncSystemScripts({
      network: "devnet",
      sourcePath,
      destinationPath,
    });

    assert.deepEqual(result.outPoint, {
      txHash: `0x${"34".repeat(32)}`,
      index: 15,
    });
    assert.equal(
      readFileSync(destinationPath, "utf8"),
      readFileSync(sourcePath, "utf8"),
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

const scriptFixture = (digit) => ({
  codeHash: `0x${digit.repeat(64)}`,
  hashType: "type",
  cellDeps: [
    {
      cellDep: {
        outPoint: { txHash: `0x${digit.repeat(64)}`, index: 0 },
        depType: "code",
      },
    },
  ],
});

for (const network of ["devnet", "testnet"]) {
  test(`refreshes all ${network} scripts and preserves other networks`, () => {
    const directory = mkdtempSync(join(tmpdir(), "simple-lock-merge-"));
    const sourcePath = join(directory, "system-scripts.json");
    const exportedPath = join(directory, "exported.json");
    const existing = {
      devnet: { marker: "devnet" },
      testnet: { marker: "testnet" },
      mainnet: { marker: "mainnet" },
    };
    existing[network] = {
      stale: {},
      ckb_js_vm: { file: "portable-path", script: scriptFixture("1") },
      secp256k1_blake160_sighash_all: { script: scriptFixture("2") },
    };
    const fresh = {
      ckb_js_vm: { file: "/local/path", script: scriptFixture("3") },
      secp256k1_blake160_sighash_all: { script: scriptFixture("4") },
      dao: { script: scriptFixture("5") },
    };
    try {
      writeFileSync(sourcePath, JSON.stringify(existing));
      writeFileSync(exportedPath, JSON.stringify({ [network]: fresh }));
      deploy.mergeSystemScriptArtifact({ network, sourcePath, exportedPath });
      const merged = JSON.parse(readFileSync(sourcePath, "utf8"));
      assert.deepEqual(
        merged[network].secp256k1_blake160_sighash_all,
        fresh.secp256k1_blake160_sighash_all,
      );
      assert.deepEqual(merged[network].dao, fresh.dao);
      assert.equal(merged[network].stale, undefined);
      assert.equal(merged[network].ckb_js_vm.file, "portable-path");
      for (const other of ["devnet", "testnet", "mainnet"].filter(
        (n) => n !== network,
      ))
        assert.deepEqual(merged[other], existing[other]);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}

for (const name of ["ckb_js_vm", "secp256k1_blake160_sighash_all"]) {
  for (const invalid of ["missing", "malformed"]) {
    test(`rejects ${invalid} ${name} before replacing either artifact`, () => {
      const directory = mkdtempSync(join(tmpdir(), "simple-lock-invalid-"));
      const sourcePath = join(directory, "source.json");
      const exportedPath = join(directory, "exported.json");
      const destinationPath = join(directory, "frontend.json");
      const scripts = {
        ckb_js_vm: { script: scriptFixture("1") },
        secp256k1_blake160_sighash_all: { script: scriptFixture("2") },
      };
      if (invalid === "missing") delete scripts[name];
      else scripts[name].script.cellDeps = [];
      const bad = JSON.stringify({ devnet: scripts });
      try {
        writeFileSync(sourcePath, "{}");
        writeFileSync(exportedPath, bad);
        assert.throws(() =>
          deploy.mergeSystemScriptArtifact({
            network: "devnet",
            sourcePath,
            exportedPath,
          }),
        );
        assert.equal(readFileSync(sourcePath, "utf8"), "{}");
        writeFileSync(sourcePath, bad);
        writeFileSync(destinationPath, "{}");
        assert.throws(() =>
          deploy.validateAndSyncSystemScripts({
            network: "devnet",
            sourcePath,
            destinationPath,
          }),
        );
        assert.equal(readFileSync(destinationPath, "utf8"), "{}");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });
  }
}
