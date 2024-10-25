import { CardProps } from "@site/src/components/Card";

const toolCardContents: CardProps[] = [
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
    link: "https://github.com/ckb-devrel/offckb/tree/7d87d018be7626e1672a039b52f8bf4db9dd4eae",
    type: "tool",
    links: [
      {
        label: "Github",
        link: "https://github.com/ckb-devrel/offckb/tree/7d87d018be7626e1672a039b52f8bf4db9dd4eae",
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

export { toolCardContents };
