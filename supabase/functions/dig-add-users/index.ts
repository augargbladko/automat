// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { delay, denoServe, handleCORS } from "../utils/index.ts"
import { createUsers } from "./createUsers.ts"

const isAddUsersDisabled = false

// this cron runs every 10 minutes.
denoServe(
  handleCORS(async () => {
    // we have 400s to play with.
    // should be able to do the whole function in under 100s, so 300 for delay.
    const delayAmount = 1000 * Math.floor(Math.random() * 200)
    console.log(`Dig add users called; delaying for ${delayAmount}ms`)
    await delay(delayAmount)
    console.log("Starting dig add users process")

    if (isAddUsersDisabled) {
      console.error("Add users is currently disabled.")
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      })
    }
    await createUsers()

    // ensure the one-time GA stuff gets run
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  })
)

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/dig-add-users' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"channel":"bibleverses" }'

*/

/* To invoke from another Supabase Function:

    const supabase = await connectToSupabase(req)
    const response = await supabase.functions.invoke('dig-add-users')

*/
