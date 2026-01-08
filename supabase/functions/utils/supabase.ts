import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../types/supabase.ts"
import { supabaseServiceRoleKey, supabaseUrl } from "./index.ts"

export function secureConnectToSupabase(): SupabaseClient<Database> {
  const supabaseClient: SupabaseClient<Database> = createClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      global: {
        headers: { Authorization: `Bearer ${supabaseServiceRoleKey}` },
        fetch(url, options) {
          return fetch(url, {
            cache: "no-cache",
            ...options,
          })
        },
      },
    }
  )
  return supabaseClient
}
