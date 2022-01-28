---
id: portalwallet
title: Portal Wallet
---

import useBaseUrl from "@docusaurus/useBaseUrl";

**Portal Wallet** is a web wallet that runs directly in a browser. It is a dApp wallet that allows users to receive and send Nervos CKBs with existing Ethereum addresses and wallets. 

Portal Wallet (PW) currently supports the following wallets: [MetaMask](https://metamask.io/), [imToken](https://token.im/), [Huobi Wallet](https://www.huobiwallet.com/en/), [BitKeep](https://bitkeep.org/), [Coinbase Wallet](https://wallet.coinbase.com/), [Opera](https://www.opera.com/), [ABC Wallet](https://abcwallet.com/), [Bitpie](https://bitpie.com/), [TokenPocket](https://www.tokenpocket.pro/), [AlphaWallet](https://alphawallet.com/).

The Portal wallet is a superb alternative to Neuron Wallet by allowing users to use on the mobile phone. In addition, it does not require manual sync with a Mainnet node and supports a variety of wallets. Using Portal Wallet is quite simple. The user needs to possess at least one cryptocurrency account and at least one cryptocurrency wallet in use. On the Portal Wallet, users can check the Ethereum address and CKB address, view the balance, and lock the CKB in the Nervos DAO.

**Note**: The wallet must have a minimum of **102** CKBs for a Nervos DAO deposit operation and **61** CKBs for a Nervos DAO withdrawal operation.


## Use PW With MetaMask

To use PW with MetaMask:

1. Open [ckb.pw](http://ckb.pw) in a browser that has installed the MetaMask wallet extension. Type the password to log in to the MetaMask.

  <img src={useBaseUrl("img/wallet/pw_01.png")} width="50%"/>

  <img src={useBaseUrl("img/wallet/pw_02.png")} width="30%"/>

2. A MetaMask connection request will automatically pop up. Choose the address desired for login.

   <img src={useBaseUrl("img/wallet/pw_03.png")} width="30%"/>

3. Sign the **Authorised Signature**, then click **Connect** to open the Portal Wallet in the browser.
  <img src={useBaseUrl("img/wallet/pw_04.png")} width="30%"/>

  <img src={useBaseUrl("img/wallet/pw_05.png")} width="40%"/>

## Receive Payments

To receive payments:

1. Choose CKB and click **Receive** on the home page.

   <img src={useBaseUrl("img/wallet/pw_06.png")} width="40%"/>

   <img src={useBaseUrl("img/wallet/pw_07.png")} width="40%"/>

2. Two addresses will appear, ETH *address* and CKB *address*.

   <img src={useBaseUrl("img/wallet/pw_08.png")} width="40%"/>

   <img src={useBaseUrl("img/wallet/pw_09.png")} width="38%"/>

   The address needs to be modified depending on where to receive payments:

   - To receive funds from **another Portal Wallet**, click **ETH address** on the left.
   - To transfer from **other wallets or exchanges** to Portal Wallet, click **CKB address** on the right.

Portal Wallet currently supports multi-chain addresses, users can transfer payments to each other using CKB addresses, Ether addresses, ENS, etc., in Portal Wallet. However, other wallets/exchanges are less supported at the moment, so it is necessary to align the receiving address with where the payment is to be made.

- *Ethereum address* is the current Ethereum address bundled at login that can be used to send and receive CKB assets directly in Portal Wallet.
- *CKB address*: since most exchanges and CKB wallets do not yet support the transfer of CKB full address, Portal Wallet can assist with transferring assets by transferring CKB to a *ckb address* for the first time using.

## Transfer CKB

**Note**: The wallet must have a minimum of **61** CKBs for a transfer operation.

1. Click **Send** to access the transfer page. 

   <img src={useBaseUrl("img/wallet/pw_10.png")} width="40%"/>

   - Currently supported transfer address formats are *Ethereum address*, *CKB address, and* *ENS domain address*.
   - To enter the address: manually input or copy & paste, QR code scanning, common contacts.

2. After entering the transfer address and transfer amount, Portal Wallet will automatically calculate the transfer fee. 
3. Then, click **Send and sign** to complete the transfer.

## Set Transfer Fees

Portal Wallet has a fee-setting function that allows users to customize the fee rate for transfers based on their personal preferences. With a higher fee rate, users will have priority to package transactions.

Transfer fee for CKB = transaction size * exchange rate

The minimum fee rate on CKB is 1000 Shannon/KB (1 Shannon = 10<sup>8</sup>  CKB).

## Add a Transfer Note

Portal Wallet supports notes on transfers to make it easier to keep track of each transfer. When initiating a transfer, users can add notes to check the transfer later on.
