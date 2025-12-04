// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { denoServe, handleCORS } from "../utils/index.ts"

denoServe(
  handleCORS(async (req: Request) => {
    console.log("Dig spoof GA called")

    // or we just fake this, and run each user every ~6 hours? We know their spins etc, and we can just update their db data directly.
    // 24k users, 360 runs/6h. Run 100/h, and this works easily on a single cron job.

    // 1. pull the users with the lowest "next_run" time below now
    // 2. Update their "next_run" time to now + 6h; update their current nugs, ore, spins, #conversions, etc.
    // 3. Calculate their points & ore increases from 6h of spins
    // 4. Do a group update of mongo to adjust their data (new slotsPlayStates, increment points & ore)
    // 5. Check for one Ore>NUGS conversions that can now be done (based on thresholds).
    // 6. For each of these, run the conversion via the dig it api

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  })
)

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/dig-spend-ton' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"channel":"bibleverses" }'

*/

/* To invoke from another Supabase Function:

    const supabase = await connectToSupabase(req)
    const response = await supabase.functions.invoke('dig-spend-ton')

*/
