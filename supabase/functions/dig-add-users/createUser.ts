import { SupabaseClient } from "@supabase/supabase-js"
import { sendGaForUser } from "../dig-spoof-ga/sendGa.ts"
import { storeUser } from "../queries/database/users.ts"
import { getWalletAddress } from "../ton/tonWallet.ts"
import { UserData } from "../types/index.ts"
import { createTelegramInitData } from "../users/data/telegramInitData.ts"
import { getNextActionTime } from "../users/getNextActionTime.ts"
import { subscribeProfileToList } from "../users/klaviyo.ts"
import { updateUser } from "../users/user.ts"
import { ApiRoute, BASE_ROUTE } from "../utils/consts.ts"
import { getUserAgent, MongoUserUpdate, UserStatus } from "../utils/index.ts"
import { delay } from "../utils/time.ts"

export async function createUser(
  supabase: SupabaseClient,
  user: UserData
): Promise<number> {
  try {
    const isRealUser = !!user.referral_group

    // Add wallet address, so we don't need to look it up in the future
    user.wallet_address =
      (await getWalletAddress(user.wallet_id, user.referral_group)) || null
    let isSuccess = await newUserCreate(user)
    if (!isSuccess) {
      console.error(`Failed to create user ${user.telegram_id}`, user)
      return 0
    }
    await delay(1000)
    isSuccess = await newUserAddWallet(user)
    if (!isSuccess) {
      console.error(
        `Failed to create wallet for user ${user.telegram_id}`,
        user
      )
      return 0
    }
    await delay(1000)

    isSuccess = await newUserConfirmEmail(user)
    if (!isSuccess) {
      console.error(
        `Failed to confirm email for user ${user.telegram_id}; continuing - we'll fix this later`,
        user
      )
    }
    await delay(1000)

    await newUserSetCreationTime(user)

    // run the GA function for the user's first run(s)
    // don't await this; it's fire-and-forget
    await sendGaForUser(user, true)

    // store the user status in Supabase
    // all the real users get marked LIVE. 20% of the fake users get marked LIVE as well, to simulate some long tail activity.
    user.user_status =
      isRealUser || Math.random() < 0.2 ? UserStatus.live : UserStatus.complete
    const userUpsert = {
      telegram_id: user.telegram_id,
      user_status: user.user_status,
      wallet_address: user.wallet_address || null,
      next_action_time: getNextActionTime(user),
      user_error: new Date().toISOString(),
    }
    if (!(await storeUser(supabase, userUpsert))) {
      console.error("Failed to store supabase data for user", userUpsert)
    }

    console.log(
      `Completed initial analytics and data for ${user.telegram_id} (${isRealUser ? "real" : "fake"}) Status: ${user.user_status}`
    )
    return user.telegram_id
  } catch (e) {
    console.error(`Error creating user ${user.telegram_id}:`, e)
    return 0
  }
}

export async function updateUserToComplete(
  supabase: SupabaseClient,
  user: UserData
) {
  try {
    const userUpsert = {
      telegram_id: user.telegram_id,
      user_status: UserStatus.complete,
      user_error: new Date().toISOString(),
    }
    if (!(await storeUser(supabase, userUpsert))) {
      console.error("Failed to store supabase data for user", userUpsert)
    } else {
      console.log(`Updated user ${user.telegram_id} to complete status`)
    }
  } catch (e) {
    console.error(`Error removing user ${user.telegram_id}:`, e)
  }
}

async function newUserCreate(user: UserData): Promise<boolean> {
  try {
    const telegramInitData = createTelegramInitData(user)
    const userBody = {
      telegramInitData: telegramInitData,
      referrerTelegramId: user.referred_by_id?.toString(),
      timeZone: user.time_zone,
    }

    const createUserResponse = await fetch(BASE_ROUTE + ApiRoute.user, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": getUserAgent(),
      },
      body: JSON.stringify(userBody),
    })
    if (!createUserResponse.ok) {
      const errorData = await createUserResponse.text()
      console.error(
        `Create user failed for ${user.telegram_id}:`,
        userBody,
        createUserResponse.status,
        errorData
      )
    }
    await delay(1000)
    return createUserResponse.ok
  } catch (error) {
    console.error("Error creating user:", error)
    return false
  }
}

async function newUserAddWallet(user: UserData): Promise<boolean> {
  try {
    if (!user.wallet_address) {
      console.log(`no wallet to add to user ${user.telegram_id}`)
      return true
    }

    const telegramInitData = createTelegramInitData(user)
    const walletRequest = {
      telegramInitData: telegramInitData,
      tonWalletAddress: user.wallet_address,
    }

    const addWalletResponse = await fetch(BASE_ROUTE + ApiRoute.wallet, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": getUserAgent(),
      },
      body: JSON.stringify(walletRequest),
    })

    await delay(2000)
    return addWalletResponse.ok
  } catch (error) {
    console.error("Error adding wallet to user:", error)
    return false
  }
}

async function newUserSetCreationTime(user: UserData): Promise<void> {
  try {
    const creation = new Date()
    // send creation back up to 10 minutes into the past
    // ensure created day lines up with creation time
    creation.setMinutes(creation.getMinutes() - Math.floor(Math.random() * 10))
    const userUpdate: MongoUserUpdate = {
      createdAt: creation,
      createdDay: creation.toISOString().split("T")[0],
    }
    await updateUser(userUpdate, user)
  } catch (error) {
    console.error("Error setting user creation time:", error)
  }
}

export async function newUserConfirmEmail(user: UserData): Promise<boolean> {
  try {
    const telegramInitData = createTelegramInitData(user)
    if (!user.email) {
      return true
    }

    // add email call
    const addEmailRequest = {
      telegramInitData: telegramInitData,
      email: user.email,
    }

    const addEmailResponse = await fetch(BASE_ROUTE + ApiRoute.emailEntry, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": getUserAgent(),
      },
      body: JSON.stringify(addEmailRequest),
    })

    if (!addEmailResponse.ok) {
      console.error(
        `Add email failed for user ${user.telegram_id}`,
        addEmailResponse.status,
        addEmailResponse
      )
      return false
    }

    if (!user.confirmed_email) {
      // if the user's email should not be confirmed, we're done here.
      return true
    }
    await delay(2000)

    return await confirmUserEmail(user)
  } catch (error) {
    console.error("Error confirming email for user:", error)
    return false
  }
}

export async function confirmUserEmail(user: UserData): Promise<boolean> {
  try {
    // Klaviyo API call to confirm email
    await subscribeProfileToList(user)
    await delay(5000)

    // api call to confirm email - try even if the klaviyo call failed
    const confirmEmailRequest = {
      email: user.email,
      telegramId: user.telegram_id,
    }
    const confirmEmailResponse = await fetch(
      BASE_ROUTE + ApiRoute.emailConfirm,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${Deno.env.get("KLAYVIO_AUTHORIZATION")}`,
          "User-Agent": getUserAgent(),
        },
        body: JSON.stringify(confirmEmailRequest),
      }
    )
    if (!confirmEmailResponse.ok) {
      const confirmEmailData = await confirmEmailResponse.json()
      console.error(
        "Confirm email response not ok:",
        user.email,
        user.telegram_id,
        confirmEmailData
      )
    }
    return confirmEmailResponse.ok
  } catch (error) {
    console.error("Error confirming email for user (final confirm):", error)
    return false
  }
}
