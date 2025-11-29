
import { Database } from "./supabase.ts";

export type UserData = Database["public"]['Tables']['user_data']['Row'];
export type UserUpsert = Database["public"]['Tables']['user_data']['Insert'];
