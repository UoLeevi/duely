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

CREATE OR REPLACE FUNCTION internal_.extract_referenced_resources_jsonb_(_resource_definition_uuid uuid, _data jsonb) RETURNS TABLE (owner_ jsonb, owned_ jsonb)
    LANGUAGE sql SECURITY DEFINER STABLE
    AS
$_$
  -- NOTE: This function expects input in external format (i.e. before internal_.convert_from_internal_format_)
  WITH
    _owned AS (
      SELECT jsonb_object_agg(r.key, r.value) data_
      FROM jsonb_each(_data) r
      JOIN security_.resource_definition_ d ON r.key = d.name_
      WHERE d.owner_uuid_ = _resource_definition_uuid
    )
  SELECT _data - ARRAY(SELECT jsonb_object_keys(_owned.data_)) owner_, _owned.data_ owned_
  FROM _owned;
$_$;

CREATE OR REPLACE FUNCTION internal_.create_or_update_owned_resource_(_owner_resource_name text, _owner_id text, _resource_name text, _id text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
BEGIN
  _data := _data || jsonb_build_object(_owner_resource_name || '_id', _owner_id);

  IF _id IS NULL THEN
    _data := operation_.create_resource_(_resource_name, _data);
  ELSE
    _data := _data - 'id';
    _data := operation_.update_resource_(_resource.id_, _data);
  END IF;

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
$_$;

CREATE OR REPLACE FUNCTION operation_.update_resource_(_id text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
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

  RETURN _data || _owned_resources_data;
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
  FROM application_.resource_ WHERE id_ = _id;

  SELECT * INTO _resource_definition
  FROM security_.resource_definition_ WHERE uuid_ = _resource.definition_uuid_;

  PERFORM security_.control_delete_(_resource_definition, _resource);

  _data := operation_.query_resource_(_id);

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
