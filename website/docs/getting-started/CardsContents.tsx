import { CardProps } from "@site/src/components/Card";

// Tutorial links
const TUTORIALS_LINKS = {
  transferBalance: "/docs/dapp/transfer-ckb",
  writeMessage: "/docs/dapp/write-message",
  issueToken: "/docs/dapp/create-token",
  createDOB: "/docs/dapp/create-dob",
};

const toolCardContents: CardProps[] = [
  {
    title: "Lumos",
    description:
      "A JavaScript/TypeScript framework to simplify the development of dApp",
    link: "https://github.com/ckb-js/lumos",
    type: "tool",
    links: [
      { label: "Github", link: "https://github.com/ckb-js/lumos" },
      { label: "Docs", link: "https://lumos-website.vercel.app/" },
    ],
  },
  {
    title: "CKB SDKs",
    description:
      "Necessary functions available in various programming languages",
    link: "https://github.com/nervosnetwork/ckb-sdk-rust",
    type: "tool",
    links: [
      { label: "Rust", link: "https://github.com/nervosnetwork/ckb-sdk-rust" },
      { label: "Go", link: "https://github.com/nervosnetwork/ckb-sdk-go" },
      { label: "Java", link: "https://github.com/nervosnetwork/ckb-sdk-java" },
    ],
  },
  {
    title: "CKB-CLI",
    description:
      "The command-line tool for direct interaction with the Nervos network",
    link: "https://github.com/nervosnetwork/ckb-cli",
    type: "tool",
    links: [
      { label: "Github", link: "https://github.com/nervosnetwork/ckb-cli" },
      {
        label: "Wiki",
        link: "https://github.com/nervosnetwork/ckb-cli/wiki/Tutorials",
      },
    ],
  },
  {
    title: "OffCKB",
    description: "CKB local development network for your first try",
    link: "https://github.com/RetricSu/offckb/tree/7d87d018be7626e1672a039b52f8bf4db9dd4eae",
    type: "tool",
    links: [
      {
        label: "Github",
        link: "https://github.com/RetricSu/offckb/tree/7d87d018be7626e1672a039b52f8bf4db9dd4eae",
      },
    ],
  },
  {
    title: "CKB-Debugger",
    description:
      "A standalone debugger enabling off-chain contract development",
    link: "https://github.com/nervosnetwork/ckb-standalone-debugger",
    type: "tool",
    links: [
      {
        label: "Github",
        link: "https://github.com/nervosnetwork/ckb-standalone-debugger",
      },
    ],
  },
  {
    title: "CKB Address",
    description:
      "Convert and decode CKB addresses and generate private keys for development",
    link: "https://ckb.tools/address",
    type: "tool",
    links: [
      { label: "Website", link: "https://ckb.tools/address" },
      { label: "Github", link: "https://github.com/jordanmack/ckb-tools" },
    ],
  },
  {
    title: "Nervos Pudge Faucet",
    description: "Claim CKBytes to use while developing and testing",
    link: "https://faucet.nervos.org/",
    type: "tool",
    links: [
      { label: "Website", link: "https://faucet.nervos.org/" },
      {
        label: "Github",
        link: "https://github.com/Magickbase/ckb-testnet-faucet",
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

export { toolCardContents, tutorialFrameContent };
