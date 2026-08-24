const baseConfig = require("./jest.config.cjs");

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...baseConfig,
  testMatch: ["<rootDir>/tests/**/*.devnet.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/scripts/"],
};
