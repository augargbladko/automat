
ALTER TABLE tokens
ADD COLUMN launch_holders double precision,
ADD COLUMN launch_score double precision,
ADD COLUMN launch_pct double precision,
ADD COLUMN launch_volume double precision,
ADD COLUMN launch_price double precision,
ADD COLUMN launch_five_score double precision,
ADD COLUMN launch_five_pct double precision,
ADD COLUMN d0_score double precision,
ADD COLUMN d0_pct double precision,
ADD COLUMN d0_volume double precision,
ADD COLUMN d0_price double precision,
ADD COLUMN launch_vol_24h double precision,
ADD COLUMN launch_pool_balance double precision,
ADD COLUMN launch_d0_mcap double precision,
ADD COLUMN launch_d1_mcap double precision,
ADD COLUMN ignore boolean;

CREATE INDEX ON tokens (launch_holders);
CREATE INDEX ON tokens (launch_score);
CREATE INDEX ON tokens (launch_pct);
CREATE INDEX ON tokens (launch_volume);
CREATE INDEX ON tokens (launch_five_score);
CREATE INDEX ON tokens (launch_five_pct);
CREATE INDEX ON tokens (d0_score);
CREATE INDEX ON tokens (d0_pct);
CREATE INDEX ON tokens (d0_volume);
CREATE INDEX ON tokens (ignore);

select
  cron.schedule(
    'invoke-analyze-launch-owners-every-minute',
    '* * * * *',
    $$ SELECT call_webhook('analyze-launch-owners', '{}'); $$
  );