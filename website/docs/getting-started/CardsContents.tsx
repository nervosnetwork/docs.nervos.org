import { CardProps } from "@site/src/components/Card";

// Tutorial links
const TUTORIALS_LINKS = {
  transferBalance: "/docs/getting-started/transfer-ckb",
  writeMessage: "/docs/getting-started/write-message",
  issueToken: "/docs/getting-started/create-token",
  createDOB: "/docs/getting-started/create-dob",
};

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
    title: "CKB-Debugger",
    description: "A standalone debugger enabling off-chain contract development",
    href: "https://github.com/nervosnetwork/ckb-standalone-debugger",
    type: "tool",
    links: [
      {
        label: "Github",
        href: "https://github.com/nervosnetwork/ckb-standalone-debugger",
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
    tabValue: "transfer-ckb",
    label: "Transfer CKB",
    tutorialTitle: "View and transfer CKB from one address to another.",
    tutorialLink: TUTORIALS_LINKS.transferBalance,
    iframeSrc:
      "https://codesandbox.io/embed/58n9pq?view=preview&module=%2Flib.ts",
  },
  {
    tabValue: "write-message",
    label: "Write a Message",
    tutorialTitle: "Write 'Hello CKB!' to a CKB Cell and then retrieve it.",
    tutorialLink: TUTORIALS_LINKS.writeMessage,
    iframeSrc:
      "https://codesandbox.io/embed/jsn25g?view=Editor+%2B+Preview&module=%2Flib.ts",
  },
  {
    tabValue: "create-token",
    label: "Create a Fungible Token",
    tutorialTitle: "Create, view, and transfer a custom token.",
    tutorialLink: TUTORIALS_LINKS.issueToken,
    iframeSrc:
      "https://codesandbox.io/embed/drlfr5?view=Editor+%2B+Preview&module=%2Flib.ts",
  },
  {
    tabValue: "create-dob",
    label: "Create a DOB",
    tutorialTitle: "Create a digital object using spore protocol.",
    tutorialLink: TUTORIALS_LINKS.createDOB,
    iframeSrc:
      "https://codesandbox.io/embed/rmwshy?view=Editor+%2B+Preview&module=%2Flib.ts",
  },
];

const MORETOOLCARDTITLE = "More Dev Tools →";
const MORETOOLCARDHREF = "/docs/getting-started/devtool";

export {
  toolCardContents,
  tutorialFrameContent,
  MORETOOLCARDTITLE,
  MORETOOLCARDHREF,
};
