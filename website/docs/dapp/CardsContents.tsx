import { CardProps } from "@site/src/components/Card";

// Tutorial Cards
const tutorialCardContents: CardProps[] = [
    {
        title: 'Create Custom Token',
        description: 'Create user-defined tokens using xUDT',
        href: './DApp/create-custom-token',
        type: 'tutorial',
    },
    {
        title: 'Transfer Custom Token',
        description: 'Transfer user-defined tokens using xUDT',
        href: './DApp/transfer-custom-token',
        type: 'tutorial',
    },
    {
        title: 'Create an NFT',
        description: 'Create NFT using Spore Protocol',
        href: './DApp/create-nft',
        type: 'tutorial',
    },
];

const toolCardContents: CardProps[] = [
    {
        title: 'Lumos',
        description: 'A JavaScript/TypeScript framework to simplify the development of dApp',
        href: 'https://github.com/ckb-js/lumos',
        type: 'tool',
        links: [
        { label: 'Github', href: 'https://github.com/ckb-js/lumos' },
        { label: 'Docs', href: 'https://lumos-website.vercel.app/' },
        ],
    },
    {
        title: 'CKB SDKs',
        description: 'Necessary functions available in various programming languages',
        href: 'https://github.com/nervosnetwork/ckb-sdk-rust',
        type: 'tool',
        links: [
        { label: 'Rust', href: 'https://github.com/nervosnetwork/ckb-sdk-rust' },
        { label: 'Go', href: 'https://github.com/nervosnetwork/ckb-sdk-go' },
        { label: 'Java', href: 'https://github.com/nervosnetwork/ckb-sdk-java' },
        ],
    },
    {
        title: 'CKB-CLI',
        description: 'The command-line tool for direct interaction with the Nervos network',
        href: 'https://github.com/nervosnetwork/ckb-cli',
        type: 'tool',
        links: [
        { label: 'Github', href: 'https://github.com/nervosnetwork/ckb-cli' },
        { label: 'Wiki', href: 'https://github.com/nervosnetwork/ckb-cli/wiki/Tutorials' },
        ],
    },
    {
        title: 'OffCKB',
        description: 'CKB local development network for your first try',
        href: 'https://github.com/RetricSu/offckb/tree/7d87d018be7626e1672a039b52f8bf4db9dd4eae',
        type: 'tool',
        links: [
        { label: 'Github', href: 'https://github.com/RetricSu/offckb/tree/7d87d018be7626e1672a039b52f8bf4db9dd4eae' },
        ],
    },
    {
        title: 'CKB Address',
        description: 'Convert and decode CKB addresses and generate private keys for development',
        href: 'https://ckb.tools/address',
        type: 'tool',
        links: [
        { label: 'Website', href: 'https://ckb.tools/address' },
        { label: 'Github', href: 'https://github.com/jordanmack/ckb-tools' },
        ],
    },

];
const MORETOOLCARDTITLE = 'More Dev Tools →';
const MORETOOLCARDHREF= './DApp/devtool';

export { tutorialCardContents, toolCardContents, MORETOOLCARDTITLE, MORETOOLCARDHREF };
