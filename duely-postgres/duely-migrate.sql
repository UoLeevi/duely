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
    SET after_uuid_ = policy_.uuid_
    WHERE uuid_ = _before_uuid;
  END IF;

  RETURN _policy;
END
$$;


CREATE OR REPLACE FUNCTION operation_.create_agency_(_name text, _subdomain_name text) RETURNS application_.agency_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _subdomain_uuid uuid;
  _agency application_.agency_;
  _arg RECORD;
BEGIN
  -- DEPRECATED: Use create_resource_ instead.

  SELECT _name agency_name_, _subdomain_name subdomain_name_ INTO _arg; 
  PERFORM security_.control_operation_('create_agency_', _arg);

  INSERT INTO security_.subdomain_ (name_)
  VALUES (_subdomain_name)
  RETURNING uuid_ INTO _subdomain_uuid;

  INSERT INTO application_.agency_ (subdomain_uuid_, name_)
  VALUES (_subdomain_uuid, _name)
  RETURNING * INTO _agency;

  RETURN _agency;
END
$$;

CREATE OR REPLACE FUNCTION internal_.assign_subdomain_owner_() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
BEGIN
  INSERT INTO security_.subject_assignment_ (role_uuid_, subdomain_uuid_, subject_uuid_)
  SELECT r.uuid_, _subdomain.uuid_, current_setting('security_.token_.subject_uuid_'::text, false)::uuid
  FROM security_.role_ r
  CROSS JOIN _subdomain
  WHERE r.name_ = 'owner';

  RETURN NULL;
END
$_$;

CREATE TRIGGER tr_after_insert_assign_subdomain_owner_ AFTER INSERT ON security_.subdomain_ REFERENCING NEW TABLE AS _subdomain FOR EACH STATEMENT EXECUTE PROCEDURE internal_.assign_subdomain_owner_();

ALTER TABLE application_.agency_ ALTER COLUMN subdomain_uuid_ SET NOT NULL;

CREATE OR REPLACE FUNCTION policy_.logged_in_user_can_query_name_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
SELECT 1
    FROM security_.active_subject_
    WHERE type_ = 'user'
  ) THEN
    RETURN array_cat(_keys, '{uuid_, name_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.logged_in_user_can_create_subdomain_(_resource_definition security_.resource_definition_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
SELECT 1
    FROM security_.active_subject_
    WHERE type_ = 'user'
  ) THEN
    RETURN array_cat(_keys, '{uuid_, name_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_create_agency_(_resource_definition security_.resource_definition_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_role_
    WHERE name_ = 'owner'
      AND subdomain_uuid_ = (_data->>'subdomain_uuid_')::uuid
  ) THEN
    RETURN array_cat(_keys, '{uuid_, subdomain_uuid_, name_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE FUNCTION policy_.anyone_can_query_basic_agency_fields_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE sql SECURITY DEFINER STABLE
    AS
$$
  SELECT array_cat(_keys, '{uuid_, subdomain_uuid_, name_}');
$$;

DELETE FROM security_.policy_;
DROP FUNCTION policy_.owner_can_query_all_agency_fields_;

PERFORM security_.register_policy_('security_.subdomain_', 'query', 'policy_.logged_in_user_can_query_name_');
PERFORM security_.register_policy_('security_.subdomain_', 'create', 'policy_.logged_in_user_can_create_subdomain_');
PERFORM security_.register_policy_('application_.agency_', 'create', 'policy_.owner_can_create_agency_');
PERFORM security_.register_policy_('application_.agency_', 'query', 'policy_.anyone_can_query_basic_agency_fields_');

CREATE OR REPLACE FUNCTION internal_.dynamic_insert_(_table regclass, _data jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
DECLARE
  _column_list text;
  _select_list text;
  _uuid uuid;
BEGIN
  SELECT string_agg(format('%1$I', k), ','), string_agg(format('d.%1$I', k), ',') INTO _column_list, _select_list
  FROM jsonb_object_keys(_data) k;

  EXECUTE '
    INSERT INTO ' || _table || ' (' || _column_list || ')
    SELECT ' || _select_list || '
    FROM jsonb_populate_record(NULL::' || _table || ', $1) d
    RETURNING uuid_;
  '
  INTO _uuid
  USING _data;

  RETURN _uuid;
END
$_$;

CREATE OR REPLACE FUNCTION internal_.dynamic_update_(_table regclass, _uuid uuid, _data jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
DECLARE
  _update_list text;
BEGIN
  SELECT string_agg(format('%1$I = d.%1$I', k), ',') INTO _update_list
  FROM jsonb_object_keys(_data) k;

  EXECUTE '
    UPDATE ' || _table || ' r
    SET ' || _update_list || '
    FROM jsonb_populate_record(NULL::' || _table || ', $1) d
    WHERE r.uuid_ = $2
    RETURINING uuid_;
  '
  INTO _uuid
  USING _data, _uuid;

  RETURN _uuid;
END
$_$;

CREATE OR REPLACE FUNCTION security_.control_create_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $_$
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
      SELECT ' || _policy_function::regproc || '($1, $2, $3);
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
$_$;

CREATE OR REPLACE FUNCTION security_.control_update_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $_$
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
      SELECT ' || _policy_function::regproc || '($1, $2, $3, $4);
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
$_$;

CREATE OR REPLACE FUNCTION security_.control_query_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql
    AS $_$
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
      SELECT ' || _policy_function::regproc || '($1, $2, $3);
    '
    INTO _keys
    USING _resource_definition, _resource, _keys;
  END LOOP;

  IF array_length(_keys, 1) = 0 THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;

  SELECT array_agg(DISTINCT k) INTO _keys
  FROM unnest(_keys) k;

  RETURN _keys;
END
$_$;

DROP FUNCTION internal_.create_or_update_owned_resource_;

CREATE OR REPLACE FUNCTION internal_.create_or_update_owned_resource_(_owner_resource_name text, _owner_id text, _resource_name text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _id text;
BEGIN
  _data := _data || jsonb_build_object(_owner_resource_name || '_id', _owner_id);
  _id := _data->>'id';

  IF _id IS NULL THEN
    _data := operation_.create_resource_(_resource_name, _data);
  ELSE
    _data := _data - 'id';
    _data := operation_.update_resource_(id_, _data);
  END IF;

  RETURN _data;
END
$$;

CREATE OR REPLACE FUNCTION operation_.create_resource_(_resource_name text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
  _column_list text;
  _select_list text;
  _uuid uuid;
  _id text;
  _owned_resources_data jsonb;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_ WHERE name_ = _resource_name;

  SELECT owner_, owned_ INTO _data, _owned_resources_data
  FROM internal_.extract_referenced_resources_jsonb_(_resource_definition.uuid_, _data);

  _data := internal_.convert_to_internal_format_(_data);

  PERFORM security_.control_create_(_resource_definition, _data);

  _uuid := internal_.dynamic_insert_(_resource_definition.table_, _data);

  SELECT id_ INTO _id FROM application_.resource_ WHERE uuid_ = _uuid;

  _data := operation_.query_resource_(_id);

  SELECT jsonb_object_agg(r.key, internal_.create_or_update_owned_resource_(_resource_definition.name_, _id, r.key, r.value)) INTO _owned_resources_data
  FROM jsonb_each(_owned_resources_data) r;

  RETURN _data || _owned_resources_data;
END
$$;

CREATE OR REPLACE FUNCTION operation_.query_resource_(_id text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
  _keys text[];
  _select_list text;
  _data jsonb;
BEGIN
  _data := internal_.convert_to_internal_format_(_data);

  SELECT * INTO _resource
  FROM application_.resource_ WHERE id_ = _id;

  SELECT * INTO _resource_definition
  FROM security_.resource_definition_ WHERE uuid_ = _resource.definition_uuid_;

  _keys := security_.control_query_(_resource_definition, _resource);
  _data := internal_.dynamic_select_(_resource_definition.table_, _resource.uuid_, _keys);
  _data := internal_.convert_from_internal_format_(_data);

  RETURN _data;
END
$$;

CREATE OR REPLACE PROCEDURE internal_.setup_resource_(_table regclass, _name text, _id_prefix text, _owner_table regclass DEFAULT NULL::regclass)
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource_definition security_.resource_definition_;
  _owner_resource_definition_uuid uuid;
  _table_name name;
  _table_schema name;
  _search regprocedure;
BEGIN
  SELECT c.relname, ns.nspname INTO _table_name, _table_schema
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace ns ON c.relnamespace = ns.oid
  WHERE c.oid = _table;

  SELECT uuid_ INTO _owner_resource_definition_uuid
  FROM security_.resource_definition_
  WHERE table_ = _owner_table;

  BEGIN
    SELECT format('operation_.%1$I(uuid)', 'search_' || _table_name)::regprocedure INTO _search;
  EXCEPTION
    WHEN OTHERS THEN
      -- NOT EXIST
      NULL;
  END;

  INSERT INTO security_.resource_definition_ (id_prefix_, name_, table_, owner_uuid_, search_)
  VALUES (_id_prefix, _name, _table, _owner_resource_definition_uuid, _search)
  ON CONFLICT (table_) DO UPDATE
  SET 
    id_prefix_ = _id_prefix,
    name_ = _name,
    table_ = _table,
    owner_uuid_ = _owner_resource_definition_uuid,
    search_ = _search
  RETURNING * INTO _resource_definition;

  EXECUTE '
    DROP TRIGGER IF EXISTS tr_after_insert_resource_insert_ ON ' || _table || ';
    CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON ' || _table || ' REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();
    DROP TRIGGER IF EXISTS tr_after_update_resource_update_ ON ' || _table || ';
    CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON ' || _table || ' REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();
    DROP TRIGGER IF EXISTS tr_after_delete_resource_delete_ ON ' || _table || ';
    CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON ' || _table || ' REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();
  ';
END
$_$;

CALL internal_.setup_resource_('security_.subdomain_', 'subdomain', 'sub');
CALL internal_.setup_resource_('application_.agency_', 'agency', 'agcy', 'security_.subdomain_');
CALL internal_.setup_resource_('application_.service_', 'service', 'svc', 'application_.agency_');

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
      SELECT ' || _policy_function::regproc || '($1, $2, $3, $4);
    '
    USING _resource_definition, _resource;
  END LOOP;

  INSERT INTO security_.event_log_ (operation_type_, resource_definition_uuid_, resource_uuid_)
  VALUES ('delete', _resource_definition.uuid_, _resource.uuid_);
END
$_$;

CREATE OR REPLACE FUNCTION internal_.resource_insert_() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource_definition security_.resource_definition_;
  _owner_resource_definition security_.resource_definition_;
  _uuid uuid;
  _owner_uuid uuid;
  _search text;
  _id_len int := 6;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE table_ = format('%1$I.%2I', TG_TABLE_SCHEMA, TG_TABLE_NAME)::regclass;

  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  IF _owner_resource_definition IS NOT NULL THEN
    EXECUTE format($$
      SELECT %1$I
      FROM _new_table;
    $$,
    _owner_resource_definition.name_ || '_uuid_')
    INTO _owner_uuid;
  END IF;

  IF _resource_definition.search_ IS NOT NULL THEN
    EXECUTE format($$
      SELECT %1$I(uuid_)
      FROM _new_table;
    $$,
    _resource_definition.search_)
    INTO _search;
  ELSE
    SELECT name_ INTO _search
    FROM _new_table;
  END IF;

  LOOP
    BEGIN
      INSERT INTO application_.resource_ (uuid_, search_, owner_uuid_, definition_uuid_, id_)
      SELECT uuid_, _search, _owner_uuid, _resource_definition.uuid_, _resource_definition.id_prefix_ || '_' || substring(replace(uuid_::text, '-', '' ) FOR _id_len)
      FROM _new_table;
      EXIT;
    EXCEPTION WHEN unique_violation THEN
      _id_len := _id_len + 2;
    END;
  END LOOP;

  RETURN NULL;
END
$_$;

CREATE OR REPLACE FUNCTION internal_.resource_update_() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource_definition security_.resource_definition_;
  _owner_resource_definition security_.resource_definition_;
  _uuid uuid;
  _owner_uuid uuid;
  _search text;
  _id_len int := 6;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE table_ = format('%1$I.%2I', TG_TABLE_SCHEMA, TG_TABLE_NAME)::regclass;

  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  EXECUTE format($$
    SELECT uuid_, %1$I owner_uuid_
    FROM _new_table
  $$,
  _owner_resource_definition.name_ || '_uuid_')
  INTO _uuid, _owner_uuid;

  IF _resource_definition.search_ IS NOT NULL THEN
    EXECUTE format($$
      SELECT %1$I($1);
    $$,
    _resource_definition.search_)
    INTO _search
    USING _uuid;
  ELSE
    SELECT name_ INTO _search
    FROM _new_table;
  END IF;

  UPDATE security_.resource_
  SET
    search_ = _search,
    owner_uuid_ = _owner_uuid
  FROM _new_table t
  WHERE uuid_ = t.uuid_;

  RETURN NULL;
END
$_$;


-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
