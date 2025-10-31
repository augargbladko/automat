ALTER TABLE tokens
ADD COLUMN launch_analyzed integer,
ADD COLUMN owner_score double precision,
ADD COLUMN owner_win_loss double precision,
ADD COLUMN owner_win_pct double precision,
ADD COLUMN owner_profit_pct double precision,
ADD COLUMN owner_count integer,
ADD COLUMN owner_win_count integer,
ADD COLUMN owner_count_pct double precision,
ADD COLUMN owner_correlation double precision,
ADD COLUMN as_2_score double precision,
ADD COLUMN d5_2_score double precision,
ADD COLUMN d5_3_score double precision,
ADD COLUMN d5_4_score double precision,
ADD COLUMN ft_last_analyzed integer,
ADD COLUMN launch_market text;

CREATE INDEX ON tokens (launch_analyzed);
CREATE INDEX ON tokens (owner_score);
CREATE INDEX ON tokens (owner_win_loss);
CREATE INDEX ON tokens (owner_win_pct);
CREATE INDEX ON tokens (owner_profit_pct);
CREATE INDEX ON tokens (owner_count);
CREATE INDEX ON tokens (owner_win_count);
CREATE INDEX ON tokens (owner_count_pct);
CREATE INDEX ON tokens (owner_correlation);
CREATE INDEX ON tokens (as_2_score);
CREATE INDEX ON tokens (d5_2_score);
CREATE INDEX ON tokens (d5_3_score);
CREATE INDEX ON tokens (d5_4_score);
CREATE INDEX ON tokens (launch_market);
CREATE INDEX ON tokens (ft_last_analyzed);

select
  cron.schedule(
    'invoke-analyze-token-launches-every-minute',
    '* * * * *',
    $$ SELECT call_webhook('analyze-token-launches', '{}'); $$
  );