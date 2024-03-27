import { CardProps } from "@site/src/components/Card";

// Tutorial links
const TUTORIALS_LINKS = {
  transferBalance: "/docs/dapps/transfer-balance",
  writeMessage: "/docs/dapps/write-message",
  issueToken: "/docs/dapps/issue-token",
  createDOB: "/docs/dapps/create-dob",
};

// Tutorial Cards
const tutorialCardContents: CardProps[] = [
  {
    title: "Issue Token",
    description: "Create user-defined tokens using xUDT",
    href: TUTORIALS_LINKS.issueToken,
    type: "tutorial",
  },
  {
    title: "Transfer Balance",
    description: "Transfer user-defined tokens using xUDT",
    href: TUTORIALS_LINKS.transferBalance,
    type: "tutorial",
  },
  {
    title: "Create a DOB",
    description: "Create DOB using Spore Protocol",
    href: TUTORIALS_LINKS.createDOB,
    type: "tutorial",
  },
  {
    title: "Write Message",
    description: "Write and retrieve 'Hello CKB!' from a CKB.",
    href: TUTORIALS_LINKS.writeMessage,
    type: "tutorial",
  },
];

const toolCardContents: CardProps[] = [
  {
    title: "Lumos",
    description:
      "A JavaScript/TypeScript framework to simplify the development of dApp",
    href: "https://github.com/ckb-js/lumos",
    type: "tool",
    links: [
      { label: "Github", href: "https://github.com/ckb-js/lumos" },
      { label: "Docs", href: "https://lumos-website.vercel.app/" },
    ],
  },
  {
    title: "CKB SDKs",
    description:
      "Necessary functions available in various programming languages",
    href: "https://github.com/nervosnetwork/ckb-sdk-rust",
    type: "tool",
    links: [
      { label: "Rust", href: "https://github.com/nervosnetwork/ckb-sdk-rust" },
      { label: "Go", href: "https://github.com/nervosnetwork/ckb-sdk-go" },
      { label: "Java", href: "https://github.com/nervosnetwork/ckb-sdk-java" },
    ],
  },
  {
    title: "CKB-CLI",
    description:
      "The command-line tool for direct interaction with the Nervos network",
    href: "https://github.com/nervosnetwork/ckb-cli",
    type: "tool",
    links: [
      { label: "Github", href: "https://github.com/nervosnetwork/ckb-cli" },
      {
        label: "Wiki",
        href: "https://github.com/nervosnetwork/ckb-cli/wiki/Tutorials",
      },
    ],
  },
  {
    title: "OffCKB",
    description: "CKB local development network for your first try",
    href: "https://github.com/RetricSu/offckb/tree/7d87d018be7626e1672a039b52f8bf4db9dd4eae",
    type: "tool",
    links: [
      {
        label: "Github",
        href: "https://github.com/RetricSu/offckb/tree/7d87d018be7626e1672a039b52f8bf4db9dd4eae",
      },
    ],
  },
  {
    title: "CKB Address",
    description:
      "Convert and decode CKB addresses and generate private keys for development",
    href: "https://ckb.tools/address",
    type: "tool",
    links: [
      { label: "Website", href: "https://ckb.tools/address" },
      { label: "Github", href: "https://github.com/jordanmack/ckb-tools" },
    ],
  },
  {
    title: "Nervos Pudge Faucet",
    description: "Claim CKBytes to use while developing and testing",
    href: "https://faucet.nervos.org/",
    type: "tool",
    links: [
      { label: "Website", href: "https://faucet.nervos.org/" },
      {
        label: "Github",
        href: "https://github.com/Magickbase/ckb-testnet-faucet",
      },
    ],
  },
];

const tutorialFrameContent = [
  {
    tabValue: "transfer-balance",
    label: "Transfer Balance",
    tutorialTitle: "View and transfer CKB from one address to another.",
    tutorialLink: TUTORIALS_LINKS.transferBalance,
    iframeSrc:
      "https://codesandbox.io/embed/58n9pq?view=preview&module=%2Flib.ts",
  },
  {
    tabValue: "write-message",
    label: "Write Message",
    tutorialTitle: "Write 'Hello CKB!' to a CKB cell and then retrieve it.",
    tutorialLink: TUTORIALS_LINKS.writeMessage,
    iframeSrc:
      "https://codesandbox.io/embed/jsn25g?view=Editor+%2B+Preview&module=%2Flib.ts",
  },
  {
    tabValue: "issue-token",
    label: "Issue Token",
    tutorialTitle: "Issue, view and transfer a custom token.",
    tutorialLink: TUTORIALS_LINKS.issueToken,
    iframeSrc:
      "https://codesandbox.io/embed/drlfr5?view=Editor+%2B+Preview&module=%2Flib.ts",
  },
  {
    tabValue: "create-dob",
    label: "Create a DOB",
    tutorialTitle: "Create an on-chain digital object with Spore protocol.",
    tutorialLink: TUTORIALS_LINKS.createDOB,
    iframeSrc:
      "https://codesandbox.io/embed/rmwshy?view=Editor+%2B+Preview&module=%2Flib.ts",
  },
];

const MORETOOLCARDTITLE = "More Dev Tools →";
const MORETOOLCARDHREF = "./dapps/devtool";

export {
  tutorialCardContents,
  toolCardContents,
  tutorialFrameContent,
  MORETOOLCARDTITLE,
  MORETOOLCARDHREF,
};
