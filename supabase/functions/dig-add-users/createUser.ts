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
import { API_ROUTES, BASE_ROUTE } from "../utils/consts.ts"
import { delay } from "../utils/time.ts"

const isTestCreate = true

export async function createUser(
  supabase: SupabaseClient,
  user: UserData
): Promise<number> {
  try {
    console.log(`Creating user ${user.telegram_id}...`)
    const isRealUser = !!user.referral_group

    // Add wallet address, so we don't need to look it up in the future
    user.wallet_address =
      (await getWalletAddress(user.wallet_id, user.referral_group)) || null
    const isSuccess =
      (await newUserCreate(user)) &&
      (await newUserAddWallet(user)) &&
      (await newUserConfirmEmail(user))
    console.log(
      `Created user ${user.telegram_id} (${isRealUser ? "real" : "fake"}) ${isSuccess ? "success" : "failed"}`
    )

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

    if (isTestCreate) {
      return user.telegram_id
    }
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
  const telegramInitData = createTelegramInitData(user)
  const userBody = {
    telegramInitData: telegramInitData,
    referrerTelegramId: user.referred_by_id,
    timeZone: user.time_zone,
  }
  if (isTestCreate) {
    console.log("test create user", userBody)
    return true
  }
  const createUserResponse = await fetch(BASE_ROUTE + API_ROUTES.user, {
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
}

async function newUserAddWallet(user: UserData): Promise<boolean> {
  if (!user.wallet_address) {
    console.log(`no wallet to add to user ${user.telegram_id}`)
    return true
  }

  const telegramInitData = createTelegramInitData(user)
  const walletRequest = {
    telegramInitData: telegramInitData,
    tonWalletAddress: user.wallet_address,
  }

  if (isTestCreate) {
    console.log(`test add wallet`, user.telegram_id, walletRequest)
    return true
  }

  const addWalletResponse = await fetch(BASE_ROUTE + API_ROUTES.wallet, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(walletRequest),
  })
  const addWalletData = await addWalletResponse.json()
  console.log("Add wallet response:", addWalletData)
  await delay(1000)
  return addWalletResponse.ok
}

async function newUserConfirmEmail(user: UserData): Promise<boolean> {
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

  if (isTestCreate) {
    console.log("test confirm email", user.telegram_id, addEmailRequest)
    return true
  }

  const addEmailResponse = await fetch(BASE_ROUTE + API_ROUTES.emailEntry, {
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

  const addEmailData = await addEmailResponse.json()
  console.log("Add email response:", addEmailData)

  if (!user.confirmed_email) {
    // if the user's email is not confirmed, we're done here.
    return true
  }
  await delay(5000)

  // Klaviyo API call to confirm email
  if (!(await subscribeProfileToList(user))) {
    console.log("Klaviyo subscribe failed for user", user.telegram_id)
    return false
  }
  await delay(2000)

  // api call to confirm email
  const confirmEmailRequest = {
    email: user.email,
    telegramId: user.telegram_id,
  }
  const confirmEmailResponse = await fetch(
    BASE_ROUTE + API_ROUTES.emailConfirm,
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
}
