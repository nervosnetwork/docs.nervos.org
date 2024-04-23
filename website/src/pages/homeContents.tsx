export interface CardLinks {
    label: string;
    link: string;
}
export interface DevToolProps {
    title: string;
    href: string;
    category: string;
}
export interface HomeCardProps {
    title: string;
    links: CardLinks[];
    icon: string;
}

const homeCardContents: HomeCardProps[] = [
    {
        title: 'Getting Started',
        links: [
            { label: "Dev Environment", link: "/docs/getting-started/dev-environment"},
            { label: "DApp Tutorials", link: "/docs/getting-started/transfer-ckb"},
            { label: "Scripts Tutorials", link: "/docs/Script/minimal-script"},
        ],
        icon: 'rocket',
    },
    {
        title: 'Run a Node',
        links: [
            { label: "Run a Mainnet Node", link: "/docs/node/run-mainnet-node"},
            { label: "Run a Testnet Node", link: "/docs/node/run-testnet-node"},
            { label: "Run a Public RPC Node", link: "/docs/node/run-public-rpc-node"},
        ],
        icon: 'node',
    },
    {
        title: 'Concepts',
        links: [
            { label: "Nervos Blockchain", link: "/docs/concepts/nervos-blockchain"},
            { label: "Cell Model", link: "/docs/concepts/cell-model"},
            { label: "Tokenomics", link: "/docs/concepts/economics"},
        ],
        icon: 'concept',
    },
];

const devToolSectionContents: DevToolProps[] = [
    { title: 'Lumos', href: 'https://github.com/ckb-js/lumos', category: 'Development & Deployment' },
    { title: 'CKB SDKs', href: 'https://github.com/nervosnetwork/ckb-sdk-rust', category: 'Development & Deployment' },
    { title: 'CKB-CLI', href: 'https://github.com/nervosnetwork/ckb-cli', category: 'Development & Deployment' },
    { title: 'OffCKB', href: 'https://github.com/RetricSu/offckb/tree/7d87d018be7626e1672a039b52f8bf4db9dd4eae', category: 'Development & Deployment' },
    { title: 'CKB Debugger', href: 'https://github.com/nervosnetwork/ckb-standalone-debugger', category: 'Utilities & Testing' },
    { title: 'CKB Address', href: 'https://ckb.tools/address', category: 'Utilities & Testing' },
    { title: 'Nervos Pudge Faucet', href: 'https://faucet.nervos.org/', category: 'Utilities & Testing' },
];

const contactUsContents: CardLinks[]= [
    { label: 'github', link: 'https://github.com/nervosnetwork'},
    { label: 'discord', link: 'https://discord.gg/nervosnetwork'},
    { label: 'reddit', link: 'https://www.reddit.com/r/NervosNetwork/'},
    { label: 'nervostalk', link: 'https://talk.nervos.org/'},
    { label: 'telegram', link: 'https://t.me/nervosnetwork'},
    { label: 'twitter', link: 'https://twitter.com/nervosnetwork'},
    { label: 'medium', link: 'https://medium.com/nervosnetwork'},
    { label: 'youtube', link: 'https://www.youtube.com/channel/UCONuJGdMzUY0Y6jrPBOzH7A'},
]

// Just to include a default export
const HomeContentsPage: React.FC = () => {
    return null;
};
export default HomeContentsPage;

export { homeCardContents, devToolSectionContents, contactUsContents } ;
