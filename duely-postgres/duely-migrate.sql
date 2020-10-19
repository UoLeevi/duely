-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'MIGRATION STARTED'
\set QUIET true

DO 
LANGUAGE plpgsql
$_MIGRATION_$
DECLARE

BEGIN
-- MIGRATION CODE START

CREATE OR REPLACE FUNCTION security_.register_policy_(_table regclass, _operation_type public.operation_type_, _policy_function regproc, _after_policy_function regproc DEFAULT NULL::regproc) RETURNS security_.policy_
    LANGUAGE plpgsql
    AS $$
DECLARE
  _resource_definition_uuid uuid;
  _policy security_.policy_;
  _function regprocedure;
  _after_uuid uuid;
  _before_uuid uuid;
BEGIN
  SELECT CASE _operation_type
    WHEN 'query' THEN (_policy_function || '(security_.resource_definition_, application_.resource_, text[])')::regprocedure
    WHEN 'create' THEN (_policy_function || '(security_.resource_definition_, jsonb, text[])')::regprocedure
    WHEN 'update' THEN (_policy_function || '(security_.resource_definition_, application_.resource_, jsonb, text[])')::regprocedure
    WHEN 'delete' THEN (_policy_function || '(security_.resource_definition_, application_.resource_)')::regprocedure
  END INTO _function;

  SELECT uuid_ INTO _resource_definition_uuid
  FROM security_.resource_definition_
  WHERE table_ = _table;

  IF _after_policy_function IS NOT NULL THEN
    SELECT uuid_ INTO _after_uuid
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition_uuid
      AND CASE _operation_type
      WHEN 'query' THEN (_policy_function || '(security_.resource_definition_, application_.resource_, text[])')::regprocedure
      WHEN 'create' THEN (_policy_function || '(security_.resource_definition_, jsonb, text[])')::regprocedure
      WHEN 'update' THEN (_policy_function || '(security_.resource_definition_, application_.resource_, jsonb, text[])')::regprocedure
      WHEN 'delete' THEN (_policy_function || '(security_.resource_definition_, application_.resource_)')::regprocedure
    END = function_;

    IF _after_uuid IS NULL THEN
      RAISE 'Previous policy was not found.' USING ERRCODE = '20000';
    END IF;
  END IF;

  SELECT uuid_ INTO _before_uuid
  FROM security_.policy_
  WHERE after_uuid_ IS NOT DISTINCT FROM _after_uuid
    AND resource_definition_uuid_ = _resource_definition_uuid
    AND operation_type_ = _operation_type;

  INSERT INTO security_.policy_ (function_, after_uuid_, resource_definition_uuid_, operation_type_)
  VALUES (_function, _after_uuid, _resource_definition_uuid, _operation_type)
  RETURNING * INTO _policy;

  IF _before_uuid IS NOT NULL THEN
    UPDATE security_.policy_
    SET after_uuid_ = _policy.uuid_
    WHERE uuid_ = _before_uuid;
  END IF;

  RETURN _policy;
END
$$;

CREATE FUNCTION policy_.anyone_with_verification_code_can_verify_password_reset_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF _resource.search_->>'verification_code_' = _data->>'verification_code_' THEN
    RETURN array_cat(_keys, '{password_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.password_reset_', 'update', 'policy_.anyone_with_verification_code_can_verify_password_reset_');

CALL internal_.drop_auditing_('security_.password_reset_');
ALTER TABLE security_.password_reset_ DROP COLUMN password_hash_;
CALL internal_.setup_auditing_('security_.password_reset_');

CREATE UNIQUE INDEX password_reset__user_uuid__idx ON security_.password_reset_ USING btree (user_uuid_) WHERE status_ = 'started';

CREATE OR REPLACE FUNCTION internal_.try_verify_password_reset_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _uuid uuid;
  _password_reset security_.password_reset_;
  _user_uuid uuid;
BEGIN
  IF NOT NEW.verified_ THEN
    RETURN NULL;
  END IF;

  UPDATE security_.password_reset_
  SET 
    status_ = 'verified'
  WHERE uuid_ = NEW.uuid_
    AND status_ = 'started'
  RETURNING * INTO _password_reset;

  UPDATE security_.user_
  SET
    password_hash_ = pgcrypto_.crypt(NEW.password_, pgcrypto_.gen_salt('md5'))
  WHERE uuid_ = _password_reset.user_uuid_
  RETURNING uuid_ INTO _user_uuid;

  IF _user_uuid IS NULL THEN
    RETURN NULL;
  ELSE
    RETURN NEW;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION internal_.try_start_password_reset_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE security_.password_reset_ p
  SET
    status_ = 'cancelled'
  FROM security_.user_ u
  WHERE u.uuid_ = p.user_uuid_
    AND u.email_address_ = NEW.email_address_
    AND p.status_ = 'started';

  INSERT INTO security_.password_reset_(uuid_, user_uuid_, data_)
  SELECT NEW.uuid_, u.uuid_, COALESCE(NEW.data_, '{}'::jsonb)
  FROM security_.user_ u
  WHERE u.email_address_ = NEW.email_address_;

  RETURN NEW;
END
$$;

CREATE OR REPLACE FUNCTION policy_.anyone_can_create_password_reset_(_resource_definition security_.resource_definition_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN array_cat(_keys, '{email_address_, data_}');
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
