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

test("deployment refreshes only the selected ckb-js-vm entry", () => {
  assert.equal(typeof deploy.mergeSystemScriptArtifact, "function");

  const directory = mkdtempSync(join(tmpdir(), "simple-lock-merge-system-"));
  const sourcePath = join(directory, "system-scripts.json");
  const exportedPath = join(directory, "exported-system-scripts.json");
  const retainedTestnet = { marker: "keep-testnet" };
  const existing = {
    devnet: {
      secp256k1_blake160_sighash_all: { marker: "keep-devnet" },
      ckb_js_vm: { file: "existing-portable-metadata", script: {} },
    },
    testnet: retainedTestnet,
  };
  const exported = {
    devnet: {
      ckb_js_vm: {
        file: "/machine-specific/offckb/path",
        script: {
          codeHash: `0x${"56".repeat(32)}`,
          hashType: "type",
          cellDeps: [],
        },
      },
    },
  };

  try {
    writeFileSync(sourcePath, JSON.stringify(existing));
    writeFileSync(exportedPath, JSON.stringify(exported));
    deploy.mergeSystemScriptArtifact({
      network: "devnet",
      sourcePath,
      exportedPath,
    });

    const merged = JSON.parse(readFileSync(sourcePath, "utf8"));
    assert.deepEqual(merged.testnet, retainedTestnet);
    assert.equal(
      merged.devnet.secp256k1_blake160_sighash_all.marker,
      "keep-devnet",
    );
    assert.equal(merged.devnet.ckb_js_vm.file, "existing-portable-metadata");
    assert.equal(
      merged.devnet.ckb_js_vm.script.codeHash,
      exported.devnet.ckb_js_vm.script.codeHash,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
