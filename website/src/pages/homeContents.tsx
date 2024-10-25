export interface CardLinks {
  label: string;
  link: string;
}
export interface TutorialProps {
  title: string;
  description: string;
  link: string;
  iframeSrc: string;
  illusSrc: string;
}
export interface DevToolProps {
  title: string;
  href: string;
  category: string;
}

export interface HomeCardProps {
  title: string;
  links?: CardLinks[];
  to?: string;
  icon: string;
}

const homeCardContents: HomeCardProps[] = [
  {
    title: "Getting Started",
    links: [
      { label: "How CKB Works", link: "/docs/getting-started/how-ckb-works" },
      {
        label: "Quick Start (5 min)",
        link: "/docs/getting-started/quick-start",
      },
      { label: "CKB vs. BTC", link: "/docs/getting-started/ckb-vs-btc" },
    ],
    icon: "rocket",
  },
  {
    title: "DApp Tutorials",
    links: [
      { label: "Transfer CKB", link: "/docs/dapp/transfer-ckb" },
      { label: "Store Data on Cell", link: "/docs/dapp/store-data-on-cell" },
      { label: "Create a DOB", link: "/docs/dapp/create-dob" },
    ],
    icon: "dapp",
  },
  {
    title: "Scripts (Smart Contracts)",
    links: [
      { label: "Intro to Script", link: "/docs/script/intro-to-script" },
      {
        label: "Tutorial: A Minimal Script",
        link: "/docs/script/minimal-script",
      },
      { label: "Tutorial: Simple UDT", link: "/docs/script/sudt-script" },
    ],
    icon: "script",
  },
  {
    title: "RPCs & Nodes",
    to: "/docs/node/rpcs",
    icon: "node",
  },
  {
    title: "Mining",
    to: "/docs/mining/algorithm-difficulty",
    icon: "mining",
  },
  {
    title: "Tech Explanation",
    to: "/docs/tech-explanation/nervos-blockchain",
    icon: "tech-explanation",
  },
];

const tutorialSectionContents: TutorialProps[] = [
  {
    title: "Transfer CKB",
    description: "View and transfer CKB from one address to another",
    link: "/docs/dapp/transfer-ckb",
    iframeSrc:
      "https://codesandbox.io/embed/58n9pq?view=preview&module=%2Flib.ts",
    illusSrc: "/svg/illus-transfer-ckb.svg",
  },
  {
    title: "Store Data on Cell",
    description: "Write ‘Hello CKB!’ to a CKB Cell and then retrieve it",
    link: "/docs/dapp/store-data-on-cell",
    iframeSrc:
      "https://codesandbox.io/embed/jsn25g?view=Editor+%2B+Preview&module=%2Flib.ts",
    illusSrc: "/svg/illus-write-message.svg",
  },
  {
    title: "Create a Fungible Token",
    description: "Create, view, and transfer a custom token",
    link: "/docs/dapp/create-token",
    iframeSrc:
      "https://codesandbox.io/embed/drlfr5?view=Editor+%2B+Preview&module=%2Flib.ts",
    illusSrc: "/svg/illus-create-token.svg",
  },
  {
    title: "Create a DOB",
    description: "Create a digital object using Spore DOB",
    link: "/docs/dapp/create-dob",
    iframeSrc:
      "https://codesandbox.io/embed/rmwshy?view=Editor+%2B+Preview&module=%2Flib.ts",
    illusSrc: "/svg/illus-create-dob.svg",
  },
];

const devToolSectionContents: DevToolProps[] = [
  {
    title: "Rust",
    href: "/docs/sdk-and-devtool/rust",
    category: "SDK",
  },
  {
    title: "Go",
    href: "/docs/sdk-and-devtool/go",
    category: "SDK",
  },
  {
    title: "Java",
    href: "/docs/sdk-and-devtool/java",
    category: "SDK",
  },
  {
    title: "TypeScript",
    href: "/docs/sdk-and-devtool/ccc",
    category: "SDK",
  },
  {
    title: "CKB-CLI",
    href: "https://github.com/nervosnetwork/ckb-cli",
    category: "Other DevTools",
  },
  {
    title: "OffCKB",
    href: "https://github.com/ckb-devrel/offckb/tree/7d87d018be7626e1672a039b52f8bf4db9dd4eae",
    category: "Other DevTools",
  },
  {
    title: "CKB Debugger",
    href: "https://github.com/nervosnetwork/ckb-standalone-debugger",
    category: "Other DevTools",
  },
  {
    title: "CKB Address",
    href: "https://ckb.tools/address",
    category: "Other DevTools",
  },
];

const contactUsContents: CardLinks[] = [
  { label: "github", link: "https://github.com/nervosnetwork" },
  { label: "discord", link: "https://discord.gg/4Jcw8MwEEv" },
  { label: "reddit", link: "https://www.reddit.com/r/NervosNetwork/" },
  { label: "nervostalk", link: "https://talk.nervos.org/" },
  { label: "telegram", link: "https://t.me/nervosnetwork" },
  { label: "twitter", link: "https://twitter.com/nervosnetwork" },
  { label: "medium", link: "https://medium.com/nervosnetwork" },
  {
    label: "youtube",
    link: "https://www.youtube.com/channel/UCONuJGdMzUY0Y6jrPBOzH7A",
  },
];

// Just to include a default export
const HomeContentsPage: React.FC = () => {
  return null;
};
export default HomeContentsPage;

export {
  homeCardContents,
  tutorialSectionContents,
  devToolSectionContents,
  contactUsContents,
};
