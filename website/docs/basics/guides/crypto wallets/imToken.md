---
id: imtoken
title: imToken & imKey
---

import useBaseUrl from "@docusaurus/useBaseUrl";

## imToken

**imToken** is a mobile wallet that supports encrypted assets on multiple chains.

1. Download and install [imToken.](https://token.im)

2. Open imToken, click **Create Identity** and confirm **Terms of Service**.

3. Enter the identity name and the password to create an account. 

   <img src={useBaseUrl("img/wallet/imtoken_01.png")} width="30%"/>
   
4. Click **Confirm** to add the default coins (ETH, BTC, and ATOM) or choose other coins, such as CKB.

   <img src={useBaseUrl("img/wallet/imtoken_02.png")} width="30%"/> 

5. Click **Backup Wallet** under **Manage your identity wallet** to back up the mnemonic phrase. 

   **Note**: Never give the phrase away; otherwise, your coins will be at risk. 

   The mnemonic phrase consists of 12 random words. Write them down in a safe place by order. These mnemonic words are required when restoring the wallet. Once the words have been written down, select **Confirmed Backup**.

6. Confirm the phrase has been well noted. Choose the word in the correct order, and click **Next**. Now the wallet has been successfully configured.

### Transfer CKB

To transfer CKB:

1. Click **CKB** to enter the CKB Wallet. 

2. Click the CKB balance that is visible under the Assets section. 

3. Click **Send** to transfer CKB. 

   <img src={useBaseUrl("img/wallet/imtoken_03.jpeg")} width="30%"/>

4. Fill in the address of the recipient and the desired transfer amount.

   <img src={useBaseUrl("img/wallet/imtoken_04.jpg")} width="30%"/>

5. Enter the wallet password, then the payment details will be shown.

   <img src={useBaseUrl("img/wallet/imtoken_05.jpg")} width="30%"/>

6. Once the payment is confirmed, the transaction will be broadcast to the network. Click on **Query Details** to see the on-chain confirmation status of the transaction. The on-chain information can be found on the [Nervos Explorer](https://explorer.nervos.org/).

   <img src={useBaseUrl("img/wallet/imtoken_06.jpg")} width="30%"/>

7. It takes 24 blocks for a transaction to be confirmed.

   <img src={useBaseUrl("img/wallet/imtoken_07.jpg")} width="30%"/>

### Receive CKB

To receive CKB:

1. Click **CKB** to enter the CKB Wallet.

2. Click the CKB balance that is visible under the **Assets** section.

3. Click **Receive**.

4. The QR code and wallet address will appear on the **Receive** page. If both parties are using imToken, simply show the QR code to the sender to receive payment.

   <img src={useBaseUrl("img/wallet/imtoken_08.JPG")} width="30%"/>

## A Word to Note

As the unique Cell model of CKB, there are several things to be aware of for CKB transfers. CKB has a **minimum** transfer amount of **61** CKBs, which means that the transfer amount **cannot be less than** 61 CKBs **excluding** the fee or miner fee.

There is no problem transferring all CKBs from the account. In the case of a partial transfer of CKB, if the account balance is less than 61 CKBs, it is impossible to make any future transfers. If the balance is equal to 61, transfers will also be impossible. For an account balance less than 61, the wallet will indicate that the transfer does not meet the required amount or will directly report an error when transferring. Due to the minimum transfer amount requirement, ensure that the account balance is at least 62 CKBs so that the full amount can be transferred the next time. 

## imKey

**imKey** is a hardware wallet, or cold wallet. The imKey is used to protect privkeys and other confidential data of the user. imKey is integrated with the CC EAL 6+ security chip, fully compatible with all imToken 2.0 supported digital assets such as BTC, ETH, COSMOS and EROS. For more details and usage processes, see [imkey support](https://support.imkey.im/hc/en-us).

## Troubleshooting

Network connection issue is a common cause for data sync failure, such as the problem that withdrawn asset is unreceived in imToken.

Try the following process to solve the problem:

1. Upgrade imToken to the latest version.
2. Set up a VPN on the phone.
3. If it still doesn't work out, go to My Profile -> Settings -> Network Detection to check the network connection. Copy the detected information and send it to the imToken support team.

