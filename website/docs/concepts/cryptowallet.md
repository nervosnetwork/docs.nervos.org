---
id: cryptowallet
title: Address and Wallet
sidebar_position: 6
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";
import WalletCard from '@components/WalletCard';
import CardLayout from '@components/CardLayout';
import { walletCardContents } from './CardContents';

## CKB Address

Nervos CKB adheres to either the [Bitcoin bech32 address format (BIP-173)](https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki) or [Bitcoin bech32m address format (BIP-350)](https://github.com/sipa/bips/blob/bip-bech32m/bip-0350.mediawiki) rules for generating addresses. It currently supports a new full address format, exemplified by the following:

`ckb1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqdnnw7qkdnnclfkg59uzn8umtfd2kwxceqxwquc4`

The address formats below have been **deprecated**:

- Short address example:

`ckb1qyq5lv479ewscx3ms620sv34pgeuz6zagaaqklhtgg`

- Full address example:

`ckb1q3w9q60tppt7l3j7r09qcp7lxnp3vcanvgha8pmvsa3jplykxn32snajhch96rq68wrff7pjx59r8stgt4rh5g96ahs`

We encourage the adoption of the new full address format. Below are tools for address generation and transformation, offering options for generating new addresses and converting deprecated ones, and vice versa. 

- [CKB.tools/address](https://ckb.tools/)
- [CKB Lumos](https://lumos-website.vercel.app/#2-generate-a-wallet-account)
- [ckb-address-transformer](https://codesandbox.io/s/ckb-address-transformer-524gi)

For more information, refer to [RFC0021: CKB Address Format](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md).

---

## Wallets

Crypto wallets store private keys to access cryptos. They come in two types: hot wallets (online) and cold wallets (offline). Hot wallets, such as web-based, desktop, and mobile wallets, offer convenience but pose higher risk. Cold wallets, including paper and hardware wallets, provide enhanced security by keeping keys offline.

When it comes to storing and securing CKB assets, users have various options, including hot and cold wallets. While storing assets on exchanges is common, additional security can be achieved with dedicated wallets. 

These wallets listed below offer custody and security services tailored to CKB. For more information, refer to the respective guides for each wallet.

<CardLayout colNum={3}> 
{walletCardContents.map(({ index, title, href, description }) => (
    <WalletCard
      key={index}
      title={title}
      href={href}
      description={description}
    />
  ))}
</CardLayout>
---

## Requirements for CKB Transfers

To initiate a transfer, you need at least one cell. Each cell comprises the essential data fields: `capacity`, `lock`, `args`, and `hash_type`, with storage sizes as follows:
- `capacity`: 8 bytes
- `lock`: 32 bytes
- `args`: 20 bytes
- `hash_type`: 1 byte

Thus, a single cell necessitates a minimum storage of 61 bytes, equivalent to 61 CKBytes (CKB). Hence, **every transfer mandates a minimum of 61 CKBs**.
