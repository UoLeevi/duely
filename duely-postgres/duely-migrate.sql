-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'Running migration...'
\set QUIET true

DO 
LANGUAGE plpgsql
$_$
DECLARE

BEGIN
-- MIGRATION CODE START

DROP SCHEMA resource_ CASCADE;
DROP TABLE application_.resource_ CASCADE;

-- TODO: explain all the conventions used
CREATE TABLE security_.resource_definition_ (
    uuid_ uuid PRIMARY KEY,
    id_prefix_ text NOT NULL UNIQUE,
    name_ text NOT NULL UNIQUE,
    table_ regclass NOT NULL UNIQUE,
    owner_uuid_ uuid REFERENCES security_.resource_definition_ (uuid_),
    query_ regprocedure,
    create_ regprocedure,
    update_ regprocedure,
    delete_ regprocedure,
    search_ regprocedure
);

CREATE FUNCTION operation_.query_resource_definition_(_resource_definition_uuid uuid) RETURNS security_.resource_definition_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $__$
DECLARE
  _resource_definition security_.resource_definition_;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition_uuid;

  PERFORM security_.control_operation_('query_resource_definition_', _resource_definition);

  RETURN _resource_definition;
END
$__$;

CREATE TABLE application_.resource_ (
    uuid_ uuid PRIMARY KEY,
    id_ text NOT NULL UNIQUE,
    search_ text,
    owner_uuid_ uuid REFERENCES application_.resource_ (uuid_),
    definition_uuid_ uuid NOT NULL REFERENCES security_.resource_definition_ (uuid_)
);

CALL internal_.setup_auditing_('application_.resource_');

CREATE FUNCTION operation_.query_resource_(_resource_id text) RETURNS application_.resource_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource application_.resource_;
BEGIN
  SELECT * INTO _resource
  WHERE id_ = _resource_id;

  PERFORM security_.control_operation_('query_resource_', _resource);

  RETURN resource_;
END
$$;

CREATE FUNCTION internal_.resource_delete_() RETURNS trigger
    LANGUAGE plpgsql
    AS $__$
BEGIN
  DELETE FROM application_.resource_ r
  USING _old_table t
  WHERE r.uuid_ = t.uuid_;

  RETURN NULL;
END
$__$;

CREATE FUNCTION internal_.resource_insert_() RETURNS trigger
    LANGUAGE plpgsql
    AS $__$
DECLARE
  _resource_definition security_.resource_definition_;
  _owner_resource_definition security_.resource_definition_;
  _owner_table_name name;
  _uuid uuid;
  _owner_uuid uuid;
  _search text;
  _id_len int := 6;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = TG_TABLE_NAME;

  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.uuid_;

  SELECT c.relname INTO _owner_table_name
  FROM pg_catalog.pg_class c
  WHERE c.oid = _owner_resource_definition.table_;

  EXECUTE format($$
    SELECT uuid_, %1$I owner_uuid_
    FROM _new_table
  $$,
  _owner_table_name || 'uuid_')
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

  LOOP
    BEGIN
      INSERT INTO application_.resource_ (uuid_, search_, owner_uuid_, definition_uuid_, id_)
      SELECT _uuid, _search, _owner_uuid, _resource_definition.uuid_, _resource_definition.id_prefix_ || '_' || substring(replace(_uuid::text, '-', '' ) FOR _id_len);
      EXIT;
    EXCEPTION WHEN unique_violation THEN
      _id_len := _id_len + 2;
    END;
  END LOOP;

  RETURN NULL;
END
$__$;

CREATE FUNCTION internal_.resource_update_() RETURNS trigger
    LANGUAGE plpgsql
    AS $__$
DECLARE
  _resource_definition security_.resource_definition_;
  _owner_resource_definition security_.resource_definition_;
  _owner_table_name name;
  _uuid uuid;
  _owner_uuid uuid;
  _search text;
  _id_len int := 6;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = TG_TABLE_NAME;

  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.uuid_;

  SELECT c.relname INTO _owner_table_name
  FROM pg_catalog.pg_class c
  WHERE c.oid = _owner_resource_definition.table_;

  EXECUTE format($$
    SELECT uuid_, %1$I owner_uuid_
    FROM _new_table
  $$,
  _owner_table_name || 'uuid_')
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
  FROM security_.resource_
  WHERE uuid_ = _uuid;

  RETURN NULL;
END
$__$;

DROP PROCEDURE internal_.setup_resource_(regclass, regproc, text);

CREATE PROCEDURE internal_.setup_resource_(_name text, _id_prefix text, _table regclass)
    LANGUAGE plpgsql
    AS $_X$
DECLARE
  _resource_definition security_.resource_definition_;
  _table_name name;
  _table_schema name;
  _query regprocedure;
  _create regprocedure;
  _update regprocedure;
  _delete regprocedure;
  _search regprocedure;
BEGIN
  SELECT c.relname, ns.nspname INTO _table_name, _table_schema
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace ns ON c.relnamespace = ns.oid
  WHERE c.oid = _table;

  BEGIN
    SELECT format('operation_.%1$I(uuid)', 'query_' || _table_name)::regprocedure INTO _query;
  EXCEPTION
    WHEN OTHERS THEN
      -- NOT EXIST
      NULL;
  END;

  BEGIN
    SELECT format('operation_.%1$I(json)', 'create_' || _table_name)::regprocedure INTO _create;
  EXCEPTION
    WHEN OTHERS THEN
      -- NOT EXIST
      NULL;
  END;

  BEGIN
    SELECT format('operation_.%1$I(uuid, json)', 'update_' || _table_name)::regprocedure INTO _update;
  EXCEPTION
    WHEN OTHERS THEN
      -- NOT EXIST
      NULL;
  END;

  BEGIN
    SELECT format('operation_.%1$I(uuid)', 'delete_' || _table_name)::regprocedure INTO _delete;
  EXCEPTION
    WHEN OTHERS THEN
      -- NOT EXIST
      NULL;
  END;

  BEGIN
    SELECT format('operation_.%1$I(uuid)', 'search_' || _table_name)::regprocedure INTO _search;
  EXCEPTION
    WHEN OTHERS THEN
      -- NOT EXIST
      NULL;
  END;

  INSERT INTO security_.resource_definition_ (id_prefix_, name_, table_, query_, create_, update_, delete_, search_)
  VALUES (_id_prefix, _name, _table, _query, _create, _update, _delete, _search)
  ON CONFLICT (table_) DO UPDATE
  SET 
    id_prefix_ = _id_prefix,
    name_ = _name,
    table_ = _table,
    query_ = _query,
    create_ = _create,
    update_ = _update,
    delete_ = _delete,
    search_ = _search
  RETURNING * INTO _resource_definition;

  EXECUTE '
    DROP TRIGGER IF EXISTS tr_after_insert_resource_insert_ ON ' || _table || ';
    CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON ' || _table || ' REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert();
    DROP TRIGGER IF EXISTS tr_after_insert_resource_insert_ ON ' || _table || ';
    CREATE TRIGGER tr_after_insert_resource_insert_ AFTER UPDATE ON ' || _table || ' REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update();
    DROP TRIGGER IF EXISTS tr_after_delete_resource_delete_ ON ' || _table || ';
    CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON ' || _table || ' REFERENCING NEW TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete();
  ';
END
$_X$;

CREATE OR REPLACE PROCEDURE internal_.drop_resource_(_table regclass)
    LANGUAGE plpgsql
    AS $_X$
DECLARE
  _table_name name;
  _table_schema name;
BEGIN
  DELETE FROM security_.resource_definition_
  WHERE table_ = _table;

  EXECUTE '
    DROP TRIGGER tr_after_insert_resource_insert_ ON ' || _table || ';
    DROP TRIGGER tr_after_insert_resource_insert_ ON ' || _table || ';
    DROP TRIGGER tr_after_delete_resource_delete_ ON ' || _table || ';
  ';
END
$_X$;


INSERT INTO security_.operation_(name_, log_events_) VALUES ('query_resource_definition_', 'f');

PERFORM security_.implement_policy_allow_('query_resource_definition_', 'logged_in_');
PERFORM security_.implement_policy_allow_('query_resource_definition_', 'visitor_');


-- CREATE FUNCTION operation_.update_resource_(_uuid uuid, _values json) RETURNS anyelement
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- DECLARE
--   _arg RECORD;
-- BEGIN
--   SELECT _service_uuid service_uuid_, s.agency_uuid_, s.status_ service_status_ INTO _arg
--   FROM application_.service_ s
--   WHERE s.uuid_ = _service_uuid;
--   PERFORM security_.control_operation_('update_resource_', _arg);

--   RETURN QUERY
--   SELECT s.uuid_, s.name_, s.agency_uuid_, s.status_, s.default_variant_uuid_, v.name_ default_variant_uuid_, v.description_, v.duration_, v.price_, v.currency_, v.image_logo_uuid_, v.image_hero_uuid_
--   FROM application_.service_ s
--   LEFT JOIN application_.service_variant_ v ON s.default_variant_uuid_ = v.uuid_
--   WHERE s.uuid_ = _service_uuid;

-- END
-- $$;

-- INSERT INTO security_.operation_(name_, log_events_) VALUES ('query_service_variant_by_service_', 'f');

-- PERFORM security_.implement_policy_allow_('query_service_variant_', 'agent_in_agency_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
