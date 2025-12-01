import { SupabaseClient } from "@supabase/supabase-js"
import { sendGaForUser } from "../dig-spoof-ga/sendGa.ts"
import { storeUser } from "../queries/database/users.ts"
import { getWalletAddress } from "../ton/tonWallet.ts"
import { UserData } from "../types/index.ts"
import { API_ROUTES, BASE_ROUTE } from "../utils/consts.ts"
import { delay } from "../utils/time.ts"
import { createTelegramInitData } from "./data/telegramInitData.ts"
import { UserStatus } from "./data/types.ts"
import { subscribeProfileToList } from "./klaviyo.ts"
import { playSlotsUntilEnergyRunsOut } from "./playSlots.ts"

export async function createUser(supabase: SupabaseClient, user: UserData) {
  const isRealUser = !!user.referral_group
  ;(await newUserCreate(user)) &&
    (await newUserAddWallet(user)) &&
    (await newUserConfirmEmail(user))
  console.log(
    `Created user ${user.telegram_id} (${isRealUser ? "real" : "fake"})`
  )

  // run the GA function for the user's first run(s)
  await sendGaForUser(user, true)

  // store the user status in Supabase
  // all the real users get marked LIVE. 40% of the fake users get marked LIVE as well, to simulate long tail activity.
  const userStatus =
    isRealUser || Math.random() < 0.4 ? UserStatus.live : UserStatus.complete
  await storeUser(supabase, {
    telegram_id: user.telegram_id,
    user_status: userStatus,
    next_action_time:
      userStatus === UserStatus.live
        ? Math.floor(
            Date.now() / 1000 +
              (isRealUser ? 6 * 60 * 60 : (24 + Math.random() * 24) * 60 * 60)
          )
        : 2_147_483_647,
  })

  // run some fake slots plays for the user, so their data looks more realistic
  await playSlotsUntilEnergyRunsOut(user)

  console.log(
    `Completed initial analytics and data for ${user.telegram_id} (${isRealUser ? "real" : "fake"}) Status: ${userStatus}`
  )
}

async function newUserCreate(user: UserData): Promise<boolean> {
  const telegramInitData = createTelegramInitData(user)
  const userBody = {
    telegramInitData: telegramInitData,
    referrerTelegramId: user.referred_by_id,
    timeZone: user.time_zone,
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
  if ((user.wallet_id || 0) <= 0) {
    return true
  }

  const telegramInitData = createTelegramInitData(user)
  const walletRequest = {
    telegramInitData: telegramInitData,
    tonWalletAddress: await getWalletAddress(
      user.wallet_id,
      user.referral_group
    ),
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
    return true
  }

  // add email call
  const addEmailRequest = {
    telegramInitData: telegramInitData,
    email: user.email,
  }
  const addEmailResponse = await fetch(BASE_ROUTE + API_ROUTES.emailEntry, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addEmailRequest),
  })
  const addEmailData = await addEmailResponse.json()
  console.log("Add email response:", addEmailData)

  if (!addEmailResponse.ok) {
    return false
  }

  if (!user.confirmed_email) {
    // if the user's email is not confirmed, we're done here.
    return true
  }
  await delay(5000)

  // Klaviyo API call to confirm email
  if (!(await subscribeProfileToList(user))) {
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
      },
      body: JSON.stringify(confirmEmailRequest),
    }
  )
  const confirmEmailData = await confirmEmailResponse.json()
  console.log("Confirm email response:", confirmEmailData)
  await delay(1000)
  return confirmEmailResponse.ok
}
