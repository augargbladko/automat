import { SupabaseClient } from "supabase-jsr";
import {
  LaunchHoldingUpdate,
  LaunchOwner,
  LaunchOwnerUpdate,
  Tables,
  tableConflictKeys
} from "../../types/index.ts";
import { supabaseStoreArray } from "./index.ts";


export async function storeLaunchHoldings(
  supabase: SupabaseClient,
  holdings: LaunchHoldingUpdate[]
): Promise<boolean> {
  return await supabaseStoreArray(supabase, holdings, Tables.launch_holdings)
}

export async function storeLaunchOwners(
  supabase: SupabaseClient,
  holdings: LaunchOwner[]
): Promise<boolean> {
  return await supabaseStoreArray(supabase, holdings, Tables.launch_owners)
}

export async function storeLaunchOwner(
  supabase: SupabaseClient,
  launchOwner: LaunchOwnerUpdate
): Promise<boolean> {
  const { error } = await supabase
    .from(Tables.launch_owners)
    .upsert(launchOwner, {
      onConflict: tableConflictKeys[Tables.launch_owners],
    })
  if (error) {
    console.log("storeLaunchOwner error", error)
    return false
  } else {
    return true
  }
}
