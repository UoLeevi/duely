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

CREATE OR REPLACE FUNCTION operation_.begin_session_(_jwt text, _tag text DEFAULT NULL::text) RETURNS security_.session_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _claims jsonb;
  _token_uuid uuid;
  _subject_uuid uuid;
  _session security_.session_;
BEGIN
  UPDATE security_.session_
  SET
    nesting_ = nesting_ + 1
  WHERE uuid_ = current_setting('security_.session_.uuid_'::text, true)::uuid
  RETURNING * INTO _session;

  IF _session IS NULL THEN
    SELECT internal_.jwt_verify_hs256_(_jwt, x.value_) INTO _claims
    FROM security_.secret_ x
    WHERE x.name_ = 'jwt_hs256';

    IF _claims IS NULL THEN
      RAISE 'Invalid JWT.' USING ERRCODE = 'D0JWT';
    END IF;

    SELECT t.uuid_, t.subject_uuid_ INTO _token_uuid, _subject_uuid
    FROM security_.token_ t
    WHERE t.uuid_ = (_claims->>'jti')::uuid
      AND t.revoked_at_ IS NULL;

    IF _token_uuid IS NULL THEN
      RAISE 'Invalid JWT.' USING ERRCODE = 'D0JWT';
    END IF;

    INSERT INTO security_.session_ (token_uuid_, tag_)
    VALUES (_token_uuid, _tag)
    RETURNING * INTO _session;

    PERFORM set_config('security_.token_.subject_uuid_', _subject_uuid::text, 'f');
    PERFORM set_config('security_.session_.uuid_', _session.uuid_::text, 'f');
  END IF;

  RETURN _session;
END
$$;

CREATE OR REPLACE FUNCTION operation_.begin_visit_() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _uuid uuid := gen_random_uuid();
  _iat bigint := FLOOR(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP));
  _subject_uuid uuid;
  _secret bytea;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid <> '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'Active session already exists.' USING ERRCODE = 'DEXSE';
  END IF;

  INSERT INTO security_.subject_ (type_)
  VALUES ('visitor')
  RETURNING uuid_ INTO _subject_uuid;

  SELECT x.value_ INTO _secret
  FROM security_.secret_ x
  WHERE x.name_ = 'jwt_hs256';

  IF _secret IS NULL THEN
    RAISE 'Invalid secret configuration.' USING ERRCODE = 'DCONF';
  END IF;

  INSERT INTO security_.token_ (uuid_, subject_uuid_)
  VALUES (_uuid, _subject_uuid);

  RETURN 
    internal_.jwt_sign_hs256_(
      jsonb_build_object(
        'iss', 'duely.app',
        'sub', _subject_uuid,
        'jti', _uuid,
        'iat', _iat
      ),
      _secret
    );
END
$$;

CREATE OR REPLACE FUNCTION operation_.end_session_() RETURNS security_.session_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _session security_.session_;
BEGIN
  SELECT * INTO _session
  FROM security_.session_
  WHERE uuid_ = current_setting('security_.session_.uuid_'::text, true)::uuid
  FOR UPDATE;

  IF _session IS NULL THEN
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
  ELSEIF _session.nesting_ > 0 THEN
    UPDATE security_.session_
    SET
      nesting_ = nesting_ - 1
    WHERE uuid_ = _session.uuid_
    RETURNING * INTO _session;
  ELSE
    UPDATE security_.session_
    SET
      end_at_ = CURRENT_TIMESTAMP
    WHERE uuid_ = _session.uuid_
    RETURNING * INTO _session;

    PERFORM set_config('security_.token_.subject_uuid_', '00000000-0000-0000-0000-000000000000', 'f');
    PERFORM set_config('security_.session_.uuid_', '00000000-0000-0000-0000-000000000000', 'f');
  END IF;

  RETURN _session;
END
$$;

CREATE OR REPLACE FUNCTION operation_.end_visit_() RETURNS security_.token_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _token security_.token_;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
  END IF;

  UPDATE security_.token_ t
  SET
    revoked_at_ = CURRENT_TIMESTAMP
  FROM security_.session_ se
  CROSS JOIN security_.subject_ s
  WHERE t.uuid_ = se.token_uuid_
  AND t.revoked_at_ IS NULL
  AND s.uuid_ = t.subject_uuid_
  AND s.type_ = 'visitor'
  AND se.uuid_ = current_setting('security_.session_.uuid_'::text, false)::uuid
  RETURNING * INTO _token;

  RETURN _token;
END
$$;

CREATE OR REPLACE FUNCTION operation_.log_in_user_(_email_address text, _password text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _uuid uuid := gen_random_uuid();
  _iat bigint := FLOOR(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP));
  _subject_uuid uuid;
  _secret bytea;
  _arg RECORD;
BEGIN
  SELECT _email_address email_address_ INTO _arg; 
  PERFORM security_.control_operation_('log_in_user_', _arg);

  SELECT u.uuid_ INTO _subject_uuid
  FROM security_.user_ u
  WHERE u.email_address_ = _email_address
    AND u.password_hash_ = pgcrypto_.crypt(_password, u.password_hash_);

  IF _subject_uuid IS NULL THEN
    RAISE 'Email address and password do not match.' USING ERRCODE = 'DPASS';
  END IF;

  SELECT x.value_ INTO _secret
  FROM security_.secret_ x
  WHERE x.name_ = 'jwt_hs256';

  IF _secret IS NULL THEN
    RAISE 'Invalid secret configuration.' USING ERRCODE = 'DCONF';
  END IF;

  INSERT INTO security_.token_ (uuid_, subject_uuid_)
  VALUES (_uuid, _subject_uuid);

  RETURN 
    internal_.jwt_sign_hs256_(
      jsonb_build_object(
        'iss', 'duely.app',
        'sub', _subject_uuid,
        'jti', _uuid,
        'iat', _iat
      ),
      _secret
    );
END
$$;

CREATE OR REPLACE FUNCTION policy_.delete_forbidden_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
END
$$;

CREATE OR REPLACE FUNCTION policy_.only_owner_can_delete_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF NOT internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.user_can_delete_only_themselves_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    WHERE s.type_ = 'user'
      AND s.uuid_ = _resource.uuid_
  ) THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION security_.control_create_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
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
    SELECT uuid_, function_ INTO _policy_uuid, _policy_function
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND after_uuid_ IS NOT DISTINCT FROM _policy_uuid
      AND operation_type_ = 'create';

    IF _policy_function IS NULL THEN
      EXIT;
    END IF;

    EXECUTE '
      SELECT ' || _policy_function::regproc || '($1, $2);
    '
    INTO _keys
    USING _resource_definition, _data;

    _unauthorized_data := _unauthorized_data - COALESCE(_keys, '{}');

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
    SELECT uuid_, function_ INTO _policy_uuid, _policy_function
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND after_uuid_ IS NOT DISTINCT FROM _policy_uuid
      AND operation_type_ = 'delete';

    IF _policy_function IS NULL THEN
      EXIT;
    END IF;

    EXECUTE '
      SELECT ' || _policy_function::regproc || '($1, $2);
    '
    USING _resource_definition, _resource;
  END LOOP;

  INSERT INTO security_.event_log_ (operation_type_, resource_definition_uuid_, resource_uuid_)
  VALUES ('delete', _resource_definition.uuid_, _resource.uuid_);
END
$_$;

CREATE OR REPLACE FUNCTION security_.control_operation_(_operation_name text, _arg anyelement DEFAULT NULL::text) RETURNS security_.event_
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _event security_.event_;
  _policy text;
  _deny boolean := 'f';
  _allow boolean := 'f';
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
  END IF;

  FOR _policy IN
    SELECT p.policy_name_
    FROM security_.policy_assignment_ p
    JOIN security_.operation_ o ON p.operation_uuid_ = o.uuid_
    WHERE o.name_ = _operation_name
      AND p.type_ = 'deny'
  LOOP
    EXECUTE format('SELECT policy_.%1$I($1)', _policy) INTO _deny USING _arg;
    IF _deny THEN
      RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
    END IF;
  END LOOP;

  FOR _policy IN
    SELECT p.policy_name_
    FROM security_.policy_assignment_ p
    JOIN security_.operation_ o ON p.operation_uuid_ = o.uuid_
    WHERE o.name_ = _operation_name
      AND p.type_ = 'allow'
  LOOP
    EXECUTE format('SELECT policy_.%1$I($1)', _policy) INTO _allow USING _arg;
    IF _allow THEN
      EXIT;
    END IF;
  END LOOP;

  IF NOT _allow THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  IF (
    SELECT o.log_events_
    FROM security_.operation_ o
    WHERE o.name_ = _operation_name
  ) THEN
    INSERT INTO security_.event_ (operation_uuid_, arg_)
    SELECT o.uuid_, _arg::text
    FROM security_.operation_ o
    WHERE o.name_ = _operation_name
    RETURNING * INTO _event;
  END IF;

  RETURN _event;
END
$_$;

CREATE OR REPLACE FUNCTION security_.control_query_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
  _keys text[];
  _authorized_keys text[] := '{}'::text[];
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
  END IF;

  LOOP
    SELECT uuid_, function_ INTO _policy_uuid, _policy_function
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND after_uuid_ IS NOT DISTINCT FROM _policy_uuid
      AND operation_type_ = 'query';

    IF _policy_function IS NULL THEN
      EXIT;
    END IF;

    EXECUTE '
      SELECT ' || _policy_function::regproc || '($1, $2);
    '
    INTO _keys
    USING _resource_definition, _resource;

    _authorized_keys := array_cat(_authorized_keys, COALESCE(_keys, '{}'));
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
    SELECT uuid_, function_ INTO _policy_uuid, _policy_function
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND after_uuid_ IS NOT DISTINCT FROM _policy_uuid
      AND operation_type_ = 'update';

    IF _policy_function IS NULL THEN
      EXIT;
    END IF;

    EXECUTE '
      SELECT ' || _policy_function::regproc || '($1, $2, $3);
    '
    INTO _keys
    USING _resource_definition, _resource, _data;

    _unauthorized_data := _unauthorized_data - COALESCE(_keys, '{}');

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
