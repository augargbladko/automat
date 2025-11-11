CREATE TABLE telegram_users (
  telegram_id VARCHAR(42) PRIMARY KEY,
  premium boolean,
  first_name text,
  last_name text,
  username text,
  phone text,
  lang_code text,
  photo_url text, -- photo url needs to be parsed, from users[] => users.photo.
  date_joined integer, -- from participants[] => participant.date

  -- below here, we're creating this data.
  wallet_id integer,
  wallet_address text,
  email text,
  confirmed_email boolean,
  tokens double precision, -- we'll calculate points, level, spend, etc off this value
  ton_spend double precision,

  -- tracking data
  -- what are we using this user for
  -- have we created it
  -- what are its current stats
  tool_flags integer, -- 1/2/4/8 for the 4 tools, small to large
  treasure_flags integer -- 1/2/4/8 for the 4 treasures, small to large
);

CREATE INDEX ON telegram_users (date_joined);
CREATE INDEX ON telegram_users (wallet_id);
CREATE INDEX ON telegram_users (wallet_address);
CREATE INDEX ON telegram_users (email);
CREATE INDEX ON telegram_users (confirmed_email);
CREATE INDEX ON telegram_users (tokens);
CREATE INDEX ON telegram_users (ton_spend);
CREATE INDEX ON telegram_users (tokens);
CREATE INDEX ON telegram_users (tokens);

-- alter table public.telegram_users enable row level security;
-- CREATE POLICY "telegram_users_read" ON public.telegram_users FOR SELECT USING (true);


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