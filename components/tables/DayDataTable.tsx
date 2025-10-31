"use client"

import { Token, TokenDay } from "@/supabase/functions/types"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react"
import { useEffect, useState } from "react"
import { TableSection, tableClassNames } from "../panels"
import {
  CookieName,
  Queries,
  TableParams,
  defaultFilters,
  dollarToKValue,
  dollarValue,
  openInNewTab,
} from "../utils"
import { ColumnDefinition } from "../utils/interfaces"
import { TablePagination } from "./TablePagination"
import { TokenNameComponent } from "./TokensTable"

const tokenDayColumns: ColumnDefinition[] = [
  {
    key: "token",
    name: "Token",
  },
  {
    key: "day",
    name: "Day",
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
    key: "buy_score",
    name: "Score",
  },
]

export function DayDataTable({
  dayData,
  tokens,
}: {
  dayData: TokenDay[]
  tokens: { [tokenId: string]: Token }
}) {
  const [sortedData, setSortedData] = useState<TokenDay[]>([])
  const [buyParams, setBuyParams] = useState<TableParams>({
    queries: defaultFilters[CookieName.DayDataTable],
    count: Math.max(0, dayData.length - 30),
    cookie: CookieName.DayDataTable,
    onFilter: (queries: Queries) => {
      setBuyParams({ ...buyParams, queries: { ...queries } })
    },
  })
  useEffect(() => {
    const sortArray: TokenDay[] = [...dayData]
    if (buyParams.queries.sorts.length > 0) {
      buyParams.queries.sorts.forEach((sort) => {
        if (sort.key === "date") {
          sortArray.sort((a, b) => {
            if (sort.direction === "asc") {
              return a.day > b.day ? 1 : -1
            } else {
              return a.day > b.day ? -1 : 1
            }
          })
        }
      })
    }
    const startItem = Math.min(
      dayData.length - 1,
      30 + (buyParams.queries.page - 1) * buyParams.queries.pageSize
    )
    setSortedData(
      sortArray.slice(startItem, startItem + buyParams.queries.pageSize)
    )
  }, [buyParams, dayData])

  return (
    <TableSection>
      <Table
        onRowAction={(key) => openInNewTab(`/tokens/${key.slice(0, 42)}`)}
        selectionMode="single"
        isHeaderSticky
        isStriped
        classNames={tableClassNames(false)}
        topContentPlacement="outside"
        topContent={TablePagination(buyParams)}
      >
        <TableHeader columns={tokenDayColumns}>
          {(column) => (
            <TableColumn key={column.key} className="p-0 text-[10px]">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedData}>
          {(tokenDay) => (
            <TableRow key={getKeyForTokenDay(tokenDay)}>
              {(column) =>
                getTokenDayCell(tokenDay, tokens[tokenDay.token], column)
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableSection>
  )
}

const getKeyForTokenDay = (tokenDay: TokenDay) =>
  `${tokenDay.token}-${tokenDay.day}`

function getTokenDayCell(
  tokenDay: TokenDay,
  token: Token,
  key: string | number
) {
  switch (key) {
    case "token":
      return (
        <TableCell className="p-0 text-xs max-w-32">
          <TokenNameComponent token={token} />
        </TableCell>
      )
    case "day":
      return <TableCell className="p-0.5 text-xs">{tokenDay.day}</TableCell>
    case "price":
      return (
        <TableCell className="p-0.5 text-xs">
          {dollarValue(tokenDay.price)}
        </TableCell>
      )
    case "volume":
      return (
        <TableCell className="p-0.5 text-xs">
          {dollarToKValue(tokenDay.volume)}
        </TableCell>
      )
    case "buy_score":
      return (
        <TableCell className="p-0.5 text-xs">
          {`${tokenDay.buy_pct}% | ${tokenDay.buy_score}`}
        </TableCell>
      )
    /*case "sell_score":
      return <SellScoreCell tokenDay={tokenDay} />;*/
    default:
      return (
        <TableCell className="p-0.5 text-xs">
          Missing &quot;{key}&quot;
        </TableCell>
      )
  }
}
