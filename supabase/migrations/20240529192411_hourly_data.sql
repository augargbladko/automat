
CREATE TABLE hourly_data (
  token VARCHAR(42) NOT NULL REFERENCES tokens,
  timestamp integer NOT NULL,
  price double precision,
  end_price double precision,
  volume double precision,
  vol_24h double precision,
  count integer,
  sells integer,
  buys integer,
  buy_volume double precision,
  sell_volume double precision,
  height integer,
  holders integer,
  pool_balance double precision,
  score double precision,
  d5_score real,
  d25_score real,
  historical_version integer,
  mcap double precision,
  PRIMARY KEY (timestamp, token)
);

alter table public.hourly_data enable row level security;
CREATE POLICY "hourly_data_read" ON public.hourly_data FOR SELECT USING (true);

CREATE INDEX ON hourly_data (token);
CREATE INDEX ON hourly_data (timestamp);
CREATE INDEX ON hourly_data (price);
CREATE INDEX ON hourly_data (end_price);
CREATE INDEX ON hourly_data (volume);
CREATE INDEX ON hourly_data (vol_24h);
CREATE INDEX ON hourly_data (count);
CREATE INDEX ON hourly_data (sells);
CREATE INDEX ON hourly_data (buys);
CREATE INDEX ON hourly_data (buy_volume);
CREATE INDEX ON hourly_data (sell_volume);
CREATE INDEX ON hourly_data (holders);
CREATE INDEX ON hourly_data (pool_balance);
CREATE INDEX ON hourly_data (score);
CREATE INDEX ON hourly_data (d5_score);
CREATE INDEX ON hourly_data (d25_score);
CREATE INDEX ON hourly_data (historical_version);
CREATE INDEX ON hourly_data (mcap);

select
  cron.schedule(
    'invoke-parse-realtime-launches-every-minute',
    '* * * * *',
    $$ SELECT call_webhook('parse-realtime-launches', '{}'); $$
  );

select
  cron.schedule(
    'invoke-parse-historical-launches-every-minute',
    '* * * * *',
    $$ SELECT call_webhook('parse-historical-launches', '{}'); $$
  );
