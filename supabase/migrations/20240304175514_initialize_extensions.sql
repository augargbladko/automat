-- create required extensions: cron jobs, case-insensitive text, and async http

CREATE SCHEMA IF NOT EXISTS extensions;
create extension if not exists pg_cron  SCHEMA extensions;
create extension if not exists citext  SCHEMA extensions;
create extension if not exists http  SCHEMA extensions; -- sync http calls
create extension if not exists pg_net  SCHEMA extensions; -- async http calls
