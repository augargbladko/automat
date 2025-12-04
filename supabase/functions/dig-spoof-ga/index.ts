// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { AnyBulkWriteOperation, BulkWriteOptions } from "mongodb"
import { getDb } from "../mongodb/mongo.ts"
import { secureConnectToSupabase } from "../queries/database/supaFunc.ts"
import { storeUsers } from "../queries/database/users.ts"
import { UserCol } from "../types/database.ts"
import { Tables, UserData, UserUpsert } from "../types/index.ts"
import { MongoSlotsUpdate, MongoUser, UserStatus } from "../users/data/types.ts"
import { getNextActionTime } from "../users/getNextActionTime.ts"
import { denoServe, handleCORS } from "../utils/index.ts"
import { delay } from "../utils/time.ts"
import { getSlotsUpdate } from "./getSlotsUpdate.ts"
import { sendGaForUser } from "./sendGa.ts"

const isDisabled = true

denoServe(
  handleCORS(async (req: Request) => {
    try {
      console.log("Dig spoof GA called")
      if (isDisabled) {
        console.error("Dig spoof GA is currently disabled.")
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        })
      }
      const supabase = secureConnectToSupabase()

      // we need valid-looking GA data for users
      // find the next N users that we can run GA data for.
      //  30k users, 4x/day is the ideal. 120k/day. Spread over 24h, that's 5k/h, or ~83/minute.
      // ~10k fake users at a time, but only 1/day.
      // will be spiky, so 150/hr is likely safe.

      const { data, error } = await supabase
        .from(Tables.user_data)
        .select("*")
        .eq(UserCol.user_status, UserStatus.live)
        .lte(UserCol.next_action_time, Math.floor(Date.now() / 1000))
        .limit(150)

      if (error || !data) {
        console.error("Error fetching users:", error)
        return new Response(JSON.stringify({ success: false }), {
          headers: { "Content-Type": "application/json" },
        })
      }
      if (data.length === 0) {
        console.log("No users found.")
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        })
      }
      console.log(`Fetched ${data.length} supabase users`)

      // get users from MongoDB to get their slots data
      const userLookup: { [telegramId: string]: UserData } = {}
      const mongoPull: string[] = data.map((user) => {
        const tgString = user.telegram_id.toString()
        userLookup[tgString] = user
        return tgString
      })
      const db = await getDb()
      const user = db.collection<MongoUser>("User")
      const cursor = user.find({ telegram_id: { $in: mongoPull } })
      const mData = await cursor.toArray()
      console.log(
        `Fetched ${mData.length} MongoDB users out of ${mongoPull.length} requested`,
        mongoPull
      )

      const slotsUpdates: MongoSlotsUpdate[] = mData
        .map((mongoUser) =>
          !mongoUser?.slotsPlayState?.lastPlayed
            ? null
            : getSlotsUpdate(userLookup[mongoUser.telegramId], mongoUser)
        )
        .filter((update) => update !== null)

      console.log(
        `Prepared ${slotsUpdates.length} slots updates from ${data.length} users`,
        slotsUpdates
      )

      // update users to reflect new action times, last action times, and new nugs balances
      const userUpserts: UserUpsert[] = data.map((user) => {
        user.user_status =
          user.referral_group || Math.random() < 0.2
            ? UserStatus.live
            : UserStatus.complete
        const nugs =
          (slotsUpdates.find(
            (update) =>
              update && update.telegramId === user.telegram_id.toString()
          )?.tokenBalance || 0) / 1_000_000
        return {
          next_action_time: getNextActionTime(user),
          user_status: user.user_status,
          telegram_id: user.telegram_id,
          nugs: nugs || undefined,
        }
      })
      await storeUsers(supabase, userUpserts)
      console.log(`Updated ${userUpserts.length} users in Supabase`)

      // send the slots updates back to MongoDB
      const bulkOps: AnyBulkWriteOperation<MongoUser>[] = slotsUpdates.map(
        (update) => {
          return {
            updateOne: {
              filter: { telegramId: update.telegramId },
              update: { $set: update },
            },
          }
        }
      )
      const options: BulkWriteOptions = {
        forceServerObjectId: true,
        retryWrites: true,
      }

      const bulkResult = await db
        .collection<MongoUser>("User")
        .bulkWrite(bulkOps, options)
      console.log(
        `Updated slots data for ${bulkResult.modifiedCount} users from ${bulkOps.length} updates`,
        bulkOps,
        bulkResult
      )

      // send the GA data for each user
      for (let i = 0; i < (data || []).length; i++) {
        const user = data[i]
        if (!user) {
          console.log(`Skipping invalid user at index ${i}`)
          continue
        }

        // only send the GA data if this user had its play time updated
        // 3 hours of GA data is more than enough
        const tgId = user.telegram_id.toString()
        if (slotsUpdates.find((u) => u.telegramId === tgId)?.lastLoginDay) {
          for (let j = 0; j < 3; j++) {
            await sendGaForUser(user, false, j * 3600 + Math.random() * 3600)
            await delay(10)
            console.log(`Sent GA data for user ${tgId} #${j + 1}`)
          }
        } else {
          console.log(
            `Skipping GA send for user ${tgId} as no slots play time update`
          )
        }
      }
      console.log(`updated GA data for ${data.length} users`)
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/dig-spoof-ga' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"channel":"bibleverses" }'

*/

/* To invoke from another Supabase Function:

    const supabase = await connectToSupabase(req)
    const response = await supabase.functions.invoke('dig-spoof-ga')

*/
