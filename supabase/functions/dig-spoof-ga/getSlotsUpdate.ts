import { UserData } from "../types/index.ts"
import { LEVEL_DAY_DATA } from "../users/data/levelDayData.ts"
import { MongoSlotsUpdate, MongoUser } from "../users/data/types.ts"
import { convertDateToDayString } from "../utils/consts.ts"

const LEVEL_TO_PLAY_GAP: { [level: number]: number } = {
  0: 13 * 24 * 60 * 60 * 1000,
  1: 3 * 24 * 60 * 60 * 1000,
  2: 5 * 24 * 60 * 60 * 1000,
  3: 7 * 24 * 60 * 60 * 1000,
  4: 11 * 24 * 60 * 60 * 1000,
  5: 11 * 24 * 60 * 60 * 1000,
  6: 11 * 24 * 60 * 60 * 1000,
  7: 11 * 24 * 60 * 60 * 1000,
  8: 11 * 24 * 60 * 60 * 1000,
  9: 11 * 24 * 60 * 60 * 1000,
  10: 11 * 24 * 60 * 60 * 1000,
}

export function getSlotsUpdate(
  user: UserData,
  mongoUser: MongoUser
): MongoSlotsUpdate | null {
  if (!user || !mongoUser.slotsPlayState?.lastPlayed) {
    console.error(
      "Invalid user or mongoUser data for slots update:",
      user,
      mongoUser
    )
    return null
  }
  const date = new Date()
  const todayString = convertDateToDayString(date)

  let { ore, nugs } = LEVEL_DAY_DATA[todayString] || {
    day: todayString,
    ore: 0,
    nugs: 0,
    real: 0,
    fake: 0,
  }
  ore = Math.floor((ore * 0.8 + Math.random() * ore * 0.4) / 4 / 1000) * 1000
  nugs = Math.floor((nugs * 0.3 + Math.random() * nugs * 1.4) / 4 / 50) * 50
  if (ore <= 0) {
    console.log("No ore to award for user:", user.telegram_id)
    return null
  }

  const lastPlayedGap =
    LEVEL_TO_PLAY_GAP[user.user_level || 0] || 11 * 24 * 60 * 60 * 1000
  const lastPlayed = new Date(
    mongoUser.slotsPlayState?.lastPlayed || 0
  ).getTime()
  const shouldUpdateDate = date.getTime() - lastPlayed > lastPlayedGap
  console.log(
    `should update date for user ${user.telegram_id}:`,
    shouldUpdateDate,
    lastPlayed,
    lastPlayedGap
  )

  const slotsUpdate: MongoSlotsUpdate = {
    tokenBalance: mongoUser.tokenBalance + nugs,
    pointsBalance: mongoUser.pointsBalance + ore,
    lastLoginDay: shouldUpdateDate ? todayString : undefined,
    slotsLastPlayed: shouldUpdateDate ? date.toISOString() : undefined, // we don't update this one if we aren't updating the date
    slotsPlayState: {
      ...mongoUser.slotsPlayState,
      totalPointsEarned: mongoUser.slotsPlayState.totalPointsEarned + ore,
      totalTokensEarned: mongoUser.slotsPlayState.totalTokensEarned + nugs,
      totalSpins:
        mongoUser.slotsPlayState.totalSpins +
        5 * 6 +
        Math.floor(Math.random() * 6),
      energyAtLastPlay: 100 + Math.floor(Math.random() * 300),
      lastPlayed: shouldUpdateDate
        ? date.toISOString()
        : mongoUser.slotsPlayState.lastPlayed,
    },
    telegramId: mongoUser.telegramId,
  }
  console.log(
    `Prepared slots update for user ${user.telegram_id}:`,
    slotsUpdate
  )
  return slotsUpdate
}
