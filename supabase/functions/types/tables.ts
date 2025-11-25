
import { Database } from "./supabase.ts";

export type TelegramUser = Database["public"]["Tables"]["user_data"]["Row"]
