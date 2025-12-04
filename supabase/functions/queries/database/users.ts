import { SupabaseClient } from "@supabase/supabase-js"
import { Tables, UserUpsert, tableConflictKeys } from "../../types/index.ts"
import { supabaseStoreArray } from "./supaFunc.ts"

export async function storeUsers(
  supabase: SupabaseClient,
  users: UserUpsert[]
): Promise<boolean> {
  return await supabaseStoreArray<UserUpsert>(supabase, users, Tables.user_data)
}

export async function storeUser(
  supabase: SupabaseClient,
  user: UserUpsert
): Promise<boolean> {
  const { error } = await supabase.from(Tables.user_data).upsert(user, {
    onConflict: tableConflictKeys[Tables.user_data],
  })
  if (error) {
    console.log("storeUser error", error)
    return false
  } else {
    return true
  }
}
