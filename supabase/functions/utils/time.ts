export async function delay(ms: number): Promise<boolean> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
  return true
}

export function currentWeek(): number {
  return Math.floor(Date.now() / 86400 / 1000 / 7) * 86400 * 7
}

export function currentTime(): number {
  return Math.floor(Date.now() / 1000)
}

export function oneWeekFromNow(): number {
  return currentTime() + 86400 * 7
}

export function oneDayFromNow(): number {
  return currentTime() + 86400
}

export const oneYear = 86400 * 365
export const sixMonths = 86400 * 30 * 6

export function sixMonthsAgo(): number {
  return currentTime() - sixMonths
}

export function toDay(timestamp: number): string | undefined {
  if (timestamp <= 0 || timestamp > 2147483647) return undefined
  const date = new Date(timestamp * 1000)
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`
}
