import { SupabaseClient } from "@supabase/supabase-js";
import {
  Tables,
  TelegramUser,
  tableConflictKeys
} from "../../types/index.ts";
import { supabaseStoreArray } from "./supabase.ts";


export async function storeTelegramUsers(
  supabase: SupabaseClient,
  users: TelegramUser[]
): Promise<boolean> {
  return await supabaseStoreArray(supabase, users, Tables.user_data)
}

export async function storeTelegramUser(
  supabase: SupabaseClient,
  user: TelegramUser
): Promise<boolean> {
  const { error } = await supabase
    .from(Tables.user_data)
    .upsert(user, {
      onConflict: tableConflictKeys[Tables.user_data],
    })
  if (error) {
    console.log("storeTelegramUser error", error)
    return false
  } else {
    return true
  }
}
