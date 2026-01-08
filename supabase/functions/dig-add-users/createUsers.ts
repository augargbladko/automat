import { denoConnectToSupabase } from "../queries/database/supaFunc.ts"
import { UserCol } from "../types/database.ts"
import { Tables } from "../types/index.ts"
import { UserData } from "../types/tables.ts"
import { UserStatus } from "../users/data/types.ts"
import { playSlotsUntilEnergyRunsOut } from "../users/playSlots.ts"
import { createUser, updateUserToComplete } from "./createUser.ts"
import { getNumberOfUsersToAdd } from "./getNumberOfUsersToAdd.ts"

export async function createUsers(): Promise<void> {
  try {
    let realUsers: UserData[]
    const supabase = denoConnectToSupabase()

    // figure out the correct number of users to add in this 10min block.
    const { realAdd, fakeAdd } = getNumberOfUsersToAdd()

    // delay to start user adds at a random time within the 10min block

    if (realAdd > 0) {
      const realResult = await supabase
        .from(Tables.user_data)
        .select("*")
        .neq(UserCol.referral_group, 0)
        .eq(UserCol.user_status, UserStatus.none)
        .order(UserCol.referral_group, { ascending: true })
        .order(UserCol.referral_pos, { ascending: true })
        .limit(realAdd)
      realUsers = realResult.data || []
      console.log(
        `Found ${realUsers.length} of ${realAdd} real users to add`,
        realResult.data,
        realResult.error
      )

      const userIds = await Promise.all(
        realUsers.map((user) => createUser(supabase, user))
      )
      console.log(
        `created ${userIds.length} of ${realAdd} real users:`,
        userIds
      )
    } else if (realAdd < 0) {
      const realRemove = -realAdd
      console.log(`Removing ${realRemove} real users this cycle`)

      const removeResult = await supabase
        .from(Tables.user_data)
        .select("*")
        .neq(UserCol.referral_group, 0)
        .eq(UserCol.user_status, UserStatus.live)
        .order(UserCol.referral_pos, { ascending: true })
        .limit(realRemove)
      const toRemove = removeResult.data || []
      console.log(
        `Found ${toRemove.length} of ${realRemove} real users to remove`,
        removeResult.data,
        removeResult.error
      )
      toRemove.map((user) => updateUserToComplete(supabase, user))
      realUsers = []
    } else {
      console.log("No real users to add this cycle")
      realUsers = []
    }

    let fakeUsers: UserData[]

    if (fakeAdd === 0) {
      console.log("No fake users to add this cycle")
      fakeUsers = []
    } else {
      console.log(`adding ${fakeAdd} fake users this cycle`)

      let result = await supabase
        .from(Tables.user_data)
        .select("*")
        .eq(UserCol.referral_group, 0)
        .eq(UserCol.user_status, UserStatus.none)
        .order(UserCol.referral_pos, { ascending: true })
        .limit(fakeAdd)

      fakeUsers = result?.data || []
      if (result.error) {
        console.error("error getting fake users", result.error, result.data)
      } else {
        console.log(
          `Found ${fakeUsers.length} of ${fakeAdd} fake users to add`,
          result.data,
          result.error
        )
      }

      result = await supabase
        .from(Tables.user_data)
        .select("*")
        .gt(UserCol.telegram_id, 0)
        .neq(UserCol.referral_group, 0)
        .eq(UserCol.user_status, UserStatus.live)
        .order(UserCol.referral_pos, { ascending: true })
        .limit(5000)

      if (result.error) {
        console.error("error getting referral users", result.error, result.data)
      }
      const ids = (result?.data || []).map(
        (user) => user.telegram_id
      ) as number[]

      // give the fake users with referrals listed referrals from real live users
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
      const fakeResults: number[] = []
      for (let i = 0; i < fakeUsers.length; i++) {
        fakeResults.push(await createUser(supabase, fakeUsers[i]))
      }
      console.log(
        `created ${fakeResults.length} of ${fakeUsers.length} fake users:`,
        fakeResults
      )
    }

    // run some fake slots plays for the user, so their data looks more realistic
    const allUsers = [...realUsers, ...fakeUsers]
    for (let i = 0; i < allUsers.length; i++) {
      await playSlotsUntilEnergyRunsOut(allUsers[i])
    }

    console.log(
      `completed initial slots for ${realUsers.length} users and ${fakeUsers.length} fake users`
    )
  } catch (e) {
    console.error("Error in createUsers function:", e)
  }
}
