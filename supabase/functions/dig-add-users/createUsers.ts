import { secureConnectToSupabase } from "../queries/database/supaFunc.ts"
import { UserCol } from "../types/database.ts"
import { Tables } from "../types/index.ts"
import { UserData } from "../types/tables.ts"
import { UserStatus } from "../users/data/types.ts"
import { createUser } from "./createUser.ts"
import { getNumberOfUsersToAdd } from "./getNumberOfUsersToAdd.ts"

export async function createUsers(isTest: boolean): Promise<void> {
  const supabase = secureConnectToSupabase()

  // figure out the correct number of users to add in this 10min block.
  let { realAdd, fakeAdd } = getNumberOfUsersToAdd()

  // delay to start user adds at a random time within the 10min block

  if (isTest) {
    realAdd = 1
    fakeAdd = 1
  }

  const realUsers: UserData[] =
    // @ts-ignore breaks deno type checking
    (
      await supabase
        .from(Tables.user_data)
        .select("*")
        .neq(UserCol.referral_group, 0)
        .eq(UserCol.user_status, UserStatus.none)
        .order(UserCol.referral_group, { ascending: true })
        .order(UserCol.referral_pos, { ascending: true })
        .limit(realAdd)
    )?.data || []

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

  if (isTest) {
    console.log("Test mode, not adding users.")
    return
  }

  const telegramIds = await Promise.all(
    realUsers.map((user) => createUser(supabase, user))
  )
  let ids = telegramIds.filter((id) => id > 0)

  if (ids.length < 5) {
    ids = (
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
    console.log(`got ${ids.length} existing live wallets for real users`)
  }

  // give the fake users with treferrals listed referrals from real live users
  if (ids.length >= 5) {
    fakeUsers.forEach((user) => {
      if ((user.referred_by_id || 0) > 0) {
        user.referred_by_id =
          ids[Math.floor(Math.random() * ids.length)] || null
      }
    })
  }

  console.log("Real user creation results:", ids)
  const fakeResults = await Promise.all(
    fakeUsers.map((user) => createUser(supabase, user))
  )
  console.log("Fake user creation results:", fakeResults)
}
