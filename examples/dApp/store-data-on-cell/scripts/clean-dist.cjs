const fs = require("node:fs");
const path = require("node:path");

const distDirectory = path.resolve(__dirname, "../dist");
fs.rmSync(distDirectory, { recursive: true, force: true });
