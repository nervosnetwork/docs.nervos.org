import { CardProps } from "@site/src/components/Card";
import { WalletCardProps } from "@site/src/components/WalletCard";

const conceptCardContents: CardProps[] = [
    {
      title: 'Nervos Blockchain',
      description: 'A scalable, interoperable blockchain for diverse dApp development',
      href: './nervos-blockchain',
      type: 'concept',
    },
    {
      title: 'Cell Model',
      description: 'Flexible on-chain asset and data management structure',
      href: './cell-model',
      type: 'concept',
    },
    {
      title: 'CKB-VM',
      description: 'Adaptable virtual machine for secure smart contract execution',
      href: './ckb-vm',
      type: 'concept',
    },
    {
      title: 'Consensus',
      description: 'Secure algorithm ensuring network integrity',
      href: './consensus',
      type: 'concept',
    },
    {
      title: 'Tokenomics',
      description: 'Adaptive token utility and economic mechanisms',
      href: './economics',
      type: 'concept',
    },
    {
      title: 'Address and Wallet',
      description: 'Versatile address system and wallet integration',
      href: './cryptowallet',
      type: 'concept',
    },
  ];

  const walletCardContents: WalletCardProps[] = [
    {
      title: 'Neuron',
      href: 'https://neuron.magickbase.com/',
      description: 'Window, MacOS, Linux',
    },
    {
      title: 'JoyID',
      href: 'https://joy.id/',
      description: 'Web-based',
    },
    {
      title: 'Portal Wallet',
      href: 'https://ckb.pw/#/',
      description: 'Web-based',
    },
    {
      title: 'imToken',
      href: 'https://token.im/ckb-wallet',
      description: 'Android, IOS',
    },
    {
      title: 'CKBull',
      href: 'https://ckbull.app/#download',
      description: 'Android, IOS',
    },
    {
      title: 'Opera Wallet',
      href: 'https://www.opera.com/download',
      description: 'Android',
    },
    {
      title: 'SafePal',
      href: 'https://blog.safepal.com/ckb/',
      description: 'Android, IOS, Hardware',
    },
    {
      title: 'Ledger',
      href: 'https://www.ledger.com/',
      description: 'Hardware',
    },
    {
      title: 'OneKey',
      href: 'https://onekey.so/',
      description: 'Hardware',
    },
  ];

  export { conceptCardContents, walletCardContents };