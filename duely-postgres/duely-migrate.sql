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

CALL internal_.drop_auditing_('application_.resource_');
ALTER TABLE application_.resource_ DROP COLUMN search_;
ALTER TABLE application_.resource_ ADD COLUMN search_ jsonb DEFAULT '{}'::jsonb NOT NULL;

ALTER TABLE security_.resource_definition_ DROP COLUMN search_;
ALTER TABLE security_.resource_definition_ ADD COLUMN search_ text[] NOT NULL DEFAULT '{uuid_, name_}'::text[];

CREATE OR REPLACE FUNCTION internal_.resource_insert_() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource_definition security_.resource_definition_;
  _owner_resource_definition security_.resource_definition_;
  _uuid uuid;
  _owner_uuid uuid;
  _select_list text;
  _search jsonb;
  _id_len int := 6;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE table_ = format('%1$I.%2I', TG_TABLE_SCHEMA, TG_TABLE_NAME)::regclass;

  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN
    EXECUTE format('
      SELECT %1$I
      FROM _new_table;
    ',
    _owner_resource_definition.name_ || '_uuid_')
    INTO _owner_uuid;
  END IF;

  SELECT string_agg(format('%1$I', k), ',') INTO _select_list
  FROM unnest(_resource_definition.search_) k;

  EXECUTE '
    WITH
      r AS (
        SELECT ' || _select_list || '
        FROM _new_table
      )
    SELECT to_jsonb(r)
    FROM r;
  '
  INTO _search;

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
  _select_list text;
  _search jsonb;
  _id_len int := 6;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE table_ = format('%1$I.%2I', TG_TABLE_SCHEMA, TG_TABLE_NAME)::regclass;

  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN
    EXECUTE format('
      SELECT %1$I
      FROM _new_table;
    ',
    _owner_resource_definition.name_ || '_uuid_')
    INTO _owner_uuid;
  END IF;

  SELECT string_agg(format('%1$I', k), ',') INTO _select_list
  FROM unnest(_resource_definition.search_) k;

  EXECUTE '
    WITH
      r AS (
        SELECT ' || _select_list || '
        FROM _new_table
      )
    SELECT to_jsonb(r)
    FROM r;
  '
  INTO _search;

  UPDATE application_.resource_ r
  SET
    search_ = _search,
    owner_uuid_ = _owner_uuid
  FROM _new_table t
  WHERE r.uuid_ = t.uuid_;

  RETURN NULL;
END
$_$;

DROP PROCEDURE internal_.setup_resource_;
CREATE OR REPLACE PROCEDURE internal_.setup_resource_(_table regclass, _name text, _id_prefix text, _search text[] DEFAULT '{uuid_, name_}'::text[], _owner_table regclass DEFAULT NULL::regclass)
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _owner_resource_definition_uuid uuid;
  _table_name name;
  _table_schema name;
BEGIN
  SELECT c.relname, ns.nspname INTO _table_name, _table_schema
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace ns ON c.relnamespace = ns.oid
  WHERE c.oid = _table;

  SELECT uuid_ INTO _owner_resource_definition_uuid
  FROM security_.resource_definition_
  WHERE table_ = _owner_table;

  INSERT INTO security_.resource_definition_ (id_prefix_, name_, table_, owner_uuid_, search_)
  VALUES (_id_prefix, _name, _table, _owner_resource_definition_uuid, _search)
  ON CONFLICT (table_) DO UPDATE
  SET 
    id_prefix_ = _id_prefix,
    name_ = _name,
    table_ = _table,
    search_ = _search,
    owner_uuid_ = _owner_resource_definition_uuid;

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

CALL internal_.setup_resource_('security_.subdomain_', 'subdomain', 'sub', '{uuid_, name_}');
CALL internal_.setup_resource_('application_.agency_', 'agency', 'agcy', '{uuid_, name_, subdomain_uuid_}', 'security_.subdomain_');
CALL internal_.setup_resource_('application_.service_', 'service', 'svc', '{uuid_, name_, agency_uuid_}', 'application_.agency_');
CALL internal_.setup_resource_('application_.theme_', 'theme', 'theme', '{uuid_, name_, agency_uuid_}', 'application_.agency_');
CALL internal_.setup_resource_('application_.image_', 'image', 'img', '{uuid_, name_}', 'application_.agency_');
CALL internal_.setup_resource_('security_.user_', 'user', 'user', '{uuid_, name_, email_address_}');

CREATE OR REPLACE FUNCTION operation_.query_resource_all_(_resource_name text, _containing jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  _containing := internal_.convert_to_internal_format_(_containing);

  RETURN QUERY
    WITH
      a_ AS (
        SELECT r, d
        FROM application_.resource_ r
        JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
        WHERE d.name = _resource_name
          AND r.search_ @> _containing
      ),
      b_ AS (
        SELECT internal_.dynamic_select_(a_.d.table_, a_.r.uuid_, keys_) data_
        FROM a_
        CROSS JOIN security_.control_query_(a_.d, a_.r) keys_
      )
    SELECT internal_.convert_from_internal_format_(b_.data_) query_resource_all_
    FROM b_
    WHERE b.data_ @> _containing;
END
$$;

CREATE OR REPLACE FUNCTION operation_.query_resource_(_id text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
  _keys text[];
  _data jsonb;
BEGIN
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

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
