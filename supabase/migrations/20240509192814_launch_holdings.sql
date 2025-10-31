CREATE TABLE launch_holdings (
  joined_key text PRIMARY KEY,
  day date NOT NULL,
  address VARCHAR(42) NOT NULL REFERENCES launch_owners,
  token VARCHAR(42) NOT NULL REFERENCES tokens,
  holding double precision,
  score double precision,
  d0_score double precision,
  d1_score double precision,
  d0_price double precision,
  d1_price double precision,
  d0_pct double precision,
  d1_pct double precision,
  d0_vol double precision,
  d1_vol double precision,

  d1_five_score double precision,
  d1_five_pct double precision,
  d0_five_score double precision,
  d0_five_pct double precision,
  as2 double precision,
  d5 double precision,
  d25 double precision,
  vol_24 double precision,
  pool_balance double precision,
  d0_mcap double precision,
  d1_mcap double precision,
  holders double precision
);

CREATE INDEX ON launch_holdings (day);
CREATE INDEX ON launch_holdings (address);
CREATE INDEX ON launch_holdings (token);
CREATE INDEX ON launch_holdings (holding);
CREATE INDEX ON launch_holdings (score);
CREATE INDEX ON launch_holdings (d1_five_score);
CREATE INDEX ON launch_holdings (d0_five_score);
CREATE INDEX ON launch_holdings (d5);
CREATE INDEX ON launch_holdings (d25);
CREATE INDEX ON launch_holdings (as2);

CREATE FUNCTION launch_holdings_function()
RETURNS trigger 
LANGUAGE plpgsql
AS $$
BEGIN
  -- Cannot have a launch holders list without a token already present
  -- INSERT INTO tokens (token) VALUES (NEW.token) ON CONFLICT DO NOTHING;
  INSERT INTO accounts (address) VALUES (NEW.address) ON CONFLICT DO NOTHING;
  INSERT INTO launch_owners (address) VALUES (NEW.address) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "before_launch_holdings"
BEFORE INSERT on launch_holdings
for each row
EXECUTE FUNCTION launch_holdings_function();

