export const dollarValue = (value: number | null | undefined) =>
  value
    ? `$${parseFloat(value.toPrecision(2)).toLocaleString(undefined, { maximumFractionDigits: 20 })}`
    : "-"
export const thousandDollarValue = (value: number | null | undefined) =>
  value ? `$${parseFloat(value.toPrecision(2)).toLocaleString()}k` : "-"
export const dollarToKValue = (value: number | null | undefined) =>
  value
    ? Math.abs(value) >= 1000000000000000
      ? `err`
      : Math.abs(value) >= 1000000
        ? `$${parseFloat((value / 1000000).toPrecision(2)).toLocaleString()}M`
        : `$${parseFloat((value / 1000).toPrecision(2)).toLocaleString()}k`
    : "-"
export const wholeDollarValue = (value: number | null | undefined) =>
  value ? `$${Math.floor(value).toLocaleString()}` : "-"
export const numberValue = (value: number | null | undefined) =>
  value ? value.toLocaleString() : "-"
export const wholeNumberValue = (value: number | null | undefined) =>
  value ? Math.floor(value).toLocaleString() : "-"
export const percentValue = (value: number | null | undefined) =>
  value ? `${parseFloat((value * 100).toPrecision(2)).toLocaleString()}%` : "-"
export const alreadyPercentValue = (value: number | null | undefined) =>
  value ? `${parseFloat(value.toPrecision(2)).toLocaleString()}%` : "-"

export const timeText = (timestamp: number | null | undefined) =>
  timestamp && timestamp > 0 ? new Date(timestamp * 1000).toLocaleString() : "-"

export const dayToTime = (day: string) => {
  return Math.floor(new Date(day).getTime() / 1000)
}
