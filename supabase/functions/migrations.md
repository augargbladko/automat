For migrations, we need the following data tables:

1. All the TON addresses we have, and their parent levels (maybe 4 levels of parenting?)
   - these are programatically created, so we don't need to store them (but it might be easier)?
2. All the manufactured user information we have:
   - email
   - username
   - profile photo
   - telegram Id
   - linked TON address
3. The list of created accounts, and how
   - user
   - activity data (how much, when)
   - validation data (email, confirmed, wallet)
   - parent telegramId
4. Telegram data for everyone we've scraped

5. Create base accounts that we can then use

We need cron jobs for the following functions:

1. create new users

   - check user count vs created user count
   - create N new users based on that
   - include create reference
   - create the telegramInitData data
   - use a proxy mobile service to do this via the normal api call
   - launch the clicker page via a proxy to generate some real activity from the new user

2. run individual users

   - play slots games
   - maybe complete quests?
   - fire google analytics

3. manually update users via mongoDb

   - nugs
   - activity
   - level & payment amount (if we store that directly)

4. scrape telegram user data
   - get real user data from public channels to build out our real users
