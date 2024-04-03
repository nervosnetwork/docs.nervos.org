---
id: tx-confirmation
title: The Back-of-Envelope Calculation of the Transaction Confirmation Number
---

Think of the chain quality attack as a gambler's ruin problem. The attacker has an infinite number of coins, but the honest miners have $\sigma$, which is the transaction confirmation number. In each round, one player wins a coin, and the other loses a coin. The honest miner loses if there is no coin in his hands. The attacker never gives up—note that this assumption requires that the attacker controls less than a third of the total mining power.

Now analysis of the gambler's ruin tells us the probability that the attacker wins the game is

$$
{\rm P(attacker\ wins)}=(\frac{p}{1-p})^\sigma,
$$

where $p$ is the probability that the attacker wins a coin. If we consider the attacker as a selfish miner with perfect network propagation advantage, we have

$$
p=\frac{\alpha+o}{1-\alpha-o} ,
$$

where $\alpha$ is the attacker's mining power share, $o$ is the proportion of orphaned blocks among all the blocks. See [this paper](https://eprint.iacr.org/2014/765.pdf) for the rationale behind the above equation. Note that this orphan rate definition is slightly different from the orphan rate in the NC-Max paper. Now we have

$$
{\rm P(attacker\ wins)}=(\frac{\alpha+o}{1-2\alpha-2o})^\sigma
$$

If we assume $o=0$ and $\sigma=6$ in Bitcoin, $\alpha=0.25$ , to get the same probability that the attacker wins the game, we need to have

$$
(\frac{0.25}{0.5})^6=(\frac{0.25+o}{0.5-2o})^\sigma ,
$$

so

$$
\sigma=\log_{\frac{0.25+o}{0.5-2o}}0.015625 .
$$

In Nervos CKB, when $o=5\%$, $\sigma=14.4$; when $o=2.5\%$, $\sigma=8.4$.

If we assume, similar to Bitcoin, $o=0$, $\sigma=6$, and $\alpha=0.3$, to achieve the same level of security in Nervos CKB, when $o=2.5\%$,  we have $\sigma=23.29$.

If we assume, similar to Ethereum, $o=6\%$, $\sigma=12$, and $\alpha=0.25$, to achieve the same level of security in Nervos CKB, when $o=0.025\%$, we have $\sigma=4.96$.

In reality, $o$ can be estimated as $0=u{200}/(200+u{200})$, where $u_{200}$ is the number of uncle blocks embedded in the last 200 main chain blocks. By definition $\sigma$ cannot be smaller than 6; when $\sigma>30$, use 30 as an upper bound.
