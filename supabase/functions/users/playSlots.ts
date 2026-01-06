import { UserData } from "../types/index.ts"
import { ApiRoute, BASE_ROUTE } from "../utils/consts.ts"
import { getUserAgent } from "../utils/fetch.ts"
import { delay } from "../utils/time.ts"
import { createTelegramInitData } from "./data/telegramInitData.ts"
import { SlotsPlayState } from "./data/types.ts"

export async function playSlotsUntilEnergyRunsOut(user: UserData) {
  let currentEnergy = 1000000
  const now = new Date()
  const hours = now.getHours() + now.getDate()

  // goal is to get a variable number of plays that clumps
  let mult =
    (user.email?.length || 0 > 0 ? 1 : 0) +
    (user.confirmed_email ? 1 : 0) +
    (user.wallet_id ? 1 : 0) +
    (hours % 7) / 7 +
    (hours % 5) / 5 +
    (hours % 3) / 3

  if (mult < 4) {
    mult = mult + (Math.random() < 0.15 ? 1 : 0)
  }
  if (mult < 5) {
    mult = mult + (Math.random() < 0.25 ? 1 : 0)
  }
  let playsLeft =
    user.referral_group === 0 ? Math.floor(Math.random() * mult) + 1 : 500
  while (playsLeft > 0 && currentEnergy >= 500) {
    await delay(5100 + Math.floor(Math.random() * 1500))
    currentEnergy = (await makeSlotsPlayCall(user))?.energyAtLastPlay || 0
    playsLeft--
  }
}

async function makeSlotsPlayCall(
  user: UserData
): Promise<SlotsPlayState | null> {
  try {
    const telegramInitData = createTelegramInitData(user)
    const slotsPlayRequest = {
      telegramInitData: telegramInitData,
      timeZone: user.time_zone,
    }
    const slotsPlayResponse = await fetch(BASE_ROUTE + ApiRoute.slotsPlay, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": getUserAgent(),
      },
      body: JSON.stringify(slotsPlayRequest),
    })
    const slotsPlayData = await slotsPlayResponse.json()

    if (slotsPlayResponse.ok) {
      return slotsPlayData as SlotsPlayState
    } else {
      console.error(
        `Slots play response not ok for user ${user.telegram_id}:`,
        slotsPlayResponse.status,
        slotsPlayData
      )
      return null
    }
  } catch (e) {
    console.error("Error making slots play call:", e)
    return null
  }
}
