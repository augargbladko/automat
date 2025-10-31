export function tryParseDay(day: string): number {
  try {
    return Math.floor(new Date(day).getTime() / 1000)
  } catch (_err) {
    console.error("error parsing day to time:", day)
    return 0
  }
}

export function tryParseFloat(input: string): number {
  try {
    return !input ? 0 : parseFloat(input)
  } catch (_err) {
    return 0
  }
}

export function tryParseInt(input: string): number {
  try {
    return !input ? 0 : parseInt(input)
  } catch (_err) {
    return 0
  }
}
