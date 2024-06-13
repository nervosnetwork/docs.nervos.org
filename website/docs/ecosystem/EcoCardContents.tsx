import { EcoCardProps } from "@site/src/components/EcoCard";

const ecoCardContents: EcoCardProps[] = [
  {
    title: "RGB++",
    description:
      "An extended RGB protocol to manage state changes and transaction verification",
    href: "https://github.com/ckb-cell/RGBPlusPlus-design",
    bannerSrc: "rgb++",
    tags: ["Protocol"],
    links: [
      {
        label: "github",
        link: "https://github.com/ckb-cell/RGBPlusPlus-design",
      },
      {
        label: "doc",
        link: "https://github.com/ckb-cell/RGBPlusPlus-design/blob/main/docs/light-paper-en.md",
      },
    ],
  },
  {
    title: "Spore",
    description: "Craft, Secure, Distribute, and Monetize DOBs",
    href: "https://spore.pro/",
    bannerSrc: "spore",
    tags: ["Protocol", "DOB"],
    links: [
      { label: "website", link: "https://spore.pro/" },
      { label: "doc", link: "https://docs.spore.pro/" },
    ],
  },
  {
    title: "JoyID",
    description: "A web-based passwordless and mnemonic-free wallet solution",
    href: "https://joy.id/",
    bannerSrc: "joyid",
    tags: ["Wallet"],
    links: [
      { label: "website", link: "https://joy.id/" },
      { label: "github", link: "https://github.com/nervina-labs?q=joyid" },
    ],
  },
  {
    title: ".bit",
    description: "Cross-chain Web3 identities for you and your community",
    href: "https://did.id/",
    bannerSrc: ".bit",
    tags: ["DID"],
    links: [
      { label: "website", link: "https://did.id/" },
      { label: "github", link: "https://github.com/dotbitHQ" },
      {
        label: "doc",
        link: "https://www.notion.so/bit-Previously-DAS-5cea5b425b204679b8ef2855ed94b04d",
      },
    ],
  },
  {
    title: "Omiga",
    description:
      "The 1st inscription protocol established on Nervos $CKB blockchain",
    href: "https://omiga.io/",
    bannerSrc: "omiga",
    tags: ["Protocol", "DApp"],
    links: [
      { label: "website", link: "https://omiga.io/" },
      { label: "doc", link: "https://docs.omiga.io/" },
    ],
  },
  {
    title: "CoTA",
    description: "A layer-1.5 account based token protocol on Nervos CKB",
    href: "https://www.cotadev.io/",
    bannerSrc: "cota",
    tags: ["Protocol", "NFT"],
    links: [
      { label: "website", link: "https://www.cotadev.io/" },
      {
        label: "doc",
        link: "https://www.cotadev.io/docs/getting-started/overview",
      },
    ],
  },

  {
    title: "Nervape",
    description:
      "A Metaverse with an ongoing Story and NFTs Shaped by the Community",
    href: "https://nervape.com/",
    bannerSrc: "nervape",
    tags: ["NFT"],
    links: [
      { label: "website", link: "https://nervape.com/" },
      { label: "github", link: "https://github.com/nervape" },
      {
        label: "doc",
        link: "https://tourmaline-elderberry-f93.notion.site/Nervape-Community-Wiki-e46261f411ed42e19b859f48da06fe63",
      },
    ],
  },
  {
    title: "JoyGift",
    description:
      "Sending crypto assets as gifts to your friends, communities, or users",
    href: "https://joygift.cc/",
    bannerSrc: "joygift",
    tags: ["DApp"],
    links: [{ label: "website", link: "https://joygift.cc/" }],
  },
  {
    title: "Philosopher's Stone",
    description: "On-Chain Gifting Platform powered by the Spore Protocol",
    href: "https://philosopherstone.xyz/",
    bannerSrc: "philosopherstone",
    tags: ["DApp", "DOB"],
    links: [
      { label: "website", link: "https://philosopherstone.xyz/" },
      {
        label: "github",
        link: "https://github.com/SpectreMercury/PhilosopherStone",
      },
    ],
  },
  {
    title: "NFTnation",
    description:
      "Explore, buy and sell NFTs. By the community, for the community",
    href: "https://nft-nation.live/",
    bannerSrc: "nftnation",
    tags: ["NFT"],
    links: [
      { label: "website", link: "https://nft-nation.live/" },
      {
        label: "doc",
        link: "https://nftnation.gitbook.io/nftnation-explained",
      },
    ],
  },
  {
    title: "CKB Explorer",
    description: "A CKB Explorer built with React and Ruby on Rails",
    href: "https://explorer.nervos.org/",
    bannerSrc: "explorer",
    tags: ["Explorer"],
    links: [
      { label: "website", link: "https://explorer.nervos.org/" },
      {
        label: "github",
        link: "https://github.com/nervosnetwork/ckb-explorer",
      },
    ],
  },
  {
    title: "Nervos Scan",
    description: "A CKB Explorer produced with love by 7774.bit",
    href: "https://nervosscan.com/",
    bannerSrc: "nervosscan",
    tags: ["Explorer"],
    links: [{ label: "website", link: "https://nervosscan.com/" }],
  },
  {
    title: "Neuron",
    description:
      "A versatile desktop wallet designed for securely managing CKB assets",
    href: "https://github.com/nervosnetwork/neuron/releases/tag/v0.114.2",
    bannerSrc: "neuron",
    tags: ["Wallet"],
    links: [
      {
        label: "website",
        link: "https://github.com/nervosnetwork/neuron/releases/tag/v0.114.2",
      },
    ],
  },

  {
    title: "CKBull",
    description:
      "A mobile wallet that allows you to access and manage your CKB",
    href: "https://ckbull.app/",
    bannerSrc: "ckbull",
    tags: ["Wallet"],
    links: [
      { label: "website", link: "https://ckbull.app/" },
      {
        label: "doc",
        link: "https://www.notion.so/How-to-use-CKBull-wallet-89153cac673447b0bf827d1f6f7d151c?pvs=4",
      },
    ],
  },
  {
    title: "imToken",
    description:
      "A built-in CKB wallet on mobile that enables users to safely send, receive and store CKB",
    href: "https://token.im/",
    bannerSrc: "imtoken",
    tags: ["Wallet"],
    links: [
      { label: "website", link: "https://token.im/" },
      { label: "github", link: "https://github.com/consenlabs" },
      {
        label: "doc",
        link: "https://medium.com/imtoken/imtoken-2-5-0-now-with-nervos-tron-bch-ltc-support-14d7171ccf4",
      },
    ],
  },
  {
    title: "SafePal",
    description:
      "A hardware wallet that supports both Nervos L1 CKB and L2 Godwoken",
    href: "https://www.safepal.com/",
    bannerSrc: "safepal",
    tags: ["Wallet"],
    links: [
      { label: "website", link: "https://www.safepal.com/" },
      {
        label: "doc",
        link: "https://www.notion.so/How-to-add-send-Nervos-Chain-CKB-coin-with-SafePal-Hardware-Wallet-40da32d8f7074563859e9d08b585768e",
      },
    ],
  },
  {
    title: "Ledger",
    description:
      "Provide secure hardware wallets for cryptocurrency storage and management",
    href: "https://www.ledger.com/",
    bannerSrc: "ledger",
    tags: ["Wallet"],
    links: [
      { label: "website", link: "https://www.ledger.com/" },
      { label: "doc", link: "https://developers.ledger.com/docs/sections" },
    ],
  },
  {
    title: "imKey",
    description:
      "Offer secure, user-friendly hardware wallets for digital asset protection",
    href: "https://imkey.im/",
    bannerSrc: "imkey",
    tags: ["Wallet"],
    links: [{ label: "website", link: "https://imkey.im/" }],
  },
  {
    title: "oneKey",
    description:
      "Offer secure hardware wallets with cross-platform apps for digital asset management",
    href: "https://onekey.so/",
    bannerSrc: "onekey",
    tags: ["Wallet"],
    links: [
      { label: "website", link: "https://onekey.so/" },
      { label: "github", link: "https://github.com/OneKeyHQ/" },
      { label: "doc", link: "https://developer.onekey.so/" },
    ],
  },
  {
    title: "ReiWallet",
    description:
      "Nervos CKB native chrome extension wallet for digital asset management",
    href: "https://reiwallet.io",
    bannerSrc: "reiwallet",
    tags: ["Wallet"],
    links: [
      { label: "website", link: "https://reiwallet.io" },
      { label: "github", link: "https://github.com/teamtaoist/" },
      { label: "doc", link: "https://docs.reiwallet.io/" },
    ],
  },
  {
    title: "ForceBridge",
    description:
      "A cross-chain interoperability bridge b/w Nervos and other blockchains",
    href: "https://forcebridge.com/",
    bannerSrc: "forcebridge",
    tags: ["Bridge"],
    links: [
      { label: "website", link: "https://forcebridge.com/" },
      {
        label: "github",
        link: "https://github.com/nervosnetwork/force-bridge",
      },
      {
        label: "doc",
        link: "https://github.com/nervosnetwork/force-bridge/blob/main/docs/dapp-user-guide.md",
      },
    ],
  },
  {
    title: "Godwoken Bridge",
    description: "A token bridge between CKB and Godwoken",
    href: "https://bridge.godwoken.io/",
    bannerSrc: "godwokenbridge",
    tags: ["Bridge"],
    links: [
      { label: "website", link: "https://bridge.godwoken.io/" },
      {
        label: "github",
        link: "https://github.com/godwokenrises/light-godwoken/tree/develop/apps/godwoken-bridge",
      },
      { label: "doc", link: "https://docs.godwoken.io/" },
    ],
  },
  {
    title: "Yokaiswap Bridge",
    description:
      "A cross-chain interoperability bridge b/w Nervos and other blockchains",
    href: "https://www.yokaiswap.com/bridge/",
    bannerSrc: "yokaiswap",
    tags: ["Bridge"],
    links: [
      { label: "website", link: "https://www.yokaiswap.com/bridge/" },
      { label: "github", link: "https://github.com/yokaiswap" },
    ],
  },
  {
    title: "Ankr",
    description: "The fastest, most reliable Web3 infrastructure",
    href: "https://www.ankr.com/",
    bannerSrc: "ankr",
    tags: ["Tools & Infra"],
    links: [
      { label: "website", link: "https://www.ankr.com/" },
      {
        label: "doc",
        link: "https://archive.nervos.org/blog/ankr-integrates-support-for-nervos-nodes",
      },
    ],
  },
  {
    title: "Axon",
    description: "A L2 framework that unleashes the power of appchain future",
    href: "https://axonweb3.io/",
    bannerSrc: "axon",
    tags: ["Tools & Infra"],
    links: [
      { label: "website", link: "https://axonweb3.io/" },
      { label: "github", link: "https://github.com/axonweb3/axon" },
      { label: "doc", link: "https://docs.axonweb3.io/" },
    ],
  },
  {
    title: "BandProtocol",
    description: "A L2 framework that unleashes the power of appchain future",
    href: "https://www.bandprotocol.com/",
    bannerSrc: "bandprotocol",
    tags: ["Tools & Infra"],
    links: [
      { label: "website", link: "https://www.bandprotocol.com/" },
      { label: "github", link: "https://github.com/bandprotocol" },
      {
        label: "doc",
        link: "https://medium.com/bandprotocol/band-protocol-integrates-with-nervos-godwoken-361546e1091d",
      },
    ],
  },
  {
    title: "DIA",
    description:
      "Provides fully customizable and transparent data feeds for smart contracts",
    href: "https://www.diadata.org/",
    bannerSrc: "dia",
    tags: ["Tools & Infra"],
    links: [
      { label: "website", link: "https://www.diadata.org/" },
      {
        label: "doc",
        link: "https://archive.nervos.org/blog/dia-deploys-oracles-onto-layer-2-bolstering-dev-resources",
      },
    ],
  },
  {
    title: "Godwoken",
    description:
      "An EVM-compatible, L2 optimistic rollup solution built on Nervos L1",
    href: "https://www.godwoken.com/",
    bannerSrc: "godwoken",
    tags: ["Tools & Infra"],
    links: [
      { label: "website", link: "https://www.godwoken.com/" },
      { label: "github", link: "https://github.com/godwokenrises" },
      { label: "doc", link: "https://docs.godwoken.io/" },
    ],
  },
  {
    title: "Khalani",
    description:
      "A decentralized infrastructure for collaborative solving in intent-driven applications",
    href: "https://khalani.network/",
    bannerSrc: "khalani",
    tags: ["Tools & Infra"],
    links: [
      { label: "website", link: "https://khalani.network/" },
      { label: "doc", link: "https://blog.khalani.network/" },
    ],
  },
  {
    title: "Perun",
    description:
      "A L2 solution enhancing efficiency with off-chain transaction capabilities",
    href: "https://perun.network/",
    bannerSrc: "perun",
    tags: ["Tools & Infra"],
    links: [
      { label: "website", link: "https://perun.network/" },
      { label: "github", link: "https://github.com/perun-network/go-perun" },
    ],
  },
  {
    title: "Unifra",
    description:
      "A leading L2 platform that provides open, reliable infrastructure services",
    href: "https://unifra.io/",
    bannerSrc: "unifra",
    tags: ["Tools & Infra"],
    links: [{ label: "website", link: "https://unifra.io/" }],
  },
  {
    title: "F2Pool",
    description: "Leading mining pool for PoW network",
    href: "https://www.f2pool.com/",
    bannerSrc: "f2pool",
    tags: ["Mining pool"],
    links: [
      { label: "website", link: "https://www.f2pool.com/" },
      {
        label: "doc",
        link: "https://f2pool.zendesk.com/hc/en-us/articles/22893426126489-How-to-mine-Nervos",
      },
    ],
  },
  {
    title: "Antpool",
    description: "World leading BTC mining pool",
    href: "https://www.antpool.com/home?lang=en",
    bannerSrc: "antpool",
    tags: ["Mining pool"],
    links: [
      { label: "website", link: "https://www.antpool.com/home?lang=en" },
      {
        label: "doc",
        link: "https://antpoolsupport-hc.zendesk.com/hc/en-us/articles/5985104597913-CKB-Mining",
      },
    ],
  },
  {
    title: "Binance Pool",
    description: "Enjoy zero pool fees with CKB mining",
    href: "https://pool.binance.com/en",
    bannerSrc: "binancepool",
    tags: ["Mining pool"],
    links: [
      { label: "website", link: "https://pool.binance.com/en" },
      {
        label: "doc",
        link: "https://www.binance.com/en/support/faq/how-to-mine-nervos-ckb-on-binance-pool-6967ad3306b84ec49dcbb5ed8ac30a9b",
      },
    ],
  },
  {
    title: "2miners",
    description: "The most profitable Nervos mining pool for GPU and ASIC",
    href: "https://ckb.2miners.com/",
    bannerSrc: "2miners",
    tags: ["Mining pool"],
    links: [{ label: "website", link: "https://ckb.2miners.com/" }],
  },
  {
    title: "ViaBTC",
    description:
      "Pool the world together by providing the best mining services",
    href: "https://www.viabtc.com/",
    bannerSrc: "viabtc",
    tags: ["Mining pool"],
    links: [{ label: "website", link: "https://www.viabtc.com/" }],
  },
  {
    title: "DxPool",
    description:
      "Technology leading blockchain infrastructure service provider",
    href: "https://www.dxpool.com/",
    bannerSrc: "dxpool",
    tags: ["Mining pool"],
    links: [{ label: "website", link: "https://www.dxpool.com/" }],
  },
  {
    title: "Poolin",
    description: "A great bitcoin and multi-cryptocurrency mining pool",
    href: "https://www.poolin.com/",
    bannerSrc: "poolin",
    tags: ["Mining pool"],
    links: [
      { label: "website", link: "https://www.poolin.com/" },
      {
        label: "doc",
        link: "https://help.poolin.me/hc/en-us/articles/360040689912-CKB-Mining-Settings",
      },
    ],
  },
];

export default ecoCardContents;
