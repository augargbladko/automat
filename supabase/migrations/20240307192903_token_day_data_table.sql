CREATE TABLE token_day_data (
  joined_key text PRIMARY KEY,
  day date NOT NULL,
  token VARCHAR(42) NOT NULL REFERENCES tokens,
  price double precision,
  volume double precision
);

ALTER TABLE token_day_data
ADD COLUMN buy_score real,
ADD COLUMN buy_pct real,
ADD COLUMN five_score real,
ADD COLUMN five_pct real,
ADD COLUMN sell_score real,
ADD COLUMN sell_pct real;

ALTER TABLE token_day_data
ADD COLUMN gecko_price double precision,
ADD COLUMN gecko_volume double precision,
ADD COLUMN dex_price double precision,
ADD COLUMN dex_volume double precision;

ALTER TABLE token_day_data
ADD COLUMN v3_usd_buy_volume double precision,
ADD COLUMN v3_usd_sell_volume double precision,
ADD COLUMN v3_buy_volume double precision,
ADD COLUMN v3_sell_volume double precision;

CREATE INDEX ON token_day_data (day);
CREATE INDEX ON token_day_data (token);
CREATE INDEX ON token_day_data (buy_score);
CREATE INDEX ON token_day_data (five_score);
CREATE INDEX ON token_day_data (sell_score);

CREATE FUNCTION token_day_data_function()
RETURNS trigger 
LANGUAGE plpgsql
AS $$
DECLARE 
  divisor real;
BEGIN
  INSERT INTO tokens (token) VALUES (NEW.token) ON CONFLICT DO NOTHING;
  NEW.v3_usd_sell_volume := COALESCE(OLD.v3_usd_sell_volume + NEW.v3_usd_sell_volume, NEW.v3_usd_sell_volume, OLD.v3_usd_sell_volume,0);
  NEW.v3_usd_buy_volume := COALESCE(OLD.v3_usd_buy_volume + NEW.v3_usd_buy_volume, NEW.v3_usd_buy_volume, OLD.v3_usd_buy_volume,0);
  SELECT decimals INTO divisor FROM tokens WHERE token = NEW.token;
  divisor := POWER(10, COALESCE(divisor, 18));
  BEGIN
    NEW.v3_buy_volume := COALESCE(OLD.v3_buy_volume + NEW.v3_buy_volume / divisor, NEW.v3_buy_volume / divisor, OLD.v3_buy_volume,0);
  EXCEPTION WHEN OTHERS THEN
    NEW.v3_buy_volume := COALESCE(OLD.v3_buy_volume, 0);
    RAISE WARNING 'Error in TDD buy volume % vol:%|% usd:%|%', NEW.token, NEW.v3_sell_volume, NEW.v3_buy_volume, NEW.v3_usd_sell_volume, NEW.v3_usd_buy_volume;
  END;
  BEGIN
    NEW.v3_sell_volume := COALESCE(OLD.v3_sell_volume + NEW.v3_sell_volume / divisor, NEW.v3_sell_volume / divisor, OLD.v3_sell_volume,0);
  EXCEPTION WHEN OTHERS THEN
    NEW.v3_sell_volume := COALESCE(OLD.v3_sell_volume, 0);
    RAISE WARNING 'Error in TDD sell volume % vol:%|% usd:%|%', NEW.token, NEW.v3_sell_volume, NEW.v3_buy_volume, NEW.v3_usd_sell_volume, NEW.v3_usd_buy_volume;
  END; 
  RETURN NEW;
END;
$$;

CREATE TRIGGER "token_day_data_trigger"
BEFORE INSERT on token_day_data
for each row
EXECUTE FUNCTION token_day_data_function();
