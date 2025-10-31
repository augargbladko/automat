
import { secureConnectToSupabase } from "../database/index.ts";
import { recursiveGetParticipants } from "./recursiveGetParticipants.ts";
import { testClient } from "./testClient.ts";

// to run this file with Deno:
// deno run --allow-all --env-file supabase/functions/queries/telegram/scrapeUsers.ts

async function scrapeUsers() {
  const supabase = secureConnectToSupabase();
  const session = await supabase.from('dave').select('*');
  console.log("Connected to Supabase.", session);
  const client = await testClient();
  await recursiveGetParticipants(client, supabase, "https://t.me/somechannel");
  // function implementation
  // const channel = getChannelToScrape(supabase);

  // storeUserDataArray(supabase, [])
}

scrapeUsers();