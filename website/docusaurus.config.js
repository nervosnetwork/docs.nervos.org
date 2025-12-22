import path from "path";
import math from "remark-math";
import katex from "rehype-katex";

const lightCodeTheme = require("./src/prism/light");
const darkCodeTheme = require("./src/prism/dark");

const repoBranch =
  process.env.VERCEL_GIT_COMMIT_REF || process.env.DEPLOY_BRANCH || "master";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Nervos CKB",
  tagline: "Nervos CKB",
  url: "https://docs.nervos.org",
  baseUrl: "/",
  organizationName: "nervosnetwork",
  projectName: "docs-new",
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],
  favicon: "img/favicon.png",
  customFields: {
    oldDocSiteUrl: "https://docs-old.nervos.org",
    gaGtag: true,
    disableHeaderTitle: true,
    socialLinks: [
      {
        label: "Twitter",
        icon: "img/footer_twitter.png",
        url: "https://twitter.com/nervosnetwork",
      },
      {
        label: "Blog",
        icon: "img/footer_medium.png",
        url: "https://medium.com/nervosnetwork",
      },
      {
        label: "Telegram",
        icon: "img/footer_telegram.png",
        url: "https://t.me/nervosnetwork",
      },
      {
        label: "Reddit",
        icon: "img/footer_reddit.png",
        url: "https://www.reddit.com/r/NervosNetwork/",
      },
      {
        label: "YouTube",
        icon: "img/footer_youtube.png",
        url: "https://www.youtube.com/channel/UCONuJGdMzUY0Y6jrPBOzH7A",
      },
      {
        label: "Forum",
        icon: "img/footer_forum.png",
        url: "https://talk.nervos.org/",
      },
    ],
    examplesBaseUrl: `https://github.com/nervosnetwork/docs.nervos.org/tree/${repoBranch}/examples/`,
  },
  onBrokenLinks: "log",
  onBrokenMarkdownLinks: "log",
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        gtag: {
          trackingID: "G-Q42TXTFP46",
          anonymizeIP: true,
        },
        docs: {
          path: "./docs",
          breadcrumbs: false,
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
          sidebarPath: require.resolve("./sidebars.js"),
          remarkPlugins: [math],
          rehypePlugins: [katex],
          editUrl:
            "https://github.com/nervosnetwork/docs-new/tree/develop/website",
        },
        blog: {
          path: "blog",
          // Simple use-case: string editUrl
          // editUrl: 'https://github.com/facebook/docusaurus/edit/main/website/',
          // Advanced use-case: functional editUrl
          editUrl: ({ locale, blogDirPath, blogPath, permalink }) =>
            `https://github.com/nervosnetwork/docs-new/tree/develop/website/${blogDirPath}/${blogPath}`,
          editLocalizedFiles: false,
          blogTitle: "Nervos Blog",
          blogDescription: "Blog Posts About Nervos Blockchain",
          blogSidebarCount: 20,
          blogSidebarTitle: "All Posts",
          routeBasePath: "blog",
          include: ["**/*.{md,mdx}"],
          exclude: [
            "**/_*.{js,jsx,ts,tsx,md,mdx}",
            "**/_*/**",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__tests__/**",
          ],
          postsPerPage: 1,
          blogListComponent: "@theme/BlogListPage",
          blogPostComponent: "@theme/BlogPostPage",
          blogTagsListComponent: "@theme/BlogTagsListPage",
          blogTagsPostsComponent: "@theme/BlogTagsPostsPage",
          processBlogPosts: async ({ blogPosts }) =>
            blogPosts.sort(
              (a, b) =>
                Date.parse(a.metadata.date) - Date.parse(b.metadata.date)
            ),
          truncateMarker: /<!--\s*(truncate)\s*-->/,
          showReadingTime: true,
          feedOptions: {
            title: "Nervos Blog",
            description: "Blog Posts About Nervos Blockchain",
            createFeedItems: async (params) => {
              const { blogPosts, defaultCreateFeedItems, ...rest } = params;
              return defaultCreateFeedItems({
                // keep only the 10 most recent blog posts in the feed
                blogPosts: blogPosts.filter((item, index) => index < 10),
                ...rest,
              });
            },
          },
        },
        theme: {
          customCss: [path.join(__dirname, "./src/css/customTheme.css")],
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        style: undefined,
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/docs",
            to: "/",
          },
          {
            from: "/docs/reference/rpc/",
            to: "/docs/getting-started/rpcs",
          },
          {
            from: "/docs/reference/tools",
            to: "/docs/sdk-and-devtool/devtool",
          },
          {
            from: "/docs/basics/concepts/economics",
            to: "/docs/assets-token-standards/economics",
          },
          {
            from: "/docs/basics/glossary/",
            to: "/docs/tech-explanation/glossary",
          },
          {
            from: "/docs/basics/guides/mainnet",
            to: "/docs/node/run-mainnet-node",
          },
          {
            from: "/docs/basics/guides/get-ckb",
            to: "https://docs-old.nervos.org/docs/basics/guides/get-ckb",
          },
          {
            from: "/docs/basics/guides/mining-ckb",
            to: "/docs/mining/guide",
          },
          {
            from: "/docs/reference/halving",
            to: "/docs/mining/halving",
          },
          {
            from: [
              "/docs/basics/guides/crypto wallets/neuron",
              "/docs/basics/guides/neuron",
            ],
            to: "https://docs-old.nervos.org/docs/basics/guides/crypto wallets/neuron",
          },
          {
            from: "/docs/basics/tools",
            to: "https://docs-old.nervos.org/docs/basics/tools",
          },
          {
            from: "/docs/script/minimal-script",
            to: "/docs/script/rust/rust-example-minimal-script",
          },
          {
            from: "/docs/script/sudt-script",
            to: "/docs/script/rust/rust-example-sudt-script",
          },
          {
            from: "/docs/history-and-hard-forks/history-vm-version",
            to: "/docs/script/vm-version",
          },
        ],
        createRedirects(existingPath) {
          if (
            existingPath.includes("/docs/essays/") ||
            existingPath.includes("/docs/labs/")
          ) {
            return [`https://docs-old.nervos.org${existingPath}`];
          }
          return undefined;
        },
      },
    ],
    function myPlugin() {
      return {
        name: "custom-webpack-plugin",
        configureWebpack() {
          return {
            resolve: {
              alias: {
                "@components": path.resolve(__dirname, "src/components"),
                "@css": path.resolve(__dirname, "src/css"),
              },
            },
          };
        },
      };
    },
  ],
  themeConfig: {
    prism: {
      additionalLanguages: ["bash", "powershell", "rust", "json"],
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      logo: {
        src: "img/logo-dark.png",
        width: 89,
        height: 32,
        alt: "Nervos CKB Docs",
        href: "/",
      },
      items: [
        {
          type: "custom-megaMenu",
          label: "Build",
          position: "left",
          menuId: "build",
          activeBaseRegex:
            "/(getting-started|dapp|script|how-tos|integrate-wallets|sdk-and-devtool|serialization)/",
          primaryItems: [
            {
              title: "Getting Started",
              description: "Basics for onboarding to CKB",
              href: "/docs/getting-started/how-ckb-works",
              icon: "squareRocket",
              activeBaseRegex: "/getting-started/",
            },
            {
              title: "DApp Tutorials",
              description: "Step-by-step examples for building on CKB",
              href: "/docs/dapp/transfer-ckb",
              icon: "squareDapp",
              activeBaseRegex: "/dapp/",
            },
            {
              title: "Script Development",
              description: "Implement smart-contract logic on CKB",
              href: "/docs/script/intro-to-script",
              icon: "squareScript",
              activeBaseRegex: "/(script|ecosystem-scripts|script-course)/",
            },
          ],

          otherLabel: "OTHER",
          otherItems: [
            {
              title: "How-Tos",
              href: "/docs/how-tos/how-to-sign-a-tx",
              icon: "howto",
              activeBaseRegex: "/how-tos/",
            },
            {
              title: "Integrate Wallets",
              href: "/docs/integrate-wallets/intro-to-wallets",
              icon: "wallet",
              activeBaseRegex: "/integrate-wallets/",
            },
            {
              title: "SDK & Dev Tools",
              href: "/docs/sdk-and-devtool/devtool",
              icon: "tool",
              activeBaseRegex: "/sdk-and-devtool/",
            },
            {
              title: "Serialization (Molecule)",
              href: "/docs/serialization/serialization-molecule-in-ckb",
              icon: "molecule",
              activeBaseRegex: "/serialization/",
            },
          ],
        },
        {
          type: "custom-megaMenu",
          label: "Learn",
          position: "left",
          menuId: "learn",
          activeBaseRegex:
            "/(tech-explanation|ckb-fundamentals|ckb-features|assets-token-standards)/",
          primaryItems: [
            {
              title: "What Makes CKB Unique",
              description: "Design choices behind CKB",
              href: "/docs/ckb-features/extreme-decentralization",
              icon: "squareFeature",
              activeBaseRegex: "/ckb-features/",
            },
            {
              title: "CKB Fundamentals",
              description: "Core concepts of how CKB works",
              href: "/docs/ckb-fundamentals/nervos-blockchain",
              icon: "squareConcept",
              activeBaseRegex: "/ckb-fundamentals/",
            },
            {
              title: "Core Structures",
              description: "Detailed breakdown of core components",
              href: "/docs/tech-explanation/cell",
              icon: "squareStructure",
              activeBaseRegex: "^.*tech-explanation(?!/glossary)",
            },
          ],

          otherLabel: "OTHER",
          otherItems: [
            {
              title: "Assets & Token Standards",
              href: "/docs/assets-token-standards/assets-overview",
              icon: "token",
              activeBaseRegex: "/assets-token-standards/",
            },
            {
              title: "Glossary",
              href: "/docs/tech-explanation/glossary",
              icon: "resource",
              activeBaseRegex: "/tech-explanation/glossary",
            },
          ],
        },
        {
          type: "custom-megaMenu",
          label: "Network",
          position: "left",
          menuId: "network",
          activeBaseRegex: "/(node|mining)/",
          primaryItems: [
            {
              title: "Run a Node",
              description: "Install, configure, and operate CKB nodes",
              href: "/docs/node/node-overview",
              icon: "squareNodes",
              activeBaseRegex: "/node/",
            },
            {
              title: "Mining",
              description: "Mining mechanics, tools, and rewards",
              href: "/docs/mining/guide",
              icon: "squareMine",
              activeBaseRegex: "/mining/",
            },
          ],
        },
        {
          type: "custom-megaMenu",
          label: "Community",
          position: "left",
          menuId: "community",
          activeBaseRegex: "/(ecosystem|history-and-hard-forks)",
          primaryItems: [
            {
              title: "Projects",
              description:
                "Applications, tools, and initiatives in the ecosystem",
              href: "/docs/ecosystem/projects",
              icon: "squareProject",
              activeBaseRegex: "/ecosystem/projects",
            },
            {
              title: "History & Hard Forks",
              description: "Timeline and evolution of the CKB network",
              href: "/docs/history-and-hard-forks/intro-to-hard-fork",
              icon: "squareHistory",
              activeBaseRegex: "/history-and-hard-forks/",
            },
            {
              title: "Contribute",
              description: "Ways to participate and support the network",
              href: "/docs/ecosystem/contribute",
              icon: "squareContribution",
              activeBaseRegex: "/ecosystem/contribute",
            },
          ],
          otherLabel: "RESOURCES",
          otherCol: 2,
          otherItems: [
            {
              title: "Positioning Paper",
              href: "https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0001-positioning/0001-positioning.md",
              external: true,
            },
            {
              title: "CKB RFCs",
              href: "https://github.com/nervosnetwork/rfcs",
              external: true,
            },
            {
              title: "Fiber Network",
              href: "https://www.fiber.world/docs",
              external: true,
            },
            {
              title: "Spore Protocol",
              href: "https://docs.spore.pro/",
              external: true,
            },
            {
              title: "CKB Academy",
              href: "https://academy.ckb.dev/",
              external: true,
            },
            {
              title: "CKB Cookbook",
              href: "https://cookbook.ckbdapps.com/",
              external: true,
            },
            {
              title: "CKB Dev Log",
              href: "https://github.com/nervosnetwork/ckb/discussions/categories/dev-log",
              external: true,
            },
          ],
        },

        {
          type: "search",
          position: "right",
          className: "navbar-search",
        },
        {
          type: "html",
          position: "right",
          value:
            '<a class="help-flex" href="https://discord.gg/4Jcw8MwEEv" target="__blank"><img alt="Discord for help" src="/svg/icon-discord.svg" width={24} height={24}><p class="help-text">Get Help</p></a>',
          className: "navbar-help",
        },
      ],
    },
    algolia: {
      appId: "LU9B8PQ7W5",
      apiKey: "122c7efa6c0425cfd6852286c746e653",
      indexName: "nervos",
    },
  },
};

export default config;
