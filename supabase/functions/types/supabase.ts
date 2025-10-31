export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          address: string
          avg_buy: number | null
          bear_profit_k: number | null
          bear_profit_pct: number | null
          bear_score: number | null
          bear_win_pct: number | null
          bull_profit_k: number | null
          bull_profit_pct: number | null
          bull_score: number | null
          bull_win_pct: number | null
          dollar_value: number | null
          flat_profit_k: number | null
          flat_profit_pct: number | null
          flat_score: number | null
          flat_win_pct: number | null
          last_trade_day: string | null
          last_updated: number | null
          overall_score: number | null
          profit_k: number | null
          profit_pct: number | null
          recent_profit_k: number | null
          recent_profit_pct: number | null
          recent_score: number | null
          recent_win_pct: number | null
          score: number | null
          spike_count: number | null
          spike_profit: number | null
          status: string | null
          swaps: number | null
          tracking: string | null
          trade_count: number | null
          usd_buy_volume: number | null
          usd_sell_volume: number | null
          win_pct: number | null
        }
        Insert: {
          address: string
          avg_buy?: number | null
          bear_profit_k?: number | null
          bear_profit_pct?: number | null
          bear_score?: number | null
          bear_win_pct?: number | null
          bull_profit_k?: number | null
          bull_profit_pct?: number | null
          bull_score?: number | null
          bull_win_pct?: number | null
          dollar_value?: number | null
          flat_profit_k?: number | null
          flat_profit_pct?: number | null
          flat_score?: number | null
          flat_win_pct?: number | null
          last_trade_day?: string | null
          last_updated?: number | null
          overall_score?: number | null
          profit_k?: number | null
          profit_pct?: number | null
          recent_profit_k?: number | null
          recent_profit_pct?: number | null
          recent_score?: number | null
          recent_win_pct?: number | null
          score?: number | null
          spike_count?: number | null
          spike_profit?: number | null
          status?: string | null
          swaps?: number | null
          tracking?: string | null
          trade_count?: number | null
          usd_buy_volume?: number | null
          usd_sell_volume?: number | null
          win_pct?: number | null
        }
        Update: {
          address?: string
          avg_buy?: number | null
          bear_profit_k?: number | null
          bear_profit_pct?: number | null
          bear_score?: number | null
          bear_win_pct?: number | null
          bull_profit_k?: number | null
          bull_profit_pct?: number | null
          bull_score?: number | null
          bull_win_pct?: number | null
          dollar_value?: number | null
          flat_profit_k?: number | null
          flat_profit_pct?: number | null
          flat_score?: number | null
          flat_win_pct?: number | null
          last_trade_day?: string | null
          last_updated?: number | null
          overall_score?: number | null
          profit_k?: number | null
          profit_pct?: number | null
          recent_profit_k?: number | null
          recent_profit_pct?: number | null
          recent_score?: number | null
          recent_win_pct?: number | null
          score?: number | null
          spike_count?: number | null
          spike_profit?: number | null
          status?: string | null
          swaps?: number | null
          tracking?: string | null
          trade_count?: number | null
          usd_buy_volume?: number | null
          usd_sell_volume?: number | null
          win_pct?: number | null
        }
        Relationships: []
      }
      bot_buys: {
        Row: {
          account_address: string
          account_key: string
          account_number: number
          action: string
          buy_amount: number
          buy_count: number
          buy_reason: string
          buy_usd: number
          current_transaction: string | null
          est_value: number
          fail_reason: string | null
          fund_eth: number
          fund_usd: number
          gas_eth: number
          gas_usd: number
          holders: number
          hours_after: number
          id: string
          is_complete: boolean
          mcap: number
          next_hour: number
          pool_balance: number
          score: number
          sell_amount: number
          sell_count: number
          sell_time: number | null
          sell_usd: number
          threshold: string
          threshold_value: number
          timestamp: number
          token: string
          tx_fail_count: number
          vol_24h: number
          withdraw_eth: number
        }
        Insert: {
          account_address: string
          account_key: string
          account_number: number
          action: string
          buy_amount?: number
          buy_count?: number
          buy_reason: string
          buy_usd?: number
          current_transaction?: string | null
          est_value?: number
          fail_reason?: string | null
          fund_eth?: number
          fund_usd?: number
          gas_eth?: number
          gas_usd?: number
          holders: number
          hours_after: number
          id?: string
          is_complete?: boolean
          mcap: number
          next_hour?: number
          pool_balance: number
          score: number
          sell_amount?: number
          sell_count?: number
          sell_time?: number | null
          sell_usd?: number
          threshold: string
          threshold_value: number
          timestamp: number
          token: string
          tx_fail_count?: number
          vol_24h: number
          withdraw_eth?: number
        }
        Update: {
          account_address?: string
          account_key?: string
          account_number?: number
          action?: string
          buy_amount?: number
          buy_count?: number
          buy_reason?: string
          buy_usd?: number
          current_transaction?: string | null
          est_value?: number
          fail_reason?: string | null
          fund_eth?: number
          fund_usd?: number
          gas_eth?: number
          gas_usd?: number
          holders?: number
          hours_after?: number
          id?: string
          is_complete?: boolean
          mcap?: number
          next_hour?: number
          pool_balance?: number
          score?: number
          sell_amount?: number
          sell_count?: number
          sell_time?: number | null
          sell_usd?: number
          threshold?: string
          threshold_value?: number
          timestamp?: number
          token?: string
          tx_fail_count?: number
          vol_24h?: number
          withdraw_eth?: number
        }
        Relationships: [
          {
            foreignKeyName: "bot_buys_current_transaction_fkey"
            columns: ["current_transaction"]
            isOneToOne: false
            referencedRelation: "bot_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_buys_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      bot_transactions: {
        Row: {
          action: string
          amount: string
          amount_value: number
          bot_buy: string
          complete_time: number | null
          currency: string | null
          error: string | null
          eth_price: number
          gas_price: string | null
          gas_total: string | null
          gas_used: string | null
          id: string
          is_confirmed: boolean
          is_reorg: boolean
          last_updated: number
          nonce: number | null
          progress: string
          reprice_count: number
          retries: number
          sequence: number
          start_time: number
          token: string | null
          transaction_hash: string | null
          usdc: string
          usdc_value: number
        }
        Insert: {
          action: string
          amount?: string
          amount_value?: number
          bot_buy: string
          complete_time?: number | null
          currency?: string | null
          error?: string | null
          eth_price?: number
          gas_price?: string | null
          gas_total?: string | null
          gas_used?: string | null
          id?: string
          is_confirmed?: boolean
          is_reorg?: boolean
          last_updated?: number
          nonce?: number | null
          progress?: string
          reprice_count?: number
          retries?: number
          sequence: number
          start_time: number
          token?: string | null
          transaction_hash?: string | null
          usdc?: string
          usdc_value?: number
        }
        Update: {
          action?: string
          amount?: string
          amount_value?: number
          bot_buy?: string
          complete_time?: number | null
          currency?: string | null
          error?: string | null
          eth_price?: number
          gas_price?: string | null
          gas_total?: string | null
          gas_used?: string | null
          id?: string
          is_confirmed?: boolean
          is_reorg?: boolean
          last_updated?: number
          nonce?: number | null
          progress?: string
          reprice_count?: number
          retries?: number
          sequence?: number
          start_time?: number
          token?: string | null
          transaction_hash?: string | null
          usdc?: string
          usdc_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "bot_transactions_bot_buy_fkey"
            columns: ["bot_buy"]
            isOneToOne: false
            referencedRelation: "bot_buys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_transactions_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      first_trade_data: {
        Row: {
          day: string
          duration: number
          holding: number | null
          last_updated: number | null
          score: number | null
          start_time: number
          token: string
          volume: number | null
        }
        Insert: {
          day: string
          duration: number
          holding?: number | null
          last_updated?: number | null
          score?: number | null
          start_time: number
          token: string
          volume?: number | null
        }
        Update: {
          day?: string
          duration?: number
          holding?: number | null
          last_updated?: number | null
          score?: number | null
          start_time?: number
          token?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "first_trade_data_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      first_trades: {
        Row: {
          day: string
          end_active: number | null
          height: number | null
          score: number | null
          timestamp: number | null
          token: string
        }
        Insert: {
          day: string
          end_active?: number | null
          height?: number | null
          score?: number | null
          timestamp?: number | null
          token: string
        }
        Update: {
          day?: string
          end_active?: number | null
          height?: number | null
          score?: number | null
          timestamp?: number | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "first_trades_token_fkey"
            columns: ["token"]
            isOneToOne: true
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      hourly_data: {
        Row: {
          buy_volume: number | null
          buys: number | null
          count: number | null
          d25_score: number | null
          d5_score: number | null
          end_price: number | null
          height: number | null
          historical_version: number | null
          holders: number | null
          mcap: number | null
          pool_balance: number | null
          price: number | null
          score: number | null
          sell_volume: number | null
          sells: number | null
          timestamp: number
          token: string
          vol_24h: number | null
          volume: number | null
        }
        Insert: {
          buy_volume?: number | null
          buys?: number | null
          count?: number | null
          d25_score?: number | null
          d5_score?: number | null
          end_price?: number | null
          height?: number | null
          historical_version?: number | null
          holders?: number | null
          mcap?: number | null
          pool_balance?: number | null
          price?: number | null
          score?: number | null
          sell_volume?: number | null
          sells?: number | null
          timestamp: number
          token: string
          vol_24h?: number | null
          volume?: number | null
        }
        Update: {
          buy_volume?: number | null
          buys?: number | null
          count?: number | null
          d25_score?: number | null
          d5_score?: number | null
          end_price?: number | null
          height?: number | null
          historical_version?: number | null
          holders?: number | null
          mcap?: number | null
          pool_balance?: number | null
          price?: number | null
          score?: number | null
          sell_volume?: number | null
          sells?: number | null
          timestamp?: number
          token?: string
          vol_24h?: number | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hourly_data_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      launch_d25_signals: {
        Row: {
          day10: number | null
          day11: number | null
          day12: number | null
          day13: number | null
          day14: number | null
          day15: number | null
          day2: number | null
          day3: number | null
          day4: number | null
          day5: number | null
          day6: number | null
          day7: number | null
          day8: number | null
          day9: number | null
          end_price: number
          high_day: number | null
          high_mult: number | null
          historical_version: number | null
          holders: number
          hours_after: number | null
          mcap: number | null
          pool_balance: number
          price: number
          score: number
          threshold: string
          threshold_value: number
          timestamp: number
          token: string
          vol_24h: number
        }
        Insert: {
          day10?: number | null
          day11?: number | null
          day12?: number | null
          day13?: number | null
          day14?: number | null
          day15?: number | null
          day2?: number | null
          day3?: number | null
          day4?: number | null
          day5?: number | null
          day6?: number | null
          day7?: number | null
          day8?: number | null
          day9?: number | null
          end_price: number
          high_day?: number | null
          high_mult?: number | null
          historical_version?: number | null
          holders: number
          hours_after?: number | null
          mcap?: number | null
          pool_balance: number
          price: number
          score: number
          threshold: string
          threshold_value: number
          timestamp: number
          token: string
          vol_24h: number
        }
        Update: {
          day10?: number | null
          day11?: number | null
          day12?: number | null
          day13?: number | null
          day14?: number | null
          day15?: number | null
          day2?: number | null
          day3?: number | null
          day4?: number | null
          day5?: number | null
          day6?: number | null
          day7?: number | null
          day8?: number | null
          day9?: number | null
          end_price?: number
          high_day?: number | null
          high_mult?: number | null
          historical_version?: number | null
          holders?: number
          hours_after?: number | null
          mcap?: number | null
          pool_balance?: number
          price?: number
          score?: number
          threshold?: string
          threshold_value?: number
          timestamp?: number
          token?: string
          vol_24h?: number
        }
        Relationships: [
          {
            foreignKeyName: "launch_d25_signals_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      launch_d5_signals: {
        Row: {
          day10: number | null
          day11: number | null
          day12: number | null
          day13: number | null
          day14: number | null
          day15: number | null
          day2: number | null
          day3: number | null
          day4: number | null
          day5: number | null
          day6: number | null
          day7: number | null
          day8: number | null
          day9: number | null
          end_price: number
          high_day: number | null
          high_mult: number | null
          historical_version: number | null
          holders: number
          hours_after: number | null
          mcap: number | null
          pool_balance: number
          price: number
          score: number
          threshold: string
          threshold_value: number
          timestamp: number
          token: string
          vol_24h: number
        }
        Insert: {
          day10?: number | null
          day11?: number | null
          day12?: number | null
          day13?: number | null
          day14?: number | null
          day15?: number | null
          day2?: number | null
          day3?: number | null
          day4?: number | null
          day5?: number | null
          day6?: number | null
          day7?: number | null
          day8?: number | null
          day9?: number | null
          end_price: number
          high_day?: number | null
          high_mult?: number | null
          historical_version?: number | null
          holders: number
          hours_after?: number | null
          mcap?: number | null
          pool_balance: number
          price: number
          score: number
          threshold: string
          threshold_value: number
          timestamp: number
          token: string
          vol_24h: number
        }
        Update: {
          day10?: number | null
          day11?: number | null
          day12?: number | null
          day13?: number | null
          day14?: number | null
          day15?: number | null
          day2?: number | null
          day3?: number | null
          day4?: number | null
          day5?: number | null
          day6?: number | null
          day7?: number | null
          day8?: number | null
          day9?: number | null
          end_price?: number
          high_day?: number | null
          high_mult?: number | null
          historical_version?: number | null
          holders?: number
          hours_after?: number | null
          mcap?: number | null
          pool_balance?: number
          price?: number
          score?: number
          threshold?: string
          threshold_value?: number
          timestamp?: number
          token?: string
          vol_24h?: number
        }
        Relationships: [
          {
            foreignKeyName: "launch_d5_signals_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      launch_holdings: {
        Row: {
          address: string
          as2: number | null
          d0_five_pct: number | null
          d0_five_score: number | null
          d0_mcap: number | null
          d0_pct: number | null
          d0_price: number | null
          d0_score: number | null
          d0_vol: number | null
          d1_five_pct: number | null
          d1_five_score: number | null
          d1_mcap: number | null
          d1_pct: number | null
          d1_price: number | null
          d1_score: number | null
          d1_vol: number | null
          d25: number | null
          d5: number | null
          day: string
          holders: number | null
          holding: number | null
          joined_key: string
          pool_balance: number | null
          score: number | null
          token: string
          vol_24: number | null
        }
        Insert: {
          address: string
          as2?: number | null
          d0_five_pct?: number | null
          d0_five_score?: number | null
          d0_mcap?: number | null
          d0_pct?: number | null
          d0_price?: number | null
          d0_score?: number | null
          d0_vol?: number | null
          d1_five_pct?: number | null
          d1_five_score?: number | null
          d1_mcap?: number | null
          d1_pct?: number | null
          d1_price?: number | null
          d1_score?: number | null
          d1_vol?: number | null
          d25?: number | null
          d5?: number | null
          day: string
          holders?: number | null
          holding?: number | null
          joined_key: string
          pool_balance?: number | null
          score?: number | null
          token: string
          vol_24?: number | null
        }
        Update: {
          address?: string
          as2?: number | null
          d0_five_pct?: number | null
          d0_five_score?: number | null
          d0_mcap?: number | null
          d0_pct?: number | null
          d0_price?: number | null
          d0_score?: number | null
          d0_vol?: number | null
          d1_five_pct?: number | null
          d1_five_score?: number | null
          d1_mcap?: number | null
          d1_pct?: number | null
          d1_price?: number | null
          d1_score?: number | null
          d1_vol?: number | null
          d25?: number | null
          d5?: number | null
          day?: string
          holders?: number | null
          holding?: number | null
          joined_key?: string
          pool_balance?: number | null
          score?: number | null
          token?: string
          vol_24?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "launch_holdings_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "launch_owners"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "launch_holdings_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      launch_owners: {
        Row: {
          address: string
          avg_holding: number | null
          avg_loss_holdings: number | null
          avg_losses: number | null
          avg_profit: number | null
          avg_profit_pct: number | null
          avg_score: number | null
          avg_total_holdings: number | null
          avg_win_holdings: number | null
          avg_win_loss: number | null
          avg_win_pct: number | null
          avg_wins: number | null
          d0_holdings: number | null
          d0_loss_holdings: number | null
          d0_losses: number | null
          d0_profit: number | null
          d0_profit_pct: number | null
          d0_score: number | null
          d0_win_holdings: number | null
          d0_win_loss: number | null
          d0_win_pct: number | null
          d0_wins: number | null
          d25_score: number | null
          last_day: string | null
          last_updated: number | null
          launches: number | null
          loss_holdings: number | null
          losses: number | null
          min_holding: number | null
          min_loss_holdings: number | null
          min_losses: number | null
          min_profit: number | null
          min_profit_pct: number | null
          min_score: number | null
          min_total_holdings: number | null
          min_win_holdings: number | null
          min_win_loss: number | null
          min_win_pct: number | null
          min_wins: number | null
          profit: number | null
          profit_pct: number | null
          score: number | null
          total_holdings: number | null
          tracking: string | null
          win_holdings: number | null
          win_loss: number | null
          win_pct: number | null
          wins: number | null
        }
        Insert: {
          address: string
          avg_holding?: number | null
          avg_loss_holdings?: number | null
          avg_losses?: number | null
          avg_profit?: number | null
          avg_profit_pct?: number | null
          avg_score?: number | null
          avg_total_holdings?: number | null
          avg_win_holdings?: number | null
          avg_win_loss?: number | null
          avg_win_pct?: number | null
          avg_wins?: number | null
          d0_holdings?: number | null
          d0_loss_holdings?: number | null
          d0_losses?: number | null
          d0_profit?: number | null
          d0_profit_pct?: number | null
          d0_score?: number | null
          d0_win_holdings?: number | null
          d0_win_loss?: number | null
          d0_win_pct?: number | null
          d0_wins?: number | null
          d25_score?: number | null
          last_day?: string | null
          last_updated?: number | null
          launches?: number | null
          loss_holdings?: number | null
          losses?: number | null
          min_holding?: number | null
          min_loss_holdings?: number | null
          min_losses?: number | null
          min_profit?: number | null
          min_profit_pct?: number | null
          min_score?: number | null
          min_total_holdings?: number | null
          min_win_holdings?: number | null
          min_win_loss?: number | null
          min_win_pct?: number | null
          min_wins?: number | null
          profit?: number | null
          profit_pct?: number | null
          score?: number | null
          total_holdings?: number | null
          tracking?: string | null
          win_holdings?: number | null
          win_loss?: number | null
          win_pct?: number | null
          wins?: number | null
        }
        Update: {
          address?: string
          avg_holding?: number | null
          avg_loss_holdings?: number | null
          avg_losses?: number | null
          avg_profit?: number | null
          avg_profit_pct?: number | null
          avg_score?: number | null
          avg_total_holdings?: number | null
          avg_win_holdings?: number | null
          avg_win_loss?: number | null
          avg_win_pct?: number | null
          avg_wins?: number | null
          d0_holdings?: number | null
          d0_loss_holdings?: number | null
          d0_losses?: number | null
          d0_profit?: number | null
          d0_profit_pct?: number | null
          d0_score?: number | null
          d0_win_holdings?: number | null
          d0_win_loss?: number | null
          d0_win_pct?: number | null
          d0_wins?: number | null
          d25_score?: number | null
          last_day?: string | null
          last_updated?: number | null
          launches?: number | null
          loss_holdings?: number | null
          losses?: number | null
          min_holding?: number | null
          min_loss_holdings?: number | null
          min_losses?: number | null
          min_profit?: number | null
          min_profit_pct?: number | null
          min_score?: number | null
          min_total_holdings?: number | null
          min_win_holdings?: number | null
          min_win_loss?: number | null
          min_win_pct?: number | null
          min_wins?: number | null
          profit?: number | null
          profit_pct?: number | null
          score?: number | null
          total_holdings?: number | null
          tracking?: string | null
          win_holdings?: number | null
          win_loss?: number | null
          win_pct?: number | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "launch_owners_address_fkey"
            columns: ["address"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["address"]
          },
        ]
      }
      launch_signals: {
        Row: {
          day10: number | null
          day11: number | null
          day12: number | null
          day13: number | null
          day14: number | null
          day15: number | null
          day2: number | null
          day3: number | null
          day4: number | null
          day5: number | null
          day6: number | null
          day7: number | null
          day8: number | null
          day9: number | null
          end_price: number
          high_day: number | null
          high_mult: number | null
          historical_version: number | null
          holders: number
          hours_after: number | null
          mcap: number | null
          pool_balance: number
          price: number
          score: number
          threshold: string
          threshold_value: number
          timestamp: number
          token: string
          vol_24h: number
        }
        Insert: {
          day10?: number | null
          day11?: number | null
          day12?: number | null
          day13?: number | null
          day14?: number | null
          day15?: number | null
          day2?: number | null
          day3?: number | null
          day4?: number | null
          day5?: number | null
          day6?: number | null
          day7?: number | null
          day8?: number | null
          day9?: number | null
          end_price: number
          high_day?: number | null
          high_mult?: number | null
          historical_version?: number | null
          holders: number
          hours_after?: number | null
          mcap?: number | null
          pool_balance: number
          price: number
          score: number
          threshold: string
          threshold_value: number
          timestamp: number
          token: string
          vol_24h: number
        }
        Update: {
          day10?: number | null
          day11?: number | null
          day12?: number | null
          day13?: number | null
          day14?: number | null
          day15?: number | null
          day2?: number | null
          day3?: number | null
          day4?: number | null
          day5?: number | null
          day6?: number | null
          day7?: number | null
          day8?: number | null
          day9?: number | null
          end_price?: number
          high_day?: number | null
          high_mult?: number | null
          historical_version?: number | null
          holders?: number
          hours_after?: number | null
          mcap?: number | null
          pool_balance?: number
          price?: number
          score?: number
          threshold?: string
          threshold_value?: number
          timestamp?: number
          token?: string
          vol_24h?: number
        }
        Relationships: [
          {
            foreignKeyName: "launch_signals_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      leaking_alpha: {
        Row: {
          buy_amount: number | null
          buy_eth: number | null
          buy_price: number | null
          buy_timestamp: number
          buy_tweeted: boolean
          buy_type: string
          buy_usd: number | null
          profit_eth: number | null
          profit_eth_pct: number | null
          profit_usd: number | null
          profit_usd_pct: number | null
          sell_amount: number | null
          sell_eth: number | null
          sell_price: number | null
          sell_timestamp: number | null
          sell_tweeted: boolean
          sell_usd: number | null
          symbol: string
          token: string
        }
        Insert: {
          buy_amount?: number | null
          buy_eth?: number | null
          buy_price?: number | null
          buy_timestamp: number
          buy_tweeted?: boolean
          buy_type: string
          buy_usd?: number | null
          profit_eth?: number | null
          profit_eth_pct?: number | null
          profit_usd?: number | null
          profit_usd_pct?: number | null
          sell_amount?: number | null
          sell_eth?: number | null
          sell_price?: number | null
          sell_timestamp?: number | null
          sell_tweeted?: boolean
          sell_usd?: number | null
          symbol: string
          token: string
        }
        Update: {
          buy_amount?: number | null
          buy_eth?: number | null
          buy_price?: number | null
          buy_timestamp?: number
          buy_tweeted?: boolean
          buy_type?: string
          buy_usd?: number | null
          profit_eth?: number | null
          profit_eth_pct?: number | null
          profit_usd?: number | null
          profit_usd_pct?: number | null
          sell_amount?: number | null
          sell_eth?: number | null
          sell_price?: number | null
          sell_timestamp?: number | null
          sell_tweeted?: boolean
          sell_usd?: number | null
          symbol?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaking_alpha_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      pointers: {
        Row: {
          pointer: string
          value: string
        }
        Insert: {
          pointer: string
          value: string
        }
        Update: {
          pointer?: string
          value?: string
        }
        Relationships: []
      }
      signals: {
        Row: {
          address: string
          amount: number | null
          day: string
          exchange: number | null
          score: string | null
          timestamp: number | null
          token: string
          usd: number | null
        }
        Insert: {
          address: string
          amount?: number | null
          day: string
          exchange?: number | null
          score?: string | null
          timestamp?: number | null
          token: string
          usd?: number | null
        }
        Update: {
          address?: string
          amount?: number | null
          day?: string
          exchange?: number | null
          score?: string | null
          timestamp?: number | null
          token?: string
          usd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "signals_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "signals_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      spike_scores: {
        Row: {
          address: string
          bought_pct: number | null
          buys_30d: number | null
          buys_total: number | null
          day: string
          holding_usd: number | null
          market_cap: number | null
          mcap_basis_pts: number | null
          profit_usd: number | null
          score: number | null
          sells_30d: number | null
          sells_total: number | null
          sold_pct: number | null
          token: string
        }
        Insert: {
          address: string
          bought_pct?: number | null
          buys_30d?: number | null
          buys_total?: number | null
          day: string
          holding_usd?: number | null
          market_cap?: number | null
          mcap_basis_pts?: number | null
          profit_usd?: number | null
          score?: number | null
          sells_30d?: number | null
          sells_total?: number | null
          sold_pct?: number | null
          token: string
        }
        Update: {
          address?: string
          bought_pct?: number | null
          buys_30d?: number | null
          buys_total?: number | null
          day?: string
          holding_usd?: number | null
          market_cap?: number | null
          mcap_basis_pts?: number | null
          profit_usd?: number | null
          score?: number | null
          sells_30d?: number | null
          sells_total?: number | null
          sold_pct?: number | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "spike_scores_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "spike_scores_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      spikes: {
        Row: {
          above_count: number | null
          day: string
          high_day: string | null
          high_price: number | null
          high_score: number | null
          last_analyzed: number | null
          market_cap_high: number | null
          market_cap_low: number | null
          price: number | null
          score: number | null
          token: string
          volume: number | null
        }
        Insert: {
          above_count?: number | null
          day: string
          high_day?: string | null
          high_price?: number | null
          high_score?: number | null
          last_analyzed?: number | null
          market_cap_high?: number | null
          market_cap_low?: number | null
          price?: number | null
          score?: number | null
          token: string
          volume?: number | null
        }
        Update: {
          above_count?: number | null
          day?: string
          high_day?: string | null
          high_price?: number | null
          high_score?: number | null
          last_analyzed?: number | null
          market_cap_high?: number | null
          market_cap_low?: number | null
          price?: number | null
          score?: number | null
          token?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "spikes_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      swaps: {
        Row: {
          address: string
          day: string
          swap_id: number
          symbol: string
          token: string
          usd_earned: number
        }
        Insert: {
          address: string
          day: string
          swap_id: number
          symbol: string
          token: string
          usd_earned: number
        }
        Update: {
          address?: string
          day?: string
          swap_id?: number
          symbol?: string
          token?: string
          usd_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "swaps_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "swaps_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      token_day_data: {
        Row: {
          buy_pct: number | null
          buy_score: number | null
          day: string
          dex_price: number | null
          dex_volume: number | null
          five_pct: number | null
          five_score: number | null
          gecko_price: number | null
          gecko_volume: number | null
          joined_key: string
          price: number | null
          sell_pct: number | null
          sell_score: number | null
          token: string
          v3_buy_volume: number | null
          v3_sell_volume: number | null
          v3_usd_buy_volume: number | null
          v3_usd_sell_volume: number | null
          volume: number | null
        }
        Insert: {
          buy_pct?: number | null
          buy_score?: number | null
          day: string
          dex_price?: number | null
          dex_volume?: number | null
          five_pct?: number | null
          five_score?: number | null
          gecko_price?: number | null
          gecko_volume?: number | null
          joined_key: string
          price?: number | null
          sell_pct?: number | null
          sell_score?: number | null
          token: string
          v3_buy_volume?: number | null
          v3_sell_volume?: number | null
          v3_usd_buy_volume?: number | null
          v3_usd_sell_volume?: number | null
          volume?: number | null
        }
        Update: {
          buy_pct?: number | null
          buy_score?: number | null
          day?: string
          dex_price?: number | null
          dex_volume?: number | null
          five_pct?: number | null
          five_score?: number | null
          gecko_price?: number | null
          gecko_volume?: number | null
          joined_key?: string
          price?: number | null
          sell_pct?: number | null
          sell_score?: number | null
          token?: string
          v3_buy_volume?: number | null
          v3_sell_volume?: number | null
          v3_usd_buy_volume?: number | null
          v3_usd_sell_volume?: number | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "token_day_data_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["token"]
          },
        ]
      }
      tokens: {
        Row: {
          adopter_pct: number | null
          adopter_score: number | null
          as_2_score: number | null
          blacklist: boolean | null
          buy_tax: number | null
          circulating_supply: number | null
          coingecko_id: string | null
          d0_pct: number | null
          d0_price: number | null
          d0_score: number | null
          d0_volume: number | null
          d5_2_score: number | null
          d5_3_score: number | null
          d5_4_score: number | null
          decimals: number
          external_call: boolean | null
          first_coingecko_day: string | null
          first_dex_day: string | null
          ft_day: string | null
          ft_height: number | null
          ft_last_analyzed: number | null
          ft_score: number | null
          ft_timestamp: number | null
          has_owner: boolean | null
          high_holder_percent: number | null
          high_score: number | null
          holder_count: number | null
          icon: string | null
          ignore: boolean | null
          is_anti_whale: boolean | null
          is_proxy: boolean | null
          last_updated: number
          launch_analyzed: number | null
          launch_d0_mcap: number | null
          launch_d1_mcap: number | null
          launch_five_pct: number | null
          launch_five_score: number | null
          launch_holders: number | null
          launch_market: string | null
          launch_pct: number | null
          launch_pool_balance: number | null
          launch_price: number | null
          launch_score: number | null
          launch_vol_24h: number | null
          launch_volume: number | null
          low_score: number | null
          lp_count: number | null
          lp_size: number | null
          max_supply: number | null
          maybe_honeypot: boolean | null
          name: string | null
          no_go_score: number | null
          owner_correlation: number | null
          owner_count: number | null
          owner_count_pct: number | null
          owner_profit_pct: number | null
          owner_score: number | null
          owner_win_count: number | null
          owner_win_loss: number | null
          owner_win_pct: number | null
          prev_address: string | null
          realtime_as_2: number | null
          risk_score: number | null
          sell_tax: number | null
          spike_count: number | null
          spike_score: number | null
          spiker_profit: number | null
          spikers: number | null
          symbol: string | null
          token: string
          total_supply: number | null
          trade_count: number | null
          trading_cooldown: boolean | null
          volume_usd: number | null
          web_slug: string | null
          whitelist: boolean | null
        }
        Insert: {
          adopter_pct?: number | null
          adopter_score?: number | null
          as_2_score?: number | null
          blacklist?: boolean | null
          buy_tax?: number | null
          circulating_supply?: number | null
          coingecko_id?: string | null
          d0_pct?: number | null
          d0_price?: number | null
          d0_score?: number | null
          d0_volume?: number | null
          d5_2_score?: number | null
          d5_3_score?: number | null
          d5_4_score?: number | null
          decimals?: number
          external_call?: boolean | null
          first_coingecko_day?: string | null
          first_dex_day?: string | null
          ft_day?: string | null
          ft_height?: number | null
          ft_last_analyzed?: number | null
          ft_score?: number | null
          ft_timestamp?: number | null
          has_owner?: boolean | null
          high_holder_percent?: number | null
          high_score?: number | null
          holder_count?: number | null
          icon?: string | null
          ignore?: boolean | null
          is_anti_whale?: boolean | null
          is_proxy?: boolean | null
          last_updated?: number
          launch_analyzed?: number | null
          launch_d0_mcap?: number | null
          launch_d1_mcap?: number | null
          launch_five_pct?: number | null
          launch_five_score?: number | null
          launch_holders?: number | null
          launch_market?: string | null
          launch_pct?: number | null
          launch_pool_balance?: number | null
          launch_price?: number | null
          launch_score?: number | null
          launch_vol_24h?: number | null
          launch_volume?: number | null
          low_score?: number | null
          lp_count?: number | null
          lp_size?: number | null
          max_supply?: number | null
          maybe_honeypot?: boolean | null
          name?: string | null
          no_go_score?: number | null
          owner_correlation?: number | null
          owner_count?: number | null
          owner_count_pct?: number | null
          owner_profit_pct?: number | null
          owner_score?: number | null
          owner_win_count?: number | null
          owner_win_loss?: number | null
          owner_win_pct?: number | null
          prev_address?: string | null
          realtime_as_2?: number | null
          risk_score?: number | null
          sell_tax?: number | null
          spike_count?: number | null
          spike_score?: number | null
          spiker_profit?: number | null
          spikers?: number | null
          symbol?: string | null
          token: string
          total_supply?: number | null
          trade_count?: number | null
          trading_cooldown?: boolean | null
          volume_usd?: number | null
          web_slug?: string | null
          whitelist?: boolean | null
        }
        Update: {
          adopter_pct?: number | null
          adopter_score?: number | null
          as_2_score?: number | null
          blacklist?: boolean | null
          buy_tax?: number | null
          circulating_supply?: number | null
          coingecko_id?: string | null
          d0_pct?: number | null
          d0_price?: number | null
          d0_score?: number | null
          d0_volume?: number | null
          d5_2_score?: number | null
          d5_3_score?: number | null
          d5_4_score?: number | null
          decimals?: number
          external_call?: boolean | null
          first_coingecko_day?: string | null
          first_dex_day?: string | null
          ft_day?: string | null
          ft_height?: number | null
          ft_last_analyzed?: number | null
          ft_score?: number | null
          ft_timestamp?: number | null
          has_owner?: boolean | null
          high_holder_percent?: number | null
          high_score?: number | null
          holder_count?: number | null
          icon?: string | null
          ignore?: boolean | null
          is_anti_whale?: boolean | null
          is_proxy?: boolean | null
          last_updated?: number
          launch_analyzed?: number | null
          launch_d0_mcap?: number | null
          launch_d1_mcap?: number | null
          launch_five_pct?: number | null
          launch_five_score?: number | null
          launch_holders?: number | null
          launch_market?: string | null
          launch_pct?: number | null
          launch_pool_balance?: number | null
          launch_price?: number | null
          launch_score?: number | null
          launch_vol_24h?: number | null
          launch_volume?: number | null
          low_score?: number | null
          lp_count?: number | null
          lp_size?: number | null
          max_supply?: number | null
          maybe_honeypot?: boolean | null
          name?: string | null
          no_go_score?: number | null
          owner_correlation?: number | null
          owner_count?: number | null
          owner_count_pct?: number | null
          owner_profit_pct?: number | null
          owner_score?: number | null
          owner_win_count?: number | null
          owner_win_loss?: number | null
          owner_win_pct?: number | null
          prev_address?: string | null
          realtime_as_2?: number | null
          risk_score?: number | null
          sell_tax?: number | null
          spike_count?: number | null
          spike_score?: number | null
          spiker_profit?: number | null
          spikers?: number | null
          symbol?: string | null
          token?: string
          total_supply?: number | null
          trade_count?: number | null
          trading_cooldown?: boolean | null
          volume_usd?: number | null
          web_slug?: string | null
          whitelist?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      call_webhook: {
        Args: {
          function_name: string
          payload: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

