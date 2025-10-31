-- we can have 40 total per-minute function invocations without spending more $
-- there are ~45k minutes per month, and our free limit is 2M invocations/month

select
  cron.schedule(
    'invoke-analyze-token-data-every-minute',
    '* * * * *',
    $$ SELECT call_webhook('analyze-token-data', '{}'); $$
  );

select
  cron.schedule(
    'invoke-analyze-accounts-every-minute',
    '* * * * *',
    $$ BEGIN;
      SELECT call_webhook('analyze-accounts', '{"delay_seconds":"0"}');
    END; $$
  );

select
  cron.schedule(
    'invoke-analyze-spikes-every-minute',
    '* * * * *',
    $$ BEGIN;
      SELECT call_webhook('analyze-spikes', '{"delay_seconds":"0"}');
      SELECT call_webhook('analyze-spikes', '{"delay_seconds":"10"}');
      SELECT call_webhook('analyze-spikes', '{"delay_seconds":"20"}');
      SELECT call_webhook('analyze-spikes', '{"delay_seconds":"30"}');
    END; $$
  );

select
  cron.schedule(
    'invoke-analyze-recent-spikes-every-minute',
    '* * * * *',
    $$ SELECT call_webhook('analyze-recent-spikes', '{}'); $$
  );

select
  cron.schedule(
    'invoke-token-ingest-on-startup',
    '* * * * *', -- every minute, but only once!
    $$ BEGIN;
      SELECT call_webhook('ingest-token-data', '{"group":"0"}'); 
      SELECT call_webhook('ingest-token-data', '{"group":"1"}'); 
      -- SELECT call_webhook('ingest-token-data', '{"group":"2"}'); 
      -- SELECT call_webhook('ingest-token-data', '{"group":"3"}');
      -- SELECT call_webhook('ingest-token-data', '{"group":"4"}');
      -- SELECT call_webhook('ingest-token-data', '{"group":"5"}'); 
      SELECT cron.alter_job(
        job_id := (select jobid from cron.job where jobname = 'invoke-token-ingest-on-startup'),
        -- adjust to 1/week on Sunday
        schedule := '* * * * 0'
      );
      END;
    $$
  );