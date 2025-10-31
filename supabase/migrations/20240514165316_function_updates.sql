
CREATE OR REPLACE FUNCTION launch_holdings_function()
RETURNS trigger 
LANGUAGE plpgsql
set search_path = ''
AS $$
BEGIN
  -- Cannot have a launch holders list without a token already present
  INSERT INTO public.tokens (token) VALUES (NEW.token) ON CONFLICT DO NOTHING;
  INSERT INTO public.accounts (address) VALUES (NEW.address) ON CONFLICT DO NOTHING;
  INSERT INTO public.launch_owners (address) VALUES (NEW.address) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION signals_function()
RETURNS trigger 
LANGUAGE plpgsql
set search_path = ''
AS $$
BEGIN
  INSERT INTO public.tokens (token) VALUES (NEW.token) ON CONFLICT DO NOTHING;
  INSERT INTO public.accounts (address) VALUES (NEW.address) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION spike_scores_function()
RETURNS trigger 
LANGUAGE plpgsql
set search_path = ''
AS $$
BEGIN
  INSERT INTO public.tokens (token) VALUES (NEW.token) ON CONFLICT DO NOTHING;
  INSERT INTO public.accounts (address) VALUES (NEW.address) ON CONFLICT DO NOTHING;
  UPDATE public.accounts
    SET (spike_count, spike_profit) = (COALESCE(spike_count, 0) + 1, COALESCE(spike_profit, 0) + NEW.profit_usd)
    WHERE address = NEW.address;
  UPDATE public.tokens
    SET (spikers, spiker_profit) = (COALESCE(spikers, 0) + 1, COALESCE(spiker_profit, 0) + NEW.profit_usd)
    WHERE token = NEW.token;
  RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION spikes_function()
RETURNS trigger 
LANGUAGE plpgsql
set search_path = ''
AS $$
BEGIN
-- This has been borking out; I don't know why. And it's likely unnecessary.
  -- INSERT INTO public.tokens (token) VALUES (NEW.token) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION token_day_data_function()
RETURNS trigger 
LANGUAGE plpgsql
set search_path = ''
AS $$
DECLARE 
  divisor real;
BEGIN
  INSERT INTO public.tokens (token) VALUES (NEW.token) ON CONFLICT DO NOTHING;
  NEW.v3_usd_sell_volume := COALESCE(OLD.v3_usd_sell_volume + NEW.v3_usd_sell_volume, NEW.v3_usd_sell_volume, OLD.v3_usd_sell_volume,0);
  NEW.v3_usd_buy_volume := COALESCE(OLD.v3_usd_buy_volume + NEW.v3_usd_buy_volume, NEW.v3_usd_buy_volume, OLD.v3_usd_buy_volume,0);
  SELECT decimals INTO divisor FROM public.tokens WHERE token = NEW.token;
  divisor := POWER(10, COALESCE(divisor, 18));
  BEGIN
    NEW.v3_buy_volume := COALESCE(OLD.v3_buy_volume + NEW.v3_buy_volume / divisor, NEW.v3_buy_volume / divisor, OLD.v3_buy_volume,0);
  EXCEPTION WHEN OTHERS THEN
    NEW.v3_buy_volume := COALESCE(OLD.v3_buy_volume, 0);
    RAISE WARNING 'Error in TDD buy volume % vol:%|% usd:%|%', NEW.token, NEW.v3_sell_volume, NEW.v3_buy_volume, NEW.v3_usd_sell_volume, NEW.v3_usd_buy_volume;
  END;
  BEGIN
    NEW.v3_sell_volume := COALESCE(OLD.v3_sell_volume + NEW.v3_sell_volume / divisor, NEW.v3_sell_volume / divisor, OLD.v3_sell_volume,0);
  EXCEPTION WHEN OTHERS THEN
    NEW.v3_sell_volume := COALESCE(OLD.v3_sell_volume, 0);
    RAISE WARNING 'Error in TDD sell volume % vol:%|% usd:%|%', NEW.token, NEW.v3_sell_volume, NEW.v3_buy_volume, NEW.v3_usd_sell_volume, NEW.v3_usd_buy_volume;
  END; 
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION combine_swaps_function()
RETURNS trigger 
LANGUAGE plpgsql
set search_path = ''
AS $$
BEGIN
  INSERT INTO public.tokens (token, symbol) 
    VALUES (NEW.token, NEW.symbol) 
    ON CONFLICT DO NOTHING;
  INSERT INTO public.accounts (address) VALUES (NEW.address) ON CONFLICT DO NOTHING;
  BEGIN
    IF 
      NEW.usd_earned >= 0 
    THEN
      UPDATE public.accounts SET usd_sell_volume = COALESCE(usd_sell_volume, 0) + New.usd_earned, swaps = COALESCE(swaps,0) + 1 WHERE address = NEW.address;
    ELSE
      UPDATE public.accounts SET usd_buy_volume = COALESCE(usd_buy_volume, 0) - New.usd_earned, swaps = COALESCE(swaps,0) + 1 WHERE address = NEW.address;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error in swaps % new:% old:%', NEW.token, NEW.usd_earned, OLD.usd_earned;
  END;
  NEW.usd_earned := COALESCE(OLD.usd_earned + NEW.usd_earned, NEW.usd_earned, OLD.usd_earned);
  RETURN NEW;
END;
$$;
CREATE OR REPLACE FUNCTION call_webhook(function_name text, payload text)
  RETURNS VOID
	LANGUAGE plpgsql
  set search_path = ''
	AS $$
DECLARE
	url text;
	project_id text;
	project_env text DEFAULT 'LOCAL';
  service_role_token text;
	headers jsonb;
  jsonPayload jsonb;
	request_id bigint;
	timeout_ms integer DEFAULT 1000;
BEGIN
	--
	--
	IF function_name IS NULL THEN
		RAISE EXCEPTION 'function_name cannot be null';
	END IF;
	--
	-- GET AUTH TOKEN
	SELECT
		decrypted_secret
	FROM
		vault.decrypted_secrets
	WHERE
		name = 'service_role_token'
	LIMIT 1 INTO service_role_token;
	--
	-- GET URL ENDPOINT
	SELECT
		decrypted_secret
	FROM
		vault.decrypted_secrets
	WHERE
		name = 'project_id'
	LIMIT 1 INTO project_id;
	--
	-- GET ENV
	SELECT
		decrypted_secret
	FROM
		vault.decrypted_secrets
	WHERE
		name = 'project_env'
	LIMIT 1 INTO project_env;
  --
  --
  IF service_role_token IS NULL THEN
    RAISE EXCEPTION 'service_role_token cannot be null';
  END IF;
	--
	--
	IF project_id IS NULL THEN
		url := 'http://172.17.0.1:54321';
	ELSE
		url := 'https://' || project_id || '.supabase.co';
	END IF;
	--
	--
	IF project_env IS NULL THEN
		project_env := 'LOCAL';
	END IF;
	--
	--
	headers := jsonb_build_object('Content-type', 'application/json', 'Authorization', 'Bearer ' || service_role_token);
	--
	--
  jsonPayload := payload::jsonb;
  --
  --
	SELECT
		http_post INTO request_id
	FROM
		net.http_post(url || '/functions/v1/' || function_name, jsonPayload, '{}'::jsonb, headers, timeout_ms);
END
$$;

DROP FUNCTION IF EXISTS webhooks_func() CASCADE;