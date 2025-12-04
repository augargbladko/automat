import { UserData } from "../types/index.ts"
import { UserStatus } from "./data/types.ts"

export function getNextActionTime(user: UserData): number {
  const nextActionTime =
    user.user_status === UserStatus.live
      ? Math.floor(
          Date.now() / 1000 +
            (user.referral_group
              ? (5.5 + Math.random()) * 60 * 60 // reals 1 per 5.5-6.5hrs (small variance)
              : (6 + Math.random()) * 4 * 60 * 60) // fakes 1 per 24-28 hours
        )
      : 2_147_483_647
  console.log(
    `Next action time for user ${user.telegram_id} set to ${new Date(nextActionTime * 1000).toISOString()} at ${new Date().toISOString()}`
  )
  return nextActionTime
}
