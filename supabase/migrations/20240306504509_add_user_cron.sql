ALTER TABLE user_data
ADD COLUMN next_action_time integer;

alter role service_role set statement_timeout = '10min';
alter database postgres set statement_timeout TO '10min';
NOTIFY pgrst, 'reload config';


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
