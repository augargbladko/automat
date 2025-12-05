import { SupabaseClient } from "@supabase/supabase-js"
import { Tables, UserUpsert } from "../../types/index.ts"
import { supabaseStoreArray, supabaseStoreDataPoint } from "./supaFunc.ts"

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
  return await supabaseStoreDataPoint<UserUpsert>(
    supabase,
    user,
    Tables.user_data
  )
}
