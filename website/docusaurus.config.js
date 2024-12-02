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
  scripts: ["/js/extra.js", "/js/scrollSidebar.js"],
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
        blog: {
          path: "blog",
          // Simple use-case: string editUrl
          // editUrl: 'https://github.com/facebook/docusaurus/edit/main/website/',
          // Advanced use-case: functional editUrl
          editUrl: ({ locale, blogDirPath, blogPath, permalink }) =>
            `https://github.com/facebook/docusaurus/edit/main/website/${blogDirPath}/${blogPath}`,
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
            to: "/docs/node/rpcs",
          },
          {
            from: "/docs/reference/tools",
            to: "/docs/sdk-and-devtool/devtool",
          },
          {
            from: "/docs/basics/concepts/economics",
            to: "/docs/tech-explanation/economics",
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
          to: "/docs/getting-started/how-ckb-works",
          label: "Docs",
          position: "left",
        }, // or position: 'right'
        { to: "blog", label: "Blog", position: "left" }, // or position: 'right'
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
