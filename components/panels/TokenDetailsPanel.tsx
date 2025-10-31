"use client"

import { Token } from "@/supabase/functions/types"
import { Link } from "@nextui-org/react"
import {
  coinGeckoUrl,
  etherscanUrl,
  goPlusUrl,
  timeText,
  tokenName,
  uniswapInfoUrl,
} from "../utils"
import { GenericPanel } from "./elements"

export function TokenDetailsPanel({ token }: { token: Token }) {
  const tokenId = token.token
  const {
    last_updated,
    symbol,
    first_coingecko_day,
    first_dex_day,
    high_score,
    low_score,
    spike_score,
    spike_count,
    web_slug,
    decimals,
    total_supply,
    max_supply,
    circulating_supply,
    volume_usd,
    trade_count,
  } = token
  return (
    <GenericPanel>
      <h2 className="flex flex-row">{tokenName(token, "Details for")}</h2>
      <p>
        <Link href={`/tokens/${tokenId}`} isExternal>
          Token Details Page
        </Link>
      </p>
      <p>
        {symbol} | {tokenId}
      </p>
      <p>Last updated: {timeText(last_updated)}</p>
      <p>
        First coingecko day: {first_coingecko_day || "never"}
        {" | "}First dex day: {first_dex_day || "never"}
      </p>
      <p>
        Scores: High: {high_score}
        {" | "}Low: {low_score}
        {" | "}Spike: {spike_score}
        {" | "}Spike Count: {spike_count}
      </p>
      <p>
        Supply:{" "}
        {Math.floor(circulating_supply || total_supply || max_supply || 0) ||
          "unknown"}
        {" | "}
        Decimals: {decimals}
      </p>
      <p>
        Volume: {Math.floor(volume_usd || 0) || "unknown"}
        {" | "}Trade Count: {Math.floor(trade_count || 0) || "unknown"}
      </p>
      <p>
        {web_slug ? (
          <Link href={coinGeckoUrl(web_slug)} isExternal>
            Coingecko
          </Link>
        ) : (
          <span className="line-through text-gray-500">Coingecko</span>
        )}
        {" | "}
        <Link href={etherscanUrl(tokenId)} isExternal>
          Etherscan
        </Link>
        {" | "}
        <Link href={goPlusUrl(tokenId)} isExternal>
          GoPlus
        </Link>
        {" | "}
        <Link href={uniswapInfoUrl(tokenId)} isExternal>
          Uniswap
        </Link>
      </p>
    </GenericPanel>
  )
}
