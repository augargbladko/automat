import { delay } from "../utils/time.ts";
import { API_ROUTES, BASE_ROUTE } from "./consts.ts";
import { createTelegramInitData } from "./telegramInitData.ts";
import { MongoUser, SlotsPlayState, SupabaseUser } from "./types.ts";
import { getCurrentEnergy, getUser } from "./user.ts";


export async function playSlots(user: SupabaseUser) {
  const mongoUser: MongoUser = await getUser(user);
  console.log("User data for slots play:", mongoUser);

  let slotsPlays = 0;
  let pointsEarned = 0;
  let tokensEarned = 0;
  let slotsPlayState: SlotsPlayState | null = mongoUser.slotsPlayState || null;

  // make Slots calls until energy is expended
  while (!slotsPlayState || getCurrentEnergy(slotsPlayState.lastPlayed, mongoUser.level, slotsPlayState.energyAtLastPlay) > 500) {
    slotsPlayState = await makeSlotsPlayCall(user);
    if (!slotsPlayState) {
      console.error('failed to get slots play state', user)
      break;
    }
    pointsEarned += slotsPlayState.result.points;
    tokensEarned += slotsPlayState.result.tokens;
    slotsPlays++;
    await delay(6000);
  }
  console.log(`Slots plays: ${slotsPlays}, Points earned: ${pointsEarned}, Tokens earned: ${tokensEarned}`);
}

async function makeSlotsPlayCall(user: SupabaseUser): Promise<SlotsPlayState | null> {
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
}