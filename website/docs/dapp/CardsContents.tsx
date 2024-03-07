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

// TODO: fill out hrefs 
// Tool Cards
const toolCardContents: CardProps[] = [
    {
        title: 'CKB SDKs',
        description: 'Necessary functions available in various programming languages',
        href: './',
        type: 'tool',
        links: [
        { label: 'JavaScript', href: './' },
        { label: 'Ruby', href: './' },
        { label: 'Python', href: './' },
        ],
    },
    {
        title: 'Lumos',
        description: 'A JavaScript/TypeScript framework to simplify the development of dApp',
        href: './',
        type: 'tool',
        links: [
        { label: 'Github', href: './' },
        { label: 'Docs', href: './' },
        ],
    },
    {
        title: 'PW SDK',
        description: 'A simple and powerful SDK for building CKB dApps',
        href: './',
        type: 'tool',
        links: [
        { label: 'Github', href: './' },
        { label: 'Docs', href: './' },
        ],
    },
];

export { tutorialCardContents, toolCardContents };
