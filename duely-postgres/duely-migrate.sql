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

CREATE OR REPLACE FUNCTION security_.implement_policy_allow_(_operation_name text, _policy_name text, _policy_function_body text DEFAULT NULL::text) RETURNS security_.policy_assignment_
    LANGUAGE plpgsql
    AS $_X$
DECLARE
  _policy_assignment security_.policy_assignment_;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = _operation_name
      AND n.nspname = 'operation_'
  ) THEN
    RAISE 'Operation does not exist.' USING ERRCODE = '20000';
  END IF;

  IF _policy_function_body IS NOT NULL THEN
    EXECUTE format($__$

      CREATE FUNCTION policy_.%1$I(_arg anyelement DEFAULT NULL::text) RETURNS boolean
        LANGUAGE plpgsql SECURITY DEFINER
        AS $$ %2$s $$;

      ALTER FUNCTION policy_.%1$I(_arg anyelement) OWNER TO postgres;

      $__$,
      _policy_name, _policy_function_body);
  END IF;

  PERFORM format('policy_.%1$I', _policy_name)::regproc;

  INSERT INTO security_.policy_assignment_ (policy_name_, operation_uuid_, type_)
  SELECT _policy_name, o.uuid_, 'allow'
  FROM security_.operation_ o
  WHERE o.name_ = _operation_name
  ON CONFLICT (policy_name_, operation_uuid_) DO UPDATE
  SET
    type_ = 'allow';

  SELECT p.* INTO _policy_assignment
    FROM security_.policy_assignment_ p
    JOIN security_.operation_ o ON o.uuid_ = p.operation_uuid_
    WHERE p.policy_name_ = _policy_name
      AND o.name_ = _operation_name;

  RETURN _policy_assignment;
END
$_X$;


CREATE OR REPLACE FUNCTION security_.implement_policy_deny_(_operation_name text, _policy_name text, _policy_function_body text DEFAULT NULL::text) RETURNS security_.policy_assignment_
    LANGUAGE plpgsql
    AS $_X$
DECLARE
  _policy_assignment security_.policy_assignment_;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = _operation_name
      AND n.nspname = 'operation_'
  ) THEN
    RAISE 'Operation does not exist.' USING ERRCODE = '20000';
  END IF;

  IF _policy_function_body IS NOT NULL THEN
    EXECUTE format($__$

      CREATE FUNCTION policy_.%1$I(_arg anyelement DEFAULT NULL::text) RETURNS boolean
        LANGUAGE plpgsql SECURITY DEFINER
        AS $$ %2$s $$;

      ALTER FUNCTION policy_.%1$I(_arg anyelement) OWNER TO postgres;

      $__$,
      _policy_name, _policy_function_body, _policy_function_arg_name, _policy_function_arg_type, _policy_function_arg_default);
  END IF;

  PERFORM format('policy_.%1$I', _policy_name)::regproc;

  INSERT INTO security_.policy_assignment_ (policy_name_, operation_uuid_, type_)
  SELECT _policy_name, o.uuid_, 'deny'
  FROM security_.operation_ o
  WHERE o.name_ = _operation_name
  ON CONFLICT (policy_name_, operation_uuid_) DO UPDATE
  SET
    type_ = 'deny';

  SELECT p.* INTO _policy_assignment
    FROM security_.policy_assignment_ p
    JOIN security_.operation_ o ON o.uuid_ = p.operation_uuid_
    WHERE p.policy_name_ = _policy_name
      AND o.name_ = _operation_name;

  RETURN _policy_assignment;
END
$_X$;

CREATE SCHEMA resource_;

CREATE TABLE application_.resource_ (
    uuid_ uuid PRIMARY KEY,
    id_ text NOT NULL UNIQUE,
    table_ regclass NOT NULL,
    query_ regproc NOT NULL
);

CREATE PROCEDURE internal_.setup_resource_(_table regclass, _query regproc, _prefix text)
    LANGUAGE plpgsql
    AS $_X$
DECLARE
  _table_name name;
  _table_schema name;
BEGIN
  SELECT c.relname, ns.nspname INTO _table_name, _table_schema
  FROM pg_catalog.pg_class AS c
  JOIN pg_catalog.pg_namespace AS ns ON c.relnamespace = ns.oid
  WHERE c.oid = _table;

  EXECUTE format($__$
    CREATE FUNCTION resource_.%2$I() RETURNS trigger
      LANGUAGE plpgsql SECURITY DEFINER
      AS $$
    DECLARE
      _id_len int := 6;
    BEGIN
      LOOP
        BEGIN
          INSERT INTO application_.resource_ (uuid_, table_, query_, id_)
          SELECT t.uuid_, %3$L::regclass, %4$L::regproc, %5$L || '_' || substring(replace(t.uuid_::text, '-', '' ) FOR _id_len)
          FROM _new_table t;
          EXIT;
        EXCEPTION WHEN unique_violation THEN
          _id_len := _id_len + 2;
        END;
      END LOOP;
      RETURN NULL;
    END;
    $$;

    ALTER FUNCTION resource_.%2$I() OWNER TO postgres;
    CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON %1$I.%2$I REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION resource_.%2$I();
  $__$,
  _table_schema, _table_name, _table, _query, _prefix);
END
$_X$;

CREATE PROCEDURE internal_.drop_resource_(_table regclass)
    LANGUAGE plpgsql
    AS $_X$
DECLARE
  _table_name name;
  _table_schema name;
BEGIN
  SELECT c.relname, ns.nspname INTO _table_name, _table_schema
  FROM pg_catalog.pg_class AS c
  JOIN pg_catalog.pg_namespace AS ns ON c.relnamespace = ns.oid
  WHERE c.oid = _table;

  EXECUTE format($__$
    DROP TRIGGER tr_after_insert_resource_insert_ ON %1$I.%2$I;
    DROP FUNCTION resource_.%2$I();
  $__$,
  _table_schema, _table_name);
END
$_X$;

CREATE FUNCTION operation_.query_resource_(_resource_uuid uuid) RETURNS application_.resource_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $__$
DECLARE
  _resource application_.resource_;
BEGIN
  SELECT * INTO _resource
  WHERE uuid_ = _resource_uuid;

  PERFORM security_.control_operation_('query_resource_', _resource);

  RETURN resource_;
END
$__$;

CREATE FUNCTION operation_.query_resource_(_resource_id text) RETURNS application_.resource_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $__$
DECLARE
  _resource application_.resource_;
BEGIN
  SELECT * INTO _resource
  WHERE id_ = _resource_id;

  PERFORM security_.control_operation_('query_resource_', _resource);

  RETURN resource_;
END
$__$;

INSERT INTO security_.operation_(name_, log_events_) VALUES ('query_resource_', 'f');

PERFORM security_.implement_policy_allow_('query_resource_', 'logged_in_');
PERFORM security_.implement_policy_allow_('query_resource_', 'visitor_');


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
