// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { AnyBulkWriteOperation, BulkWriteOptions, Filter } from "mongodb"
import { fixTotalSpins } from "../dig-spoof-ga/getSlotsUpdate.ts"
import { getDb } from "../mongodb/mongo.ts"
import { secureConnectToSupabase } from "../queries/database/supaFunc.ts"
import { storeUsers } from "../queries/database/users.ts"
import { UserCol } from "../types/database.ts"
import { Tables, UserData, UserUpsert } from "../types/index.ts"
import { MongoSlotsUpdate, MongoUser, UserStatus } from "../users/data/types.ts"
import {
  convertDateToDayString,
  denoServe,
  handleCORS,
} from "../utils/index.ts"

const isFixDisabled = true

async function undoFixed() {
  const supabase = secureConnectToSupabase()
  let length = 1
  while (length > 0) {
    const { data, error } = await supabase
      .from(Tables.user_data)
      .select("*")
      .eq(UserCol.user_status, UserStatus.fixed)
      .limit(1000)
    length = data?.length || 0
    if (!data) {
      return
    }

    // update users to reflect new action times, last action times, and new nugs balances
    const userUpserts: UserUpsert[] = data.map((user) => {
      return {
        user_status: UserStatus.complete,
        telegram_id: user.telegram_id,
      }
    })
    if (!(await storeUsers(supabase, userUpserts))) {
      console.error("Failed to update supabase records. Stopping")
      return new Response(JSON.stringify({ success: false }), {
        headers: { "Content-Type": "application/json" },
      })
    }
  }
}

denoServe(
  handleCORS(async (req: Request) => {
    try {
      if (isFixDisabled) {
        console.log("Dig upgrade users is currently disabled.")
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        })
      }
      // await undoFixed()
      const supabase = secureConnectToSupabase()

      // we need valid-looking GA data for users
      // find the next N users that we can run GA data for.
      //  30k users, 4x/day is the ideal. 120k/day. Spread over 24h, that's 5k/h, or ~83/minute.
      // ~10k fake users at a time, but only 1/day.
      // will be spiky, so 150/hr is likely safe.

      const { data, error } = await supabase
        .from(Tables.user_data)
        .select("*")
        .eq(UserCol.user_status, UserStatus.complete)
        .limit(15)

      if (error || !data) {
        console.error("Error fetching users:", error)
        return new Response(JSON.stringify({ success: false }), {
          headers: { "Content-Type": "application/json" },
        })
      }
      if (data.length === 0) {
        return new Response(JSON.stringify({ success: true }), {
          headers: { "Content-Type": "application/json" },
        })
      }
      console.log(
        `Fetched ${data.length} supabase users`,
        data.map((u) => `${u.telegram_id} (${u.next_action_time})`)
      )

      // get users from MongoDB to get their slots data
      const userLookup: { [telegramId: string]: UserData } = {}
      const mongoPull: string[] = data.map((user) => {
        const tgString = user.telegram_id.toString()
        userLookup[tgString] = user
        return tgString
      })
      console.log("Pulling MongoDB users for telegram IDs:", mongoPull)
      const db = await getDb()
      const user = db.collection<MongoUser>("User")
      const filter: Filter<MongoUser> = { telegramId: { $in: mongoPull } }
      const mData = await user.find(filter).toArray()
      console.log(
        `Fetched ${mData.length} MongoDB users out of ${mongoPull.length} requested`,
        mData
      )

      const slotsUpdates: MongoSlotsUpdate[] = mData
        .map((mongoUser) => {
          const actualSpins = fixTotalSpins(mongoUser)
          const timeBetweenSpins = actualSpins > 100 ? 24 : 36
          const minPlayTime = new Date(
            mongoUser.createdAt.getTime() +
              Math.floor(
                actualSpins *
                  timeBetweenSpins *
                  (0.8 + Math.random() * 0.4) *
                  60 *
                  1000
              )
          ).toISOString()
          const shouldUpdate =
            !!mongoUser.slotsPlayState?.lastPlayed &&
            (!mongoUser.lastActivityAt ||
              mongoUser.energyFullNotificationTime ||
              mongoUser.lastLoginDay ||
              minPlayTime > mongoUser.slotsPlayState.lastPlayed)
          if (actualSpins > 10) {
            console.log(
              "fixuser:",
              mongoUser.telegramId,
              actualSpins,
              shouldUpdate,
              mongoUser.createdDay,
              minPlayTime,
              mongoUser.slotsPlayState.lastPlayed
            )
          }
          if (shouldUpdate) {
            const lastPlayDate =
              minPlayTime > mongoUser.slotsPlayState.lastPlayed!
                ? new Date(minPlayTime)
                : new Date(mongoUser.slotsPlayState.lastPlayed!)
            const update: MongoSlotsUpdate = {
              telegramId: mongoUser.telegramId,
              pointsBalance: mongoUser.pointsBalance,
              tokenBalance: mongoUser.tokenBalance,
              slotsPlayState: mongoUser.slotsPlayState!,
              lastLoginDay:
                mongoUser.lastLoginDay || convertDateToDayString(lastPlayDate),
              energyFullNotificationTime: new Date(
                lastPlayDate.getTime() +
                  60 * 60 * 1000 +
                  Math.floor((2 + Math.random() * 7) * 60 * 1000)
              ), // add the 10-ish mins to be more random
              lastActivityAt: lastPlayDate,
              slotsLastPlayed: lastPlayDate.toISOString(),
            }
            update.slotsPlayState.lastPlayed = lastPlayDate.toISOString()
            update.slotsPlayState.totalSpins = fixTotalSpins(mongoUser)
            return update
          } else {
            return null
          }
        })
        .filter((update) => update !== null)

      console.log(
        `Prepared ${slotsUpdates.length} slots updates from ${data.length} users`,
        slotsUpdates
      )

      // update users to reflect new action times, last action times, and new nugs balances
      const userUpserts: UserUpsert[] = data.map((user) => {
        user.user_status = UserStatus.fixed
        const nugs = slotsUpdates.find(
          (update) =>
            update && update.telegramId === user.telegram_id.toString()
        )?.tokenBalance
        return {
          user_status: user.user_status,
          telegram_id: user.telegram_id,
          nugs:
            nugs === undefined
              ? undefined
              : Math.floor((nugs || 0) / 1_000_000),
        }
      })
      if (!(await storeUsers(supabase, userUpserts))) {
        console.error("Failed to update supabase records. Stopping")
        return new Response(JSON.stringify({ success: false }), {
          headers: { "Content-Type": "application/json" },
        })
      }

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

      if (bulkOps.length > 0) {
        const bulkResult = await db
          .collection<MongoUser>("User")
          .bulkWrite(bulkOps, options)
        console.log(
          `Updated slots data for ${bulkResult.modifiedCount} users from ${bulkOps.length} updates`,
          bulkOps,
          bulkResult
        )
      } else {
        console.log("No slots updates to apply to MongoDB.")
      }
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
