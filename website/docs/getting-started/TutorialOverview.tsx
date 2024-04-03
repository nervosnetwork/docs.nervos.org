import { TutorialHeaderProps } from "@site/src/components/TutorialHeader";

const TRANSFEROVERVIEW: TutorialHeaderProps = 
{
    time: "2 - 5 min",
    topics: [
    { label: "Cell Model", href:"/docs/concepts/cell-model" },
    { label: "Transaction", href:"/docs/concepts/glossary#transaction" },
    { label: "Witness", href:"/docs/concepts/glossary#witness" },
    { label: "Signature", href:"/docs/concepts/glossary#cryptographic-signature" },
    ],
    tools: [
        <div>An IDE/Editor that supports TypeScript</div>,
        <div><a href={"https://nodejs.org/en"}>Node.js</a>{' and '} <a href={"https://yarnpkg.com/"}>Yarn</a></div>,
        <div>CKB dev environment: <a href={"/doc/getting-started/dev-environment#quick-setup-with-offckb"}>OffCKB</a></div>
    ],
}
const WRITEOVERVIEW: TutorialHeaderProps = 
{
    time: "2 - 5 min",
    topics: [
    { label: "Cell Model", href:"/docs/concepts/cell-model" },
    { label: "Data", href:"/docs/concepts/glossary#data" },
    { label: "Transaction Hash", href:"/docs/concepts/glossary#transaction-hash" },
    ],
    tools: [
        <div>An IDE/Editor that supports TypeScript</div>,
        <div><a href={"https://nodejs.org/en"}>Node.js</a>{' and '} <a href={"https://yarnpkg.com/"}>Yarn</a></div>,
        <div>CKB dev environment: <a href={"/doc/getting-started/dev-environment#quick-setup-with-offckb"}>OffCKB</a></div>
    ],
}
const TOKENOVERVIEW: TutorialHeaderProps = 
{
    time: "5 - 10 min",
    topics: [
    { label: "UDT", href:"/docs/concepts/glossary#udt" },
    { label: "Fungible Token", href:"/docs/concepts/glossary#fungible-token" },
    { label: "xUDT", href:"https://github.com/XuJiandong/rfcs/blob/xudt/rfcs/0052-extensible-udt/0052-extensible-udt.md" },
    ],
    tools: [
        <div>An IDE/Editor that supports TypeScript</div>,
        <div><a href={"https://nodejs.org/en"}>Node.js</a>{' and '} <a href={"https://yarnpkg.com/"}>Yarn</a></div>,
        <div>CKB dev environment: <a href={"/doc/getting-started/dev-environment#quick-setup-with-offckb"}>OffCKB</a></div>
    ],
}
const DOBOVERVIEW: TutorialHeaderProps = 
{
    time: "5 - 10 min",
    topics: [
    { label: "DOB", href:"/docs/concepts/glossary#digital-object-dob" },
    { label: "NFT", href:"/docs/concepts/glossary#non-fungible-token" },
    { label: "Spore Protocol", href:"https://spore.pro" },
    ],
    tools: [
        <div>An IDE/Editor that supports TypeScript</div>,
        <div><a href={"https://nodejs.org/en"}>Node.js</a>{' and '} <a href={"https://yarnpkg.com/"}>Yarn</a></div>,
        <div>CKB dev environment: <a href={"/doc/getting-started/dev-environment#quick-setup-with-offckb"}>OffCKB</a></div>
    ],
}
  
  
export {
    TRANSFEROVERVIEW,
    WRITEOVERVIEW,
    TOKENOVERVIEW,
    DOBOVERVIEW
};
  