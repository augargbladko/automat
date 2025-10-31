
import { Database } from "./supabase.ts";

export type Token = Database["public"]["Tables"]["tokens"]["Row"]

export type TokenUpdate = Database["public"]["Tables"]["tokens"]["Update"]
export type Account = Database["public"]["Tables"]["accounts"]["Row"]
export type AccountUpdate = Database["public"]["Tables"]["accounts"]["Update"]
export type Spike = Database["public"]["Tables"]["spikes"]["Row"]
export type SpikeScore = Database["public"]["Tables"]["spike_scores"]["Row"]
export type TokenDay = Database["public"]["Tables"]["token_day_data"]["Row"]
export type Signal = Database["public"]["Tables"]["signals"]["Row"]

export type LaunchOwner = Database["public"]["Tables"]["launch_owners"]["Row"]
export type LaunchHolding =
  Database["public"]["Tables"]["launch_holdings"]["Row"]
export interface LaunchHoldingWithHighHolder extends LaunchHolding {
  tokens: {
    launch_holders: number
    high_holder_percent: number
  }
}

export type LaunchOwnerUpdate =
  Database["public"]["Tables"]["launch_owners"]["Update"]
export type LaunchHoldingUpdate =
  Database["public"]["Tables"]["launch_holdings"]["Update"]

export type FirstTrade = Database["public"]["Tables"]["first_trades"]["Row"]
export type FirstTradeUpdate =
  Database["public"]["Tables"]["first_trades"]["Update"]

export type FirstTradeData =
  Database["public"]["Tables"]["first_trade_data"]["Row"]
export type FirstTradeDataUpdate =
  Database["public"]["Tables"]["first_trade_data"]["Update"]

export type HourlyData = Database["public"]["Tables"]["hourly_data"]["Row"]
export type HourlyDataUpdate =
  Database["public"]["Tables"]["hourly_data"]["Update"]

export function getHourlyPrice(data: HourlyData | HourlyDataUpdate) {
  return !data
    ? 0
    : !data.end_price
      ? data.price || 0
      : !data.price
        ? data.end_price
        : Math.min(data.price, data.end_price)
}
export interface HourlyDataWithToken extends HourlyData {
  tokens: Token
}

export type LaunchSignal = Database["public"]["Tables"]["launch_signals"]["Row"]
export type LaunchSignalUpdate =
  Database["public"]["Tables"]["launch_signals"]["Update"]
export interface LaunchSignalWithToken extends LaunchSignal {
  tokens: Token
}
export interface LaunchSignalWithHourlyData extends LaunchSignalWithToken {
  hourly_data: HourlyData[]
}

export type LeakingAlpha = Database["public"]["Tables"]["leaking_alpha"]["Row"]
export type LeakingAlphaUpdate =
  Database["public"]["Tables"]["leaking_alpha"]["Update"]

export type BotBuy = Database["public"]["Tables"]["bot_buys"]["Row"]
export type BotBuyUpdate = Database["public"]["Tables"]["bot_buys"]["Update"]
export interface BotBuyWithTransaction extends BotBuy {
  bot_transactions: BotTransaction
}

export type BotTransaction =
  Database["public"]["Tables"]["bot_transactions"]["Row"]
export type BotTransactionUpdate =
  Database["public"]["Tables"]["bot_transactions"]["Update"]

export interface BotTransactionWithBuy extends BotTransaction {
  bot_buys: BotBuy
  tokens: {
    decimals: number
  }
}
