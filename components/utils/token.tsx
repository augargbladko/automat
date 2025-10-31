import { Token } from "@/supabase/functions/types"
import { Avatar } from "@nextui-org/react"

export function tokenName(token: Token, title?: string) {
  let nameString = token.name || token.symbol || `${token.token.slice(2, 8)}…`
  if (nameString.length > 20) {
    nameString = nameString.slice(0, 18) + "…"
  }
  return (
    <span className="flex text-nowrap">
      {title ? `${title} ` : ""}
      <Avatar
        src={token.icon || ""}
        name={nameString}
        className="w-4 h-4 min-w-4 text-tiny mx-1"
      />
      {nameString}
    </span>
  )
}
