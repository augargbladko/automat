import { SupabaseClient } from "@supabase/supabase-js"
import { sendGaForUser } from "../dig-spoof-ga/sendGa.ts"
import { storeUser } from "../queries/database/users.ts"
import { getWalletAddress } from "../ton/tonWallet.ts"
import { UserData } from "../types/index.ts"
import { createTelegramInitData } from "../users/data/telegramInitData.ts"
import { UserStatus } from "../users/data/types.ts"
import { getNextActionTime } from "../users/getNextActionTime.ts"
import { subscribeProfileToList } from "../users/klaviyo.ts"
import { playSlotsUntilEnergyRunsOut } from "../users/playSlots.ts"
import { ApiRoute, BASE_ROUTE } from "../utils/consts.ts"
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
    isSuccess = await newUserAddWallet(user)
    if (!isSuccess) {
      console.error(
        `Failed to create wallet for user ${user.telegram_id}`,
        user
      )
      return 0
    }

    isSuccess = await newUserConfirmEmail(user)
    if (!isSuccess) {
      console.error(
        `Failed to confirm email for user ${user.telegram_id}; continuing - we'll fix this later`,
        user
      )
    } else {
      console.log(
        `Created user ${user.telegram_id} (${isRealUser ? "real" : "fake"})`
      )
    }

    // run the GA function for the user's first run(s)
    // don't await this; it's fire-and-forget
    await sendGaForUser(user, true)

    // store the user status in Supabase
    // all the real users get marked LIVE. 20% of the fake users get marked LIVE as well, to simulate some long tail activity.
    user.user_status =
      isRealUser || Math.random() < 0.2 ? UserStatus.live : UserStatus.complete
    await storeUser(supabase, {
      telegram_id: user.telegram_id,
      user_status: user.user_status,
      wallet_address: user.wallet_address || null,
      next_action_time: getNextActionTime(user),
    })

    // run some fake slots plays for the user, so their data looks more realistic
    await playSlotsUntilEnergyRunsOut(user)

    console.log(
      `Completed initial analytics and data for ${user.telegram_id} (${isRealUser ? "real" : "fake"}) Status: ${user.user_status}`
    )
    return user.telegram_id
  } catch (e) {
    console.error(`Error creating user ${user.telegram_id}:`, e)
    return 0
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
      },
      body: JSON.stringify(userBody),
    })
    const createUserData = await createUserResponse.json()
    console.log("Create user response:", createUserData)
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

export async function newUserConfirmEmail(user: UserData): Promise<boolean> {
  try {
    const telegramInitData = createTelegramInitData(user)
    if (!user.email) {
      console.log(
        `No email for user ${user.telegram_id}, skipping email add/confirm.`
      )
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
        },
        body: JSON.stringify(confirmEmailRequest),
      }
    )
    const confirmEmailData = await confirmEmailResponse.json()
    console.log("Confirm email response:", confirmEmailData)
    await delay(1000)
    return confirmEmailResponse.ok
  } catch (error) {
    console.error("Error confirming email for user (final confirm):", error)
    return false
  }
}
