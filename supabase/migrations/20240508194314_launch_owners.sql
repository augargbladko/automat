CREATE TABLE launch_owners (
  address VARCHAR(42) PRIMARY KEY REFERENCES accounts,
  launches integer,
  losses integer,
  wins integer,
  win_loss double precision,
  win_pct double precision,
  profit double precision,
  profit_pct double precision,
  total_holdings double precision,
  score double precision,
  win_holdings double precision,
  loss_holdings double precision,
  tracking text,
  last_updated integer,
  d0_holdings double precision,
  d0_score double precision,
  d0_profit double precision,
  d0_win_loss double precision,
  d0_profit_pct double precision,
  d0_wins integer,
  d0_losses integer,
  d0_win_holdings double precision,
  d0_loss_holdings double precision,
  d0_win_pct double precision,
  min_holding double precision,
  avg_holding double precision,

  avg_total_holdings double precision,
  avg_score double precision,
  avg_profit double precision,
  avg_win_loss double precision,
  avg_profit_pct double precision,
  avg_wins integer,
  avg_losses integer,
  avg_win_holdings double precision,
  avg_loss_holdings double precision,
  avg_win_pct double precision,

  min_total_holdings double precision,
  min_score double precision,
  min_profit double precision,
  min_win_loss double precision,
  min_profit_pct double precision,
  min_wins integer,
  min_losses integer,
  min_win_holdings double precision,
  min_loss_holdings double precision,
  min_win_pct double precision,

  d25_score double precision,

  last_day date
);

CREATE INDEX ON launch_owners (launches);
CREATE INDEX ON launch_owners (wins);
CREATE INDEX ON launch_owners (losses);
CREATE INDEX ON launch_owners (win_loss);
CREATE INDEX ON launch_owners (win_pct);
CREATE INDEX ON launch_owners (profit);
CREATE INDEX ON launch_owners (profit_pct);
CREATE INDEX ON launch_owners (total_holdings);
CREATE INDEX ON launch_owners (score);
CREATE INDEX ON launch_owners (tracking);
CREATE INDEX ON launch_owners (last_updated);
CREATE INDEX ON launch_owners (min_holding);
CREATE INDEX ON launch_owners (avg_holding);

CREATE INDEX ON launch_owners (d0_win_loss);
CREATE INDEX ON launch_owners (avg_win_loss);
CREATE INDEX ON launch_owners (min_win_loss);
CREATE INDEX ON launch_owners (d0_win_pct);
CREATE INDEX ON launch_owners (avg_win_pct);
CREATE INDEX ON launch_owners (min_win_pct);
CREATE INDEX ON launch_owners (d0_profit_pct);
CREATE INDEX ON launch_owners (avg_profit_pct);
CREATE INDEX ON launch_owners (min_profit_pct);
CREATE INDEX ON launch_owners (d0_score);
CREATE INDEX ON launch_owners (avg_score);
CREATE INDEX ON launch_owners (min_score);
CREATE INDEX ON launch_owners (d25_score);
CREATE INDEX ON launch_owners (last_day);