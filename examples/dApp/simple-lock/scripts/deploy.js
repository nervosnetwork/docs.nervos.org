#!/usr/bin/env node

/**
 * Deploy script for CKB contracts
 *
 * This script deploys all built contracts using the offckb deploy command.
 *
 * Fixed parameters:
 * - target: dist/ (where all built contracts are located)
 * - output: deployment/ (where deployment artifacts are saved)
 *
 * Command line arguments accepted:
 * - --network: Network to deploy to (devnet or testnet) - defaults to devnet
 * - --privkey: Private key for deployment - defaults to offckb's deployer account
 * - --type-id: Whether to use upgradable type id - defaults to false
 *
 * Usage:
 *   pnpm run deploy
 *   pnpm run deploy -- --network testnet
 *   pnpm run deploy -- --network testnet --privkey 0x...
 *   pnpm run deploy -- --network testnet --type-id
 */

import { spawn, spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const SUPPORTED_NETWORKS = ["devnet", "testnet"];
const DEPLOYMENT_SOURCE = "deployment/scripts.json";
const DEPLOYMENT_DESTINATION = "frontend/deployment/scripts.json";
const SYSTEM_SCRIPTS_SOURCE = "deployment/system-scripts.json";
const SYSTEM_SCRIPTS_DESTINATION = "frontend/deployment/system-scripts.json";

export function validateNetwork(network) {
  if (network === "mainnet") {
    throw new Error(
      "Current OffCKB does not support direct Mainnet deployment, and its Mainnet system-script export has no ckb-js-vm dependency. Use Devnet, Testnet, or an isolated Mainnet fork.",
    );
  }
  if (!SUPPORTED_NETWORKS.includes(network)) {
    throw new Error(
      `Unsupported network "${network}". Supported networks are devnet and testnet.`,
    );
  }
  return network;
}

export function validatePrivateKey(privateKey) {
  if (privateKey === null) return null;
  if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error(
      "--privkey must be a 32-byte hexadecimal private key beginning with 0x.",
    );
  }
  return privateKey;
}

function validateScriptArtifact(script, label) {
  const cellDep = script?.cellDeps?.[0]?.cellDep;
  const outPoint = cellDep?.outPoint;
  if (!/^0x[0-9a-fA-F]{64}$/.test(script?.codeHash ?? "")) {
    throw new Error(`${label} has an invalid codeHash.`);
  }
  if (!["data", "data1", "data2", "type"].includes(script?.hashType)) {
    throw new Error(`${label} has an invalid hashType.`);
  }
  if (!/^0x[0-9a-fA-F]{64}$/.test(outPoint?.txHash ?? "")) {
    throw new Error(`${label} has an invalid CellDep OutPoint.`);
  }
  if (
    !Number.isSafeInteger(outPoint.index) ||
    outPoint.index < 0 ||
    outPoint.index > 0xffffffff
  ) {
    throw new Error(`${label} CellDep has an invalid output index.`);
  }
  if (!["code", "depGroup"].includes(cellDep?.depType)) {
    throw new Error(`${label} CellDep has an invalid depType.`);
  }
  return outPoint;
}

export function validateAndSyncDeployment({
  network,
  sourcePath = DEPLOYMENT_SOURCE,
  destinationPath = DEPLOYMENT_DESTINATION,
}) {
  validateNetwork(network);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Deployment artifact not found: ${sourcePath}`);
  }

  let deployment;
  try {
    deployment = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read ${sourcePath}: ${error.message}`);
  }

  const contract = deployment[network]?.["hash-lock.bc"];
  if (!contract) {
    throw new Error(
      `${sourcePath} does not contain ${network}.hash-lock.bc. Redeploy to ${network} and try again.`,
    );
  }
  const outPoint = validateScriptArtifact(contract, `${network}.hash-lock.bc`);

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);

  const source = fs.readFileSync(sourcePath);
  const destination = fs.readFileSync(destinationPath);
  if (!source.equals(destination)) {
    throw new Error(
      `Deployment synchronization failed: ${destinationPath} does not match ${sourcePath}.`,
    );
  }

  return { codeHash: contract.codeHash, outPoint };
}

export function mergeSystemScriptArtifact({
  network,
  sourcePath = SYSTEM_SCRIPTS_SOURCE,
  exportedPath,
}) {
  validateNetwork(network);

  const current = fs.existsSync(sourcePath)
    ? JSON.parse(fs.readFileSync(sourcePath, "utf8"))
    : {};
  const exported = JSON.parse(fs.readFileSync(exportedPath, "utf8"));
  const exportedCkbJsVm = exported[network]?.ckb_js_vm;
  if (!exportedCkbJsVm?.script) {
    throw new Error(`${exportedPath} does not contain ${network}.ckb_js_vm.`);
  }

  const previousFile = current[network]?.ckb_js_vm?.file;
  current[network] ??= {};
  current[network].ckb_js_vm = {
    ...exportedCkbJsVm,
    ...(previousFile ? { file: previousFile } : {}),
  };
  fs.writeFileSync(sourcePath, `${JSON.stringify(current, null, 2)}\n`);
}

export function exportSystemScripts({
  network,
  sourcePath = SYSTEM_SCRIPTS_SOURCE,
}) {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "simple-lock-system-scripts-"),
  );
  const exportedPath = path.join(directory, "system-scripts.json");

  try {
    const result = spawnSync("offckb", ["system-scripts", "-o", exportedPath], {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    if (result.error) {
      throw new Error(
        `Unable to export system scripts: ${result.error.message}`,
      );
    }
    if (result.status !== 0) {
      throw new Error(
        `Unable to export system scripts: offckb exited with code ${result.status}.`,
      );
    }

    mergeSystemScriptArtifact({ network, sourcePath, exportedPath });
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

export function validateAndSyncSystemScripts({
  network,
  sourcePath = SYSTEM_SCRIPTS_SOURCE,
  destinationPath = SYSTEM_SCRIPTS_DESTINATION,
}) {
  validateNetwork(network);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`System-script artifact not found: ${sourcePath}`);
  }

  let systemScripts;
  try {
    systemScripts = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read ${sourcePath}: ${error.message}`);
  }

  const script = systemScripts[network]?.ckb_js_vm?.script;
  if (!script) {
    throw new Error(
      `${sourcePath} does not contain ${network}.ckb_js_vm. Regenerate the system scripts and try again.`,
    );
  }
  const outPoint = validateScriptArtifact(script, `${network}.ckb_js_vm`);

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
  if (!fs.readFileSync(sourcePath).equals(fs.readFileSync(destinationPath))) {
    throw new Error(
      `System-script synchronization failed: ${destinationPath} does not match ${sourcePath}.`,
    );
  }

  return { codeHash: script.codeHash, outPoint };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    network: "devnet",
    privkey: null,
    typeId: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--network" && i + 1 < args.length) {
      parsed.network = args[i + 1];
      i++; // Skip next argument since we consumed it
    } else if (arg === "--privkey" && i + 1 < args.length) {
      parsed.privkey = args[i + 1];
      i++; // Skip next argument since we consumed it
    } else if (arg === "--type-id" || arg === "-t") {
      parsed.typeId = true;
    }
  }

  return parsed;
}

function main() {
  // Fixed parameters for the template project
  const TARGET = "dist";
  const OUTPUT = "deployment";

  // Parse command line arguments
  const options = parseArgs();
  let NETWORK;
  let PRIVKEY;
  try {
    NETWORK = validateNetwork(options.network);
    PRIVKEY = validatePrivateKey(options.privkey);
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }
  const TYPE_ID = options.typeId;

  // Validate that dist directory exists
  if (!fs.existsSync(TARGET)) {
    console.error("❌ Error: dist/ directory not found.");
    console.error(
      '   Please run "npm run build" first to build your contracts.',
    );
    process.exit(1);
  }

  // Check if there are any .bc files to deploy
  const distFiles = fs.readdirSync(TARGET);
  const bcFiles = distFiles.filter((file) => file.endsWith(".bc"));

  if (bcFiles.length === 0) {
    console.error("❌ Error: No .bc files found in dist/ directory.");
    console.error(
      '   Please run "npm run build" first to build your contracts.',
    );
    process.exit(1);
  }

  console.log("🚀 Deploying contracts...");
  console.log(`   📁 Target: ${TARGET}`);
  console.log(`   📄 Output: ${OUTPUT}`);
  console.log(`   🌐 Network: ${NETWORK}`);
  if (TYPE_ID) {
    console.log(`   🔄 Type ID: enabled (upgradable)`);
  }
  if (PRIVKEY) {
    console.log(`   🔑 Custom private key: provided`);
  }
  console.log("");

  // Build offckb deploy command
  const args = [
    "deploy",
    "--network",
    NETWORK,
    "--target",
    TARGET,
    "--output",
    OUTPUT,
  ];

  if (TYPE_ID) {
    args.push("--type-id");
  }

  if (PRIVKEY) {
    args.push("--privkey", PRIVKEY);
  }

  // Try to find offckb binary
  const offckbCmd = "offckb";

  // For now, use 'offckb' directly - users should have it installed
  console.log(`💻 Running: ${offckbCmd} ${args.join(" ")}`);
  console.log("");

  // Execute the deploy command
  const deployProcess = spawn(offckbCmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  deployProcess.on("close", (code) => {
    if (code === 0) {
      let synchronized;
      let synchronizedSystemScripts;
      try {
        exportSystemScripts({ network: NETWORK });
        synchronizedSystemScripts = validateAndSyncSystemScripts({
          network: NETWORK,
        });
        synchronized = validateAndSyncDeployment({ network: NETWORK });
      } catch (error) {
        console.error("");
        console.error(`❌ ${error.message}`);
        process.exit(1);
      }
      console.log("");
      console.log("🎉 Deployment completed successfully!");
      console.log(`📁 Deployment artifacts saved to: ${OUTPUT}/`);
      console.log(
        `🔄 Contract deployment synchronized: ${DEPLOYMENT_DESTINATION}`,
      );
      console.log(
        `🔄 System scripts synchronized: ${SYSTEM_SCRIPTS_DESTINATION}`,
      );
      console.log(
        `📍 Contract OutPoint: ${synchronized.outPoint.txHash}:${synchronized.outPoint.index}`,
      );
      console.log(
        `📍 ckb-js-vm OutPoint: ${synchronizedSystemScripts.outPoint.txHash}:${synchronizedSystemScripts.outPoint.index}`,
      );
      console.log("");
      console.log("💡 Next steps:");
      console.log(
        "   - Restart the frontend so it loads the synchronized artifact",
      );
      console.log(
        "   - Confirm both dependency OutPoints are reported as ready",
      );
    } else {
      console.error("");
      console.error("❌ Deployment failed.");
      console.error(`   Exit code: ${code}`);
      process.exit(code);
    }
  });

  deployProcess.on("error", (error) => {
    console.error("❌ Error running deploy command:", error.message);
    console.error("");
    console.error("💡 Make sure offckb is installed:");
    console.error("   npm install -g offckb-cli");
    console.error("   # or");
    console.error("   pnpm add -g offckb-cli");
    process.exit(1);
  });
}

// Run main function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
