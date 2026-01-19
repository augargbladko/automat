import { LEVEL_DAY_DATA } from "../users/data/levelDayData.ts"
import { convertDateToDayString } from "../utils/consts.ts"

function modifyUserAdd(input: number): number {
  if (input === 0) {
    return 0
  }
  const sign = input >= 0 ? 1 : -1
  let base = Math.abs(input)
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

  // if we can vary the divisor by time of day, we can get a spiky graph.
  // get the hour
  // rotate it by the day of the month
  // get a 5, and 7 sawtooth or similar

  const actual = Math.floor(base / 10)

  const remainder = base % 10

  return sign * (actual + (Math.random() < remainder ? 1 : 0))
}

export function getNumberOfUsersToAdd(): { realAdd: number; fakeAdd: number } {
  const now = new Date()
  const dayString = convertDateToDayString(now)
  const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const tomorrowString = convertDateToDayString(nextDay)
  const today = LEVEL_DAY_DATA[dayString] || {
    day: dayString,
    nugs: 0,
    real: 0,
    fake: 0,
  }
  const tomorrow = LEVEL_DAY_DATA[tomorrowString] || {
    day: tomorrowString,
    nugs: 0,
    real: 0,
    fake: 0,
  }

  const adjustmentFactor = Math.max(0, now.getUTCHours() - 16) / 8

  const fakeModifier =
    (((now.getDate() + now.getHours()) % 7) +
      (((11 * now.getDate()) / (now.getHours() + 1)) % 5)) /
    6 // 0 to 2

  const usersToAdd = {
    realAdd: Math.floor(
      modifyUserAdd(
        today.real +
          (tomorrow.real - today.real) *
            adjustmentFactor *
            (0.6 + Math.random() * 0.8)
      )
    ),
    fakeAdd: Math.floor(
      modifyUserAdd(
        today.fake * fakeModifier
        //(tomorrow.fake - today.fake) * adjustmentFactor * (0.6 + Math.random() * 0.8)
      )
    ),
  }
  return usersToAdd
}
