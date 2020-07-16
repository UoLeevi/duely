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

ALTER TABLE security_.email_address_verification_
DROP CONSTRAINT email_address_verification__email_address__key;

CREATE UNIQUE INDEX ON security_.email_address_verification_ (email_address_) WHERE (status_ is NULL);

CREATE OR REPLACE FUNCTION operation_.start_email_address_verification_(_email_address text) RETURNS security_.email_address_verification_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _email_address_verification security_.email_address_verification_;
  _verification_code text := pgcrypto_.gen_random_uuid();
BEGIN
  PERFORM security_.control_operation_('start_email_address_verification_');

  INSERT INTO security_.email_address_verification_ (email_address_, verification_code_)
  VALUES (lower(_email_address), _verification_code)
  ON CONFLICT (email_address_) WHERE (status_ IS NULL) DO UPDATE
  SET
    verification_code_ = _verification_code,
    started_at_ = DEFAULT
  WHERE security_.email_address_verification_.email_address_ = lower(_email_address)
  AND security_.email_address_verification_.status_ IS NULL
  RETURNING * INTO _email_address_verification;

  RETURN _email_address_verification;
END
$$;

CREATE FUNCTION operation_.reset_password_(_email_address text, _verification_code text, _password text) RETURNS security_.user_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _verification_uuid uuid;
  _user security_.user_;
BEGIN
  PERFORM security_.control_operation_('reset_password_');

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

  UPDATE security_.user_
  SET
    password_hash_ = pgcrypto_.crypt(_password, pgcrypto_.gen_salt('md5'))
  WHERE email_address_ = lower(_email_address)
  RETURNING * INTO _user;

  IF _user IS NULL THEN
    RAISE 'No user matching email address found: %', lower(_email_address) USING ERRCODE = '20000';
  END IF;

  RETURN _user;
END
$$;

INSERT INTO security_.operation_ (name_, log_events_) VALUES ('reset_password_', 't');
PERFORM security_.implement_policy_allow_('reset_password_', 'visitor_');
PERFORM security_.implement_policy_allow_('reset_password_', 'logged_in_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
