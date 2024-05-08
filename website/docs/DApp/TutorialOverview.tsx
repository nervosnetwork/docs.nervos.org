import Link from "@docusaurus/Link";
import { TutorialHeaderProps } from "@site/src/components/TutorialHeader";

const TRANSFEROVERVIEW: TutorialHeaderProps = 
{
    time: "2 - 5 min",
    topics: [
    { label: "Cell Model", link:"/docs/concepts/cell-model" },
    { label: "Transaction", link:"/docs/concepts/glossary#transaction" },
    { label: "Witness", link:"/docs/concepts/glossary#witness" },
    { label: "Signature", link:"/docs/concepts/glossary#cryptographic-signature" },
    ],
    tools: [
        <div>An IDE/Editor that supports TypeScript</div>,
        <div>
            <Link href={"https://nodejs.org/en"} target="_blank" rel="noopener noreferrer">
                Node.js
            </Link>{' and '}
            <Link href={"https://yarnpkg.com/"} target="_blank" rel="noopener noreferrer">
                Yarn
            </Link>
        </div>,
        <div>CKB dev environment: <Link to={"/docs/getting-started/dev-environment#quick-setup-with-offckb"}>OffCKB</Link></div>
    ],
}
const WRITEOVERVIEW: TutorialHeaderProps = 
{
    time: "2 - 5 min",
    topics: [
    { label: "Cell Model", link:"/docs/concepts/cell-model" },
    { label: "Data", link:"/docs/concepts/glossary#data" },
    { label: "Transaction Hash", link:"/docs/concepts/glossary#transaction-hash" },
    ],
    tools: [
        <div>An IDE/Editor that supports TypeScript</div>,
        <div>
            <Link href={"https://nodejs.org/en"} target="_blank" rel="noopener noreferrer">
                Node.js
            </Link>{' and '}
            <Link href={"https://yarnpkg.com/"} target="_blank" rel="noopener noreferrer">
                Yarn
            </Link>
        </div>,
        <div>CKB dev environment: <Link to={"/docs/getting-started/dev-environment#quick-setup-with-offckb"}>OffCKB</Link></div>
    ],
}
const TOKENOVERVIEW: TutorialHeaderProps = 
{
    time: "5 - 10 min",
    topics: [
    { label: "UDT", link:"/docs/concepts/glossary#udt" },
    { label: "Fungible Token", link:"/docs/concepts/glossary#fungible-token" },
    { label: "xUDT", link:"https://github.com/XuJiandong/rfcs/blob/xudt/rfcs/0052-extensible-udt/0052-extensible-udt.md" },
    ],
    tools: [
        <div>An IDE/Editor that supports TypeScript</div>,
        <div>
            <Link href={"https://nodejs.org/en"} target="_blank" rel="noopener noreferrer">
                Node.js
            </Link>{' and '}
            <Link href={"https://yarnpkg.com/"} target="_blank" rel="noopener noreferrer">
                Yarn
            </Link>
        </div>,
        <div>CKB dev environment: <Link to={"/docs/getting-started/dev-environment#quick-setup-with-offckb"}>OffCKB</Link></div>
    ],
}
const DOBOVERVIEW: TutorialHeaderProps = 
{
    time: "5 - 10 min",
    topics: [
    { label: "DOB", link:'/docs/concepts/glossary#digital-object-dob' },
    { label: "NFT", link: '/docs/concepts/glossary#non-fungible-token' },
    { label: "Spore Protocol", link: 'https://spore.pro' },
    ],
    tools: [
        <div>An IDE/Editor that supports TypeScript</div>,
        <div>
            <Link href={"https://nodejs.org/en"} target="_blank" rel="noopener noreferrer">
                Node.js
            </Link>{' and '}
            <Link href={"https://yarnpkg.com/"} target="_blank" rel="noopener noreferrer">
                Yarn
            </Link>
        </div>,
        <div>CKB dev environment: <Link to={"/docs/getting-started/dev-environment#quick-setup-with-offckb"}>OffCKB</Link></div>
    ],
}
  
  
export {
    TRANSFEROVERVIEW,
    WRITEOVERVIEW,
    TOKENOVERVIEW,
    DOBOVERVIEW
};
  