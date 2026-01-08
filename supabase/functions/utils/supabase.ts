import { createClient, SupabaseClient } from "@supabase/supabase-js"
import process from "node:process"
import { Database } from "../types/supabase.ts"

export function secureConnectToSupabase(): SupabaseClient<Database> {
  const supabaseClient: SupabaseClient<Database> = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    {
      global: {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
        },
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
