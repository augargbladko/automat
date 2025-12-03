/// <reference lib="deno.ns" />

export declare const Deno: {
  env: { get: (key: string) => string | undefined }
  serve: any
}

export const oneInchBearer = Deno.env.get("ONE_INCH_BEARER_KEY") || ""
export const mnemonicKey = (key: string) => Deno.env.get(key)

export const etherscanApiKey = Deno.env.get("ETHERSCAN_API_KEY") || ""
export const coingeckoApiKey = Deno.env.get("COINGECKO_API_KEY") || ""
export const chainbaseApiKey = Deno.env.get("CHAINBASE_API_KEY") || ""
export const chainstackApiKey = Deno.env.get("CHAINSTACK_API_KEY") || ""
export const bitQueryV1ApiKey = Deno.env.get("BITQUERY_V1_API_KEY") || ""
export const bitQueryApiToken = Deno.env.get("BITQUERY_API_TOKEN") || ""
export const bitQueryV2ApiKey = Deno.env.get("BITQUERY_API_KEY") || ""
export const coinMarketCapApiKey = Deno.env.get("COINMARKETCAP_API_KEY") || ""

export const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
export const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || ""
export const supabaseServiceRoleKey =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""

export const denoServe = Deno.serve
