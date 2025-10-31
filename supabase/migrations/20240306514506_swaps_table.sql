CREATE TABLE swaps (
  swap_id double precision PRIMARY KEY,
  day date NOT NULL,
  address VARCHAR(42) NOT NULL REFERENCES accounts,
  token VARCHAR(42) NOT NULL REFERENCES tokens,
  symbol TEXT NOT NULL,
  usd_earned double precision NOT NULL
);

CREATE INDEX ON swaps (address);
CREATE INDEX ON swaps (token);
CREATE INDEX ON swaps (usd_earned);
CREATE INDEX ON swaps (day);

CREATE FUNCTION combine_swaps_function()
RETURNS trigger 
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO tokens (token, symbol) 
    VALUES (NEW.token, NEW.symbol) 
    ON CONFLICT DO NOTHING;
  INSERT INTO accounts (address) VALUES (NEW.address) ON CONFLICT DO NOTHING;
  BEGIN
    IF 
      NEW.usd_earned >= 0 
    THEN
      UPDATE accounts SET usd_sell_volume = COALESCE(usd_sell_volume, 0) + New.usd_earned, swaps = COALESCE(swaps,0) + 1 WHERE address = NEW.address;
    ELSE
      UPDATE accounts SET usd_buy_volume = COALESCE(usd_buy_volume, 0) - New.usd_earned, swaps = COALESCE(swaps,0) + 1 WHERE address = NEW.address;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error in swaps % new:% old:%', NEW.token, NEW.usd_earned, OLD.usd_earned;
  END;
  NEW.usd_earned := COALESCE(OLD.usd_earned + NEW.usd_earned, NEW.usd_earned, OLD.usd_earned);
  RETURN NEW;
END;
$$;

CREATE TRIGGER "combine_swaps_trigger"
BEFORE INSERT on swaps
for each row
EXECUTE FUNCTION combine_swaps_function();

