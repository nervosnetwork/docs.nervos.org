---
id: cryptowallet
title: Crypto Wallet
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

## What is a Crypto Wallet?

A crypto wallet is a software program or physical device that keeps your private keys and gives you access to your cryptocurrencies. Simply put, a crypto wallet is a digital wallet that allows users to store and manage their cryptocurrencies.

A crypto wallet consists of a collection of key pairs. Each key pair consists of a private key and a public key corresponding to an address. The public key is similar to a bank account number and the private key is similar to the secret PIN that provides control over the account. 
The public key is generated from the private key by a one-way cryptographic function. The wallet address is generated from the public key by a one-way cryptographic hash function. The wallet address is human-readable and is used for sending and receiving cryptocurrencies. The keys and addresses establish the ownership of cryptocurrencies. 

## Types of Crypto Wallets

There are two main categories of crypto wallets, hot and cold wallets, which are defined by the internet connectivity. Hot wallets are internet-connected, less secure, and pose more risk, but are user-friendly. Cold wallets, on the other hand, are stored offline, do not require an internet connection, with higher security and lower risk.

### Hot Wallets

Hot wallets are basically internet-connected wallets that offer a higher level of user-friendliness. Hot wallets are easy to set up and have fast access to assets.

The three main types of hot wallets are:

- **Web-based Wallets**

  Web-based wallets are the prominent crypto wallets in the hot wallet category. One can access a web wallet through a web browser without downloading any specific software or application. Web wallets, such as MetaMask, work as browser extensions allowing users to access cryptocurrency assets from anywhere by simply having a password, a device, and a web browser, enabling users to easily interact with dApps (decentralized applications) and DeFi (decentralized finance) protocols.

- **Desktop Wallets**

  Desktop Wallet requires the user to download an application onto the desktop or laptop. The application generates a data file that holds the user's privkeys. The user also needs to create a PIN to access these keys. Desktop wallets, such as the Electrum wallet, can be used on a desktop or laptop computer.

- **Mobile Wallets**

  Mobile wallets are also one of the crucial cryptocurrency wallet categories in hot wallets. Functioning similarly to desktop wallets, users must install a mobile application on their phone to serve as a wallet. Mobile wallets bring better flexibility for exchanging funds, but there are also some security risks. Mobile wallets, such as the [Blockchain.com](http://blockchain.com/) wallet, allow users to store cryptocurrencies, send/receive transactions, and "scan" the privkey of an existing wallet into the app by scanning a QR code.

### Cold Wallets

**Cold wallets** are types of crypto wallets used for cold storage. These wallets store the cryptos in an offline mode and offer better security. Cold wallets are always a secure option compared to other wallets, as these act as a vault for daily transactions.

There are two main types of cold wallets, paper wallets and hardware wallets:

- **Paper Wallets**

  Paper wallet is nothing but a physical piece of paper. This paper must contain all the data a user needs to access the cryptocurrency.

- **Hardware Wallets**

  Hardware wallets store private keys on a physical device in an offline environment. It can be connected to a computer or other device effortlessly by using a USB drive. When the device is connected to the internet, the private key remains on the device. The device will request transaction details and provide verification for the data to complete the transaction. The transaction details are sent to the network where the transaction is logged. Trezor and Ledger are among the popular hardware wallets available today.

## Benefits of Using Crypto Wallets

- Simplicity and ease of use. It’s just like any other software or wallet that you use for your day-to-day transactions.

- Highly secure. A highly secure sign-in procedure is usually implemented, requiring an encrypted login details ID to be entered. This can assist to guarantee that no one else can access the account unless an explicit permission is given.

- Allows instant transactions across geographies. And these are barrierless, without intermediaries.

- Low transaction fees. The cost of transferring funds is much lower than with traditional banks.

- Access to multiple cryptocurrencies. One of the benefits of utilizing a well-known cryptocurrency wallet is having many cryptocurrency alternatives to choose from. It facilitates the ease of the crypto conversion whilst reducing risk and increasing the total profit potential.

## CKB Wallets

There are many options for storing and securing CKB assets, either in hot or cold wallets. Given that CKB is available on several exchanges, users can choose to store assets on any exchange. But some alternatives may deserve attention as well for additional security.

Wallets that provide custody and security services to CKB include:

<img src={useBaseUrl("img/wallet/wallet_01.png")}/>

For more information, see the guides of <Link to={useBaseUrl('/docs/basics/guides/crypto wallets/neuron')}>Neuron Wallet</Link>, <Link to={useBaseUrl('/docs/basics/guides/crypto wallets/imtoken')}>imToken & imKey</Link>, <Link to={useBaseUrl('/docs/basics/guides/crypto wallets/safepal')}>SafePal</Link>, <Link to={useBaseUrl('/docs/basics/guides/crypto wallets/portalwallet')}>Portal Wallet</Link>, <Link to={useBaseUrl('/docs/basics/guides/crypto wallets/bitpie')}>Bitpie</Link>.

## CKB Addresses

Nervos CKB follows [Bitcoin bech32 address format (BIP-173)](https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki) or [Bitcoin bech32m address format (BIP-350)](https://github.com/sipa/bips/blob/bip-bech32m/bip-0350.mediawiki) rules to generate addresses.

The following two address formats have been deprecated:

- Short address

  Example: `ckb1qyq5lv479ewscx3ms620sv34pgeuz6zagaaqklhtgg`

- Full address

  Example: `ckb1q3w9q60tppt7l3j7r09qcp7lxnp3vcanvgha8pmvsa3jplykxn32snajhch96rq68wrff7pjx59r8stgt4rh5g96ahs`

A new full address format is supported now. Both the community and partners in the Nervos ecosystem are encouraged to migrate to the new full address format.

Example: `ckb1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqdnnw7qkdnnclfkg59uzn8umtfd2kwxceqxwquc4`

For more information, see [RFC: CKB Address Format](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md). 

Here are three solutions for CKB address generation and transformation:

- [CKB.tools](https://ckb.tools/): allow the parsing or generating of deprecated addresses for applications that do not yet support the new full address format, such as the faucet.
- Lumos Page ([CKB Lumos](https://main--boring-euler-1b5fa4.netlify.app/tools/)): can be used to generate new full addresses.
- [ckb-address-transformer](https://codesandbox.io/s/ckb-address-transformer-524gi): can be used to convert a deprecated address into a new full address and vice versa.

## Minimum Requirements of a CKB Transfer

The minimum unit of a transfer is one CKB cell, and the basic data structure of a cell consists of `capacity`, `lock`, `args` and `hash_type`.

- `capacity` requires 8 bytes of storage space.
- `lock` requires 32 bytes of storage space.
- `args` requires 20 bytes of storage space. 
- `hash_type` requires 1 byte of storage space.

The total minimum storage space of a cell is 61 bytes. 1 byte equals 1 CKByte (CKB), so one cell requires at least 61 CKBs. That is, **each transfer requires at least 61 CKBs**.

## References

- [Let's Talk about Storing NFT's on the Neuron Wallet](https://everythingnervos.substack.com/p/lets-talk-about-storing-nfts-on-the)
- [How do I Configure my Opera Wallet and Import into MetaMask?](https://everythingnervos.substack.com/p/how-do-i-configure-my-opera-wallet)
- [How do I Upgrade the Firmware of my SafePal Hardware Wallet?](https://everythingnervos.substack.com/p/how-do-i-upgrade-the-firmware-of)
- [How do I Run the Neuron Wallet with a Dedicated Full Node?](https://everythingnervos.substack.com/p/how-do-i-run-the-neuron-wallet-with)
- [How do I use the Math App Wallet to Store Nervos CKB?](https://everythingnervos.substack.com/p/how-do-i-use-the-math-app-wallet)
- [How do I Connect the SafePal Hardware Wallet to my SafePal Account?](https://everythingnervos.substack.com/p/how-do-i-connect-the-safepal-hardware)
- [How do I Create a SafePal (Hot) Wallet and Store Nervos CKB?](https://everythingnervos.substack.com/p/how-do-i-create-a-safepal-hot-wallet)
- [How Do I Secure my Nervos CKB with a Ledger Nano X Hardware Wallet?](https://everythingnervos.substack.com/p/how-do-i-secure-my-nervos-ckb-with-8df)
