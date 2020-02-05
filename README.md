# Nomidot (tentative name)

Nominating on Polkadot/Kusama can be complicated. Nomidot is a dashboard for those with DOTs or KSM looking to "set it and forget it."

We do not hold any keys, however, so it is still the user's responsibility to keep safe custody of keys.

## Get Started

Run the following commands:

```bash
git clone https://github.com/paritytech/Nomidot
cd Nomidot
yarn install
yarn start
```

The app will be running on http://localhost:8000.

## Potential Difficulties with Nominating

1. Creating, and understanding the role of stash and controller keys.
2. Finding the right validators to nominate to maximize rewards and minimize slashes.
3. Mitigating the risk of getting caught in long unbonding periods.

### 1. Creating, and understanding the role of stash and controller keys.

For the casual nominator, this distinction can be intimidating enough to discourage their participation in staking. As the distinction is only with regard to the intended use of the keys and not with the cryptography underlying the keys themselves, incorrect use can expose the user to unnecessary risks.

This is an early point of friction for the uninitiated. To mitigate any confusion we have a guided tutorial to get a user from having no keys at all to bonding the two together.

We will in the near future have guided tutorials on how to lean on the more powerful key management system in BIP39 key derivations à la Parity Signer.

### 2. Finding the right validators to nominate to maximize rewards and minimize slashes.

As with all blockchains, it is difficult to query and analyze historical data. Nomidot runs an ETL script on Kusama in the background which gives us a Postgresql database to query interesting information for our users. All information can be validated directly from a full node.

The first version will include:

- slashing history of a particular validator or set of validators
- rewards history of a particular validator or set of validators
- staker percentages over time (trends in staker allocations)

### 3. Mitigating the risk of getting caught in long unbonding periods.

A potential point of churn if expectations are not communicated clearly and early, is the period of illiquidity for stakers during unbonding periods (as well as bonded periods of course). While there are teams like Chorus One working on liquid staking methods (https://blog.chorus.one/announcing-the-liquid-staking-working-group/), at the moment there a are series of possible decisions that can lead users being entangled in a snare of long unbonding periods (during which they cannot access their funds).

Nomidot will take extra precautionary steps at the UI level to guide users away from potential pitfalls.

### Contributing

Please see the [Contributing Guidelines](./CONTRIBUTING.md)
