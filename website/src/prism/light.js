import { themes as prismThemes } from "prism-react-renderer";

module.exports = {
  plain: {
    color: "var(--code-plain)",
    backgroundColor: "var(--surface-02)",
  },
  styles: [
    ...prismThemes.vsLight.styles,
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "var(--code-comment)",
      },
    },
    {
      types: ["constant"],
      style: {
        color: "var(--code-constant)",
      },
    },
    {
      types: ["operator"],
      style: {
        color: "var(--text-secondary)",
      },
    },
    {
      types: ["function", "attr-name"],
      style: {
        color: "var(--code-function)",
      },
    },
    {
      types: ["keyword", "attr-value"],
      style: {
        color: "var(--code-keyword)",
      },
    },
  ],
};
