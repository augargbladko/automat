// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { denoServe } from "../deno/deno.ts"
import { denoConnectToSupabase } from "../queries/database/supaFunc.ts"
import { handleCORS } from "../utils/index.ts"

const isTradeDisabled = true

denoServe(
  handleCORS(async (req: Request) => {
    try {
      if (isTradeDisabled) {
        console.log("Dig trade is currently disabled.")
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        })
      }

      const supabase = denoConnectToSupabase()

      // this is the catch-all for every one of our TON transaction actions.

      /*
        1. Provide initial funding to primary acct
            - 88 primary accounts, each with ~350 children
            - each child acct is 4-8 hops away from parent

        2. Move TON from primary account through children to the target
            - Keep a good stock of funded children accts (100)

        3. Target acct calls the withdraw function to get the $NUGS
            - Keep a decent-sixed stock of accts with NUGS (30)

        4. Target acct trades $NUGS for TON (or stablecoin?), and returns the TON to the parent account.
            - ONLY target accts deal in $NUGS.
            - Only trade if the price is at a decent level

        5. Continue up and down parents until the primary has all the TON

        6. Send TON from primary to exchange (maybe via conversion to USDT/USDC?)

      */

      /*
        If we want to balance this, we can create an arbitrage bot too
      */

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      })
    } catch (e) {
      console.error("Error in dig-spoof-ga function:", e)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  })
)

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/dig-upgrade-users' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"channel":"bibleverses" }'

*/

/* To invoke from another Supabase Function:

    const supabase = await connectToSupabase(req)
    const response = await supabase.functions.invoke('dig-upgrade-users')

*/
