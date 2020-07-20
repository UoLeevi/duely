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

DROP FUNCTION operation_.start_email_address_verification_;

CREATE FUNCTION operation_.start_email_address_verification_(_email_address text, _is_existing_user boolean, _data json DEFAULT NULL::json) RETURNS security_.email_address_verification_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _email_address_verification security_.email_address_verification_;
BEGIN
  PERFORM security_.control_operation_('start_email_address_verification_');

  IF _is_existing_user THEN
    IF NOT EXISTS (
      SELECT 1
      FROM security_.user_
      WHERE email_address_ = lower(_email_address)
    ) THEN
      RAISE 'User does not exist.' USING ERRCODE = '20000';
    END IF;
  ELSE
    IF EXISTS (
      SELECT 1
      FROM security_.user_
      WHERE email_address_ = lower(_email_address)
    ) THEN
      RAISE 'User already exists.' USING ERRCODE = '20000';
    END IF;
  END IF;

  INSERT INTO security_.email_address_verification_ (email_address_, data_)
  VALUES (lower(_email_address), _data)
  ON CONFLICT (email_address_) WHERE (status_ IS NULL) DO UPDATE
  SET
    data_ = _data,
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
