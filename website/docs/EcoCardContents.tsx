import { EcoCardProps } from "@site/src/components/EcoCard";

const ecoCardContents: EcoCardProps[] = [
    {
        title: 'CKB Address',
        description: 'Convert and decode CKB addresses to view the attributes',
        href: 'https://ckb.tools/address',
        type: 'address',
        links: [
        { label: 'Website', href: 'https://ckb.tools/address' },
        { label: 'Github', href: 'https://github.com/jordanmack/ckb-tools' },
        ],
    },
    {
        title: 'Nervos Pudge Faucet',
        description: 'Claim free Testnet CKBytes to use while developing and testing',
        href: 'https://faucet.nervos.org/',
        type: 'faucet',
        links: [
        { label: 'Website', href: 'https://faucet.nervos.org/' },
        { label: 'Github', href: 'https://github.com/Magickbase/ckb-testnet-faucet' },
        ],
    },
    {
        title: 'CKB Explorer',
        description: 'Explore addresses, tokens, blocks, hashrate, Nervos DAO info and all other activities',
        href: 'https://explorer.nervos.org/',
        type: 'explorer',
        links: [
        { label: 'Website', href: 'https://explorer.nervos.org/' },
        { label: 'Github', href: 'https://github.com/nervosnetwork/ckb-explorer' },
        ],
    },
    {
        title: 'Neuron Wallet',
        description: 'A CKB wallet that holds your keys and can create & broadcast your transactions',
        href: 'https://github.com/nervosnetwork/neuron/releases/tag/v0.112.0',
        type: 'neuron',
        links: [
        { label: 'Download', href: 'https://github.com/nervosnetwork/neuron/releases/tag/v0.112.0' },
        ],
    },
];

export default ecoCardContents;
