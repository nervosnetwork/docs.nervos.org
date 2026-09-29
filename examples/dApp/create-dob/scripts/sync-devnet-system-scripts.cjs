const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { sync: spawnSync } = require("cross-spawn");

const artifactPath = path.resolve(__dirname, "../system-scripts.json");

function syncDevnetSystemScripts() {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "create-dob-system-scripts-")
  );
  const exportedPath = path.join(directory, "system-scripts.json");

  try {
    const result = spawnSync(
      "offckb",
      [
        "system-scripts",
        "--network",
        "devnet",
        "--export-style",
        "ccc",
        "--output",
        exportedPath,
      ],
      {
        stdio: "inherit",
      }
    );

    if (result.error) {
      throw new Error(
        `Unable to export OffCKB system scripts: ${result.error.message}`
      );
    }
    if (result.status !== 0) {
      throw new Error(
        `Unable to export OffCKB system scripts: offckb exited with code ${result.status}.`
      );
    }

    const current = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const exported = JSON.parse(fs.readFileSync(exportedPath, "utf8"));
    for (const name of [
      "secp256k1_blake160_sighash_all",
      "spore",
      "spore_cluster",
      "spore_cluster_agent",
      "spore_cluster_proxy",
      "spore_extension_lua",
    ]) {
      const script = exported.devnet?.[name]?.script;
      if (
        !script?.codeHash ||
        !script.hashType ||
        !script.cellDeps?.[0]?.cellDep?.outPoint
      ) {
        throw new Error(
          `The OffCKB export does not contain a complete Devnet ${name} system script.`
        );
      }
    }

    current.devnet = Object.fromEntries(
      Object.entries(exported.devnet).map(([name, entry]) => [
        name,
        {
          ...entry,
          ...(current.devnet?.[name]?.file
            ? { file: current.devnet[name].file }
            : {}),
        },
      ])
    );
    fs.writeFileSync(artifactPath, `${JSON.stringify(current, null, 2)}\n`);
    console.log("Synchronized Devnet system scripts with OffCKB.");
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

if (require.main === module) {
  syncDevnetSystemScripts();
}

module.exports = { syncDevnetSystemScripts };
