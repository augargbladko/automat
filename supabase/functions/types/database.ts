import { Tables } from "./interfaces/enums.ts";

// MUST be separated by ", "
export const tableConflictKeys: Record<Tables, string> = {
  user_data: "telegram_id",
}
