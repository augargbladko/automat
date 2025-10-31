CREATE TABLE launch_signals (
  token VARCHAR(42) NOT NULL REFERENCES tokens,
  threshold text NOT NULL,
  threshold_value integer NOT NULL,

  timestamp double precision NOT NULL,
  score double precision NOT NULL,
  vol_24h double precision NOT NULL,
  price double precision NOT NULL,
  end_price double precision NOT NULL,
  pool_balance double precision NOT NULL,
  holders integer NOT NULL,
  mcap double precision,
  high_mult double precision,
  high_day integer,
  historical_version integer,
  day2 double precision,
  day3 double precision,
  day4 double precision,
  day5 double precision,
  day6 double precision,
  day7 double precision,
  day8 double precision,
  day9 double precision,
  day10 double precision,
  day11 double precision,
  day12 double precision,
  day13 double precision,
  day14 double precision,
  day15 double precision,
  hours_after integer,
  PRIMARY KEY (token, threshold)
);

alter table public.launch_signals enable row level security;
CREATE POLICY "launch_signals_read" ON public.launch_signals FOR SELECT USING (true);

CREATE INDEX ON launch_signals (token);
CREATE INDEX ON launch_signals (threshold_value);
CREATE INDEX ON launch_signals (threshold);
CREATE INDEX ON launch_signals (timestamp);
CREATE INDEX ON launch_signals (score);
CREATE INDEX ON launch_signals (vol_24h);
CREATE INDEX ON launch_signals (price);
CREATE INDEX ON launch_signals (end_price);
CREATE INDEX ON launch_signals (pool_balance);
CREATE INDEX ON launch_signals (holders);
CREATE INDEX ON launch_signals (mcap);
CREATE INDEX ON launch_signals (hours_after);
CREATE INDEX ON launch_signals (historical_version);
