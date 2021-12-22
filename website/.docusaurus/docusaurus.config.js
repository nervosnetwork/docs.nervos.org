export default {
  "title": "Nervos CKB Docs",
  "tagline": "Nervos CKB Documentations",
  "url": "https://docs.nervos.org",
  "baseUrl": "/",
  "organizationName": "nervosnetwork",
  "projectName": "docs-new",
  "scripts": [
    "/js/extra.js"
  ],
  "stylesheets": [
    "https://fonts.googleapis.com/css2?family=Lato&display=swap"
  ],
  "favicon": "img/favicon.png",
  "customFields": {
    "oldDocSiteUrl": "https://docs-old.nervos.org",
    "gaGtag": true,
    "disableHeaderTitle": true,
    "fonts": {
      "lato": [
        "Lato",
        "sans-serif"
      ]
    },
    "socialLinks": [
      {
        "label": "Twitter",
        "icon": "img/footer_twitter.png",
        "url": "https://twitter.com/nervosnetwork"
      },
      {
        "label": "Blog",
        "icon": "img/footer_medium.png",
        "url": "https://medium.com/nervosnetwork"
      },
      {
        "label": "Telegram",
        "icon": "img/footer_telegram.png",
        "url": "https://t.me/nervosnetwork"
      },
      {
        "label": "Reddit",
        "icon": "img/footer_reddit.png",
        "url": "https://www.reddit.com/r/NervosNetwork/"
      },
      {
        "label": "YouTube",
        "icon": "img/footer_youtube.png",
        "url": "https://www.youtube.com/channel/UCONuJGdMzUY0Y6jrPBOzH7A"
      },
      {
        "label": "Forum",
        "icon": "img/footer_forum.png",
        "url": "https://talk.nervos.org/"
      }
    ]
  },
  "onBrokenLinks": "log",
  "onBrokenMarkdownLinks": "log",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "path": "./docs",
          "showLastUpdateAuthor": true,
          "showLastUpdateTime": true,
          "sidebarPath": "./sidebars.json"
        },
        "blog": {},
        "theme": {
          "customCss": "../src/css/customTheme.css"
        }
      }
    ]
  ],
  "plugins": [],
  "themeConfig": {
    "navbar": {
      "title": "Nervos CKB Docs",
      "logo": {
        "src": "img/logo.png"
      },
      "items": [
        {
          "to": "docs/basics/introduction",
          "label": "Basics",
          "position": "left"
        },
        {
          "to": "docs/reference/introduction",
          "label": "Reference",
          "position": "left"
        },
        {
          "to": "docs/labs/introduction",
          "label": "Labs",
          "position": "left"
        },
        {
          "to": "docs/integrate/introduction",
          "label": "Integrate",
          "position": "left"
        },
        {
          "to": "docs/essays/introduction",
          "label": "Essays",
          "position": "left"
        }
      ],
      "hideOnScroll": false
    },
    "image": "img/undraw_online.svg",
    "footer": {
      "links": [],
      "copyright": "Copyright © 2021  Nervos Foundation. All Rights Reserved.",
      "logo": {
        "src": "img/favicon.png"
      },
      "style": "light"
    },
    "algolia": {
      "apiKey": "4ca49bc7433bcef238e8b9aab6dc4d11",
      "indexName": "nervos_ckbd",
      "placeholder": "Search",
      "algoliaOptions": {},
      "contextualSearch": false,
      "appId": "BH4D9OD16A",
      "searchParameters": {}
    },
    "gtag": {
      "trackingID": "UA-139882771-1"
    },
    "colorMode": {
      "defaultMode": "light",
      "disableSwitch": false,
      "respectPrefersColorScheme": false,
      "switchConfig": {
        "darkIcon": "🌜",
        "darkIconStyle": {},
        "lightIcon": "🌞",
        "lightIconStyle": {}
      }
    },
    "docs": {
      "versionPersistence": "localStorage"
    },
    "metadata": [],
    "prism": {
      "additionalLanguages": []
    },
    "hideableSidebar": false,
    "tableOfContents": {
      "minHeadingLevel": 2,
      "maxHeadingLevel": 3
    }
  },
  "baseUrlIssueBanner": true,
  "i18n": {
    "defaultLocale": "en",
    "locales": [
      "en"
    ],
    "localeConfigs": {}
  },
  "onDuplicateRoutes": "warn",
  "staticDirectories": [
    "static"
  ],
  "themes": [],
  "titleDelimiter": "|",
  "noIndex": false
};