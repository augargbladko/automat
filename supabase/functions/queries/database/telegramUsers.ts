import { SupabaseClient } from "supabase-jsr";
import {
  Tables,
  TelegramUser,
  tableConflictKeys
} from "../../types/index.ts";
import { supabaseStoreArray } from "./index.ts";


export async function storeTelegramUsers(
  supabase: SupabaseClient,
  users: TelegramUser[]
): Promise<boolean> {
  return await supabaseStoreArray(supabase, users, Tables.telegram_users)
}

export async function storeTelegramUser(
  supabase: SupabaseClient,
  user: TelegramUser
): Promise<boolean> {
  const { error } = await supabase
    .from(Tables.telegram_users)
    .upsert(user, {
      onConflict: tableConflictKeys[Tables.telegram_users],
    })
  if (error) {
    console.log("storeTelegramUser error", error)
    return false
  } else {
    return true
  }
}
