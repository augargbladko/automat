import { UserData } from "../types/index.ts";
import { createTelegramInitData } from "../users/data/telegramInitData.ts";
import { SlotsPlayState } from "../users/data/types.ts";
import { API_ROUTES, BASE_ROUTE } from "../utils/consts.ts";
import { delay } from "../utils/time.ts";


// TODO - we do need a fake slots function, that pulls a day or more of slots play for a user
// update their energy, tokens, points, slotsPlayState accumulators, slots plays, etc.

export async function playSlotsUntilEnergyRunsOut(user: UserData) {
  let currentEnergy = 1000000;
  while (currentEnergy > 500) {
    await delay(5100 + Math.floor(Math.random() * 1500));
    currentEnergy = (await makeSlotsPlayCall(user))?.energyAtLastPlay || 0;
  }
}

async function makeSlotsPlayCall(user: UserData): Promise<SlotsPlayState | null> {
  try {
    const telegramInitData = createTelegramInitData(user);
    const slotsPlayRequest = {
      telegramInitData: telegramInitData,
      timeZone: user.time_zone,
    }
    const slotsPlayResponse = await fetch(BASE_ROUTE + API_ROUTES.slotsPlay, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slotsPlayRequest),
    });
    const slotsPlayData = await slotsPlayResponse.json();
    console.log("Slots play response:", slotsPlayData);
    if (slotsPlayResponse.ok) {
      return slotsPlayData as SlotsPlayState;
    } else {
      return null;
    }
  } catch (e) {
    console.error('Error making slots play call:', e);
    return null;
  }
}