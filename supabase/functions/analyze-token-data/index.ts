// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { SupabaseClient } from "supabase-jsr";
import {
  connectToSupabase,
  storeTokenDataArray
} from "../queries/database/index.ts";
import { Tables } from "../types/index.ts";
import { Token, TokenUpdate } from "../types/tables.ts";
import { currentTime, delay, denoServe, handleCORS } from "../utils/index.ts";

denoServe(
  handleCORS(async (req) => {
    const supabase = await connectToSupabase(req)
    const oneMonthAgo = currentTime() - 86400 * 15
    await skipLowHolder(supabase, oneMonthAgo)
    // await ignoreEmAll(supabase)
    // TODOFUTURE - set up ignores again, anything 60 days old, and d25 <= 0

    // TODOFUTURE - unpause this
    await analyseTokenData(supabase, oneMonthAgo, 200)
    return new Response(
      JSON.stringify({ result: "completed analyze token data" }),
      {
        headers: { "Content-Type": "application/json" },
      }
    )
  })
)

async function skipLowHolder(supabase: SupabaseClient, oneMonthAgo: number) {
  const { data, error } = await supabase
    .from(Tables.tokens)
    .select("*")
    .limit(10000)
    .order("as_2_score", { ascending: false, nullsFirst: true })
    .lt(`holder_count`, `${1000}`)
    .gte("holder_count", 0)
    .or(
      `last_updated.is.null,last_updated.lt.${oneMonthAgo},last_updated.eq.2000000000`
    )

  if (error) {
    console.error("skip low holder tokens error", error)
    return false
  } else if ((data?.length || 0) < 1) {
    return false
  }
  const now = currentTime()
  if (data.length > 0) {
    const upsert: TokenUpdate[] = []
    data.forEach((token: Token) => {
      const update: TokenUpdate = {
        token: token.token,
        last_updated: now,
      }
      upsert.push(update)
    })

    console.log(`skipped ${data.length} tokens`)

    await storeTokenDataArray(supabase, upsert)
  }
}

async function ignoreEmAll(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from(Tables.tokens)
    .select("*")
    .limit(10000)
    .order("as_2_score", { ascending: false, nullsFirst: true })
    .is(`ignore`, null)

  if (error) {
    console.error("ingest token data error", error)
    return false
  } else if ((data?.length || 0) < 1) {
    return false
  }
  let ignored = 0
  if (data.length > 0) {
    const upsert: TokenUpdate[] = []
    data.forEach((token: Token) => {
      const update: TokenUpdate = {
        token: token.token,
        ignore:
          token.d0_score !== null &&
          token.d0_score < 0.1 &&
          token.launch_score !== null &&
          token.launch_score < 0.1,
      }
      if (update.ignore) {
        ignored++
      }
      upsert.push(update)
    })

    console.log("ignored", ignored, "of", data.length, "tokens")

    await storeTokenDataArray(supabase, upsert)
  }
}

export async function analyseTokenData(
  supabase: SupabaseClient,
  oneMonthAgo: number,
  numberOfTokens: number
): Promise<boolean> {
  let tokensStored = 0
  let tokenHistoryStored = 0
  let storageFailures = 0

  const startTime = currentTime()
  const endTime = startTime + 52
  let firstToken = ""
  let lastToken = ""

  const tokensToGet = 5
  let index = 0
  const tokensProcessed: string[] = []
  const tokensInFlight: string[] = []
  const callback = async (tokenId: string, storeCount: number) => {
    if (tokensInFlight.includes(tokenId)) {
      tokensInFlight.splice(tokensInFlight.indexOf(tokenId), 1)
    }
    if (storeCount >= 0) {
      tokenHistoryStored += storeCount
      tokensStored++
    } else {
      console.error("storage failure present", tokenId, storeCount)
      storageFailures++
    }
  }
  while (currentTime() < endTime + 5) {
    if (
      index < numberOfTokens &&
      tokensInFlight.length < tokensToGet &&
      currentTime() < endTime
    ) {
      const { data, error } =
        await supabase
          .from(Tables.tokens)
          .select("*,token_day_data(*)")
          .limit(3)
          //.order("spike_count", { ascending: false, nullsFirst: false })
          //.gt("spike_count", 0)
          .order("spike_count", { ascending: true, nullsFirst: true })
          //.order("trade_count", { ascending: false })
          // .or(`ignore.is.true`)
          // .or(`ignore.is.null,ignore.eq.false`)
          // This eliminates tokens with low holder counts (many, many of them that we don't need to analyze)
          .or(
            `holder_count.is.null,holder_count.gte.${1000}`
          )
          .or(
            `last_updated.is.null,last_updated.lt.${oneMonthAgo},last_updated.eq.2000000000`
          )

      if (error) {
        console.error("ingest token data error", error)
        return false
      } else if (data?.length < 1) {
        return false
      }
      for (let i = 0; i < data.length; i++) {
        const tokenData = data[i]
        if (tokenData.token && !tokensProcessed.includes(tokenData.token)) {
          lastToken = tokenData.token
          if (firstToken === "") {
            firstToken = tokenData.token
          }
          tokensInFlight.push(tokenData.token)
          tokensProcessed.push(tokenData.token)
          index++
          if (tokensInFlight.length >= tokensToGet) {
            break
          } else {
            await delay(2000)
          }
        }
      }
    }
    if (storageFailures > 0) {
      break
    }
    await delay(2000)
  }

  if (storageFailures > 0) {
    console.error(
      `Failed a token data storage. Stored ${tokensStored} tokens and ${tokenHistoryStored} data points. ${storageFailures} storage failures`
    )
    return false
  } else {
    console.log(
      `Stored ${tokensStored} tokens and ${tokenHistoryStored} data points from ${firstToken} to ${lastToken}`
    )
  }
  return true
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/analyze-token-data' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
