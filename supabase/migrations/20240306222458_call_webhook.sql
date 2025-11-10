-- Allow us to call any webhook function with payload in a cron job

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
	timeout_ms integer DEFAULT 10000;
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