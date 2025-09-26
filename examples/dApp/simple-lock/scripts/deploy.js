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
 * - --network: Network to deploy to (devnet, testnet, mainnet) - defaults to devnet
 * - --privkey: Private key for deployment - defaults to offckb's deployer account
 * - --type-id: Whether to use upgradable type id - defaults to false
 *
 * Usage:
 *   pnpm run deploy
 *   pnpm run deploy --network testnet
 *   pnpm run deploy --network testnet --privkey 0x...
 *   pnpm run deploy --network testnet --type-id
 */

import { spawn } from "child_process";
import fs from "fs";

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
  const NETWORK = options.network;
  const PRIVKEY = options.privkey;
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
    shell: true,
  });

  deployProcess.on("close", (code) => {
    if (code === 0) {
      console.log("");
      console.log("🎉 Deployment completed successfully!");
      console.log(`📁 Deployment artifacts saved to: ${OUTPUT}/`);
      console.log("");
      console.log("💡 Next steps:");
      console.log(
        "   - Check the deployment artifacts in the deployment/ folder",
      );
      console.log("   - Run your tests to use the deployed contract scripts");
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
