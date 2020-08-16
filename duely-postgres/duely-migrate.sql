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

CREATE OR REPLACE FUNCTION internal_.dynamic_delete_(_table regclass, _uuid uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
BEGIN
  EXECUTE '
    DELETE FROM ' || _table || '
    WHERE uuid_ = $1
    RETURNING uuid_;
  '
  INTO _uuid
  USING _uuid;

  RETURN _uuid;
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

  UPDATE application_.resource_ r
  SET
    search_ = _search,
    owner_uuid_ = _owner_uuid
  FROM _new_table t
  WHERE r.uuid_ = t.uuid_;

  RETURN NULL;
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
    RETURNING r.uuid_;
  '
  INTO _uuid
  USING _data, _uuid;

  RETURN _uuid;
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
    RAISE 'Unauthorized. No access policies defined.' USING ERRCODE = '42501';
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

CREATE OR REPLACE FUNCTION internal_.check_resource_role_(_resource_definition security_.resource_definition_, _resource application_.resource_, _role_name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER STABLE
    AS $$
BEGIN
  IF _resource_definition.name_ = 'subdomain' THEN
    RETURN EXISTS (
      SELECT 1
      FROM security_.active_role_ r
      JOIN security_.subdomain_ d ON d.uuid_ = _resource.uuid_ AND r.subdomain_uuid_ = d.uuid_
      WHERE r.name_ = _role_name
    );
  ELSEIF _resource.owner_uuid_ IS NOT NULL THEN
    RETURN (
      SELECT internal_.check_resource_role_(d, r, _role_name)
      FROM application_.resource_ r
      JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
      WHERE r.uuid_ = _resource.owner_uuid_
    );
  ELSE
    RETURN 'f';
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_change_name_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN array_cat(_keys, '{name_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.only_owner_can_delete_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF NOT internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;
END
$$;

PERFORM security_.register_policy_('security_.subdomain_', 'update', 'policy_.owner_can_change_name_');
PERFORM security_.register_policy_('security_.subdomain_', 'delete', 'policy_.only_owner_can_delete_');
PERFORM security_.register_policy_('application_.agency_', 'update', 'policy_.owner_can_change_name_');
PERFORM security_.register_policy_('application_.agency_', 'delete', 'policy_.only_owner_can_delete_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
