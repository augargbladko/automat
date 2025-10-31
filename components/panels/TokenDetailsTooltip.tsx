"use client"

import { Token } from "@/supabase/functions/types"
import { Tooltip } from "@nextui-org/react"
import { TokenDetailsPanel } from "./TokenDetailsPanel"

export function TokenDetailsTooltip({
  children,
  token,
}: {
  children: any
  token: Token
}) {
  return (
    <Tooltip
      placement="top-start"
      content={<TokenDetailsPanel token={token} />}
      className="bg-gray-900"
      closeDelay={0}
      delay={200}
    >
      {children}
    </Tooltip>
  )
}
