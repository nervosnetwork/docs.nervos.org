import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { visit } from "unist-util-visit";
import { remark } from "remark";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const glossaryPath = path.join(
  __dirname,
  "../docs/tech-explanation/glossary.md"
);
const outputPath = path.join(
  __dirname,
  "../src/components/Tooltip/key-terms.json"
);
const docsPath = path.join(__dirname, "../docs/tech-explanation");

const glossaryContent = fs.readFileSync(glossaryPath, "utf8");
const terms = {};

remark()
  .use(() => (tree) => {
    let currentTerm = "";
    visit(tree, (node) => {
      // Normalize the terms to lower case
      if (
        node.type === "heading" &&
        node.depth === 3 &&
        node.children.length > 0
      ) {
        const term = node.children[0].value;
        currentTerm = term;
        terms[currentTerm.toLowerCase()] = { content: "", link: "" };
      }

      // Only pick the first sentence as the content
      if (
        currentTerm &&
        node.type === "paragraph" &&
        !terms[currentTerm.toLowerCase()].content
      ) {
        let firstSentence = node.children
          .filter(
            (child) => child.type === "text" || child.type === "inlineCode"
          )
          .map((child) => child.value)
          .join("")
          .split(". ")[0];

        if (!firstSentence.endsWith(".")) {
          firstSentence += ".";
        }
        terms[currentTerm.toLowerCase()].content = firstSentence.trim();

        // Check if a specific file exists for the term
        const normalizedTerm = currentTerm
          .toLowerCase()
          .replace(/[\s_]+/g, "-")
          .replace(/[()]/g, "");
        const termFilePathMd = path.join(docsPath, `${normalizedTerm}.md`);
        const termFilePathMdx = path.join(docsPath, `${normalizedTerm}.mdx`);
        if (fs.existsSync(termFilePathMd) || fs.existsSync(termFilePathMdx)) {
          terms[
            currentTerm.toLowerCase()
          ].link = `/docs/tech-explanation/${normalizedTerm}`;
        } else {
          terms[
            currentTerm.toLowerCase()
          ].link = `/docs/tech-explanation/glossary#${normalizedTerm}`;
        }
      }
    });
  })
  .process(glossaryContent, (err) => {
    if (err) throw err;

    const jsonContent = JSON.stringify(terms, null, 2);

    fs.writeFileSync(outputPath, jsonContent);
  });
