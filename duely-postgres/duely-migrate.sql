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

CREATE OR REPLACE FUNCTION internal_.dynamic_select_(_table regclass, _uuid uuid, _keys text[]) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
DECLARE
  _select_list text;
  _data jsonb;
BEGIN
  SELECT string_agg(format('%1$I', k), ',') INTO _select_list
  FROM unnest(_keys) k;

  EXECUTE '
    WITH
      r AS (
        SELECT ' || _select_list || '
        FROM ' || _table || '
        WHERE uuid_ = $1
      )
    SELECT to_jsonb(r)
    FROM r;
  '
  INTO _data
  USING _uuid;

  RETURN _data;
END
$_$;

CREATE OR REPLACE FUNCTION operation_.query_resource_(_id text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
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

  SELECT *  INTO _data FROM internal_.dynamic_select_(_resource_definition.table_, _resource.uuid_, _keys);

  RETURN internal_.convert_from_internal_format_(_data);
END
$_$;

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
    FROM json_populate_record(NULL::' || _table || ', $1) d
    RETURNING uuid_;
  '
  INTO _uuid
  USING _data;

  RETURN _data;
END
$_$;

CREATE OR REPLACE FUNCTION operation_.create_resource_(_resource_name text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
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

  SELECT * INTO _uuid FROM internal_.dynamic_insert_(_resource_definition.table_, _data);

  SELECT id_ INTO _id
  FROM application_.resource_
  WHERE uuid_ = _uuid;

  RETURN operation_.query_resource_(_id);
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
    FROM json_populate_record(NULL::' || _table || ', $1) d
    WHERE r.uuid_ = $2
    RETURINING uuid_;
  '
  INTO _uuid
  USING _data, _uuid;

  RETURN _uuid;
END
$_$;

CREATE OR REPLACE FUNCTION operation_.update_resource_(_id text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
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

  PERFORM internal_.dynamic_update_(_resource_definition.table_, _resource.uuid_, _data); 

  RETURN operation_.query_resource_(_id);
END
$_$;

CREATE OR REPLACE FUNCTION internal_.dynamic_delete_(_table regclass, _uuid uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
BEGIN
  EXECUTE '
    DELETE FROM ' || _table || '
    WHERE uuid_ = $1
    RETURINING uuid_;
  '
  INTO _uuid
  USING _uuid;

  RETURN _uuid;
END
$_$;

CREATE OR REPLACE FUNCTION operation_.delete_resource_(_id text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
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

  PERFORM internal_.dynamic_delete_(_resource_definition.table_, _resource.uuid_);

  RETURN _data;
END
$_$;

-- CREATE OR REPLACE FUNCTION policy_.owner_can_query_all_agency_fields_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF EXISTS (
--     SELECT 1
--     FROM security_.active_role_ r
--     JOIN application_.agency_ a ON a.subdomain_uuid_ = r.subdomain_uuid_
--     WHERE r.name_ = 'owner'
--       AND a.uuid_ = _arg.agency_uuid_
--   ) THEN
--     RETURN array_cat(_keys, '{uuid_, subdomain_uuid_, name_}');
--   ELSE
--     RETURN _keys;
--   END IF;
-- END
-- $$;

-- PERFORM security_.register_policy_('application_.agency_', 'query', 'policy_.owner_can_query_all_agency_fields_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
