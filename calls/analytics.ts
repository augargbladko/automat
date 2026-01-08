import { secureConnectToSupabase } from "@/supabase/functions/utils/index"

interface AnalyticsResult {
  user_status: string
  referral_group: number
  sum: number
  count: number
}

export async function getAnalytics(): Promise<AnalyticsResult[]> {
  const supabase = secureConnectToSupabase()

  const { data, error } = await supabase
    .from("user_data")
    .select("user_status, referral_group, nugs.sum(), user_status.count()")
  if (error) {
    return []
  } else {
    return data
  }
}
