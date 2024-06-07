export interface GlossaryTerm {
  link?: string;
  content: string;
}

export const keywordList: Record<string, GlossaryTerm> = {
  UTXO: {
    content:
      "Abbreviated from Unspent Transaction Output, UTXO denotes the remaining amount of tokens after a transaction, available for future use.",
  },
  Cell: {
    link: "/docs/tech-explanation/cell",
    content:
      "The primary state units in CKB, within them users can include arbitrary states.",
  },
  "Cell Model": {
    link: "/docs/tech-explanation/cell-model",
    content:
      "A representation of how state is managed on Nervos CKB. The Cell Model is a more generic state model than either Bitcoin's UTXO or Ethereum's account model.",
  },
  "CKB-VM": {
    link: "/docs/tech-explanation/ckb-vm",
    content:
      "A crypto-agnostic virtual machine, a RISC-V instruction set based VM for executing both on-chain and off-chain code.",
  },
  "Live Cell": {
    content: "A Cell that has not been consumed and is available for use.",
  },
  Script: {
    link: "/docs/tech-explanation/script",
    content:
      "A Script in Nervos CKB is a binary executable on the CKB-VM. Compared to Bitcoin Script, CKB Script is Turing-complete, equivalent to smart contract. ",
  },
  script_args: {
    link: "/docs/tech-explanation/script-args",
    content:
      "The arguments imported into the CKB-VM instance as input for the Scripts. ",
  },
  "Lock Script": {
    content: "A Script that enforces access and ownership of a Cell.",
  },
  "Type Script": {
    content:
      "A Script that enforces the rules that must be followed in a transaction for a Cell to be consumed as an input or for a Cell to be created as an output.",
  },
  "Lock Script Hash": {
    content:
      "A Blake2b hash of a Lock Script which is used as an identifier for the Script when referenced by a Cell.",
  },
  "digital object (DOB)": {
    content:
      "A non-fungible encrypted asset with its content fully stored on-chain, establishing an intrinsic link between content and value.",
  },
  Epoch: {
    content: "A period of time for a set of blocks.",
  },
  "Orphan Rate": {
    content:
      "A measure of the speed at which Orphan blocks occur within the blockchain network.",
  },
  Cycle: {
    content:
      "The number of RISC-V computational cycles required by a Script to execute. It's a metric used to prevent malicious behavior such as infinite loops, that's why it is called cycles.",
  },
  sUDT: {
    content:
      "A standard that defines the most basic implementation of a UDT fungible token on Nervos.",
  },
};
