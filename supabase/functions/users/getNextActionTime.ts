import { UserData } from "../types/index.ts"
import { UserStatus } from "./data/types.ts"

export function getNextActionTime(user: UserData): number {
  return user.user_status === UserStatus.live
    ? Math.floor(
        Date.now() / 1000 +
          (user.referral_group
            ? (6 + Math.random()) * 60 * 60
            : (6 + Math.random()) * 4 * 60 * 60)
      )
    : 2_147_483_647
}
