// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { connectToSupabase } from "../queries/database/index.ts";
import { currentTime, delay, denoServe, handleCORS } from "../utils/index.ts";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

denoServe(
  handleCORS(async (req) => {
    const { secondCall } = await req.json()
    const supabase = await connectToSupabase(req)
    if (secondCall) {
      await delay(secondCall)
    } else {
      // await dexScreenerPull(testPairId)
    }

    const startTime = 0
    const stopTime = currentTime() + 45
    if (startTime > 0 && startTime < currentTime()) {
      let analysisCount = 0
      for (let i = 0; i < (secondCall ? 12 : 1); i++) {
        const tokenCount = 0
        analysisCount += tokenCount
        if (tokenCount === 0 || currentTime() > stopTime) {
          break
        }
      }
      console.log(
        `analysed ${analysisCount} token launches`,
        secondCall ? "(second call)" : ""
      )
      if (!secondCall && analysisCount > 0) {
        await supabase.functions.invoke("analyze-token-launches", {
          body: { secondCall: 1000 },
        })
        await supabase.functions.invoke("analyze-token-launches", {
          body: { secondCall: 1000 },
        })
        await supabase.functions.invoke("analyze-token-launches", {
          body: { secondCall: 1000 },
        })
        await supabase.functions.invoke("analyze-token-launches", {
          body: { secondCall: 1000 },
        })
        await supabase.functions.invoke("analyze-token-launches", {
          body: { secondCall: 1000 },
        })
        await supabase.functions.invoke("analyze-token-launches", {
          body: { secondCall: 1000 },
        })
      }
    } else {
      console.log(
        `skipping token launch analysis until ${
          startTime === 0
            ? `'tokenLaunchesStart is set to a number`
            : new Date(startTime * 1000).toISOString()
        }`
      )
    }

    return new Response(
      JSON.stringify({ result: "analyze-token-launches complete" }),
      {
        headers: { "Content-Type": "application/json" },
      }
    )
  })
)

const encodings = [
  "utf-16be",
  "utf-16le",
  "x-user-defined",
  "ibm866",
  "iso-8859-1",
  "iso-8859-2",
  "iso-8859-3",
  "iso-8859-4",
  "iso-8859-5",
  "iso-8859-6",
  "iso-8859-7",
  "iso-8859-8",
  "iso-8859-10",
  "iso-8859-13",
  "iso-8859-14",
  "iso-8859-15",
  "iso-8859-16",
  "koi8-r",
  "koi8-u",
  "macintosh",
  "windows-874",
  "windows-1250",
  "windows-1251",
  "windows-1252",
  "windows-1253",
  "windows-1254",
  "windows-1255",
  "windows-1256",
  "windows-1257",
  "windows-1258",
  "x-mac-cyrillic",
]

const testPairId = "0xa43fe16908251ee70ef74718545e4fe6c5ccec9f"
const dexScreenerTopTraders = (pairId: string) =>
  `https://io.dexscreener.com/dex/log/amm/v3/uniswap/top/ethereum/${pairId}?q=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`

async function dexScreenerPull(pairId: string) {
  console.log("pulling dexscreener data")
  const response = await fetch(dexScreenerTopTraders(pairId))
  console.log("got dexscreener response", response)
  if (response.status === 200) {
    const buffer = await response.arrayBuffer()
    console.log(buffer)

    encodings.forEach((encoding) => {
      const decoder = new TextDecoder(encoding)
      const text = decoder.decode(buffer)
      console.log(encoding, text)
    })
  } else {
    console.log("dexscreener error", response.status, response.statusText)
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/analyze-token-launches' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
