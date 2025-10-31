CREATE TABLE accounts (
  address VARCHAR(42) PRIMARY KEY,
  status text,
  tracking text,
  overall_score double precision,
  avg_buy double precision,
  last_trade_day text,
  score double precision,
  recent_score double precision,
  bear_score double precision,
  flat_score double precision,
  bull_score double precision,
  spike_count integer,
  trade_count integer,
  win_pct double precision,
  recent_win_pct double precision,
  bear_win_pct double precision,
  flat_win_pct double precision,
  bull_win_pct double precision,
  profit_pct double precision,
  recent_profit_pct double precision,
  bear_profit_pct double precision,
  flat_profit_pct double precision,
  bull_profit_pct double precision,
  profit_k double precision,
  recent_profit_k double precision,
  bear_profit_k double precision,
  flat_profit_k double precision,
  bull_profit_k double precision,
  swaps double precision,
  usd_buy_volume double precision,
  usd_sell_volume double precision,
  spike_profit double precision,
  dollar_value double precision,
  last_updated integer
);

CREATE INDEX ON accounts (usd_buy_volume);
CREATE INDEX ON accounts (usd_sell_volume);
CREATE INDEX ON accounts (swaps);
CREATE INDEX ON accounts (spike_count);
CREATE INDEX ON accounts (spike_profit);
CREATE INDEX ON accounts (score);
CREATE INDEX ON accounts (overall_score);
CREATE INDEX ON accounts (bear_score);
CREATE INDEX ON accounts (flat_score);
CREATE INDEX ON accounts (bull_score);
CREATE INDEX ON accounts (recent_score);
CREATE INDEX ON accounts (avg_buy);
CREATE INDEX ON accounts (status);
CREATE INDEX ON accounts (tracking);
CREATE INDEX ON accounts (last_updated);
