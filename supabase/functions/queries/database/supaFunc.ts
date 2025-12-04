import { createClient, SupabaseClient } from "@supabase/supabase-js"

import { tableConflictKeys } from "../../types/database.ts"
import { Tables } from "../../types/interfaces/enums.ts"
import { Database } from "../../types/supabase.ts"
import {
  supabaseAnonKey,
  supabaseServiceRoleKey,
  supabaseUrl,
} from "../../utils/index.ts"

export function secureConnectToSupabase(): SupabaseClient<Database> {
  const supabaseClient: SupabaseClient<Database> = createClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      global: {
        headers: { Authorization: `Bearer ${supabaseServiceRoleKey}` },
      },
    }
  )
  return supabaseClient
}

export function connectToSupabase(req: Request): SupabaseClient {
  const authHeader = req.headers.get("Authorization")!
  const supabaseClient: SupabaseClient = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    { global: { headers: { Authorization: authHeader } } }
  )
  return supabaseClient
}

export async function supabaseStoreDataPoint<T>(
  supabase: SupabaseClient,
  dataPoint: T,
  tableName: Tables
): Promise<boolean> {
  const result = await supabaseStoreArray<T>(supabase, [dataPoint], tableName)
  return result
}

export async function supabaseStoreArray<T>(
  supabase: SupabaseClient,
  dataToStore: T[],
  tableName: Tables
): Promise<boolean> {
  let isSuccess = true
  dataToStore = dataToStore.filter(
    (data) => data !== undefined && data !== null
  )
  if (dataToStore.length === 0) {
    return isSuccess
  }
  let retries = 0
  let cont = 0
  try {
    for (cont; cont < dataToStore.length; cont += 1000) {
      if (cont < 0) {
        cont = 0
      }
      const { error } = await supabase
        .from(tableName)
        .upsert(
          dataToStore.length < 1000
            ? dataToStore
            : dataToStore.slice(cont, cont + 1000),
          { onConflict: tableConflictKeys[tableName] }
        )
        .select("*")
      if (error) {
        if (retries < 4) {
          retries++
          console.log(
            `retrying storage for ${tableName}: supabase error:`,
            error.code,
            error.details,
            error.message,
            retries
          )
          cont -= 1000
        } else {
          console.error(
            `failed to store ${tableName}: supabase error:`,
            error.code,
            error.details,
            error.message
          )
          console.log(JSON.stringify(dataToStore, null, 2))
          return false
        }
      }
    }
  } catch (err) {
    console.error(`failed to store ${tableName}: exception:`, err)
    console.error(JSON.stringify(dataToStore, null, 2))
    isSuccess = false
  }
  return isSuccess
}

export async function supabaseInsertArray<T>(
  supabase: SupabaseClient,
  dataToStore: T[],
  tableName: Tables
): Promise<boolean> {
  let isSuccess = true
  if (dataToStore.length === 0) {
    return isSuccess
  }
  try {
    const { error } = await supabase
      .from(tableName)
      .upsert(dataToStore, {
        onConflict: tableConflictKeys[tableName],
        ignoreDuplicates: true,
      })
      .select()
    if (error) {
      console.error(
        `failed to insert into ${tableName}: supabase error:`,
        error.code,
        error.details,
        error.message
      )
      console.error(JSON.stringify(dataToStore, null, 2))
      isSuccess = false
    } /*else {
      console.log(
        `successfully added or updated ${data.length} to ${tableName}`
      );
    }*/
  } catch (err) {
    console.error(`failed to store ${tableName}: exception:`, err)
    console.error(JSON.stringify(dataToStore, null, 2))
    isSuccess = false
  }
  return isSuccess
}

export async function supabaseUpdateDataPoint<T extends Record<string, any>>(
  supabase: SupabaseClient,
  dataToStore: T,
  tableName: Tables
): Promise<boolean> {
  let isSuccess = true
  if (!dataToStore) {
    return false
  }
  try {
    const keys = (tableConflictKeys[tableName] || "")
      .replaceAll(" ", "")
      .split(",")
    if (keys.length === 0) {
      console.error("no keys for update in table", tableName)
      return false
    }
    const query = supabase.from(tableName).update(dataToStore)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (dataToStore[key]) {
        query.eq(key, dataToStore[key])
      } else {
        console.error("data to store does not contain key", key, dataToStore)
        return false
      }
    }
    const { error } = await query.select()
    if (error) {
      console.error(
        `failed to insert into ${tableName}: supabase error:`,
        error.code,
        error.details,
        error.message
      )
      console.error(JSON.stringify(dataToStore, null, 2))
      isSuccess = false
    } /*else {
      console.log(
        `successfully added or updated ${data.length} to ${tableName}`
      );
    }*/
  } catch (err) {
    console.error(`failed to store ${tableName}: exception:`, err)
    console.error(JSON.stringify(dataToStore, null, 2))
    isSuccess = false
  }
  return isSuccess
}
