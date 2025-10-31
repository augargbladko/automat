CREATE TABLE bot_buys (
  id uuid PRIMARY KEY default uuid_generate_v4(),
  -- set these at the start, and don't change them
  token VARCHAR(42) NOT NULL REFERENCES tokens,
  buy_reason text NOT NULL, -- the reason we're buying
  UNIQUE (token, buy_reason),

  timestamp integer NOT NULL,
  account_key text NOT NULL, -- the reference to the key (as a secure env variable)
  account_number integer NOT NULL, -- the number of the account (relative to 0, the base account, usually start at 100)
  account_address VARCHAR(42) NOT NULL, -- the address of the account

  -- these can change as more actions are taken
  threshold text NOT NULL,
  threshold_value integer NOT NULL,
  score double precision NOT NULL,
  mcap double precision NOT NULL,
  pool_balance double precision NOT NULL,
  vol_24h double precision NOT NULL,
  holders double precision NOT NULL,
  hours_after double precision NOT NULL,
  action text NOT NULL, -- the action we're taking (buy, sell, hold)

  -- used for managing the bot
  next_hour integer NOT NULL default 0, -- the next hour we can evaluate this tx
  sell_time integer, -- when we need to sell
  is_complete boolean NOT NULL default false, -- whether we're done with this bot
  tx_fail_count integer NOT NULL default 0, -- the number of times we've failed
  fail_reason text, -- whether we're have a failure we need to investigate

  -- fund, payment, tracking
  fund_eth double precision NOT NULL default 0, -- the amount of eth we've put in
  fund_usd double precision NOT NULL default 0, -- the amount of usdc we've converted to eth
  withdraw_eth double precision NOT NULL default 0, -- the amount of eth we've taken out
  est_value double precision NOT NULL default 0, -- the amount of eth we've put in, or what it's currently worth
  buy_count integer NOT NULL default 0, -- the number of buys we've done successfully
  buy_amount double precision NOT NULL default 0, -- the amount of the token we bought
  buy_usd double precision NOT NULL default 0, -- the USD amount of the token we bought
  sell_count integer NOT NULL default 0, -- the number of sells we've done successfully
  sell_amount double precision NOT NULL default 0, -- the amount of the token we sold so far
  sell_usd double precision NOT NULL default 0, -- the USD amount of the token we sold so far
  gas_eth double precision NOT NULL default 0, -- the amount of eth we've spent on gas
  gas_usd double precision NOT NULL default 0 -- the USD amount of the gas we've spent
);


CREATE INDEX ON bot_buys (token);
CREATE INDEX ON bot_buys (buy_reason);
CREATE INDEX ON bot_buys (timestamp);
CREATE INDEX ON bot_buys (account_key);
CREATE INDEX ON bot_buys (account_number);
CREATE INDEX ON bot_buys (account_address);
CREATE INDEX ON bot_buys (threshold);
CREATE INDEX ON bot_buys (threshold_value);
CREATE INDEX ON bot_buys (score);
CREATE INDEX ON bot_buys (mcap);
CREATE INDEX ON bot_buys (pool_balance);
CREATE INDEX ON bot_buys (vol_24h);
CREATE INDEX ON bot_buys (holders);
CREATE INDEX ON bot_buys (hours_after);
CREATE INDEX ON bot_buys (action);
CREATE INDEX ON bot_buys (next_hour);
CREATE INDEX ON bot_buys (sell_time);
CREATE INDEX ON bot_buys (is_complete);
CREATE INDEX ON bot_buys (tx_fail_count);
CREATE INDEX ON bot_buys (fail_reason);
CREATE INDEX ON bot_buys (fund_eth);
CREATE INDEX ON bot_buys (withdraw_eth);
CREATE INDEX ON bot_buys (est_value);
CREATE INDEX ON bot_buys (buy_count);
CREATE INDEX ON bot_buys (buy_amount);
CREATE INDEX ON bot_buys (buy_usd);
CREATE INDEX ON bot_buys (sell_count);
CREATE INDEX ON bot_buys (sell_amount);
CREATE INDEX ON bot_buys (sell_usd);
CREATE INDEX ON bot_buys (gas_eth);
CREATE INDEX ON bot_buys (gas_usd);


-- fund with the eth for the next 2 buys, and enough to transact (0.05 is probably plenty, 0.1 would make sure).
-- actions are fund(1-5), buy(1-5), approve (during buys), hold (do no more buys) sell(1-5),  withdraw, done
-- if we get a token that hits buy3+ immediately, we should do each buy separately, in sequence.
-- progress: initialized, pending, cancelled, success, failed, finalized

CREATE TABLE bot_transactions (
  id uuid PRIMARY KEY default uuid_generate_v4(),

  -- set these at the start, and don't change them
  bot_buy UUID NOT NULL REFERENCES bot_buys,
  token text REFERENCES tokens, -- can be ethAddress for ETH on fund and withdraw
  action text NOT NULL,
  sequence integer NOT NULL,
  start_time integer NOT NULL, -- exact timestamp, not hour - used for tracking and gas increases

  -- set these at the start, then update at various times
  currency text, -- this is NOT a token, as it can include usdc, eth, weth, etc
  amount text NOT NULL default '0', -- native token amount, exact bigint (select amount::text)
  amount_value double precision NOT NULL default 0, -- amount in whole tokens, for sorting
  eth_price double precision NOT NULL default 0, -- eth price (USD) at the time
  usdc text NOT NULL default '0', -- amount in ETH, exact bigint, important for buys and sells
  usdc_value double precision NOT NULL default 0, -- amount in whole ETH, for sorting
  progress text NOT NULL default '', -- progress updates
  is_confirmed boolean NOT NULL default false,
  is_reorg boolean NOT NULL default false,
  last_updated integer NOT NULL default 0,
  retries integer NOT NULL default 0,

  -- add these once we've created the transaction (before firing it); update as needed
  gas_used text, -- gas used, exact number important for buys and sells
  gas_price text, -- gas price (ETH) at the time
  gas_total text, -- gas total, exact bigint important for buys and sells
  reprice_count integer NOT NULL default 0, -- number of gas reprices we've done
  transaction_hash text,
  nonce integer,
  error text,

  -- add at the very end
  complete_time integer
);

CREATE INDEX ON bot_transactions (bot_buy);
CREATE INDEX ON bot_transactions (token);
CREATE INDEX ON bot_transactions (action);
CREATE INDEX ON bot_transactions (sequence);
CREATE INDEX ON bot_transactions (start_time);
CREATE INDEX ON bot_transactions (currency);
CREATE INDEX ON bot_transactions (amount);
CREATE INDEX ON bot_transactions (amount_value);
CREATE INDEX ON bot_transactions (eth_price);
CREATE INDEX ON bot_transactions (usdc);
CREATE INDEX ON bot_transactions (usdc_value);
CREATE INDEX ON bot_transactions (progress);
CREATE INDEX ON bot_transactions (is_confirmed);
CREATE INDEX ON bot_transactions (is_reorg);
CREATE INDEX ON bot_transactions (last_updated);
CREATE INDEX ON bot_transactions (retries);
CREATE INDEX ON bot_transactions (gas_total);
CREATE INDEX ON bot_transactions (gas_price);
CREATE INDEX ON bot_transactions (gas_used);
CREATE INDEX ON bot_transactions (transaction_hash);
CREATE INDEX ON bot_transactions (nonce);
CREATE INDEX ON bot_transactions (error);
CREATE INDEX ON bot_transactions (complete_time);

alter table public.bot_buys enable row level security;
CREATE POLICY "bot_buys_read" ON public.bot_buys FOR SELECT USING (true);
alter table public.bot_transactions enable row level security;
CREATE POLICY "bot_transactions_read" ON public.bot_transactions FOR SELECT USING (true);

-- add this reference after we create both tables
ALTER TABLE bot_buys 
ADD COLUMN current_transaction uuid REFERENCES bot_transactions;
CREATE INDEX ON bot_buys (current_transaction);
