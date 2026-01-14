# A

Two parts to the project

# Part A

Make money by farming lots of $NUGS

# Part B

Turn $NUGS across 24k accounts into $

- Do as much as possible to make this hard to trace

# CEX to use

Use a variety of no-KYC exchanges. If we're aiming for $5M, then 50 accounts is
$100k. We don't let tokens linger, and we're moving $ in ~$10k amounts for
safety. We swap to stablecoins where we can.

- a: https://www.mexc.com/ - 10 BTC/day (!!!) - UK allowed
- b: https://primexbt.com/ - $20k withdrawal/day - UK allowed
- c: coinex - $10k/day, $50k/30 days - UK allowed
- d: xt.com - $200k/day
- e: https://www.bydfi.com/ - $100k/day
- f: https://blofin.com/ - $20k/day - UK allowed
- g: https://kcex.com - allegedly $100k/day - UK allowed
- NOT bybit, bitunix (kyc to deposit...) We can use one centralized no-kyc
  account to funnel the TON to the right location. We need ~15 decent identities
  to make this work (hoping to run that many through the 7 exchanges here, which
  would be 100 total)

For each email address:

- Use a unique VPN location

Fund each of the 12,483 accounts for ~0.1TON (should be enough, but requires
about $5k in TON). Doing it via a tree of TON accounts is a little risky.

The best way is probably to fund 50 base accounts manually, and have each one
branch out to 5-9 others

- 6 jumps: 50 > 300 > 1800 > 10800
- (this requires $5k in TON if we're funding at 0.1 TON)
- then reverse the branches back to consolidate the $
- Need to fund from a no-KYC exchange.
- Two paths for conversion.
- If there's a dex with good volume:
- 1. Convert the $NUGS to $ (a TON-based stablecoin) as quickly as possible.
- 2. Keep the $ in each individual account for a while
- 3. This needs a LOT more TON, and the funding sources have the same paths
- If there's only a CEX
- 1. Roll up the funds in the reverse of the funding flow
- 2. Roll each top-level acct into the CEX, and swap out
- 3. If there's a no-kyc exchange, can I create a LOT of accounts, and automate that?
- 4. 50 (no-kyc) exchange accounts, each funded with $100-150 swapped into TON.
- Only works if there's a DEX with good volume available.

# Part C

Create activity on the game to make investors happy and unlock more $

- Create faked telegramInitData to allow us to authenticate an account with the
  bot
- Create users via the API (cron job)
- Have users take actions via the API (slots, quests)
- Create fake google analytics data (hard-ish)
- Create fake telegram analytics data (easy-ish)
- Can't have any of these users be spenders, which is a little rough.
- Can't fake telegram channel members (but can pay for these)
