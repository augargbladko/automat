import { getDb } from "../mongodb/mongo.ts";
import { UserData } from "../types/index.ts";
import { API_ROUTES, BASE_ROUTE } from "../utils/consts.ts";
import { createTelegramInitData } from "./data/telegramInitData.ts";
import { ItemsOwnedState, MongoUser, MongoUserUpdate, SlotsPlayState, SlotsResult } from "./data/types.ts";



export function defaultSlotsResult(): SlotsResult {
  return {
    points: 0,
    tokens: 0,
    energy: 0,
    level: 0,
    reels: [0, 0, 0],
    treasures: [0, 0, 0, 0],
    multipliers: [1, 1, 1],
    baseScores: [0, 0, 0],
    baseMult: 1,
    doublesMult: 1,
  };
}

export function defaultSlotsPlayState(): SlotsPlayState {
  return {
    achievements: [],
    lastPlayed: new Date(0),
    result: defaultSlotsResult(),
    energyAtLastPlay: getMaxEnergy(0),
    totalPointsEarned: 0,
    totalTokensEarned: 0,
    totalSpins: 0,
  };
}

export function getCurrentEnergy(
  lastPlayed: Date,
  level: number,
  energyAtLastPlay: number | undefined,
): number {
  const secondsSinceLastPlay =
    (Date.now() - new Date(lastPlayed).getTime()) / 1000;
  const maxEnergy = getMaxEnergy(level);
  const energyPerSecond = getEnergyRecoveryRate(level); // L20 = 1/3min, L1 = 1/12 min
  return Math.min(
    Math.max(maxEnergy, energyAtLastPlay || 0), // If the current energy is higher than max (due to potions), keep it
    (energyAtLastPlay || 0) +
      Math.floor(secondsSinceLastPlay * energyPerSecond),
  );
}

export function getSpinEnergyCost(itemsOwnedState: ItemsOwnedState): number {
  const tools = itemsOwnedState?.tool || {};
  return (
    500 -
    (tools[1] ? 25 : 0) -
    (tools[2] ? 50 : 0) -
    (tools[3] ? 75 : 0) -
    (tools[4] ? 100 : 0) // min = 250 energy per spin
  );
}

export function getEnergyRecoveryRate(level: number): number {
  return getMaxEnergy(level) / 3600;
}

export function getMaxEnergy(level: number | null) {
  return !level ? 2500 : level === 1 ? 5000 : 5000 + level * 500; // 5, 10, 12-20;
}


export async function getUser(user: UserData): Promise<MongoUser> {
  const telegramInitData = createTelegramInitData(user);
  const userBody = {
    telegramInitData: telegramInitData,
    referrerTelegramId: user.referred_by_id,
    timeZone: user.time_zone,
  }
  const createUserResponse = await fetch(BASE_ROUTE + API_ROUTES.user, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userBody),
  });
  const mongoUser = await createUserResponse.json() as MongoUser
  console.log("Got user:", mongoUser);
  return mongoUser;
}

export async function updateUser(update: MongoUserUpdate, user: UserData): Promise<boolean> {
  const db = await getDb()
  const users = db.collection("User");
  const dbUser = await users.findOne({ where: { telegramId: user.telegram_id } });
  if(!dbUser) {
    console.error("User not found in DB for update:", user.telegram_id);
    return false;
  }

  const result = await users.findOneAndUpdate({ telegramId: user.telegram_id }, { $set: update });
  return !!result;
}
