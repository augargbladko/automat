// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { denoServe } from "../deno/deno.ts"
import { handleCORS } from "../utils/index.ts"
import { fixEmails } from "./fixEmails.ts"

const isFixDisabled = false

denoServe(
  handleCORS(async (req: Request) => {
    try {
      if (isFixDisabled) {
        console.log("Dig upgrade users is currently disabled.")
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        })
      }

      // next fix: email addresses.
      await fixEmails()

      // fix login dates if needed
      //// await fixLoginDates()
      console.log("Dig upgrade users completed successfully.")
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
