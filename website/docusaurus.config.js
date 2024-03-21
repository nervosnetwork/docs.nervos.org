import path from "path";
import math from "remark-math";
import katex from "rehype-katex";

const lightCodeTheme = require('./src/prism/light');
const darkCodeTheme = require('./src/prism/dark');

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
    "https://fonts.googleapis.com/css2?family=Lato&display=swap",
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
    fonts: {
      lato: ["Lato", "sans-serif"],
    },
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
          trackingID: "G-CPNK56S8G3",
          anonymizeIP: true,
        },
        docs: {
          path: "./docs",
          breadcrumbs:false,
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [math],
          rehypePlugins: [katex],
          editUrl:
            "https://github.com/nervosnetwork/docs-new/tree/develop-v2/website",
        },
        blog: {},
        theme: {
          customCss: [path.join(__dirname, "./src/css/customTheme.css")],
        },
      },
    ],
  ],
  plugins: [
    function myPlugin() {
      return {
        name: 'custom-webpack-plugin',
        configureWebpack() {
          return {
            resolve: {
              alias: {
                '@components': path.resolve(__dirname, 'src/components'),
                '@css': path.resolve(__dirname, 'src/css'),
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
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        src: "img/logo.png",
        srcDark:'img/logo-dark.png',
        alt:'Nervos CKB Docs',
        className:'navbar-logo',
        href:'/docs/'
      },
      items: [
        {
          type: 'search',
          position: 'right',
          className: 'navbar-search',
        },
        {
          type: 'html',
          position: 'right',
          value: '<a class="help-flex" href="https://discord.gg/dTZaGEs4" target="__blank"><img src="/svg/icon-discord.svg"><p class="help-text">Get Help</p></a>',
          className: 'navbar-help'
        }
      ]
    },
    image: "img/undraw_online.svg",
    footer: {
      style: 'dark',
      links: [
        {
          title: "Foundation",
          items: [
            {
              label: "About Us",
              to: "https://www.nervos.org/",
            },
          ],
        },
        {
          title: "Developer",
          items: [
            { label: "GitHub", to: "https://github.com/nervosnetwork" },
            {
              label: "Whitepaper",
              to: "https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0002-ckb/0002-ckb.md",
            },
            { label: "RFCs", to: "https://github.com/nervosnetwork/rfcs" },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              to: "https://discord.gg/dTZaGEs4",
            },

            {
              label: "Forum",
              to: "https://talk.nervos.org/",
            },
            {
              label: "Reddit",
              to: "https://www.reddit.com/r/NervosNetwork/",
            },
            {
              label: "Telegram",
              to: "https://t.me/nervosnetwork",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Twitter",
              to: "https://twitter.com/nervosnetwork",
            },
            {
              label: "Medium",
              to: "https://medium.com/nervosnetwork",
            },
            {
              label: "YouTube",
              to: "https://www.youtube.com/channel/UCONuJGdMzUY0Y6jrPBOzH7A",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nervos Foundation. All Rights Reserved.`,
    },
    algolia: {
      appId: "LU9B8PQ7W5",
      apiKey: "122c7efa6c0425cfd6852286c746e653",
      indexName: "nervos",
    },
  },
};

export default config;
