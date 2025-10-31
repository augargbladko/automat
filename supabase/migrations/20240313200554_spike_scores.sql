CREATE TABLE spike_scores (
  token VARCHAR(42) NOT NULL REFERENCES tokens,
  address VARCHAR(42) REFERENCES accounts,
  day date NOT NULL,

  score double precision,
  holding_usd double precision,
  profit_usd double precision,
  bought_pct double precision,
  sold_pct double precision,

  market_cap double precision,
  mcap_basis_pts double precision,

  buys_30d integer,
  sells_30d integer,
  buys_total integer,
  sells_total integer,
  -- last_in: date;
  -- first_in: date;
  PRIMARY KEY (day, token, address)
);

CREATE INDEX ON spike_scores (day);
CREATE INDEX ON spike_scores (token);
CREATE INDEX ON spike_scores (address);
CREATE INDEX ON spike_scores (score);
CREATE INDEX ON spike_scores (profit_usd);
CREATE INDEX ON spike_scores (holding_usd);

CREATE FUNCTION spike_scores_function()
RETURNS trigger 
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO tokens (token) VALUES (NEW.token) ON CONFLICT DO NOTHING;
  INSERT INTO accounts (address) VALUES (NEW.address) ON CONFLICT DO NOTHING;
  UPDATE accounts
    SET (spike_count, spike_profit) = (COALESCE(spike_count, 0) + 1, COALESCE(spike_profit, 0) + NEW.profit_usd)
    WHERE address = NEW.address;
  UPDATE tokens
    SET (spikers, spiker_profit) = (COALESCE(spikers, 0) + 1, COALESCE(spiker_profit, 0) + NEW.profit_usd)
    WHERE token = NEW.token;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "before_spike_scores"
BEFORE INSERT on spike_scores
for each row
EXECUTE FUNCTION spike_scores_function();

