
select
  cron.schedule(
    'invoke-bot-buy-every-minute',
    '* * * * *',
    $$ SELECT call_webhook('bot-buy', '{}'); $$
  );