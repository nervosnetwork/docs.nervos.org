import Link from "@docusaurus/Link";
import { TutorialHeaderProps } from "@site/src/components/TutorialHeader";

const TRANSFEROVERVIEW: TutorialHeaderProps = {
  time: "2 - 5 min",
  topics: [
    { label: "Cell Model", link: "/docs/tech-explanation/cell-model" },
    {
      label: "Transaction",
      link: "/docs/tech-explanation/glossary#transaction",
    },
    { label: "Witness", link: "/docs/tech-explanation/glossary#witness" },
    {
      label: "Signature",
      link: "/docs/tech-explanation/glossary#cryptographic-signature",
    },
  ],
  tools: [
    <div>An IDE/Editor that supports TypeScript</div>,
    <div>
      <Link
        href={"https://nodejs.org/en"}
        target="_blank"
        rel="noopener noreferrer"
      >
        Node.js
      </Link>
      {" and "}
      <Link
        href={"https://yarnpkg.com/"}
        target="_blank"
        rel="noopener noreferrer"
      >
        Yarn
      </Link>
    </div>,
    <div>
      CKB dev environment:{" "}
      <Link to={"/docs/node/run-devnet-node#quick-start-with-offckb"}>
        OffCKB
      </Link>
    </div>,
  ],
};
const WRITEOVERVIEW: TutorialHeaderProps = {
  time: "2 - 5 min",
  topics: [
    { label: "Cell Model", link: "/docs/tech-explanation/cell-model" },
    { label: "Data", link: "/docs/tech-explanation/glossary#data" },
    {
      label: "Transaction Hash",
      link: "/docs/tech-explanation/glossary#transaction-hash",
    },
  ],
  tools: [
    <div>An IDE/Editor that supports TypeScript</div>,
    <div>
      <Link
        href={"https://nodejs.org/en"}
        target="_blank"
        rel="noopener noreferrer"
      >
        Node.js
      </Link>
      {" and "}
      <Link
        href={"https://yarnpkg.com/"}
        target="_blank"
        rel="noopener noreferrer"
      >
        Yarn
      </Link>
    </div>,
    <div>
      CKB dev environment:{" "}
      <Link to={"/docs/node/run-devnet-node#quick-start-with-offckb"}>
        OffCKB
      </Link>
    </div>,
  ],
};
const TOKENOVERVIEW: TutorialHeaderProps = {
  time: "5 - 10 min",
  topics: [
    { label: "UDT", link: "/docs/tech-explanation/glossary#udt" },
    {
      label: "Fungible Token",
      link: "/docs/tech-explanation/glossary#fungible-token",
    },
    {
      label: "xUDT",
      link: "https://github.com/XuJiandong/rfcs/blob/xudt/rfcs/0052-extensible-udt/0052-extensible-udt.md",
    },
  ],
  tools: [
    <div>An IDE/Editor that supports TypeScript</div>,
    <div>
      <Link
        href={"https://nodejs.org/en"}
        target="_blank"
        rel="noopener noreferrer"
      >
        Node.js
      </Link>
      {" and "}
      <Link
        href={"https://yarnpkg.com/"}
        target="_blank"
        rel="noopener noreferrer"
      >
        Yarn
      </Link>
    </div>,
    <div>
      CKB dev environment:{" "}
      <Link to={"/docs/node/run-devnet-node#quick-start-with-offckb"}>
        OffCKB
      </Link>
    </div>,
  ],
};
const DOBOVERVIEW: TutorialHeaderProps = {
  time: "5 - 10 min",
  topics: [
    {
      label: "DOB",
      link: "/docs/tech-explanation/glossary#digital-object-dob",
    },
    {
      label: "NFT",
      link: "/docs/tech-explanation/glossary#non-fungible-token",
    },
    { label: "Spore Protocol", link: "https://spore.pro" },
  ],
  tools: [
    <div>An IDE/Editor that supports TypeScript</div>,
    <div>
      <Link
        href={"https://nodejs.org/en"}
        target="_blank"
        rel="noopener noreferrer"
      >
        Node.js
      </Link>
      {" and "}
      <Link
        href={"https://yarnpkg.com/"}
        target="_blank"
        rel="noopener noreferrer"
      >
        Yarn
      </Link>
    </div>,
    <div>
      CKB dev environment:{" "}
      <Link to={"/docs/node/run-devnet-node#quick-start-with-offckb"}>
        OffCKB
      </Link>
    </div>,
  ],
};

const LOCKOVERVIEW: TutorialHeaderProps = {
  time: "10 - 15 min",
  topics: [
    {
      label: "Full-Stack",
      link: "/docs/getting-started/quick-start#dapp-project-structure",
    },
    {
      label: "Lock Script",
      link: "/docs/tech-explanation/glossary#lock-script",
    },
    {
      label: "Witness",
      link: "/docs/tech-explanation/glossary#witness",
    },
    {
      label: "Cryptographic hash function",
      link: "https://en.wikipedia.org/wiki/Cryptographic_hash_function",
    },
  ],
  tools: [
    <div>An IDE/Editor that supports TypeScript</div>,
    <div>
      <Link
        href={"https://nodejs.org/en"}
        target="_blank"
        rel="noopener noreferrer"
      >
        Node.js
      </Link>
      {" and "}
      <Link
        href={"https://yarnpkg.com/"}
        target="_blank"
        rel="noopener noreferrer"
      >
        Yarn
      </Link>
    </div>,
    <div>
      CKB dev environment:{" "}
      <Link to={"/docs/node/run-devnet-node#quick-start-with-offckb"}>
        OffCKB
      </Link>
    </div>,
    <div>Script develop tools</div>,
  ],
};

export {
  TRANSFEROVERVIEW,
  WRITEOVERVIEW,
  TOKENOVERVIEW,
  DOBOVERVIEW,
  LOCKOVERVIEW,
};
