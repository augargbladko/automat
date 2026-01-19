CREATE TABLE fix_email (
  telegram_id integer PRIMARY KEY,
  email text,
  confirmed_email boolean,
  new_email text,
  new_telegram_id integer,
  new_first_name text,
  status_text text DEFAULT 'none'
);

CREATE INDEX ON fix_email (status_text);
CREATE INDEX ON fix_email (new_telegram_id);
