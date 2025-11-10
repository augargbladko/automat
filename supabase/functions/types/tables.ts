
import { Database } from "./supabase.ts";

export type TelegramUser = Database["public"]["Tables"]["telegram_users"]["Row"]
