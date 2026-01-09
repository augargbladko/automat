import { UserData } from "../types/index.ts"
import { UserStatus } from "../utils/index.ts"

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
  return nextActionTime
}
