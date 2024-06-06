import path from "path";
import math from "remark-math";
import katex from "rehype-katex";

const lightCodeTheme = require("./src/prism/light");
const darkCodeTheme = require("./src/prism/dark");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Nervos CKB",
  tagline: "Nervos CKB",
  url: "https://docs.nervos.org",
  baseUrl: "/",
  organizationName: "nervosnetwork",
  projectName: "docs-new",
  scripts: ["/js/extra.js"],
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
        blog: {},
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
            from: "/docs/basics/guides/mining-ckb",
            to: "/docs/mining/guide",
          },
          {
            from: "/docs/reference/halving",
            to: "/docs/mining/halving",
          },
          {
            from: "/docs/basics/guides/crypto wallets/neuron",
            to: "https://docs-old.nervos.org/docs/basics/guides/crypto wallets/neuron",
          },
        ],
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
      additionalLanguages: ["bash", "powershell", "rust"],
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
          type: "search",
          position: "right",
          className: "navbar-search",
        },
        {
          type: "html",
          position: "right",
          value:
            '<a class="help-flex" href="https://discord.gg/nervosnetwork" target="__blank"><img alt="Discord for help" src="/svg/icon-discord.svg" width={24} height={24}><p class="help-text">Get Help</p></a>',
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
