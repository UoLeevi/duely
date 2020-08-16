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

  RETURN _data || COALESCE(_owned_resources_data, '{}'::jsonb);
END
$$;

CREATE OR REPLACE FUNCTION operation_.update_resource_(_id text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
  _update_list text;
  _owned_resources_data jsonb;
BEGIN
  SELECT * INTO _resource
  FROM application_.resource_ WHERE id_ = _id;

  SELECT * INTO _resource_definition
  FROM security_.resource_definition_ WHERE uuid_ = _resource.definition_uuid_;

  SELECT owner_, owned_ INTO _data, _owned_resources_data
  FROM internal_.extract_referenced_resources_jsonb_(_resource_definition.uuid_, _data);

  _data := internal_.convert_to_internal_format_(_data);

  PERFORM security_.control_update_(_resource_definition, _resource, _data);
  PERFORM internal_.dynamic_update_(_resource_definition.table_, _resource.uuid_, _data);

  _data := operation_.query_resource_(_id);

  SELECT jsonb_object_agg(r.key, internal_.create_or_update_owned_resource_(_resource_definition.name_, _id, r.key, r.value)) INTO _owned_resources_data
  FROM jsonb_each(_owned_resources_data) r;

  RETURN _data || COALESCE(_owned_resources_data, '{}'::jsonb);
END
$$;

CREATE OR REPLACE FUNCTION internal_.create_or_update_owned_resource_(_owner_resource_name text, _owner_id text, _resource_name text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _id text;
BEGIN
  _data := _data || jsonb_build_object(_owner_resource_name || '_id', _owner_id);

  IF _data ? 'id' THEN
    _id := _data->>'id';
    _data := _data - 'id';
    _data := operation_.update_resource_(id_, _data);
  ELSE
    _data := operation_.create_resource_(_resource_name, _data);
  END IF;

  RETURN _data;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
