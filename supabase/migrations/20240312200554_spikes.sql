CREATE TABLE spikes (
  day date NOT NULL,
  token VARCHAR(42) NOT NULL REFERENCES tokens,

  score double precision,
  high_day date,
  high_score double precision,
  high_price double precision,
  market_cap_high double precision,
  market_cap_low double precision,
  volume double precision,
  price double precision,
  above_count integer,
  last_analyzed integer,
  PRIMARY KEY (day, token)
);

CREATE INDEX ON spikes (day);
CREATE INDEX ON spikes (high_day);
CREATE INDEX ON spikes (score);
CREATE INDEX ON spikes (high_score);
CREATE INDEX ON spikes (high_price);
CREATE INDEX ON spikes (token);
CREATE INDEX ON spikes (volume);
CREATE INDEX ON spikes (above_count);
CREATE INDEX ON spikes (last_analyzed);


CREATE FUNCTION spikes_function()
RETURNS trigger 
LANGUAGE plpgsql
AS $$
BEGIN
-- This has been borking out; I don't know why. And it's likely unnecessary.
  -- INSERT INTO tokens (token) VALUES (NEW.token) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "before_spikes"
BEFORE INSERT on spikes
for each row
EXECUTE FUNCTION spikes_function();
