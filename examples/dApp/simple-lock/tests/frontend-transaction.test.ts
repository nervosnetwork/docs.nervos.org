import { ccc } from "@ckb-ccc/core";
import { readEnvNetwork } from "../frontend/app/ccc-client";
import { stringToBytesHex } from "../frontend/app/preimage";
import { explainTransactionError } from "../frontend/app/transaction-errors";
import {
  assertOutputCapacities,
  minimumOutputCapacity,
} from "../frontend/app/transaction-validation";

describe("Simple Lock frontend transaction guidance", () => {
  test("explains why direct Mainnet configuration is unavailable", () => {
    const previousNetwork = process.env.NEXT_PUBLIC_NETWORK;
    process.env.NEXT_PUBLIC_NETWORK = "mainnet";

    try {
      expect(() => readEnvNetwork()).toThrow(
        /mainnet.*not available.*ckb-js-vm/i,
      );
    } finally {
      if (previousNetwork === undefined) {
        delete process.env.NEXT_PUBLIC_NETWORK;
      } else {
        process.env.NEXT_PUBLIC_NETWORK = previousNetwork;
      }
    }
  });

  test.each([
    ["Resolve failed Unknown(OutPoint(0x1234))", "referenced cell"],
    ["ValidationFailure: see error code 11", "preimage does not match"],
    ["Insufficient CKB, need 6 CKB", "not enough capacity"],
    ["wait transaction timeout after 60000", "confirmation timed out"],
    ["Unknown address format", "address is invalid"],
  ])("maps %s to focused guidance", (message, expected) => {
    expect(explainTransactionError(new Error(message)).toLowerCase()).toContain(
      expected,
    );
  });

  test("validates the actual occupied capacity of every output", () => {
    const lock = ccc.Script.from({
      codeHash: `0x${"11".repeat(32)}`,
      hashType: "type",
      args: `0x${"22".repeat(20)}`,
    });
    const output = ccc.CellOutput.from({
      capacity: ccc.fixedPointFrom(61),
      lock,
    });
    output.capacity = ccc.fixedPointFrom(output.occupiedSize);
    const transaction = ccc.Transaction.from({
      outputs: [output],
      outputsData: ["0x"],
    });

    expect(minimumOutputCapacity(output, "0x")).toBe(output.capacity);
    expect(() => assertOutputCapacities(transaction)).not.toThrow();

    transaction.outputs[0].capacity -= 1n;
    expect(() => assertOutputCapacities(transaction)).toThrow(
      /output 0 requires at least/i,
    );
  });

  test("encodes address and witness preimages as the same UTF-8 bytes", () => {
    expect(stringToBytesHex("é")).toBe("0xc3a9");
    expect(stringToBytesHex("🔒")).toBe("0xf09f9492");
  });
});
