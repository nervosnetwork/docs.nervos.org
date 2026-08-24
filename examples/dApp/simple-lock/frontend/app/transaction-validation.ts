import { ccc } from "@ckb-ccc/core";

type OutputCapacityLike = {
  capacity: bigint;
  occupiedSize: number;
};

type TransactionOutputsLike = {
  outputs: OutputCapacityLike[];
  outputsData: ccc.HexLike[];
};

export function minimumOutputCapacity(
  output: OutputCapacityLike,
  outputData: ccc.HexLike,
): bigint {
  return ccc.fixedPointFrom(
    output.occupiedSize + ccc.bytesFrom(outputData).length,
  );
}

export function assertOutputCapacities(
  transaction: TransactionOutputsLike,
): void {
  transaction.outputs.forEach((output, index) => {
    const minimum = minimumOutputCapacity(
      output,
      transaction.outputsData[index] ?? "0x",
    );
    if (output.capacity < minimum) {
      throw new Error(
        `Output ${index} requires at least ${ccc.fixedPointToString(minimum)} CKB of occupied capacity.`,
      );
    }
  });
}
