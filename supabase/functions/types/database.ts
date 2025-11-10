import { Tables } from "./interfaces/enums.ts";

// MUST be separated by ", "
export const tableConflictKeys: Record<Tables, string> = {
  telegram_users: "telegram_id",
}
