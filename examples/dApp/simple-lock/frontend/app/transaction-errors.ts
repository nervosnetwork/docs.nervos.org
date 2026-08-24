export function explainTransactionError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();

  if (
    normalized.includes("unknown(outpoint") ||
    normalized.includes("resolve failed")
  ) {
    return "A referenced cell is missing or already spent. Check deployment health first; if both dependencies are ready, refresh the balance because another transaction may have consumed an input.";
  }
  if (
    normalized.includes("error code 11") ||
    normalized.includes("validationfailure: 11")
  ) {
    return "The preimage does not match this hash lock (error 11). The transaction was rejected atomically and the original cells remain live.";
  }
  if (normalized.includes("insufficient") || normalized.includes("capacity")) {
    return "There is not enough capacity to create valid recipient and change cells and pay the transaction fee.";
  }
  if (normalized.includes("timeout") || normalized.includes("timed out")) {
    return "Transaction confirmation timed out. Keep the transaction hash and check the node again before resubmitting.";
  }
  if (normalized.includes("address") || normalized.includes("bech32")) {
    return "The receiver address is invalid for the active network. Copy a complete Devnet or Testnet CKB address and try again.";
  }

  return message || "The transaction failed for an unknown reason.";
}
