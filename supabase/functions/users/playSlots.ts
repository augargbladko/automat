import { UserData } from "../types/index.ts"
import { ApiRoute, BASE_ROUTE } from "../utils/consts.ts"
import { delay } from "../utils/time.ts"
import { createTelegramInitData } from "./data/telegramInitData.ts"
import { SlotsPlayState } from "./data/types.ts"

// TODO - we do need a fake slots function, that pulls a day or more of slots play for a user
// update their energy, tokens, points, slotsPlayState accumulators, slots plays, etc.

export async function playSlotsUntilEnergyRunsOut(user: UserData) {
  console.log(`Starting slots plays for user ${user.telegram_id}...`)
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
    console.log(
      "Making slots play call for user:",
      user.telegram_id,
      slotsPlayRequest
    )
    const slotsPlayResponse = await fetch(BASE_ROUTE + ApiRoute.slotsPlay, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slotsPlayRequest),
    })
    const slotsPlayData = await slotsPlayResponse.json()

    if (slotsPlayResponse.ok) {
      console.log(
        `Slots play response for user ${user.telegram_id} (${slotsPlayData.energyAtLastPlay} energy):`,
        slotsPlayData
      )
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
