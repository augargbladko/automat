CREATE TABLE tokens (
  token VARCHAR(42) PRIMARY KEY,
  symbol TEXT,
  decimals integer NOT NULL DEFAULT 18,

  first_dex_day date,
  first_coingecko_day date,

  no_go_score double precision,
  risk_score double precision,

  high_score double precision,
  low_score double precision,
  spike_score double precision, 
  spike_count integer,
  trade_count integer,

  adopter_score double precision,
  adopter_pct double precision,

  spikers integer,
  spiker_profit double precision,

  last_updated integer NOT NULL DEFAULT 0,

  prev_address VARCHAR(42) UNIQUE,
  coingecko_id TEXT,
  web_slug TEXT,
  name TEXT,
  icon TEXT,
  total_supply double precision,
  max_supply double precision,
  circulating_supply double precision,
  volume_usd double precision,

  holder_count double precision,
  high_holder_percent double precision,
  lp_size double precision,
  lp_count double precision,
  buy_tax double precision,
  sell_tax double precision,
  external_call boolean,
  is_anti_whale boolean,
  is_proxy boolean,
  blacklist boolean,
  whitelist boolean,
  trading_cooldown boolean,
  maybe_honeypot boolean,
  has_owner boolean
);

CREATE INDEX ON tokens (symbol);
CREATE INDEX ON tokens (prev_address);
CREATE INDEX ON tokens (coingecko_id);
CREATE INDEX ON tokens (first_dex_day);
CREATE INDEX ON tokens (first_coingecko_day);
CREATE INDEX ON tokens (high_score);
CREATE INDEX ON tokens (spike_count);
CREATE INDEX ON tokens (spike_score);
CREATE INDEX ON tokens (no_go_score);
CREATE INDEX ON tokens (risk_score);
CREATE INDEX ON tokens (trade_count);
CREATE INDEX ON tokens (last_updated);
CREATE INDEX ON tokens (adopter_score);
CREATE INDEX ON tokens (adopter_pct);

