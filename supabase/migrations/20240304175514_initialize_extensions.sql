-- create required extensions: cron jobs, case-insensitive text, and async http

CREATE SCHEMA IF NOT EXISTS extensions;
create extension if not exists pg_cron  SCHEMA extensions; -- cron jobs
create extension if not exists citext  SCHEMA extensions; -- case insensitive text
create extension if not exists http  SCHEMA extensions; -- sync http calls
create extension if not exists pg_net  SCHEMA extensions; -- async http calls

alter role service_role set statement_timeout = '20s'; -- ensure we have enough time to run functions

