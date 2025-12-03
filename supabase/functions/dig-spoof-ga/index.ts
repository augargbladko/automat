// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { secureConnectToSupabase } from "../queries/database/supaFunc.ts"
import { storeUsers } from "../queries/database/users.ts"
import { UserCol } from "../types/database.ts"
import { Tables, UserUpsert } from "../types/index.ts"
import { UserStatus } from "../users/data/types.ts"
import { getNextActionTime } from "../users/getNextActionTime.ts"
import { denoServe, handleCORS } from "../utils/index.ts"
import { delay } from "../utils/time.ts"
import { sendGaForUser } from "./sendGa.ts"

const isDisabled = true

denoServe(
  handleCORS(async (req: Request) => {
    const group = await req.json()
    console.log("Dig spoof GA called with group:", group)
    if (isDisabled) {
      console.error("Dig spoof GA is currently disabled.")
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      })
    }
    const supabase = secureConnectToSupabase()

    // TODO - slow down the number of GA calls?
    // TODO - add in the slots & user data updates
    // TODO - add a safety net of waiting for slots play if there's no slots play listed.

    // we need valid-looking GA data for users
    // find the next N users that we can run GA data for.
    //  30k users, 4x/day is the ideal. 120k/day. Spread over 24h, that's 5k/h, or ~83/minute.

    const usersToProcess = await supabase
      .from(Tables.user_data)
      .select("*")
      .eq(UserCol.user_status, UserStatus.live)
      .lte(UserCol.next_action_time, Date.now() / 1000)
      .limit(120)

    // update users to reflect new action times & last action times
    const userUpserts: UserUpsert[] =
      usersToProcess.data?.map((user) => {
        user.user_status =
          user.referral_group || Math.random() < 0.2
            ? UserStatus.live
            : UserStatus.complete
        return {
          next_action_time: getNextActionTime(user),
          user_status: user.user_status,
          telegram_id: user.telegram_id,
        }
      }) || []

    await storeUsers(supabase, userUpserts)

    // send the GA data for each user
    for (let i = 0; i < (usersToProcess.data || []).length; i++) {
      const user = usersToProcess.data?.[i]
      if (!user) {
        continue
      }

      for (let j = 0; j < 6; j++) {
        await sendGaForUser(user, false, j * 3600 + Math.random() * 600)
        await delay(10)
      }
    }
    console.log(`updated GA data for ${usersToProcess.data?.length} users`)

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  })
)

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/dig-spoof-ga' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"channel":"bibleverses" }'

*/

/* To invoke from another Supabase Function:

    const supabase = await connectToSupabase(req)
    const response = await supabase.functions.invoke('dig-spoof-ga')

*/
