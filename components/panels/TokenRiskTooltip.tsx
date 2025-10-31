"use client"

import { Token } from "@/supabase/functions/types"
import { Tooltip } from "@nextui-org/react"
import { TokenRiskPanel } from "./TokenRiskPanel"

export function TokenRiskTooltip({
  children,
  token,
}: {
  children: any
  token: Token
}) {
  return (
    <Tooltip
      placement="left"
      content={<TokenRiskPanel token={token} />}
      className="bg-gray-900"
      closeDelay={100}
      delay={0}
    >
      {children}
    </Tooltip>
  )
}
