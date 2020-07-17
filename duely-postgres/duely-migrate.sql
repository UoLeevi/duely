-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'Running migration...'
\set QUIET true

DO 
LANGUAGE plpgsql
$_$
DECLARE

BEGIN
-- MIGRATION CODE START

CREATE OR REPLACE FUNCTION operation_.start_email_address_verification_(_email_address text, _redirect_url text DEFAULT NULL::text) RETURNS security_.email_address_verification_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _email_address_verification security_.email_address_verification_;
  _verification_code text :=
    CASE
        WHEN _redirect_url IS NULL THEN lpad(floor(random() * 1000000)::text, 6, '0')
        ELSE pgcrypto_.gen_random_uuid()::text
    END;
BEGIN
  PERFORM security_.control_operation_('start_email_address_verification_');

  INSERT INTO security_.email_address_verification_ (email_address_, redirect_url_, verification_code_)
  VALUES (lower(_email_address), _redirect_url, _verification_code)
  ON CONFLICT (email_address_) WHERE (status_ IS NULL) DO UPDATE
  SET
    redirect_url_ = _redirect_url,
    verification_code_ = _verification_code,
    started_at_ = DEFAULT
  WHERE security_.email_address_verification_.email_address_ = lower(_email_address)
  AND security_.email_address_verification_.status_ IS NULL
  RETURNING * INTO _email_address_verification;

  RETURN _email_address_verification;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
