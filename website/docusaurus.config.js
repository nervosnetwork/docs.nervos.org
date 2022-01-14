const path = require("path");

module.exports = {
  title: "Nervos CKB",
  tagline: "Nervos CKB",
  url: "https://docs.nervos.org",
  baseUrl: "/",
  organizationName: "nervosnetwork",
  projectName: "docs-new",
  scripts: ["/js/extra.js"],
  stylesheets: ["https://fonts.googleapis.com/css2?family=Lato&display=swap"],
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
          trackingID: 'G-CPNK56S8G3',
          anonymizeIP: true,
        },
        docs: {
          path: "./docs",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          sidebarPath: require.resolve("./sidebars.json"),
        },
        blog: {},
        theme: {
          customCss: [path.join(__dirname, "./static/css/custom.css")],
        },
      },
    ],
  ],
  plugins: [],
  themeConfig: {
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      style: "dark",
      logo: {
        src: "img/logo.png",
      },
      items: [
        {
          to: "docs/basics/introduction",
          label: "Basics",
          position: "left",
        },
        {
          to: "docs/reference/introduction",
          label: "Reference",
          position: "left",
        },
        {
          to: "docs/labs/introduction",
          label: "Labs",
          position: "left",
        },
        {
          to: "docs/integrate/introduction",
          label: "Integrate",
          position: "left",
        },
        {
          to: "docs/essays/introduction",
          label: "Essays",
          position: "left",
        },
      ],
    },
    image: "img/undraw_online.svg",
    footer: {
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
              to: "https://discord.gg/AqGTUE9",
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
      copyright: "Copyright © 2021  Nervos Foundation. All Rights Reserved.",
    },
    algolia: {
      apiKey: "4ca49bc7433bcef238e8b9aab6dc4d11",
      indexName: "nervos_ckbd",
      placeholder: "Search",
      algoliaOptions: {},
    }
  },
};
