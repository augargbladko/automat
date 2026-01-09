// Add the user's play, purchase, and Ore/NUGS

import { UserData } from "../types/index.ts"
import { convertDateToDayString, getUserDayString } from "../utils/consts.ts"
import {
  defaultItemsState,
  MongoUserUpdate,
  PackageType,
} from "../utils/index.ts"
import { getGoldenSpinResult } from "./data/goldenSpin.ts"
import { LEVEL_PACKAGES } from "./data/packages.ts"
import {
  defaultSlotsPlayState,
  getMaxEnergy,
  getUser,
  updateUser,
} from "./user.ts"

export async function setUserData(user: UserData) {
  const mongoUser = await getUser(user)
  if (!mongoUser) {
    console.error("Cannot set user data, user not found:", user.telegram_id)
    return
  } else if (mongoUser.level === user.user_level) {
    console.error(
      "Already updated user level, no action needed:",
      user.telegram_id
    )
    return
  }
  // we're going to do a direct database update for the user
  //   the database just won't update if we don't have this user.
  const createdNow = new Date(mongoUser.createdAt)
  createdNow.setDate(createdNow.getDate() - 15 - Math.floor(Math.random() * 30)) // set created date to up to 15-45 days before the previous one
  const userNow = new Date()
  userNow.setMinutes(userNow.getMinutes() - Math.random() * 1200) // set to up to 20 minutes ago
  const update: MongoUserUpdate = {
    level: user.user_level || 0,
    createdAt: createdNow,
    createdDay: convertDateToDayString(createdNow),
    slotsLastPlayed: userNow.toISOString(), // set to 10 minutes ago to allow immediate play
    lastLoginDay: getUserDayString(userNow, user.time_zone),
    loginBonusStreak: 30,
  }

  // slotsplayedstate
  const spinResult = getGoldenSpinResult()
  update.goldenSpinState = {
    packageType: PackageType.levels,
    packageId: user.user_level || 0,
    result: spinResult.result,
    points: spinResult.points,
    tokens: spinResult.tokens,
    readyToCollect: false,
  }
  const treasure = user.treasure || 0
  if (treasure > 0) {
    update.itemsOwnedState = {
      ...(mongoUser.itemsOwnedState || defaultItemsState()),
      treasure: {
        1: treasure >= 1 && Math.random() > 0.2 ? 1 : 0, // add a little randomness, so not everyone has all treasures
        2: treasure >= 2 && Math.random() > 0.15 ? 1 : 0,
        3: treasure >= 3 && Math.random() > 0.1 ? 1 : 0,
        4: treasure >= 4 && Math.random() > 0.05 ? 1 : 0,
      },
    }
  }
  const tonSpent =
    (LEVEL_PACKAGES.find((p) => p.level === user.user_level)?.tonPrice || 0) +
    update.itemsOwnedState!.treasure[1] +
    update.itemsOwnedState!.treasure[2] * 2 +
    update.itemsOwnedState!.treasure[3] * 5 +
    update.itemsOwnedState!.treasure[4] * 10
  if (tonSpent > 0) {
    update.tonSpend = tonSpent
  }

  const pointsPerSpin =
    Math.floor(
      (1900000 *
        (LEVEL_PACKAGES.find((p) => p.level === user?.user_level || 0)
          ?.multiplier || 1) *
        (1 + Math.random() / 5)) /
        1000
    ) * 1000
  const tokensPerSpin =
    Math.floor(
      ((20000 +
        update.itemsOwnedState!.treasure[1] * 4500 +
        update.itemsOwnedState!.treasure[2] * 7500 +
        update.itemsOwnedState!.treasure[3] * 15500 +
        update.itemsOwnedState!.treasure[4] * 22500) *
        (1 + Math.random() / 5)) /
        50
    ) * 50 // 0-20% variance
  const totalSpins = Math.floor(
    (getMaxEnergy(user.user_level) / 500) *
      24 *
      30 *
      2 *
      (0.8 + Math.random() / 2)
  ) // 3 months of spins
  const pointsFromSpins = pointsPerSpin * totalSpins
  const tokensFromSpins = tokensPerSpin * totalSpins
  update.pointsBalance = (mongoUser.pointsBalance || 0) + pointsFromSpins
  update.tokenBalance = (mongoUser.tokenBalance || 0) + tokensFromSpins

  update.slotsPlayState = {
    ...(mongoUser.slotsPlayState || defaultSlotsPlayState()),
    totalPointsEarned: pointsFromSpins,
    totalTokensEarned: tokensFromSpins,
    totalSpins: totalSpins,
  }
  // update slotsplayedstate
  await updateUser(update, user)
}

/*export async function updateUserPlayData(user: UserData) {
  const mongoUser = await getUser(user);
  if (!mongoUser || !mongoUser.slotsPlayState) {
    console.error("Cannot set user data, user not found:", user.telegramId);
    return;
  }
  
  // L2 = 1 TON, 10 spins/hr (+ energy) = 20k t/sp for 3 months
  // L2 + T1 = 2 TON, 10 spins, 25k t/sp
  // L3 = 2 TON, 12 spins, 20k t/sp
  // L6 = 6 TON, 
  // L10 = 25 TON, 20 spins/hr

  // 5000 users with 25TON spend is 125k hidden TON.

  // Full treasure = 2x spins (2/5/10/20)
  // Full items = 70k tokens per spin (1/2/5/10) 60/50/40/30 improvement
  //   item 1 = +4.5k
  //   item 2 = +7.6k
  //   item 3 = +15.25k
  //   item 4 = +22.7k
  // No items = 20k tokens per spin

  // andrew (11/16 start)
totalPointsEarned 308507000000 // 52M points per spin
totalTokensEarned 424449750 // 71,637 tokens per spin
totalSpins 5925

// smaug (9/1 start)
totalPointsEarned 5,250,812,045,000 // 58M points per spin
totalTokensEarned 6,303,475,600 // 70k tokens/spin
totalSpins 89735


totalPointsEarned 55543m // 64M points/spin (potions/elixirs)
totalTokensEarned 81m // 93k tokens/spin (potions/elixirs)
totalSpins 868


// NO ITEMS

totalPointsEarned 85566M // 33M points/spin
totalTokensEarned 33M // 13K tokens/spin
totalSpins 2542

totalPointsEarned 116337M // 10M points/spin
totalTokensEarned 113M // 10K tokens/spin
totalSpins 11069


totalPointsEarned 69892M // 25M points/spin
totalTokensEarned 57M // 20K tokens/spin
totalSpins 2759

// Level 7

totalPointsEarned 33080M // 15M points/spin
totalTokensEarned 49M // 23K tokens/spin
totalSpins 2129

// Level 0
totalPointsEarned 1747M // 2.45M points/spin
totalTokensEarned 19M // 26k tokens/spin
totalSpins
713


If I want to earn 1.5Bn NUGS at 70K NUGS per spin, that's about 21,429 spins.

  const update: MongoUserUpdate = {
    slotsPlayState: {
      ...mongoUser.slotsPlayState,
      lastPlayed: new Date(),
      totalSpins: mongoUser.slotsPlayState?.totalSpins || 0,
      totalPoints: mongoUser.slotsPlayState?. || 0,
      totalTokens: mongoUser.slotsPlayState?.totalTokens || 0,
    }
  };
}*/
