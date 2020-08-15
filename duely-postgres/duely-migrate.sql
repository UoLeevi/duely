-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'MIGRATION STARTED'
\set QUIET true

DO 
LANGUAGE plpgsql
$_$
DECLARE

BEGIN
-- MIGRATION CODE START

ALTER TABLE ONLY security_.resource_definition_ ALTER COLUMN uuid_ SET DEFAULT pgcrypto_.gen_random_uuid();
DROP FUNCTION operation_.query_resource_;
DROP PROCEDURE internal_.setup_resource_;

ALTER TABLE ONLY security_.resource_definition_ DROP COLUMN query_;
ALTER TABLE ONLY security_.resource_definition_ DROP COLUMN create_;
ALTER TABLE ONLY security_.resource_definition_ DROP COLUMN update_;
ALTER TABLE ONLY security_.resource_definition_ DROP COLUMN delete_;

CREATE OR REPLACE PROCEDURE internal_.setup_resource_(_table regclass, _name text, _id_prefix text, _owner_table regclass DEFAULT NULL)
  LANGUAGE plpgsql
  AS $__$
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
    DROP TRIGGER IF EXISTS tr_after_insert_resource_insert_ ON ' || _table || ';
    CREATE TRIGGER tr_after_insert_resource_insert_ AFTER UPDATE ON ' || _table || ' REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();
    DROP TRIGGER IF EXISTS tr_after_delete_resource_delete_ ON ' || _table || ';
    CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON ' || _table || ' REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();
  ';
END
$__$;

CALL internal_.setup_resource_('application_.agency_', 'agency', 'agcy');
CALL internal_.setup_resource_('application_.service_', 'service', 'svc', 'application_.agency_');

-- CREATE FUNCTION internal_.raise_exception_(_message text) 
--   RETURNS void LANGUAGE plpgsql 
--   AS $$
-- BEGIN
--   RAISE EXCEPTION _message;
-- END;
-- $$;

CREATE OR REPLACE FUNCTION internal_.convert_to_internal_format_(_data jsonb) RETURNS jsonb
  LANGUAGE sql SECURITY DEFINER STABLE
  AS 
$$
  WITH
    _id_fields AS (
      SELECT k, LEFT(k, length(k) - 2) || 'uuid' f, r.uuid_
      FROM jsonb_object_keys(_data) k
      LEFT JOIN application_.resource_ r ON r.id_ = _data->>k
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
      LEFT JOIN application_.resource_ r ON r.uuid_ = (_data->>k)::uuid
      WHERE k LIKE '%uuid_'
    )
  SELECT jsonb_object_agg(rtrim(COALESCE(i.f, d.key), '_'), COALESCE(to_jsonb(i.id_), d.value)) data_
  FROM jsonb_each(_data) d
  LEFT JOIN _uuid_fields i ON i.k = d.key;
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
  SELECT * INTO _data
  FROM internal_.convert_to_internal_format_(_data);

  SELECT * INTO _resource
  FROM application_.resource_
  WHERE id_ = _id;

  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource.definition_uuid_;

  SELECT * INTO _keys FROM security_.control_query_(_resource_definition, _resource);

  IF array_length(_keys, 1) = 0 THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;

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
$$;

CREATE FUNCTION security_.control_query_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
  LANGUAGE plpgsql
  AS $__$
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  RAISE EXCEPTION 'NOT IMPLEMENTED';
END
$__$;

CREATE OR REPLACE FUNCTION operation_.create_resource_(_data jsonb) RETURNS jsonb
  LANGUAGE plpgsql SECURITY DEFINER
  AS $$
DECLARE
  _resource application_.resource_;
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
  WHERE uuid_ = _resource.definition_uuid_;

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
  USING _data, _resource.uuid_;

  SELECT id_ INTO _id
  FROM application_.resource_
  WHERE uuid_ = _uuid;

  RETURN operation_.query_resource_(_id);
END
$$;

CREATE FUNCTION security_.control_create_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS void
  LANGUAGE plpgsql
  AS $__$
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  RAISE EXCEPTION 'NOT IMPLEMENTED';
END
$__$;

CREATE OR REPLACE FUNCTION operation_.update_resource_(_id text, _data jsonb) RETURNS jsonb
  LANGUAGE plpgsql SECURITY DEFINER
  AS $$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
  _update_list text;
BEGIN
  SELECT * INTO _data
  FROM internal_.convert_to_internal_format_(_data);

  SELECT * INTO _resource
  FROM application_.resource_
  WHERE id_ = _id;

  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource.definition_uuid_;

  PERFORM security_.control_update_(_resource_definition, _resource, _data);

  SELECT string_agg(format('%1$I = d.%1$I', k), ',') INTO _update_list
  FROM jsonb_object_keys(_data) k;

  EXECUTE '
    UPDATE ' || _resource_definition.table_ || ' r
    SET ' || _update_list || '
    FROM json_populate_record(NULL::' || _resource_definition.table_ || ', $1) d
    WHERE r.uuid_ = $2;
  '
  USING _data, _resource.uuid_;

  RETURN operation_.query_resource_(_id);
END
$$;

CREATE FUNCTION security_.control_update_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS void
  LANGUAGE plpgsql
  AS $__$
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  RAISE EXCEPTION 'NOT IMPLEMENTED';
END
$__$;

CREATE OR REPLACE FUNCTION operation_.delete_resource_(_id text) RETURNS jsonb
  LANGUAGE plpgsql SECURITY DEFINER
  AS $$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
  _data jsonb;
BEGIN

  SELECT * INTO _resource
  FROM application_.resource_
  WHERE id_ = _id;

  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource.definition_uuid_;

  PERFORM security_.control_delete_(_resource_definition, _resource);

  SELECT * INTO _data FROM operation_.query_resource_(_id);

  EXECUTE '
    DELETE FROM ' || _resource_definition.table_ || '
    WHERE uuid_ = $1;
  '
  USING _resource.uuid_;

  RETURN _data;
END
$$;

CREATE FUNCTION security_.control_delete_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
  LANGUAGE plpgsql
  AS $__$
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  RAISE EXCEPTION 'NOT IMPLEMENTED';
END
$__$;

-- CREATE FUNCTION security_.control_update_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS security_.event_
--   LANGUAGE plpgsql
--   AS $__$
-- DECLARE
--   _event security_.event_;
--   _policy text;
--   _deny boolean := 'f';
--   _allow boolean := 'f';
-- BEGIN
--   IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
--     RAISE 'No active session.' USING ERRCODE = '20000';
--   END IF;

--   FOR _policy IN
--     SELECT p.policy_name_
--     FROM security_.policy_assignment_ p
--     JOIN security_.operation_ o ON p.operation_uuid_ = o.uuid_
--     WHERE o.name_ = _operation_name
--       AND p.type_ = 'deny'
--   LOOP
--     EXECUTE format('SELECT policy_.%1$I($1)', _policy) INTO _deny USING _arg;
--     IF _deny THEN
--       RAISE 'Unauthorized.' USING ERRCODE = '42501';
--     END IF;
--   END LOOP;

--   FOR _policy IN
--     SELECT p.policy_name_
--     FROM security_.policy_assignment_ p
--     JOIN security_.operation_ o ON p.operation_uuid_ = o.uuid_
--     WHERE o.name_ = _operation_name
--       AND p.type_ = 'allow'
--   LOOP
--     EXECUTE format('SELECT policy_.%1$I($1)', _policy) INTO _allow USING _arg;
--     IF _allow THEN
--       EXIT;
--     END IF;
--   END LOOP;

--   IF NOT _allow THEN
--     RAISE 'Unauthorized.' USING ERRCODE = '42501';
--   END IF;

--   IF (
--     SELECT o.log_events_
--     FROM security_.operation_ o
--     WHERE o.name_ = _operation_name
--   ) THEN
--     INSERT INTO security_.event_ (operation_uuid_, arg_)
--     SELECT o.uuid_, _arg::text
--     FROM security_.operation_ o
--     WHERE o.name_ = _operation_name
--     RETURNING * INTO _event;
--   END IF;

--   RETURN _event;
-- END
-- $__$;

-- INSERT INTO security_.operation_(name_, log_events_) VALUES ('query_service_variant_by_service_', 'f');

-- PERFORM security_.implement_policy_allow_('query_service_variant_', 'agent_in_agency_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
