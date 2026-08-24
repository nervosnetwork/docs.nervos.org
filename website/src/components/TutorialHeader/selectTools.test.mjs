import assert from "node:assert/strict";
import test from "node:test";

import { selectTutorialTools } from "./selectTools.mjs";

test("required tools replace the shared preset", () => {
  assert.deepEqual(
    selectTutorialTools(["Git", "CCC"], ["Debugger"], ["Node", "pnpm"]),
    ["Node", "pnpm"]
  );
});

test("custom tools keep appending to the shared preset", () => {
  assert.deepEqual(
    selectTutorialTools(["Git", "CCC"], ["Debugger"], undefined),
    ["Git", "CCC", "Debugger"]
  );
});
