CREATE TABLE leaking_alpha (
  token VARCHAR(42) NOT NULL REFERENCES tokens,
  buy_type text NOT NULL,
  symbol text NOT NULL,
  buy_timestamp integer NOT NULL,
  buy_amount double precision,
  buy_price double precision,
  buy_usd double precision,
  buy_eth double precision,
  buy_tweeted boolean NOT NULL default false,

  sell_timestamp integer,
  sell_amount double precision,
  sell_price double precision,
  sell_eth double precision,
  sell_usd double precision,
  sell_tweeted boolean NOT NULL default false,

  profit_eth double precision,
  profit_usd double precision,
  profit_eth_pct double precision,
  profit_usd_pct double precision,
  PRIMARY KEY (token, buy_type)
);

alter table public.leaking_alpha enable row level security;
CREATE POLICY "leaking_alpha_read" ON public.leaking_alpha FOR SELECT USING (true);

CREATE INDEX ON leaking_alpha (token);
CREATE INDEX ON leaking_alpha (buy_timestamp);
CREATE INDEX ON leaking_alpha (buy_usd);
CREATE INDEX ON leaking_alpha (buy_eth);
CREATE INDEX ON leaking_alpha (sell_timestamp);
CREATE INDEX ON leaking_alpha (sell_usd);
CREATE INDEX ON leaking_alpha (sell_eth);
CREATE INDEX ON leaking_alpha (profit_eth);
CREATE INDEX ON leaking_alpha (profit_usd);
CREATE INDEX ON leaking_alpha (profit_eth_pct);
CREATE INDEX ON leaking_alpha (profit_usd_pct);
CREATE INDEX ON leaking_alpha (buy_tweeted);
CREATE INDEX ON leaking_alpha (sell_tweeted);
CREATE INDEX ON leaking_alpha (buy_type);
