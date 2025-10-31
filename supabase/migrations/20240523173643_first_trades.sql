
ALTER TABLE tokens
ADD COLUMN ft_day date,
ADD COLUMN ft_height integer,
ADD COLUMN ft_timestamp integer,
ADD COLUMN ft_score integer,
ADD COLUMN realtime_as_2 double precision;

CREATE INDEX ON tokens (ft_day);
CREATE INDEX ON tokens (ft_height);
CREATE INDEX ON tokens (ft_timestamp);
CREATE INDEX ON tokens (ft_score);
CREATE INDEX ON tokens (realtime_as_2);


CREATE TABLE first_trades (
  token VARCHAR(42) PRIMARY KEY REFERENCES tokens,
  day date NOT NULL,
  height integer,
  timestamp integer,
  score double precision,
  end_active integer
);

CREATE INDEX ON first_trades (day);
CREATE INDEX ON first_trades (height);
CREATE INDEX ON first_trades (timestamp);
CREATE INDEX ON first_trades (score);
CREATE INDEX ON first_trades (end_active);

alter table public.first_trades enable row level security;
CREATE POLICY "first_trades_read" ON public.first_trades FOR SELECT USING (true);

CREATE FUNCTION first_trades_function()
RETURNS trigger 
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO tokens (token) VALUES (NEW.token) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "before_first_trades"
BEFORE INSERT on first_trades
for each row
EXECUTE FUNCTION first_trades_function();


CREATE FUNCTION first_trades_update_function()
RETURNS trigger 
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE tokens SET ft_day = NEW.day, ft_height = new.height, ft_timestamp = New.timestamp WHERE token = New.token;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "after_first_trades"
AFTER INSERT on first_trades
for each row
EXECUTE FUNCTION first_trades_update_function();


CREATE TABLE first_trade_data (
  token VARCHAR(42) NOT NULL REFERENCES tokens,
  start_time integer NOT NULL,
  duration integer NOT NULL,
  day date NOT NULL,

  holding double precision,
  score double precision,
  volume double precision,
  last_updated integer,
  PRIMARY KEY (start_time, token)
);

alter table public.first_trade_data enable row level security;
CREATE POLICY "first_trade_data_read" ON public.first_trade_data FOR SELECT USING (true);

CREATE INDEX ON first_trade_data (token);
CREATE INDEX ON first_trade_data (start_time);
CREATE INDEX ON first_trade_data (day);
CREATE INDEX ON first_trade_data (holding);
CREATE INDEX ON first_trade_data (score);
CREATE INDEX ON first_trade_data (volume);
CREATE INDEX ON first_trade_data (last_updated);


select
  cron.schedule(
    'invoke-ingest-first-trade-day-every-hour',
    '*/30 * * * *',
    $$ SELECT call_webhook('ingest-first-trade-day', '{}'); $$
  );
