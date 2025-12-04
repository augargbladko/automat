CREATE TABLE user_data (
  telegram_id integer PRIMARY KEY,
  is_premium boolean,
  first_name text,
  username text,

  wallet_id integer,
  wallet_address text,
  email text DEFAULT '',
  confirmed_email boolean,

  user_level integer,
  treasure integer,
  spend double precision,
  spend_total double precision,
  time_zone text,
  referred_by_id integer DEFAULT 0,

  user_status text DEFAULT 'none', -- none, created, funded, collected, converted, withdrawn, nsf, error,
  user_error text DEFAULT ''
);

										

CREATE INDEX ON user_data (wallet_id);
CREATE INDEX ON user_data (wallet_address);
CREATE INDEX ON user_data (email);
CREATE INDEX ON user_data (confirmed_email);
CREATE INDEX ON user_data (user_level);
CREATE INDEX ON user_data (treasure);
CREATE INDEX ON user_data (spend);
CREATE INDEX ON user_data (spend_total);
CREATE INDEX ON user_data (time_zone);
CREATE INDEX ON user_data (referred_by_id);
CREATE INDEX ON user_data (user_status);
CREATE INDEX ON user_data (user_error);

alter table public.user_data enable row level security;
CREATE POLICY "user_data_read" ON public.user_data FOR SELECT USING (true);


/* ------ INSERT TRIGGER FUNCTIONALITY ---------
-- Use triggers to update other tables when data changes

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
*/


/* ------ CRON FUNCTIONALITY ---------
-- we can have 40 total per-minute function invocations without spending more $
-- there are ~45k minutes per month, and our free limit is 2M invocations/month

select
  cron.schedule(
    'invoke-analyze-launch-owners-every-minute',
    '* * * * *', -- every minute
    $$ SELECT call_webhook('analyze-launch-owners', '{}'); $$
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
*/