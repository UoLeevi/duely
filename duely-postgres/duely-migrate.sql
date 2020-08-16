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

CREATE OR REPLACE FUNCTION internal_.query_owner_resource_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS TABLE (resource_definition_ security_.resource_definition_, resource_ application_.resource_)
    LANGUAGE plpgsql SECURITY DEFINER STABLE
    AS $_$
DECLARE
  _owner_resource_definition security_.resource_definition_;
  _owner_resource application_.resource_;
BEGIN
  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  EXECUTE format($$
    SELECT *
    FROM application_.resource_
    WHERE uuid_ = ($1->>'%1$I')::uuid
  $$,
  _owner_resource_definition.name_ || '_uuid_')
  INTO _owner_resource
  USING _data;

  RETURN QUERY
    SELECT _owner_resource_definition resource_definition_, _owner_resource resource_;
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

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN
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

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN
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

CALL internal_.setup_resource_('application_.theme_', 'theme', 'theme', 'application_.agency_');

CREATE OR REPLACE FUNCTION policy_.logged_in_user_can_query_theme_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_
    WHERE type_ = 'user'
  ) THEN
    RETURN array_cat(_keys, '{uuid_, name_, image_logo_uuid_, image_hero_uuid_, color_primary_, color_secondary_, color_accent_, color_background_, color_surface_, color_error_, color_success_, agency_uuid_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_create_theme_(_resource_definition security_.resource_definition_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)  
  ) THEN
    RETURN array_cat(_keys, '{name_, image_logo_uuid_, image_hero_uuid_, color_primary_, color_secondary_, color_accent_, color_background_, color_surface_, color_error_, color_success_, agency_uuid_}');
  ELSE
    RETURN _keys;
  END IF;
END
$_$;

CREATE OR REPLACE FUNCTION policy_.owner_can_change_theme_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN array_cat(_keys, '{image_logo_uuid_, image_hero_uuid_, color_primary_, color_secondary_, color_accent_, color_background_, color_surface_, color_error_, color_success_}');
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

PERFORM security_.register_policy_('application_.theme_', 'query', 'policy_.logged_in_user_can_query_theme_');
PERFORM security_.register_policy_('application_.theme_', 'create', 'policy_.owner_can_create_theme_');
PERFORM security_.register_policy_('application_.theme_', 'update', 'policy_.owner_can_change_theme_');
PERFORM security_.register_policy_('application_.theme_', 'delete', 'policy_.only_owner_can_delete_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
