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
CALL internal_.drop_auditing_('security_.resource_definition_');
ALTER TABLE security_.resource_definition_ ADD upsert_keys_ text[];
CALL internal_.setup_auditing_('security_.resource_definition_');

ALTER TABLE security_.resource_definition_
ADD CHECK (upsert_keys_ IS NULL OR upsert_keys_ <> '{}'::text[] AND search_ @> upsert_keys_);

CREATE FUNCTION operation_.upsert_resource_(_resource_name text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
  _resource application_.resource_;
  _uuid uuid;
  _id text;
  _owned_resources_data jsonb;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_ WHERE name_ = _resource_name;

  IF _resource_definition.upsert_keys_ IS NULL THEN
    RAISE 'Upsert is not supported for this resource.' USING ERRCODE = 'DUPSE';
  END IF;

  _data := jsonb_strip_nulls(_data);

  SELECT owner_, owned_ INTO _data, _owned_resources_data
  FROM internal_.extract_referenced_resources_jsonb_(_resource_definition.uuid_, _data);

  _data := internal_.convert_to_internal_format_(_data);

  WITH
    _keys as (
      SELECT jsonb_object_agg(k, _data->k) data_
      FROM unnest(_resource_definition.upsert_keys_) k
    )
  SELECT r INTO _resource
  FROM application_.resource_ r
  WHERE r.definition_uuid_ = _resource_definition.uuid_
    AND r.search_ @> _keys.data_;

  IF _resource.uuid_ IS NULL THEN
    PERFORM security_.control_create_(_resource_definition, _data);

    _uuid := internal_.dynamic_insert_(_resource_definition.table_, _data);

    SELECT id_ INTO _id FROM application_.resource_ WHERE uuid_ = _uuid;
  ELSE
    _data = _data - _resource_definition.upsert_keys_;

    PERFORM security_.control_update_(_resource_definition, _resource, _data);
    PERFORM internal_.dynamic_update_(_resource_definition.table_, _resource.uuid_, _data);
  END IF;

  _data := operation_.query_resource_(_id);

  SELECT jsonb_object_agg(r.key, internal_.create_or_update_owned_resource_(_resource_definition.table_, _id, r.key, r.value)) INTO _owned_resources_data
  FROM jsonb_each(_owned_resources_data) r;

  RETURN _data || COALESCE(_owned_resources_data, '{}'::jsonb);
END
$$;

CREATE OR REPLACE FUNCTION operation_.create_resource_(_resource_name text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
  _uuid uuid;
  _id text;
  _owned_resources_data jsonb;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_ WHERE name_ = _resource_name;

  _data := jsonb_strip_nulls(_data);

  SELECT owner_, owned_ INTO _data, _owned_resources_data
  FROM internal_.extract_referenced_resources_jsonb_(_resource_definition.uuid_, _data);

  _data := internal_.convert_to_internal_format_(_data);

  PERFORM security_.control_create_(_resource_definition, _data);

  _uuid := internal_.dynamic_insert_(_resource_definition.table_, _data);

  SELECT id_ INTO _id FROM application_.resource_ WHERE uuid_ = _uuid;

  _data := operation_.query_resource_(_id);

  SELECT jsonb_object_agg(r.key, internal_.create_or_update_owned_resource_(_resource_definition.table_, _id, r.key, r.value)) INTO _owned_resources_data
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

  SELECT jsonb_object_agg(r.key, internal_.create_or_update_owned_resource_(_resource_definition.table_, _id, r.key, r.value)) INTO _owned_resources_data
  FROM jsonb_each(_owned_resources_data) r;

  RETURN _data || COALESCE(_owned_resources_data, '{}'::jsonb);
END
$$;

CREATE OR REPLACE FUNCTION internal_.resource_insert_(_resource_definition security_.resource_definition_, _record jsonb) RETURNS application_.resource_
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource application_.resource_;
  _owner_resource_definition security_.resource_definition_;
  _owner_resource_table_name name;
  _uuid uuid;
  _owner_uuid uuid;
  _select_list text;
  _search jsonb DEFAULT '{}'::jsonb;
  _id_len int := 6;
BEGIN
  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN
    SELECT c.relname INTO _owner_resource_table_name
    FROM pg_catalog.pg_class AS c
    WHERE c.oid = _owner_resource_definition.table_;

    EXECUTE format('
      SELECT ($1->>%1$L)::uuid;
    ',
    _owner_resource_table_name || 'uuid_')
    INTO _owner_uuid
    USING _record;
  END IF;

  IF _resource_definition.search_ <> '{}'::text[] THEN
    SELECT string_agg(format('
      $1->%1$L %1$I
    ', k), ',') INTO _select_list
    FROM unnest(_resource_definition.search_) k;

    EXECUTE '
      WITH
        r AS (
          SELECT ' || _select_list || '
        )
      SELECT to_jsonb(r)
      FROM r;
    '
    INTO _search
    USING _record;
  END IF;

  LOOP
    BEGIN
      INSERT INTO application_.resource_ (uuid_, search_, owner_uuid_, definition_uuid_, id_)
      SELECT (_record->>'uuid_')::uuid, _search, _owner_uuid, _resource_definition.uuid_, _resource_definition.id_prefix_ || '_' || substring(replace(_record->>'uuid_', '-', '' ) FOR _id_len)
      RETURNING * INTO _resource;
      EXIT;
    EXCEPTION WHEN unique_violation THEN
      _id_len := _id_len + 2;
    END;
  END LOOP;

  RETURN _resource;
END
$_$;

CREATE OR REPLACE FUNCTION internal_.resource_update_(_resource_definition security_.resource_definition_, _record jsonb) RETURNS application_.resource_
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource application_.resource_;
  _owner_resource_definition security_.resource_definition_;
  _owner_resource_table_name name;
  _uuid uuid;
  _owner_uuid uuid;
  _select_list text;
  _search jsonb DEFAULT '{}'::jsonb;
BEGIN
  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN

    SELECT c.relname INTO _owner_resource_table_name
    FROM pg_catalog.pg_class AS c
    WHERE c.oid = _owner_resource_definition.table_;

    EXECUTE format('
      SELECT ($1->>%1$L)::uuid;
    ',
    _owner_resource_table_name || 'uuid_')
    INTO _owner_uuid
    USING _record;
  END IF;

  IF _resource_definition.search_ <> '{}'::text[] THEN
    SELECT string_agg(format('
      $1->%1$L %1$I
    ', k), ',') INTO _select_list
    FROM unnest(_resource_definition.search_) k;

    EXECUTE '
      WITH
        r AS (
          SELECT ' || _select_list || '
        )
      SELECT to_jsonb(r)
      FROM r;
    '
    INTO _search
    USING _record;
  END IF;

  UPDATE application_.resource_ r
  SET
    search_ = _search,
    owner_uuid_ = _owner_uuid
  WHERE r.uuid_ = (_record->>'uuid_')::uuid
  RETURNING * INTO _resource;

  RETURN _resource;
END
$_$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
