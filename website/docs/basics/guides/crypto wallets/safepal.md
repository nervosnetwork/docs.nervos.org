---
id: safepal
title: SafePal
---

import useBaseUrl from "@docusaurus/useBaseUrl";

## Download and Install

Download [SafePal](https://safepal.io/download) from iOS or Android App Store. It provides both software wallet and hardware wallet. 

<img src={useBaseUrl("img/wallet/safepal_01.png")} width="30%"/>

## Hardware Wallet

To order SafePal hardware wallet online, visit https://safepal.io/.

To use SafePal hardware wallet:

1. Use SafePal hardware wallet to scan the QRCode which will be displayed by tapping the **Next** button. 

   <img src={useBaseUrl("img/wallet/safepal_02.png")} width="30%"/>

2. Follow the instructions on the hardware wallet and finish pairing. 

## Software Wallet

### Set Up a SafePal Wallet

Here are two ways to set up a SafePal wallet:

- Create a new SafePal wallet.
- Import an existing wallet. 

#### Create a New SafePal Wallet

1. Tap **Create Wallet** to set the wallet's name and the mnemonic phrase that can be 12 or 24 mnemonic words. 
   <img src={useBaseUrl("img/wallet/safepal_03.png")} width="30%"/>

2. Click **Back up my phrase** immediately after having successfully created the wallet.

   <img src={useBaseUrl("img/wallet/safepal_04.png")} width="30%"/>

3. Follow the instructions and write the mnemonics in the given order on a piece of physical paper. Store it offline safely.

   To protect user data, SafePal disables screenshot for mnemonics setting. 

#### Import an Existing Wallet

SafePal provides four options to **Import wallet**. Choose a preferred one, follow the guidance and enter the corresponding information correctly.

<img src={useBaseUrl("img/wallet/safepal_05.png")} width="30%"/>

Once the wallet has been successfully imported, click the wallet icon in the top left to view the wallet in the **Wallet** list.

To add another existing wallet simply tap on the **+** icon.

### Add CKB to Asset List

SafePal lists 5 coins by default on the Asset page. 

To add CKB to Asset list:

1. Enter CKB in the **Search** bar.

   <img src={useBaseUrl("img/wallet/safepal_06.png")} width="30%"/>

2. Add **CKB (Nervos)** to the list.

   **Note**: The search results show such tokens as **CKB (Godwoken)**, **CKB(ERC20)** and **CKB(BEP20)**, all of which serve different purposes here. Do NOT add them to the asset list.

   <img src={useBaseUrl("img/wallet/safepal_07.png")} width="30%"/>

3. Now CKB (Nervos) is successfully added. It's time to create the first transaction. 

   <img src={useBaseUrl("img/wallet/safepal_08.png")} width="30%"/>

### Receive CKB

Two ways to receive money: 

- By text: Tap **Copy** to get the CKB address in the format of a series of letters and numbers, starting with "ckb". 

- By QRCode: Tap **Share** to get a QRCode image. 

  <img src={useBaseUrl("img/wallet/safepal_09.png")} width="30%"/>

Share either form of the address information with the sender. 
Once the transaction is completed and verified, the related transaction information will appear in the CKB transaction history. 

<img src={useBaseUrl("img/wallet/safepal_10.png")} width="30%"/>

### Send CKB

1. Tap **Send**, then fill in the address of the recipient and the desired transfer amount. Tap **Next**.

   <img src={useBaseUrl("img/wallet/safepal_11.png")} width="30%"/>

2. Recheck the information to make sure the information is correct. If so, tap **Send**.

   <img src={useBaseUrl("img/wallet/safepal_12.png")} width="30%"/>

   Once the payment is completed, the transaction **Status** turns to **Pending**. That means the transaction has been broadcast to the network for verification. 
   
3. Click on **More Details** to see the on-chain confirmation information of the transaction.

   <img src={useBaseUrl("img/wallet/safepal_13.png")} width="30%"/>

4. You will be redirected to [Nervos Explorer](https://explorer.nervos.org/) where the transaction details are displayed.

   <img src={useBaseUrl("img/wallet/safepal_14.png")} width="30%"/>

   Once the transaction is verified by the entire network, an overview will be available in the CKB transaction history.
