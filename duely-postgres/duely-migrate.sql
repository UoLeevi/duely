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

DROP FUNCTION operation_.create_resource_;

CREATE OR REPLACE FUNCTION operation_.create_resource_(_resource_name text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $__$
DECLARE
  _resource_definition security_.resource_definition_;
  _column_list text;
  _select_list text;
  _uuid uuid;
  _id text;
BEGIN
  SELECT * INTO _data
  FROM internal_.convert_to_internal_format_(_data);

  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = _resource_name;

  PERFORM security_.control_create_(_resource_definition, _data);

  SELECT string_agg(format('%1$I', k), ','), string_agg(format('d.%1$I', k), ',') INTO _column_list, _select_list
  FROM jsonb_object_keys(_data) k;

  EXECUTE '
    INSERT INTO ' || _resource_definition.table_ || ' (' || _column_list || ')
    SELECT ' || _select_list || '
    FROM json_populate_record(NULL::' || _resource_definition.table_ || ', $1) d
    RETURNING uuid_;
  '
  INTO _uuid
  USING _data;

  SELECT id_ INTO _id
  FROM application_.resource_
  WHERE uuid_ = _uuid;

  RETURN operation_.query_resource_(_id);
END
$__$;

ALTER TABLE application_.agency_ ALTER COLUMN subdomain_uuid_ DROP NOT NULL;

CREATE OR REPLACE FUNCTION internal_.convert_to_internal_format_(_data jsonb) RETURNS jsonb
  LANGUAGE sql SECURITY DEFINER STABLE
  AS 
$$
  WITH
    _id_fields AS (
      SELECT k, LEFT(k, length(k) - 2) || 'uuid' f, r.uuid_
      FROM jsonb_object_keys(_data) k
      JOIN application_.resource_ r ON r.id_ = _data->>k
      WHERE k LIKE '%id'
    )
  SELECT jsonb_object_agg(COALESCE(i.f, d.key) || '_', COALESCE(to_jsonb(i.uuid_), d.value)) data_
  FROM jsonb_each(_data) d
  LEFT JOIN _id_fields i ON i.k = d.key;
$$;

CREATE OR REPLACE FUNCTION internal_.convert_from_internal_format_(_data jsonb) RETURNS jsonb
  LANGUAGE sql SECURITY DEFINER STABLE
  AS 
$$
  WITH
    _uuid_fields AS (
      SELECT k, LEFT(k, length(k) - 5) || 'id_' f, r.id_
      FROM jsonb_object_keys(_data) k
      JOIN application_.resource_ r ON r.uuid_ = (_data->>k)::uuid
      WHERE k LIKE '%uuid_'
    )
  SELECT jsonb_object_agg(rtrim(COALESCE(i.f, d.key), '_'), COALESCE(to_jsonb(i.id_), d.value)) data_
  FROM jsonb_each(_data) d
  LEFT JOIN _uuid_fields i ON i.k = d.key;
$$;

CREATE OR REPLACE FUNCTION operation_.query_resource_(_id text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $__$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
  _keys text[];
  _select_list text;
  _data jsonb;
BEGIN
  SELECT * INTO _data
  FROM internal_.convert_to_internal_format_(_data);

  SELECT * INTO _resource
  FROM application_.resource_
  WHERE id_ = _id;

  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource.definition_uuid_;

  SELECT * INTO _keys FROM security_.control_query_(_resource_definition, _resource);

  SELECT string_agg(format('%1$I', k), ',') INTO _select_list
  FROM unnest(_keys) k;

  EXECUTE '
    WITH
      r AS (
        SELECT ' || _select_list || '
        FROM ' || _resource_definition.table_ || '
        WHERE uuid_ = $1
      )
    SELECT to_jsonb(r)
    FROM r;
  '
  INTO _data
  USING _resource.uuid_;

  RETURN internal_.convert_from_internal_format_(_data);
END
$__$;

CREATE OR REPLACE FUNCTION security_.control_query_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
  LANGUAGE plpgsql
  AS $__$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
  _keys text[] := '{}';
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
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
      SELECT ' || _policy_function || '($1, $2, $3);
    '
    INTO _keys
    USING _resource_definition, _resource, _keys;
  END LOOP;

  IF array_length(_keys, 1) = 0 THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;

  SELECT array_agg(DISTINCT k)
  FROM unnest(_keys) k;

  RETURN _keys;
END
$__$;

CREATE OR REPLACE FUNCTION security_.control_create_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS void
  LANGUAGE plpgsql
  AS $__$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
  _keys text[] := '{}';
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  IF _data IS NULL OR _data = '{}'::jsonb THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;

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
      SELECT ' || _policy_function || '($1, $2, $3);
    '
    INTO _keys
    USING _resource_definition, _data, _keys;
  END LOOP;

  IF EXISTS (
      SELECT jsonb_object_keys(_data)
    EXCEPT
      SELECT unnest(_keys)
  ) THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;

  INSERT INTO security_.event_log_ (operation_type_, resource_definition_uuid_, data_)
  VALUES ('create', _resource_definition.uuid_, _data);
END
$__$;

CREATE OR REPLACE FUNCTION security_.control_update_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS void
  LANGUAGE plpgsql
  AS $__$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
  _keys text[] := '{}';
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  IF _data IS NULL OR _data = '{}'::jsonb THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;

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
      SELECT ' || _policy_function || '($1, $2, $3, $4);
    '
    INTO _keys
    USING _resource_definition, _resource, _data, _keys;
  END LOOP;

  IF EXISTS (
      SELECT jsonb_object_keys(_data)
    EXCEPT
      SELECT unnest(_keys)
  ) THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;

  INSERT INTO security_.event_log_ (operation_type_, resource_definition_uuid_, resource_uuid_, data_)
  VALUES ('update', _resource_definition.uuid_, _resource.uuid_, _data);
END
$__$;

CREATE OR REPLACE FUNCTION security_.control_delete_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
  LANGUAGE plpgsql
  AS $__$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

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
      SELECT ' || _policy_function || '($1, $2, $3, $4);
    '
    USING _resource_definition, _resource;
  END LOOP;

  INSERT INTO security_.event_log_ (operation_type_, resource_definition_uuid_, resource_uuid_)
  VALUES ('delete', _resource_definition.uuid_, _resource.uuid_);
END
$__$;

CREATE OR REPLACE FUNCTION policy_.owner_can_query_all_agency_fields_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_role_ r
    JOIN application_.agency_ a ON a.subdomain_uuid_ = r.subdomain_uuid_
    WHERE r.name_ = 'owner'
      AND a.uuid_ = _arg.agency_uuid_
  ) THEN
    RETURN array_cat(_keys, '{uuid_, subdomain_uuid_, name_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
