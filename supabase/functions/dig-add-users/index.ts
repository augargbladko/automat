// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { secureConnectToSupabase } from "../queries/database/supabase.ts";
import { Tables } from "../types/index.ts";
import { createUser } from "../users/createUser.ts";
import { UserStatus } from "../users/data/types.ts";
import { denoServe, handleCORS } from "../utils/index.ts";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const startDate = new Date("2023-12-03T00:00:00Z");
const realPerTen = [1, 2, 2, 2, 3, 4, 5, 8, 8, 8, 8, 8, 11, 8, 11, 12, 11, 14, 15, 12, 11]
const fakePerTen = [0,0,1,2,2,3,3,2,5,3,6,7,7,8,8,11,10,10,10,10,8,15,9,11,12,10,9,6,7,5,8,7,9,6,8,8,8,5,6,8,7,7,8,5,6,6,5,6,4,8,8,4,4,5,7,7,5,5,3,7,3,6,3,7,6,5,7,7,3,7,5,4,7,2,4,2,4,6,4,4,6,3,4,4,5,6,2,4,5,2,2,5,1,2,3,4,4,2,1,3,3,3,2]

function modifyUserAdd(base: number): number {
  // apply some randomness
  let threeChance = 0;
  let twoChance = 0;
  let oneChance = 0;
  if (base > 6) {
    threeChance = 0.35;
    twoChance = 0.25;
    oneChance = 0.15;
  } else if (base > 5) {
    threeChance = 0.32;
    twoChance = 0.25;
    oneChance = 0.15;
  } else if (base > 4) {
    threeChance = 0.3;
    twoChance = 0.27;
    oneChance = 0.15;
  } else if (base > 3) {
    twoChance = 0.3;
    oneChance = 0.15;
  } else if (base > 2) {
    twoChance = 0.3;
    oneChance = 0.2;
  } else if (base > 1) {
    oneChance = 0.25;
  } else if (base > 0) {
    oneChance = 0.2;
  }
  const chance = Math.random();
  if (chance < oneChance) {
    base += 1;
  } else if (chance < twoChance) {
    base += 2;
  } else if (chance < threeChance) {
    base += 3;
  } else if (chance > (1 - oneChance)) {
    base = Math.max(0, base - 1);
  } else if (chance > (1 - twoChance)) {
    base = Math.max(0, base - 2);
  } else if (chance > (1 - threeChance)) {
    base = Math.max(0, base - 3);
  }
  return base
}

export function getUsersToAdd(): { realAdd: number, fakeAdd: number } {
  const now = new Date();
  if (now < startDate) {
    console.log("Before start date, no users to add", new Date(startDate.getTime()-now.getTime()).toTimeString());  ;
    return { realAdd: 0, fakeAdd: 0 };
  }
  const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const realBase = daysSinceStart < realPerTen.length ? realPerTen[daysSinceStart] : 0;
  const fakeBase = daysSinceStart < fakePerTen.length ? fakePerTen[daysSinceStart] : 0;
  const realNext = daysSinceStart + 1 < realPerTen.length ? realPerTen[daysSinceStart + 1] : 0;
  const fakeNext = daysSinceStart + 1 < fakePerTen.length ? fakePerTen[daysSinceStart + 1] : 0;
  
  const adjustmentFactor = Math.max(0,(now.getUTCHours() - 16)) / 8;

  const usersToAdd = {
    realAdd: modifyUserAdd(realBase + Math.round((realNext - realBase) * adjustmentFactor)),
    fakeAdd: modifyUserAdd(fakeBase + Math.round((fakeNext - fakeBase) * adjustmentFactor))
  };
  console.log(`Users to add calculation: now=${now.toUTCString()}, realBase=${realBase}, fakeBase=${fakeBase}, usersToAdd=${JSON.stringify(usersToAdd)}`);
  return usersToAdd;
}

const isTest = true;

// this cron runs every 10 minutes.
denoServe(
  handleCORS(async () => {
    console.log("Dig add users called");
    const supabase = secureConnectToSupabase()

    // figure out the correct number of users to add in this 10min block.
    const { realAdd, fakeAdd } = getUsersToAdd();

    const realUsers = (await supabase.from(Tables.user_data).select('*')
      .neq('referral_group', 0)
      .eq('user_status', UserStatus.none)
      .order('referral_group', { ascending: true })
      .order('referral_pos', { ascending: true })
      .limit(realAdd))?.data || []
    
    const fakeUsers = (await supabase.from(Tables.user_data).select('*')
      .eq('referral_group', 0)
      .eq('user_status', UserStatus.none)
      .order('referral_pos', { ascending: true })
      .limit(fakeAdd))?.data || []
        
    if (isTest) {
      console.log("Test mode, not adding users.");
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      })
    }

    const realResults = await Promise.all(realUsers.map((user) => { createUser(supabase, user); }));
    console.log("Real user creation results:", realResults);
    const fakeResults = await Promise.all(fakeUsers.map((user) => { createUser(supabase, user); }));
    console.log("Fake user creation results:", fakeResults);

    // ensure the one-time GA stuff gets run
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      })
  })
)

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/dig-add-users' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"channel":"bibleverses" }'

*/

/* To invoke from another Supabase Function:

    const supabase = await connectToSupabase(req)
    const response = await supabase.functions.invoke('ingest-telegram-users', {
      body: { channel: 'bibleverses' },
    })

*/
