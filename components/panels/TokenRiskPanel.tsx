"use client"

import { Token } from "@/supabase/functions/types"
import { Link } from "@nextui-org/react"
import { goPlusUrl, numberValue, percentValue, tokenName } from "../utils"
import { GenericPanel, HighRisk, LowRisk, MediumRisk } from "./elements"

export function TokenRiskPanel({ token }: { token: Token }) {
  const {
    no_go_score,
    risk_score,
    holder_count,
    high_holder_percent,
    buy_tax,
    sell_tax,
    external_call,
    is_proxy,
    blacklist,
    whitelist,
    trading_cooldown,
    maybe_honeypot,
    has_owner,
  } = token

  return (
    <GenericPanel>
      <h2>{tokenName(token, "Risks for")}</h2>
      {(no_go_score || 0) > 0 ? (
        <HighRisk>
          {numberValue(no_go_score)}
          {(risk_score || 0) > 0 && `, ${numberValue(risk_score)}`}: High risk
          for this token
        </HighRisk>
      ) : (risk_score || 0) > 0 ? (
        <MediumRisk>
          {numberValue(risk_score)}: Some risk for this token
        </MediumRisk>
      ) : (
        <LowRisk>Low risk for this token</LowRisk>
      )}
      {maybe_honeypot && <HighRisk>Possible Honeypot</HighRisk>}
      {has_owner && <HighRisk>Contract has an owner</HighRisk>}
      {external_call && (
        <HighRisk>Contract has an external function call</HighRisk>
      )}
      {is_proxy && has_owner && (
        <HighRisk>
          Contract is a proxy and has an owner, so functions could be changed
        </HighRisk>
      )}
      {(holder_count || 0) < 100 ? (
        <HighRisk>{numberValue(holder_count)} holders (&lt;100)</HighRisk>
      ) : (holder_count || 0) < 500 ? (
        <MediumRisk>{numberValue(holder_count)} holders (&lt;500)</MediumRisk>
      ) : null}
      {(high_holder_percent || 0) > 0.25 ? (
        <HighRisk>
          {percentValue(high_holder_percent)}: Biggest holder owns too much
        </HighRisk>
      ) : (high_holder_percent || 0) > 0.05 ? (
        <MediumRisk>
          {percentValue(high_holder_percent)}: Highest holder owns a lot
        </MediumRisk>
      ) : null}
      {(buy_tax || 0) > 0.05 ? (
        <HighRisk>{percentValue(buy_tax)} buy tax (too high)</HighRisk>
      ) : (buy_tax || 0) > 0 ? (
        <MediumRisk>{percentValue(buy_tax)} buy tax</MediumRisk>
      ) : null}
      {(sell_tax || 0) > 0.05 ? (
        <HighRisk>{percentValue(sell_tax)} sell tax (too high)</HighRisk>
      ) : (sell_tax || 0) > 0 ? (
        <MediumRisk>{percentValue(sell_tax)} sell tax</MediumRisk>
      ) : null}
      {blacklist && has_owner && (
        <MediumRisk>Contract includes a blacklist function</MediumRisk>
      )}
      {whitelist && has_owner && (
        <HighRisk>Contract includes a whitelist function</HighRisk>
      )}
      {trading_cooldown && (
        <MediumRisk>There may be a trading cooldown on the contract</MediumRisk>
      )}
      <p>
        Details:{" "}
        <Link href={goPlusUrl(token.token)} isExternal>
          Go Plus
        </Link>
      </p>
    </GenericPanel>
  )
}
