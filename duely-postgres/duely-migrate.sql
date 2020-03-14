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

CALL internal_.drop_auditing_('security_.email_address_verification_');
ALTER TABLE security_.email_address_verification_ ADD COLUMN status_ text;
ALTER TABLE security_.email_address_verification_ ADD COLUMN status_at_ timestamp with time zone;
CALL internal_.setup_auditing_('security_.email_address_verification_');

CREATE OR REPLACE FUNCTION operation_.sign_up_user_(_email_address text, _verification_code text, _name text, _password text) RETURNS security_.user_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _verification_uuid uuid;
  _user security_.user_;
BEGIN
  PERFORM security_.control_operation_('sign_up_user_');

  UPDATE security_.email_address_verification_ SET
    status_ = 'verified',
    status_at_ = CURRENT_TIMESTAMP
  WHERE email_address_ = lower(_email_address)
    AND verification_code_ = _verification_code
    AND status_ IS NULL
  RETURNING uuid_ INTO _verification_uuid;

  IF _verification_uuid IS NULL THEN
    RAISE 'No matching email address verification code found: %', lower(_email_address) USING ERRCODE = '20000';
  END IF;

  WITH _subject AS (
    INSERT INTO security_.subject_ (name_, type_)
    VALUES (_name, 'user')
    RETURNING uuid_
  )
  INSERT INTO security_.user_ (uuid_, email_address_, password_hash_)
  SELECT s.uuid_, lower(_email_address), pgcrypto_.crypt(_password, pgcrypto_.gen_salt('md5'))
  FROM _subject s
  RETURNING * INTO _user;

  RETURN _user;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
