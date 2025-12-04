import { secureConnectToSupabase } from "../queries/database/supaFunc.ts"
import { UserCol } from "../types/database.ts"
import { Tables } from "../types/index.ts"
import { UserData } from "../types/tables.ts"
import { UserStatus } from "../users/data/types.ts"
import { createUser } from "./createUser.ts"
import { getNumberOfUsersToAdd } from "./getNumberOfUsersToAdd.ts"

export async function createUsers(): Promise<void> {
  try {
    const supabase = secureConnectToSupabase()

    // figure out the correct number of users to add in this 10min block.
    const { realAdd, fakeAdd } = getNumberOfUsersToAdd()

    // delay to start user adds at a random time within the 10min block

    const { data, error } =
      // @ts-ignore breaks deno type checking
      await supabase
        .from(Tables.user_data)
        .select("*")
        .neq(UserCol.referral_group, 0)
        .eq(UserCol.user_status, UserStatus.none)
        .order(UserCol.referral_group, { ascending: true })
        .order(UserCol.referral_pos, { ascending: true })
        .limit(realAdd)
    const realUsers: UserData[] = data || []
    console.log(
      `Found ${realUsers.length} of ${realAdd} real users to add`,
      data,
      error
    )

    const userIds = await Promise.all(
      realUsers.map((user) => createUser(supabase, user))
    )
    console.log(`created ${userIds.length} of ${realAdd} real users:`, userIds)

    const ids = (
      (
        await supabase
          .from(Tables.user_data)
          .select("*")
          .neq(UserCol.telegram_id, null)
          .neq(UserCol.referral_group, 0)
          .eq(UserCol.user_status, UserStatus.live)
          .order(UserCol.referral_pos, { ascending: true })
          .limit(1000)
      )?.data || []
    ).map((user) => user.telegram_id) as number[]
    console.log(`got ${ids.length} fake users`)

    const fakeUsers: UserData[] =
      (
        await supabase
          .from(Tables.user_data)
          .select("*")
          .eq(UserCol.referral_group, 0)
          .eq(UserCol.user_status, UserStatus.none)
          .order(UserCol.referral_pos, { ascending: true })
          .limit(fakeAdd)
      )?.data || []
    console.log(`Found ${fakeUsers.length} of ${fakeAdd} fake users to add`)

    // give the fake users with treferrals listed referrals from real live users
    if (ids.length > 0) {
      fakeUsers.forEach((user) => {
        if ((user.referred_by_id || 0) > 0) {
          user.referred_by_id =
            ids[Math.floor(Math.random() * ids.length)] || null
          console.log(
            `Assigned referrer ${user.referred_by_id} to fake user ${user.telegram_id}`
          )
        }
      })
    }

    const fakeResults = await Promise.all(
      fakeUsers.map((user) => createUser(supabase, user))
    )
    console.log(
      `created ${fakeResults.length} of ${fakeUsers.length} fake users:`,
      fakeResults
    )
  } catch (e) {
    console.error("Error in createUsers function:", e)
  }
}
