
import { Database } from "./supabase.ts";

export type UserUpsert = Database["public"]['Tables']['user_data']['Insert'];
