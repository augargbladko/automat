import { ReactNode } from "react"

export interface Queries {
  page: number
  pageSize: number
  sorts: Sort[]
  filters: Filter[]
}

export interface TableParams {
  queries: Queries
  count: number
  cookie: CookieName
  onFilter?: (queries: Queries) => void
  filterSection?: ReactNode
}

export interface Sort {
  key: string
  column: string
  direction: "asc" | "desc"
  text: string
}

export interface Filter {
  key: string
  column: string
  min?: number
  max?: number
  isNull?: boolean
  isNotNull?: boolean
  equals?: string
  isIn?: string[]
  text: string
}

export enum CookieName {
  none = "",
  TokensPage = "tokens_page_token_queries",
  AccountsPage = "accounts_page_account_queries",
  AdoptersPage = "adopters_page_adopter_queries",
  SignalsPage = "signals_page_signal_queries",
  BuysTable = "buys_table",
  DayDataTable = "day_data_table",
}

export const defaultFilters: { [cookieName: string]: Queries } = {
  [CookieName.TokensPage]: {
    page: 1,
    pageSize: 100,
    sorts: [
      {
        key: "spike_score",
        column: "spike_score",
        direction: "desc",
        text: "Spike Score (default)",
      },
    ],
    filters: [{ key: "spike_score", column: "spike_score", min: 1, text: "" }],
  },
  [CookieName.AccountsPage]: {
    page: 1,
    pageSize: 100,
    sorts: [
      {
        key: "score_desc",
        column: "score",
        direction: "desc",
        text: "Score (desc) (default)",
      },
    ],
    filters: [
      {
        key: "adopters_tracking_default",
        column: "tracking",
        text: "All (default)",
      },
    ],
  },
  [CookieName.AdoptersPage]: {
    page: 1,
    pageSize: 100,
    sorts: [
      {
        key: "score_desc",
        column: "score",
        direction: "desc",
        text: "Score (desc) (default)",
      },
    ],
    filters: [
      {
        key: "adopters_tracking_default",
        column: "tracking",
        text: "All (default)",
      },
    ],
  },
  [CookieName.SignalsPage]: {
    page: 1,
    pageSize: 500,
    sorts: [
      {
        key: "timestamp",
        column: "timestamp",
        direction: "desc",
        text: "Timestamp",
      },
      { key: "score", column: "score", direction: "desc", text: "Score" },
    ],
    filters: [],
  },
  [CookieName.BuysTable]: {
    page: 1,
    pageSize: 50,
    sorts: [{ key: "date", column: "date", direction: "desc", text: "Date" }],
    filters: [],
  },
  [CookieName.DayDataTable]: {
    page: 1,
    pageSize: 50,
    sorts: [{ key: "date", column: "date", direction: "asc", text: "Date" }],
    filters: [],
  },
}
