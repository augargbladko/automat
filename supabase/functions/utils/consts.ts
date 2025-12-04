export const BASE_ROUTE = "https://dig-it-gold.vercel.app"
export enum ApiRoute {
  user = "/api/user", // { telegramInitData, referrerTelegramId, tonWalletAddress, timeZone }
  wallet = "/api/user/wallet", // { telegramInitData, tonWalletAddress }
  emailEntry = "/api/user/email/entry", // { telegramInitData, email }
  emailConfirm = "/api/user/email/confirm", // { email, telegramId } << email must be entered as requested // const authToken = req.headers.get('Authorization'); if (!authToken || authToken !== process.env.KLAYVIO_AUTHORIZATION) {
  purchaseTokens = "/api/verify-and-purchase-tokens", // { telegramInitData, packageId }
  tonPurchase = "/api/verify-ton-purchase", // { packageId, packageType, transactionHash }
  slotsPlay = "/api/games/slots", // { telegramInitData, timeZone }
}

export function convertDateToDayString(date: Date): string {
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`
}

export function getUserDayString(date: Date, timeZone: string | null): string {
  // Convert the current UTC time to the user's local time
  let userLocalTime: Date
  try {
    userLocalTime = new Date(
      date.toLocaleString("en-US", { timeZone: timeZone || undefined })
    )
  } catch (error) {
    console.error(`Invalid time zone from user. Defaulting to NOW: ${timeZone}`)
    userLocalTime = date
  }
  return convertDateToDayString(userLocalTime)
}
