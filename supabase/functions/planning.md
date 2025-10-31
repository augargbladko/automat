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
