ALTER TABLE user_data
ADD COLUMN photo_url text;

CREATE INDEX ON user_data (next_action_time);

alter role service_role set statement_timeout = '10min';
alter database postgres set statement_timeout TO '10min';
NOTIFY pgrst, 'reload config';

