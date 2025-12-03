import { Tables } from "./interfaces/enums.ts"

// MUST be separated by ", "
export const tableConflictKeys: Record<Tables, string> = {
  user_data: "telegram_id",
}

export const UserCol = {
  telegram_id: "telegram_id",
  is_premium: "is_premium",
  first_name: "first_name",
  username: "username",
  wallet_id: "wallet_id",
  wallet_address: "wallet_address",
  email: "email",
  confirmed_email: "confirmed_email",
  user_level: "user_level",
  treasure: "treasure",
  spend: "spend",
  spend_total: "spend_total",
  referred_by_id: "referred_by_id",
  referral_group: "referral_group",
  referral_pos: "referral_pos",
  user_status: "user_status",
  user_error: "user_error",
  operating_system: "operating_system",
  browser: "browser",
  category: "category",
  screen_resolution: "screen_resolution",
  city: "city",
  country_id: "country_id",
  region_id: "region_id",
  time_zone: "time_zone",
  next_action_time: "next_action_time",
}
