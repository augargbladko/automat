// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { secureConnectToSupabase } from "../queries/database/index.ts";
import { Tables } from "../types/index.ts";
import { denoServe, handleCORS } from "../utils/index.ts";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

denoServe(
  handleCORS(async (req) => {
    const { address, tracking } = await req.json()

    if (address?.length === 42) {
      const supabase = secureConnectToSupabase()
      const data = await supabase
        .from(Tables.accounts)
        .update({ tracking: tracking })
        .eq("address", address)
        .select()

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
    } else {
      return new Response(
        JSON.stringify({
          error: `cannot updated account tracking for ${address}`,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
    }
  })
)

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/update-account-tracking' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"address":"0x0624ecaf5a2d2dfde8326ebe257799a1eac65e40", "tracking:"likely_account"}'
*/
