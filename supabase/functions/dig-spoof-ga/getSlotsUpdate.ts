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

const DAYS_BEHIND_GAP = {
  0: 5,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 4,
  6: 4,
  7: 4,
  8: 4,
  9: 4,
  10: 4,
}

export function fixTotalSpins(mongoUser: MongoUser): number {
  if ((mongoUser.slotsPlayState?.totalSpins || 0) < 10) {
    return mongoUser.slotsPlayState?.totalSpins || 0
  }
  const nowDate = new Date()
  const createdAt = mongoUser.createdAt
  if (!createdAt || nowDate <= createdAt) {
    return (
      mongoUser.slotsPlayState.totalSpins || Math.floor(Math.random() * 3 + 2)
    )
  }
  const maxSpins = (nowDate.getTime() - createdAt.getTime()) / 1000 / (60 * 12) // 1 spin every 12 minutes
  const halfMax = maxSpins / 2
  if (mongoUser.slotsPlayState.totalSpins > halfMax * 1.5) {
    return Math.floor(halfMax * (0.9 + Math.random() * 0.3))
  } else {
    return mongoUser.slotsPlayState.totalSpins
  }
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

  let nugs = (LEVEL_DAY_DATA[todayString]?.nugs || 0) * 1e6
  let ore = nugs * (8 + Math.random() * 4) // 8x to 12x the amount of ore

  nugs = Math.floor((nugs * 0.3 + Math.random() * nugs * 1.4) / 4 / 50) * 50
  ore = Math.floor((ore * 0.8 + Math.random() * ore * 0.4) / 4 / 1000) * 1000

  // Yikes, need to stop the zero referrals getting tons of nugs/ore
  if (user.referral_group === 0) {
    ore = Math.floor(8 + Math.random() * 40) * 1000
    nugs = Math.floor(Math.random() * 20) * 50
  }
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
  const shouldUpdateDay =
    shouldUpdateDate || mongoUser.lastLoginDay === todayString
  if (shouldUpdateDate) {
    console.log(
      `should update date for user ${user.telegram_id}:`,
      lastPlayed,
      lastPlayedGap
    )
  }

  const slotsUpdate: MongoSlotsUpdate = {
    tokenBalance: mongoUser.tokenBalance + nugs,
    pointsBalance: mongoUser.pointsBalance + ore,
    lastLoginDay: todayString, // this will trigger the GA run only if it's "today"
    slotsLastPlayed: date.toISOString(), // we don't update this one if we aren't updating the date
    lastActivityAt: date,
    energyFullNotificationTime: new Date(
      date.getTime() +
        60 * 60 * 1000 +
        Math.floor((2 + Math.random() * 7) * 60 * 1000) // add the 10-ish mins to be more random
    ), // 1 hour from now,
    slotsPlayState: {
      ...mongoUser.slotsPlayState,
      totalPointsEarned: mongoUser.slotsPlayState.totalPointsEarned + ore,
      totalTokensEarned: mongoUser.slotsPlayState.totalTokensEarned + nugs,
      totalSpins:
        mongoUser.slotsPlayState.totalSpins +
        5 * 3 +
        Math.floor(Math.random() * 4),
      energyAtLastPlay: 100 + Math.floor(Math.random() * 300),
      lastPlayed: shouldUpdateDate
        ? date.toISOString()
        : mongoUser.slotsPlayState.lastPlayed,
    },
    telegramId: mongoUser.telegramId,
  }

  slotsUpdate.slotsPlayState.totalSpins = fixTotalSpins(mongoUser)

  if (!shouldUpdateDay) {
    // fix old last login day if needed
    const newDay = convertDateToDayString(
      new Date(slotsUpdate.slotsPlayState.lastPlayed!)
    )
    if (!mongoUser.lastLoginDay && newDay < todayString) {
      mongoUser.lastLoginDay = newDay
    } else {
      delete slotsUpdate.lastLoginDay
    }
  }
  if (!shouldUpdateDate) {
    slotsUpdate.slotsLastPlayed = slotsUpdate.slotsPlayState.lastPlayed
    slotsUpdate.lastActivityAt = new Date(
      slotsUpdate.slotsPlayState.lastPlayed!
    )
    slotsUpdate.energyFullNotificationTime = new Date(
      slotsUpdate.lastActivityAt.getTime() +
        60 * 60 * 1000 + // 1 hour from now,
        Math.floor((2 + Math.random() * 7) * 60 * 1000) // add the 10-ish mins to be more random
    )
  }
  return slotsUpdate
}
