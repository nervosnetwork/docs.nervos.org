import { CardProps } from "@site/src/components/Card";

// Tutorial Cards
const tutorialCardContents: CardProps[] = [
  {
    title: "Create Custom Token",
    description: "Create user-defined tokens using xUDT",
    href: "./dapp/issue-custom-token",
    type: "tutorial",
  },
  {
    title: "Transfer Custom Token",
    description: "Transfer user-defined tokens using xUDT",
    href: "./dapp/view-and-transfer-balance",
    type: "tutorial",
  },
  {
    title: "Create an DOB",
    description: "Create DOB using Spore Protocol",
    href: "./dapp/create-dob",
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
];

const tutorialFrameContent = [
  {
    tabValue: "view-and-transfer-balance",
    label: "Transfer Balance",
    tutorialTitle: "View and transfer CKB from one address to another.",
    tutorialLink: "/docs/dapp/view-and-transfer-balance",
    iframeSrc:
      "https://codesandbox.io/embed/58n9pq?view=preview&module=%2Flib.ts",
  },
  {
    tabValue: "write-and-read-on-chain-message",
    label: "Write Message",
    tutorialTitle: "Write 'Hello CKB!' to a CKB cell and then retrieve it.",
    tutorialLink: "/docs/dapp/write-and-read-on-chain-message",
    iframeSrc:
      "https://codesandbox.io/embed/jsn25g?view=Editor+%2B+Preview&module=%2Flib.ts",
  },
  {
    tabValue: "issue-custom-token",
    label: "Issue Token",
    tutorialTitle: "Issue, view and transfer a custom token.",
    tutorialLink: "/docs/dapp/issue-custom-token",
    iframeSrc:
      "https://codesandbox.io/embed/drlfr5?view=Editor+%2B+Preview&module=%2Flib.ts",
  },
  {
    tabValue: "create-dob",
    label: "Create DOB",
    tutorialTitle: "Create an on-chain digital object with Spore protocol.",
    tutorialLink: "/docs/dapp/create-dob",
    iframeSrc:
      "https://codesandbox.io/embed/rmwshy?view=Editor+%2B+Preview&module=%2Flib.ts",
  },
];

const MORETOOLCARDTITLE = "More Dev Tools →";
const MORETOOLCARDHREF = "./DApp/devtool";

export {
  tutorialCardContents,
  toolCardContents,
  tutorialFrameContent,
  MORETOOLCARDTITLE,
  MORETOOLCARDHREF,
};
