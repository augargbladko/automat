$0.50/1M. $5M is 10Tn NUGS
Average of 1Bn per useful acct = 10k useful accts

TG Users: Figure out what data I can get
TG Users: Find lapsed users if possible
TG Users: Scrape Telegram to Supabase
Wallets: Generate wallets from seed phrase
Wallets: Store wallets with users

Email: get list of real emails (maybe old list)
Email: Store email list with users

Call one MongoDb function
Open the game web page via a mobile proxy
Navigate to a different game page via mobile proxy (harder?)

Call a Vercel endpoint via a mobile proxy
Call Telegram analytics via proxy
Call GA via proxy

Acquire Telegram channel users

If I want web pages to use supabase, I need to create an api route for the server, so Deno will work.

Mobile proxy: SOAX is $3.60/GB (pricy?) https://soax.com/proxies/mobile
Can use this effectively for

- GA direct calls
- Vercel API calls
- Can we make Telegram analytics calls?

TG Analytics takes launch parameters (which we can fake into window.location.hash)

const hash = window.location.hash.slice(1);
console.log(hash); // tgWebAppData=...&tgWebAppVersion=6.2&...

const params = new URLSearchParams(hash);
console.log(params.get('tgWebAppVersion')); // "6.2"

const lp = retrieveLaunchParams();
const initData = lp.initData;
const user = lp.initData?.user;

        this.userData = {
            id: user.id,
            is_premium: user.isPremium,
            first_name: user.firstName,
            is_bot: user.isBot,
            last_name: user.lastName,
            language_code: user.languageCode,
            photo_url: user.photoUrl,
            username: user.username,
        };
        this.webAppStartParam = initData.startParam;
        this.platform = lp.platform;

        startBatchingWithInterval() calls the init

So if we have a webpage that integrates this SDK, sets the hash, and then inits the SDK, we should get the right analytics event.
And we don't need wallet connection events, so this should work.

Then we can likely fire the right GA events from that same page?

Uses window.addEventListener to listen to the events

Get the wallet connect here:
import { SdkActionEvent , UserActionEvent } from "@tonconnect/ui";
Events.WALLET_CONNECT_STARTED
Events.WALLET_CONNECT_SUCCESS

# Needed $NUGS: 10Tn (10M million) ($5M at $0.5 per 1M)

Add 200k users with 50% confirmed is a total of ~0.6Tn $NUGS, or 6% of the total.
-- (300kM from friend bonus, and 300kM from the 20M bonus, where we don't get an exact divisor by 5)
-- Roughly 5% from referrals, which isn't a lot.
Then we have 10k useful accts that we're going to pull from, with a range of 500M to 1.5Bn
-- 10k \* 1Bn = 10Tn.
