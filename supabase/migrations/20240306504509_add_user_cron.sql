ALTER TABLE user_data
ADD COLUMN next_action_time integer;

CREATE INDEX ON user_data (next_action_time);


select
  cron.schedule(
    'invoke-add-users-every-10-minutes',
    '*/10 * * * *', -- every 10 minutes
    $$ SELECT call_webhook('dig-add-users', '{}'); $$
  );

select
  cron.schedule(
    'invoke-play-slots-every-minute',
    '* * * * *', -- every minute
    $$ SELECT call_webhook('dig-play-slots', '{}'); $$
  );

select
  cron.schedule(
    'invoke-spoof-ga-every-minute',
    '* * * * *', -- every minute
    $$ SELECT call_webhook('dig-spoof-ga', '{}'); $$
  );

select
  cron.schedule(
    'invoke-upgrade-users-every-minute',
    '* * * * *', -- every minute
    $$ SELECT call_webhook('dig-upgrade-users', '{}'); $$
  );
