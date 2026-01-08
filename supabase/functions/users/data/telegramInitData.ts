import crypto from "node:crypto"
import { UserData } from "../../types/index.ts"

interface ValidatedData {
  [key: string]: string
}

export interface TelegramUser {
  id?: string
  username?: string
  first_name?: string
  is_premium?: boolean
  photo_url?: string
}

interface ValidationResult {
  validatedData: ValidatedData | null
  telegramUser: TelegramUser
  message: string
}

export function getTelegramUser(user: UserData): TelegramUser {
  return {
    id: user.telegram_id.toString(),
    username: user.username || undefined,
    first_name: user.first_name || undefined,
    is_premium: user.is_premium || undefined,
    photo_url: user.photo_url || undefined,
  }
}

export function createTelegramInitData(user: UserData): string {
  const tgUser = getTelegramUser(user)
  const BOT_TOKEN = Deno.env.get("BOT_TOKEN") || ""
  const initData = new URLSearchParams()
  initData.set("auth_date", String(Math.floor(Date.now() / 1000 - 362)))
  initData.set("user", JSON.stringify(tgUser))

  for (const [key, value] of Object.entries(tgUser)) {
    if (value !== undefined) {
      initData.append(key, String(value))
    }
  }

  const dataCheckString = Array.from(initData.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest()
  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex")
  initData.set("hash", calculatedHash)
  return initData.toString()
}

export function validateTelegramWebAppData(
  telegramInitData: string
): ValidationResult {
  const BOT_TOKEN = Deno.env.get("BOT_TOKEN") || ""

  let validatedData: ValidatedData | null = null
  let user: TelegramUser = {}
  let message = ""

  const initData = new URLSearchParams(telegramInitData)
  const hash = initData.get("hash")

  if (!hash) {
    return {
      message: "serverChecks.hashMissing",
      validatedData: null,
      telegramUser: {},
    }
  }

  initData.delete("hash")

  // Check if auth_date is present and not older than 24 hours
  const authDate = initData.get("auth_date")
  if (!authDate) {
    return {
      message: "serverChecks.authDateMissing",
      validatedData: null,
      telegramUser: {},
    }
  }

  const authTimestamp = parseInt(authDate, 10)
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const timeDifference = currentTimestamp - authTimestamp
  const twentyFourHoursInSeconds = 24 * 60 * 60

  if (timeDifference > twentyFourHoursInSeconds) {
    return {
      message: "serverChecks.authDateExpired",
      validatedData: null,
      telegramUser: {},
    }
  }

  const dataCheckString = Array.from(initData.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest()
  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex")

  if (calculatedHash === hash) {
    validatedData = Object.fromEntries(initData.entries())
    message = "serverChecks.hashValidated"
    const userString = validatedData["user"]
    if (userString) {
      try {
        user = JSON.parse(userString)
      } catch (error) {
        console.error("Error parsing user data:", error, validatedData)
        message = "serverChecks.userDataParsingError"
        validatedData = null
      }
    } else {
      console.log("serverChecks.userDataMissing", validatedData)
      message = "serverChecks.userDataMissing"
      validatedData = null
    }
  } else {
    console.log(
      "serverChecks.hashMismatch",
      validatedData,
      calculatedHash,
      hash
    )
    message = "serverChecks.hashMismatch"
    console.log(message)
  }

  return { validatedData, telegramUser: user, message }
}
