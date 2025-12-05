import { UserData } from "../types/index.ts"
import { ApiRoute, BASE_ROUTE } from "../utils/consts.ts"
import { delay } from "../utils/time.ts"
import { createTelegramInitData } from "./data/telegramInitData.ts"
import { SlotsPlayState } from "./data/types.ts"

export async function playSlotsUntilEnergyRunsOut(user: UserData) {
  let currentEnergy = 1000000
  while (currentEnergy >= 500) {
    await delay(5100 + Math.floor(Math.random() * 1500))
    currentEnergy = (await makeSlotsPlayCall(user))?.energyAtLastPlay || 0
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
