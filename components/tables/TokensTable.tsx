"use client"

import { Token } from "@/supabase/functions/types"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react"
import clsx from "clsx"
import {
  HighRisk,
  LowRisk,
  MediumRisk,
  TableSection,
  TokenDetailsTooltip,
  TokenRiskTooltip,
  tableClassNames,
} from "../panels"
import {
  dollarToKValue,
  openInNewTab,
  timeText,
  tokenName,
  wholeNumberValue,
} from "../utils"
import { ColumnDefinition } from "../utils/interfaces"
import { TableParams } from "../utils/queries"
import { TableBottomSection } from "./TableBottomSection"
import { TablePagination } from "./TablePagination"

const tokenColumns: ColumnDefinition[] = [
  {
    key: "token",
    name: "Token",
  },
  {
    key: "spikes",
    name: "Spikes",
  },
  {
    key: "gecko",
    name: "1st CoinGecko",
  },
  {
    key: "dex",
    name: "1st dex",
  },
  /*{
    key: "supply",
    name: "Supply",
  },*/
  {
    key: "volume",
    name: "Volume",
  },
  {
    key: "trade_count",
    name: "Trade Count",
  },
  {
    key: "risks",
    name: "Risks",
  },
  {
    key: "last_updated",
    name: "Last Updated",
  },
]

export interface TokenTableProps {
  tokens: Token[]
  isFullScreen?: boolean
  params: TableParams
}

export function TokensTable(props: TokenTableProps) {
  const { tokens, isFullScreen, params } = props

  return (
    <TableSection>
      <Table
        onRowAction={(key) => openInNewTab(`/tokens/${key}`)}
        selectionMode="single"
        isHeaderSticky
        isStriped
        classNames={tableClassNames(isFullScreen)}
        topContentPlacement="outside"
        topContent={
          isFullScreen
            ? TableBottomSection(params)
            : params.onFilter
              ? TablePagination(params)
              : null
        }
      >
        <TableHeader columns={tokenColumns}>
          {(column) => (
            <TableColumn key={column.key} className="text-[10px] h-6">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={tokens}>
          {(token) => (
            <TableRow key={token.token} className="cursor-pointer h-6">
              {(column) => getCell(token, column)}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableSection>
  )
}

function getCell(token: Token, key: string | number) {
  let geckoIsFirst: boolean, dexIsFirst: boolean
  switch (key) {
    case "token":
      return (
        <TableCell className="p-0 max-w-32">
          <TokenNameComponent token={token} />
        </TableCell>
      )
    case "spikes":
      return (
        <TableCell className="whitespace-nowrap p-0.5 text-xs">
          {`${token.spike_count} (${token.spike_score})`}
        </TableCell>
      )
    case "gecko":
      geckoIsFirst =
        !token.first_dex_day ||
        (token.first_coingecko_day &&
          token.first_coingecko_day < token.first_dex_day)
      return (
        <TableCell
          className={clsx(
            "whitespace-nowrap",
            geckoIsFirst && "text-teal-500",
            "p-0.5 text-xs"
          )}
        >
          {token.first_coingecko_day}
        </TableCell>
      )
    case "dex":
      dexIsFirst =
        !token.first_coingecko_day ||
        (token.first_dex_day &&
          token.first_dex_day <= token.first_coingecko_day)
      return (
        <TableCell
          className={clsx(
            "whitespace-nowrap",
            dexIsFirst && "text-teal-500",
            "p-0.5 text-xs"
          )}
        >
          {token.first_dex_day}
        </TableCell>
      )
    case "supply":
      return (
        <TableCell className="p-0.5 text-xs">
          {wholeNumberValue(
            token.circulating_supply || token.total_supply || token.max_supply
          )}
        </TableCell>
      )
    case "volume":
      return (
        <TableCell className="p-0.5 text-xs">
          {dollarToKValue(token.volume_usd)}
        </TableCell>
      )
    case "trade_count":
      return (
        <TableCell className="p-0.5 text-xs">
          {Math.floor(token.trade_count || 0) || "-"}
        </TableCell>
      )
    case "risks":
      return (
        <TableCell className="whitespace-nowrap p-0">
          <TokenRiskComponent token={token} />
        </TableCell>
      )
    case "last_updated":
      return (
        <TableCell className="whitespace-nowrap p-0.5 text-xs">
          {timeText(token.last_updated)}
        </TableCell>
      )
    default:
      return (
        <TableCell className="whitespace-nowrap p-0.5 text-xs">
          Missing &quot;{key}&quot;
        </TableCell>
      )
  }
}

export function TokenNameComponent({ token }: { token: Token }) {
  return (
    <TokenDetailsTooltip token={token}>
      <div className="w-full px-2 py-0.5 text-xs">{tokenName(token)}</div>
    </TokenDetailsTooltip>
  )
}

export function TokenRiskComponent({ token }: { token: Token }) {
  return (
    <TokenRiskTooltip token={token}>
      <div className="flex flex-row h-full px-2 py-0.5 text-xs">
        <TokenRisk token={token} />
      </div>
    </TokenRiskTooltip>
  )
}

export function TokenRisk({ token }: { token: Token }) {
  if ((token.no_go_score || 0) > 0) {
    return (
      <HighRisk>
        Risky: {token.no_go_score}
        {(token.risk_score || 0) > 0 && `, ${token.risk_score}`}
      </HighRisk>
    )
  } else if ((token.risk_score || 0) > 0) {
    return <MediumRisk>Some risk: {token.risk_score}</MediumRisk>
  } else {
    return <LowRisk>Low risk</LowRisk>
  }
}
