"use client"

import { Spike, Token, TokenDay } from "@/supabase/functions/types"
import {
  DetailsSection,
  RowSection,
  TextHeaderSection,
  TokenDetailsPanel,
  TokenRiskPanel,
} from "../panels"
import { tokenName } from "../utils"
import { DayDataTable } from "./DayDataTable"
import { TokenSpikesTable } from "./TokenSpikesTable"

export function TokenDetailsSection({ token }: { token: Token }) {
  return (
    <DetailsSection>
      <RowSection>
        <TokenDetailsPanel token={token} />
        <TokenRiskPanel token={token} />
      </RowSection>
    </DetailsSection>
  )
}

export function TokenSpikesSection({
  token,
  spikes,
}: {
  token: Token
  spikes: Spike[]
}) {
  return (
    <DetailsSection>
      <TextHeaderSection>
        <h2>{tokenName(token, "Spikes for")}</h2>
      </TextHeaderSection>
      <RowSection>
        <TokenSpikesTable tokens={{ [token.token]: token }} spikes={spikes} />
      </RowSection>
    </DetailsSection>
  )
}

export function TokenDayDataSection({
  token,
  dayData,
}: {
  token: Token
  dayData: TokenDay[]
}) {
  return (
    <DetailsSection>
      <TextHeaderSection>
        <h2>{tokenName(token, "Token Day Data for")}</h2>
      </TextHeaderSection>
      <RowSection>
        <DayDataTable tokens={{ [token.token]: token }} dayData={dayData} />
      </RowSection>
      <p>
        Anything else here? Some kind of tagging/data entry? Probably want to
        also add in the “is this new” data. This could easily have some charts.
        And some coingecko/terminal/etc charts
      </p>
    </DetailsSection>
  )
}
