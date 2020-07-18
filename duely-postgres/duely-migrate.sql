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
DROP FUNCTION operation_.reset_password_;
DROP FUNCTION operation_.sign_up_user_;

CALL internal_.drop_auditing_('security_.email_address_verification_');
ALTER TABLE security_.email_address_verification_ DROP COLUMN verification_code_;
ALTER TABLE security_.email_address_verification_ DROP COLUMN redirect_url_;
ALTER TABLE security_.email_address_verification_ ADD COLUMN data_ json;
CALL internal_.setup_auditing_('security_.email_address_verification_');

CREATE FUNCTION operation_.start_email_address_verification_(_email_address text, _data json DEFAULT NULL::json) RETURNS security_.email_address_verification_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _email_address_verification security_.email_address_verification_;
BEGIN
  PERFORM security_.control_operation_('start_email_address_verification_');

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

CREATE FUNCTION operation_.reset_password_(_verification_uuid uuid, _password text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _user security_.user_;
  _email_address text;
BEGIN
  PERFORM security_.control_operation_('reset_password_');

  UPDATE security_.email_address_verification_ SET
    status_ = 'verified',
    status_at_ = CURRENT_TIMESTAMP
  WHERE uuid_ = _verification_uuid
    AND status_ IS NULL
  RETURNING email_address_ INTO _email_address;

  IF _email_address IS NULL THEN
    RAISE 'No matching verification found.' USING ERRCODE = '20000';
  END IF;

  UPDATE security_.user_
  SET
    password_hash_ = pgcrypto_.crypt(_password, pgcrypto_.gen_salt('md5'))
  WHERE email_address_ = _email_address
  RETURNING * INTO _user;

  IF _user IS NULL THEN
    RAISE 'No user matching email address found: %', _email_address USING ERRCODE = '20000';
  END IF;

  RETURN (SELECT operation_.log_in_user_(_email_address, _password));
END
$$;

CREATE FUNCTION operation_.sign_up_user_(_verification_uuid uuid) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _user security_.user_;
  _email_address text;
  _data json;
  _password text;
  _name text;
BEGIN
  PERFORM security_.control_operation_('sign_up_user_');

  UPDATE security_.email_address_verification_ SET
    status_ = 'verified',
    status_at_ = CURRENT_TIMESTAMP
  WHERE uuid_ = _verification_uuid
    AND status_ IS NULL
  RETURNING email_address_, data_ INTO _email_address, _data;

  IF _email_address IS NULL OR _data IS NULL THEN
    RAISE 'No matching verification found.' USING ERRCODE = '20000';
  END IF;

  SELECT _data->>'password', _data->>'name' INTO _password, _name;

  IF _password IS NULL OR _name IS NULL THEN
    RAISE 'Invalid data.' USING ERRCODE = '20000';
  END IF;

  WITH _subject AS (
    INSERT INTO security_.subject_ (name_, type_)
    VALUES (_name, 'user')
    RETURNING uuid_
  )
  INSERT INTO security_.user_ (uuid_, email_address_, password_hash_)
  SELECT s.uuid_, _email_address, pgcrypto_.crypt(_password, pgcrypto_.gen_salt('md5'))
  FROM _subject s
  RETURNING * INTO _user;

  RETURN (SELECT operation_.log_in_user_(_email_address, _password));
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
