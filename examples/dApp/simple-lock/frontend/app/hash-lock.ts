import { ccc, hexFrom, hashTypeToBytes } from "@ckb-ccc/core";
import { activeNetwork, cccClient, Network } from "./ccc-client";
import { stringToBytesHex } from "./preimage";
import { assertOutputCapacities } from "./transaction-validation";
import scripts from "../deployment/scripts.json";
import systemScripts from "../deployment/system-scripts.json";

type DeploymentScript = {
  codeHash: string;
  hashType: string;
  cellDeps: Array<{ cellDep: ccc.CellDepLike }>;
};

type NetworkDeployments = {
  "hash-lock.bc"?: DeploymentScript;
};

type SystemDeployment = {
  ckb_js_vm?: { script: DeploymentScript };
};

export type DeploymentStatus =
  | {
      kind: "ready";
      network: Network;
      codeHash: string;
      contractOutPoint: ccc.OutPoint;
      ckbJsVmOutPoint: ccc.OutPoint;
    }
  | {
      kind: "error";
      network: Network;
      message: string;
    };

const deployments = scripts as unknown as Record<Network, NetworkDeployments>;
const networkSystemScripts = systemScripts as unknown as Record<
  Network,
  SystemDeployment
>;

function deploymentConfig() {
  const contract = deployments[activeNetwork]?.["hash-lock.bc"];
  const ckbJsVm = networkSystemScripts[activeNetwork]?.ckb_js_vm?.script;
  if (!contract) {
    throw new Error(
      `No hash-lock.bc deployment was found for ${activeNetwork}. Run the deploy command for this network and restart the frontend.`,
    );
  }
  if (!ckbJsVm) {
    throw new Error(
      `No ckb-js-vm deployment was found for ${activeNetwork}. Regenerate the system scripts and restart the frontend.`,
    );
  }

  const contractCellDep = ccc.CellDep.from(contract.cellDeps[0]?.cellDep);
  const ckbJsVmCellDep = ccc.CellDep.from(ckbJsVm.cellDeps[0]?.cellDep);
  return { contract, ckbJsVm, contractCellDep, ckbJsVmCellDep };
}

export async function getDeploymentStatus(): Promise<DeploymentStatus> {
  try {
    const { contract, contractCellDep, ckbJsVmCellDep } = deploymentConfig();
    const [contractCell, ckbJsVmCell] = await Promise.all([
      cccClient.getCellLive(contractCellDep.outPoint, true),
      cccClient.getCellLive(ckbJsVmCellDep.outPoint, true),
    ]);

    if (!contractCell) {
      throw new Error(
        `The hash-lock.bc OutPoint is not live on ${activeNetwork}. Redeploy so scripts.json contains the current network artifact.`,
      );
    }
    if (!ckbJsVmCell) {
      throw new Error(
        `The ckb-js-vm OutPoint is not live on ${activeNetwork}. Regenerate the system scripts for the active network.`,
      );
    }

    return {
      kind: "ready",
      network: activeNetwork,
      codeHash: contract.codeHash,
      contractOutPoint: contractCellDep.outPoint,
      ckbJsVmOutPoint: ckbJsVmCellDep.outPoint,
    };
  } catch (error) {
    return {
      kind: "error",
      network: activeNetwork,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function capacityOf(address: string): Promise<bigint> {
  const addr = await ccc.Address.fromString(address, cccClient);
  return cccClient.getBalance([addr.script]);
}

export function shannonToCKB(amount: bigint): string {
  return ccc.fixedPointToString(amount);
}

export function generateAccount(hash: string) {
  const { contract, ckbJsVm } = deploymentConfig();
  const lockArgs =
    "0x0000" +
    contract.codeHash.slice(2) +
    hexFrom(hashTypeToBytes(contract.hashType)).slice(2) +
    hash;
  const lockScript = ccc.Script.from({
    codeHash: ckbJsVm.codeHash,
    hashType: ccc.hashTypeFrom(ckbJsVm.hashType),
    args: lockArgs,
  });

  return {
    address: ccc.Address.fromScript(lockScript, cccClient).toString(),
    lockScript,
  };
}

export async function unlock(
  fromAddr: string,
  toAddr: string,
  amountInCKB: string,
  preimage: string,
): Promise<string> {
  if (!preimage) {
    throw new Error("Enter the preimage used to create this hash lock.");
  }

  const fromScript = (await ccc.Address.fromString(fromAddr, cccClient)).script;
  const toScript = (await ccc.Address.fromString(toAddr, cccClient)).script;
  const amount = ccc.fixedPointFrom(amountInCKB);
  if (amount <= ccc.Zero) {
    throw new Error("The transfer amount must be greater than zero.");
  }

  const { contractCellDep, ckbJsVmCellDep } = deploymentConfig();
  const readSigner = new ccc.SignerCkbScriptReadonly(cccClient, fromScript);
  const transaction = ccc.Transaction.from({
    outputs: [{ lock: toScript, capacity: amount }, { lock: fromScript }],
    outputsData: ["0x", "0x"],
  });

  await transaction.addCellDeps(contractCellDep, ckbJsVmCellDep);
  await transaction.completeInputsByCapacity(readSigner);
  transaction.setWitnessArgsAt(
    0,
    ccc.WitnessArgs.from({ lock: stringToBytesHex(preimage) }),
  );
  await transaction.completeFeeChangeToOutput(readSigner, 1, 1000);
  assertOutputCapacities(transaction);

  return cccClient.sendTransaction(transaction);
}
