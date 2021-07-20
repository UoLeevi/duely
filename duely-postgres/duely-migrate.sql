-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'MIGRATION STARTED'
\set QUIET true

DO 
LANGUAGE plpgsql
$_MIGRATION_$
DECLARE
  _form_uuid uuid;
  _config_form_uuid uuid;
BEGIN
-- MIGRATION CODE START

CREATE FUNCTION internal_.check_current_user_is_test_user_() RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.security_data_ s
    JOIN security_.user_ u ON s.key_ = 'email_address:' || u.email_address_
    WHERE u.uuid_ = internal_.current_subject_uuid_()
      AND (s.data_->>'is_test_user')::boolean
  ) THEN
    RETURN 't';
  ELSE
    RETURN 'f';
  END IF;
END
$$;

CREATE FUNCTION policy_.test_user_can_create_test_subdomain_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_test_user_() AND _data->>'name_' = 'test' THEN
    RETURN '{uuid_, name_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('security_.subdomain_', 'create', 'policy_.test_user_can_create_test_subdomain_');

CREATE OR REPLACE FUNCTION policy_.test_user_can_create_test_agency_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_test_user_() AND (_data->'livemode_')::boolean = 'f' THEN
    RETURN '{uuid_, subdomain_uuid_, name_, livemode_, default_pricing_currency_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.agency_', 'create', 'policy_.test_user_can_create_test_agency_');

INSERT INTO security_.security_data_ (key_, data_)
VALUES ('email_address:test@duely.app', '{"is_test_user": true}');

ALTER TABLE security_.policy_ ADD COLUMN enabled_ boolean NOT NULL DEFAULT 't';

CREATE FUNCTION internal_.check_current_user_is_insider_user_() RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.security_data_ s
    JOIN security_.user_ u ON s.key_ = 'email_address:' || u.email_address_
    WHERE u.uuid_ = internal_.current_subject_uuid_()
      AND (s.data_->>'is_insider_user')::boolean
  ) THEN
    RETURN 't';
  ELSE
    RETURN 'f';
  END IF;
END
$$;

CREATE FUNCTION policy_.insider_user_can_create_subdomain_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_insider_user_() THEN
    RETURN '{uuid_, name_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('security_.subdomain_', 'create', 'policy_.insider_user_can_create_subdomain_');

CREATE FUNCTION policy_.insider_user_can_create_agency_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_insider_user_() THEN
    RETURN '{uuid_, subdomain_uuid_, name_, livemode_, default_pricing_currency_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.agency_', 'create', 'policy_.insider_user_can_create_agency_');

UPDATE security_.policy_
SET enabled_ = 'f'
WHERE function_::regproc IN (
  'policy_.logged_in_user_can_create_subdomain_'::regproc, 
  'policy_.owner_can_create_agency_'::regproc
);

CREATE OR REPLACE FUNCTION security_.control_create_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
  _enabled boolean;
  _keys text[];
  _unauthorized_data jsonb;
  _fields_list text;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
  END IF;

  IF _data IS NULL OR _data = '{}'::jsonb THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  _unauthorized_data := internal_.jsonb_strip_values_(_data);

  LOOP
    SELECT uuid_, function_, enabled_ INTO _policy_uuid, _policy_function, _enabled
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND after_uuid_ IS NOT DISTINCT FROM _policy_uuid
      AND operation_type_ = 'create';

    IF _policy_function IS NULL THEN
      EXIT;
    END IF;

    IF _enabled THEN
      EXECUTE '
        SELECT ' || _policy_function::regproc || '($1, $2);
      '
      INTO _keys
      USING _resource_definition, _data;

      _unauthorized_data := _unauthorized_data - COALESCE(_keys, '{}');
    END IF;

    IF _unauthorized_data = '{}'::jsonb THEN
      -- Result: authorized
      INSERT INTO security_.event_log_ (operation_type_, resource_definition_uuid_, data_)
      VALUES ('create', _resource_definition.uuid_, _data);
      RETURN;
    END IF;
  END LOOP;

  -- Result: not authorized

  _unauthorized_data := internal_.convert_from_internal_format_(_unauthorized_data);

  SELECT string_agg(k, ', ') INTO _fields_list
  FROM jsonb_object_keys(_unauthorized_data) k;

  RAISE 'Unauthorized. Not allowed to set fields: %', _fields_list USING ERRCODE = 'DUNAU';
END
$_$;

CREATE OR REPLACE FUNCTION security_.control_delete_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
  _enabled boolean;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND operation_type_ = 'delete'
  ) THEN
    RAISE 'Unauthorized. No access policies defined.' USING ERRCODE = 'DUNAU';
  END IF;

  LOOP
    SELECT uuid_, function_, enabled_ INTO _policy_uuid, _policy_function, _enabled
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND after_uuid_ IS NOT DISTINCT FROM _policy_uuid
      AND operation_type_ = 'delete';

    IF _policy_function IS NULL THEN
      EXIT;
    END IF;

    IF _enabled THEN
      EXECUTE '
        SELECT ' || _policy_function::regproc || '($1, $2);
      '
      USING _resource_definition, _resource;
    END IF;
  END LOOP;

  INSERT INTO security_.event_log_ (operation_type_, resource_definition_uuid_, resource_uuid_)
  VALUES ('delete', _resource_definition.uuid_, _resource.uuid_);
END
$_$;


CREATE OR REPLACE FUNCTION security_.control_query_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
  _enabled boolean;
  _keys text[];
  _authorized_keys text[] := '{}'::text[];
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
  END IF;

  LOOP
    SELECT uuid_, function_, enabled_ INTO _policy_uuid, _policy_function, _enabled
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND after_uuid_ IS NOT DISTINCT FROM _policy_uuid
      AND operation_type_ = 'query';

    IF _policy_function IS NULL THEN
      EXIT;
    END IF;

    IF _enabled THEN
      EXECUTE '
        SELECT ' || _policy_function::regproc || '($1, $2);
      '
      INTO _keys
      USING _resource_definition, _resource;

      _authorized_keys := array_cat(_authorized_keys, COALESCE(_keys, '{}'));
    END IF;
  END LOOP;

  IF array_length(COALESCE(_authorized_keys, '{}'), 1) = 0 THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  SELECT array_agg(DISTINCT k) INTO _authorized_keys
  FROM unnest(_authorized_keys) k;

  RETURN _authorized_keys;
END
$_$;


CREATE OR REPLACE FUNCTION security_.control_update_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
  _enabled boolean;
  _keys text[];
  _unauthorized_data jsonb;
  _fields_list text;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
  END IF;

  IF _data IS NULL OR _data = '{}'::jsonb THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  _unauthorized_data := internal_.jsonb_strip_values_(_data);

  LOOP
    SELECT uuid_, function_, enabled_ INTO _policy_uuid, _policy_function, _enabled
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND after_uuid_ IS NOT DISTINCT FROM _policy_uuid
      AND operation_type_ = 'update';

    IF _policy_function IS NULL THEN
      EXIT;
    END IF;

    IF _enabled THEN
      EXECUTE '
        SELECT ' || _policy_function::regproc || '($1, $2, $3);
      '
      INTO _keys
      USING _resource_definition, _resource, _data;

      _unauthorized_data := _unauthorized_data - COALESCE(_keys, '{}');
    END IF;

    IF _unauthorized_data = '{}'::jsonb THEN
      -- Result: authorized
      INSERT INTO security_.event_log_ (operation_type_, resource_definition_uuid_, resource_uuid_, data_)
      VALUES ('update', _resource_definition.uuid_, _resource.uuid_, _data);
      RETURN;
    END IF;
  END LOOP;

  -- Result: not authorized

  _unauthorized_data := internal_.convert_from_internal_format_(_unauthorized_data);

  SELECT string_agg(k, ', ') INTO _fields_list
  FROM jsonb_object_keys(_unauthorized_data) k;

  RAISE 'Unauthorized. Not allowed to set fields: %', _fields_list USING ERRCODE = 'DUNAU';
END
$_$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
