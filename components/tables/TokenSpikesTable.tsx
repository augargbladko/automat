"use client"

import { Spike, Token } from "@/supabase/functions/types"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react"
import { TableSection, tableClassNames } from "../panels"
import { ColumnDefinition } from "../utils/interfaces"
import {
  dollarToKValue,
  dollarValue,
  numberValue,
  timeText,
} from "../utils/values"
import { TokenNameComponent } from "./TokensTable"

const tokenSpikeColumns: ColumnDefinition[] = [
  {
    key: "token",
    name: "Token",
  },
  {
    key: "day",
    name: "Day",
  },
  {
    key: "high",
    name: "High",
  },
  {
    key: "above_count",
    name: "Above#",
  },
  {
    key: "score",
    name: "Score",
  },
  {
    key: "price",
    name: "Price",
  },
  {
    key: "volume",
    name: "Volume",
  },
  {
    key: "market_cap",
    name: "Market Cap",
  },
  {
    key: "last_updated",
    name: "Last Updated",
  },
]

export function TokenSpikesTable({
  spikes,
  tokens,
}: {
  spikes: Spike[]
  tokens: { [tokenId: string]: Token }
}) {
  return (
    <TableSection>
      <Table
        selectionMode="single"
        isHeaderSticky
        isStriped
        classNames={tableClassNames(false)}
      >
        <TableHeader columns={tokenSpikeColumns}>
          {(column) => (
            <TableColumn key={column.key}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={spikes}>
          {(spike) => (
            <TableRow key={getKeyForSpike(spike)}>
              {(column) =>
                getTokenSpikeCell(spike, tokens[spike.token], column)
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableSection>
  )
}

const getKeyForSpike = (spike: Spike) => `${spike.token}-${spike.day}`

function getTokenSpikeCell(spike: Spike, token: Token, key: string | number) {
  switch (key) {
    case "token":
      return (
        <TableCell className="p-0 text-xs max-w-32">
          <TokenNameComponent token={token} />
        </TableCell>
      )
    case "day":
      return <TableCell className="p-0.5 text-xs">{spike.day}</TableCell>
    case "high":
      return (
        <TableCell className="p-0.5 text-xs">
          {`${spike.high_day} | ${dollarValue(spike.high_price)} | ${spike.high_score}`}
        </TableCell>
      )
    case "above_count":
      return (
        <TableCell className="p-0.5 text-xs">{spike.above_count}</TableCell>
      )
    case "score":
      return (
        <TableCell className="p-0.5 text-xs">
          {numberValue(spike.score)}
        </TableCell>
      )
    case "price":
      return (
        <TableCell className="p-0.5 text-xs">
          {dollarValue(spike.price)}
        </TableCell>
      )
    case "volume":
      return (
        <TableCell className="p-0.5 text-xs">
          {dollarToKValue(spike.volume)}
        </TableCell>
      )
    case "market_cap":
      return (
        <TableCell className="p-0.5 text-xs">
          {`High: ${dollarToKValue(spike.market_cap_high)} | Low: ${dollarToKValue(spike.market_cap_low)}`}
        </TableCell>
      )
    case "last_updated":
      return (
        <TableCell className="p-0.5 text-xs">
          {timeText(token.last_updated)}
        </TableCell>
      )
    default:
      return (
        <TableCell className="p-0.5 text-xs">
          Missing &quot;{key}&quot;
        </TableCell>
      )
  }
}

export function ScoreCell({ score }: { score: number | null }) {
  return (
    <TableCell className="p-0.5 text-xs">
      {score && score > 0 ? score : "-"}
    </TableCell>
  )
}
