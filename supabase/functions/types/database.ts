import { Tables } from "./interfaces/enums.ts"

// MUST be separated by ", "
export const tableConflictKeys: Record<Tables, string> = {
  pointers: "pointer",
  spikes: "day, token",
  signals: "day, token, address",
  spike_scores: "day, token, address",
  token_day_data: "joined_key",
  tokens: "token",
  accounts: "address",
  swaps: "swap_id",
  bot_buys: "id",
  bot_transactions: "id",
  launch_holdings: "joined_key",
  launch_owners: "address",
  launch_signals: "token, threshold",
  launch_d5_signals: "token, threshold",
  launch_d25_signals: "token, threshold",
  leaking_alpha: "token, buy_type",
  first_trades: "token",
  first_trade_data: "start_time, token",
  hourly_data: "timestamp, token",
}
