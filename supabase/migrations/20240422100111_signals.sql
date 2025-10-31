CREATE TABLE signals (
  day date NOT NULL,
  token VARCHAR(42) NOT NULL REFERENCES tokens,
  address VARCHAR(42) NOT NULL REFERENCES accounts,

  timestamp double precision,
  score date,
  usd double precision,
  amount double precision,
  exchange double precision,
  PRIMARY KEY (day, token, address)
);

CREATE INDEX ON signals (day);
CREATE INDEX ON signals (token);
CREATE INDEX ON signals (address);
CREATE INDEX ON signals (score);
CREATE INDEX ON signals (usd);
CREATE INDEX ON signals (amount);


CREATE FUNCTION signals_function()
RETURNS trigger 
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO tokens (token) VALUES (NEW.token) ON CONFLICT DO NOTHING;
  INSERT INTO accounts (address) VALUES (NEW.address) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "before_signals"
BEFORE INSERT on signals
for each row
EXECUTE FUNCTION signals_function();
