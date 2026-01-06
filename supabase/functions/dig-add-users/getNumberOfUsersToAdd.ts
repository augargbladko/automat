import { LEVEL_DAY_DATA } from "../users/data/levelDayData.ts"
import { convertDateToDayString } from "../utils/consts.ts"

function modifyUserAdd(base: number): number {
  // apply some randomness
  let threeChance = 0
  let twoChance = 0
  let oneChance = 0
  if (base > 6) {
    threeChance = 0.35
    twoChance = 0.25
    oneChance = 0.15
  } else if (base > 5) {
    threeChance = 0.32
    twoChance = 0.25
    oneChance = 0.15
  } else if (base > 4) {
    threeChance = 0.3
    twoChance = 0.27
    oneChance = 0.15
  } else if (base > 3) {
    twoChance = 0.3
    oneChance = 0.15
  } else if (base > 2) {
    twoChance = 0.3
    oneChance = 0.2
  } else if (base > 1) {
    oneChance = 0.25
  } else if (base > 0) {
    oneChance = 0.2
  }
  const chance = Math.random()

  if (chance < oneChance) {
    base += 1
  } else if (chance < twoChance) {
    base += 2
  } else if (chance < threeChance) {
    base += 3
  } else if (chance >= 1 - oneChance) {
    base = Math.max(0, base - 1)
  } else if (chance >= 1 - twoChance) {
    base = Math.max(0, base - 2)
  } else if (chance >= 1 - threeChance) {
    base = Math.max(0, base - 3)
  }

  const actual = Math.floor(base / 10)

  const remainder = base % 10

  return actual + (Math.random() < remainder ? 1 : 0)
}

export function getNumberOfUsersToAdd(): { realAdd: number; fakeAdd: number } {
  const now = new Date()
  const dayString = convertDateToDayString(now)
  const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const tomorrowString = convertDateToDayString(nextDay)
  const today = LEVEL_DAY_DATA[dayString] || {
    day: dayString,
    ore: 0,
    nugs: 0,
    real: 0,
    fake: 0,
  }
  const tomorrow = LEVEL_DAY_DATA[tomorrowString] || {
    day: tomorrowString,
    ore: 0,
    nugs: 0,
    real: 0,
    fake: 0,
  }

  const adjustmentFactor = Math.max(0, now.getUTCHours() - 16) / 8

  const usersToAdd = {
    realAdd: Math.floor(
      modifyUserAdd(
        Math.max(
          0,
          today.real +
            (tomorrow.real - today.real) * adjustmentFactor * Math.random() * 2
        )
      )
    ),
    fakeAdd: Math.floor(
      modifyUserAdd(
        Math.max(
          0,
          today.fake +
            (tomorrow.fake - today.fake) * adjustmentFactor * Math.random() * 2
        )
      )
    ),
  }
  return usersToAdd
}
