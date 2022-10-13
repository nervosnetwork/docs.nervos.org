---
id: mining-ckb
title: Mining CKB
---

CKB mining is a critical part of securing the Nervos network, which in turn is fundamental to maintaining a decentralized cryptocurrency.  Not only can CKB mining be an enjoyable learning experience, it can be profitable, and a valuable way to help grow and expand this democratizing industry which so many people around the world desperately need. 

What follows is both a guide on how to get started mining CKB.  We will include a discussion on how to choose the right equipment, the importance of choosing the right mining pools, and where to go for more information.  Whatever your interest might be in mining CKB, we want you to know that we depend on our miners daily, and are here to support you in that regard.

As you move through this guide, please note that some sections are meant to be brief, and links are included to elaborate concepts should you need them.  This guide is specific to mining CKB, but also general enough to provide value to any reader just looking to understand cryptocurrency mining in general.

### Step 1 - Create a Dedicated CKB Wallet
You will want a dedicated wallet to support your mining efforts in order to separate your mining earnings from any other cryptocurrency transactions you make in other wallets.  Ideally, a good CKB wallet would be one that is secure, decentralized, and easy to use with good support.  

At Nervos Network, we provide the [Neuron Wallet](https://docs.nervos.org/docs/basics/guides/crypto%20wallets/neuron/), which is also a full node (at the time of this writing) and keeps the network secure just by using it. Keep in mind that this wallet will require downloading the full Nervos blockchain, and could take up to 72 hours to sync with the Nervos network.  Another recommended wallet is the [CK Bull wallet](https://ckbull.app/).  This is a wallet you can operate from your mobile device, is easy to use, and has great support.

### Step 2 - Select Your Miner
There a few decisions to make when it comes to selecting a miner:

- Miner Type: On Nervos, mining hardware is all ASIC-based now. There are a couple main
producers of hardware, and each model has its own interface, so you'll need to sort through a few things in order to decide.  Obviously, higher cost should relate to higher hash power, and thus more block rewards.  Energy consumption would be another consideration to keep in mind.  [Here](https://www.asicminervalue.com/) is a website listing various miners, their profitability, and specifications.  At the time of this wriging, two popular brands are Bitmain and Goldshell.
  
- Miner characteristics: Miners generate noise, heat, and [consume energy](https://www.reddit.com/r/NervosNetwork/comments/nb2yzw/ckb_proof_of_work_energy_consumptions/).  These are all considerations you will want to consider. 
  
  All of these considerations and more are covered in details in the articles written [here](https://www.cryptowendyo.com/should-i-start-mining-cryptocurrency/) and [here](https://www.cryptowendyo.com/should-i-start-mining-cryptocurrency-part-2/).


### Step 3 - Make a List

Here is a brief list of items that you will need to have to get started:

Essentials -
- ASIC Miner (Ultimately GPUs aren't used any longer due to inefficiencies, you will be looking for an ASIC miner)
- Power Supply (You can save money here if you buy one supply for >1 miner)
- Ethernet Cables (Unless you are mining over wifi)
- Surge Protector
- Ethernet Switch 
- Rack System (For larger setups involving multiple miners)
  
Optional - 
- Power Cable (Some miners don't come with this, check with your manufacturer)
- Infrared Temperature Sensor (Used to detect overheat conditions in wiring)
- Ethernet Outlet Extender (In case you wish to turn your electrical outlet into a router "essentially" for hard to reach areas of the home)
- Video Camera (Used to surveil your setup while you are away)
- Fire Extinguisher

### Step 4 - Set up and Configure Your miner
This is actually easier than you think. Once you receive your miner (can sometimes take a couple weeks to ship, depending on country of origin) check the miner for damage.  Damage to components is quite possible during shipping, especially internationally. Prepare network cables and power supply, and make the appropriate connections.  Make sure you have a good internet connection, all cables, including the power supply are attached securely. Make sure you have some method of keeping your miner from overheating (use a fan, or position in a cool place in the home, etc).

Once you have everything in place, it is time to configure the software that will be used to mine. Each miner will have a different configuration required, but in general, you will (1) create a new account (2) acquire your IP address (3) connect your miner to the software, (4) update any firmware needed, and (5) make sure your miner is connected and operating as expected (see last step below on joining a pool).

### Step 5 - Join a Mining Pool
There are many considerations to think about when you begin your CKB mining journey.  One of the most important ones is should you join a mining pool, and if so, which one.

First, these days most miners join a pool, in order to pool their hash power to secure more block rewards.  These rewards are then distributed to the miners via various scheme, for a fee.  Your job as a miner is to figure out which pool works for you based on these fee structures, and how rewards get paid out.  Essentially, you are providing the pool a portion of their mining power, and thus should receive adequate, transparent rewards that secure the network in question, increase security and enhance decentralization.

Popular pools for instance, lead to more blocks produced, and thus faster payouts for miners.  However, the payouts are smaller since you represent a smaller slice of the total pool. Less popular pools will have slower payouts, but will be larger in size. In theory, total earnings between a large and small pool should be roughly similar in the long-term.

In that case, what other considerations are there?

- Transaction Fees: Fees hover roughly around 1-3%...Fees higher than this would be considered high.  [Here](https://medium.com/luxor/mining-pool-payment-methods-pps-vs-pplns-ac699f44149f) is an article describing the payout methods, and fees associated with mining.
- Transparency: The pool should have an active dashboard, so you can see the results of the collective mining effort.
- Security: The pool should have some history and a track record of successful payouts.
- Proximity: Closer to you is better.
- Decentralized: The pool should not be so large that the network is either close to, or at risk for a 51% attack.  The isue is that the attackers would be able to prevent new transactions from gaining confirmations, which would allow them to halt payments between some or all users. Also, they would be able to reverse transactions that were completed while they were in control. Reversing transactions could allow them to double-spend coins, one of the main issues proof-of-work is trying to prevent.

[Here](https://99bitcoins.com/51-percent-attack/) is a great article on what a 51% attack is. It is very important to [choose](https://www.investopedia.com/tech/how-choose-cryptocurrency-mining-pool/) a pool that is NOT consuming too much of the hash rate on a blockchain. 

It cannot be stressed enough how important it is to choose mining pools that are not consuming too much of the overall hashrate.  We have seen blockchains like [Firo](https://decrypt.co/54751/firo-gets-hit-by-51-attack-300-blocks-rolled-back), and [Eth Classic](https://www.coindesk.com/markets/2020/08/29/ethereum-classic-hit-by-third-51-attack-in-a-month/) undergo security attacks, because too much of the hash rate was given to one entity.  

As a miner on the CKB network, it is truly our privilege and duty to protect the integrity of the network, and we do this by choosing pools that aren't edging anywhere close acquiring 51% or more of the total hashrate.

For ideas on mining pool options, you can find a few useful pools below:
- https://miningpoolstats.stream/nervos
- https://wheretomine.io/coins/nervos
- https://minerstat.com/coin/ckb/pools

For more information, please drop by our [Nervos Mining Discord](https://discord.com/channels/657799690070523914/671647273603694625)