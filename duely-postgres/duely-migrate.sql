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


CREATE TYPE operation_type_ AS ENUM ('query', 'create', 'update', 'delete');

CREATE TABLE security_.policy_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() PRIMARY KEY,
    resource_definition_uuid_ uuid REFERENCES security_.resource_definition_ (uuid_) NOT NULL,
    function_ regprocedure NOT NULL,
    operation_type_ operation_type_ NOT NULL,
    after_uuid_ uuid REFERENCES security_.policy_ (uuid_),
    UNIQUE (function_, resource_definition_uuid_, operation_type_),
    UNIQUE (after_uuid_, resource_definition_uuid_, operation_type_) DEFERRABLE INITIALLY DEFERRED
);

CREATE OR REPLACE FUNCTION policy_.owner_can_query_all_agency_fields_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_role_ r
    JOIN application_.agency_ a ON a.subdomain_uuid_ = r.subdomain_uuid_
    WHERE r.name_ = 'owner'
      AND a.uuid_ = _arg.agency_uuid_
  ) THEN
    RETURN array_cat(_keys, '{uuid_, subdomain_uuid_, name_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;


CREATE FUNCTION security_.register_policy_(_table regclass, _operation_type operation_type_, _policy_function regproc, _after_policy_function regproc DEFAULT NULL) RETURNS security_.policy_
  LANGUAGE plpgsql
  AS $__$
DECLARE
  _policy security_.policy_;
  _function regprocedure;
  _after_uuid uuid;
  _before_uuid uuid;
BEGIN
  SELECT CASE _operation_type
    WHEN 'query' THEN (_policy_function || '(security_.resource_definition_, application_.resource_, text[])')::regprocedure
    WHEN 'create' THEN (_policy_function || '(security_.resource_definition_, jsonb, text[])')::regprocedure
    WHEN 'update' THEN (_policy_function || '(security_.resource_definition_, application_.resource_, jsonb, text[])')::regprocedure
    WHEN 'delete' THEN (_policy_function || '(security_.resource_definition_, application_.resource_)')::regprocedure
  END INTO _function;

  IF _after_policy_function IS NOT NULL THEN
    SELECT uuid_ INTO _after_uuid
    FROM security_.policy_
    WHERE CASE _operation_type
      WHEN 'query' THEN (_policy_function || '(security_.resource_definition_, application_.resource_, text[])')::regprocedure
      WHEN 'create' THEN (_policy_function || '(security_.resource_definition_, jsonb, text[])')::regprocedure
      WHEN 'update' THEN (_policy_function || '(security_.resource_definition_, application_.resource_, jsonb, text[])')::regprocedure
      WHEN 'delete' THEN (_policy_function || '(security_.resource_definition_, application_.resource_)')::regprocedure
    END = function_;

    IF _after_uuid IS NULL THEN
      RAISE 'Previous policy was not found.' USING ERRCODE = '20000';
    END IF;
  END IF;

  SELECT uuid_ INTO _before_uuid
  FROM security_.policy_
  WHERE after_uuid_ IS NOT DISTINCT FROM _after_uuid;

  INSERT INTO security_.policy_ (function_, after_uuid_, resource_definition_uuid_, operation_type_)
  SELECT _function, _after_uuid, d.uuid_, _operation_type
  FROM security_.resource_definition_ d
  WHERE d.table_ = _table
  RETURNING * INTO _policy;

  IF _before_uuid IS NOT NULL THEN
    UPDATE security_.policy_
    SET after_uuid_ = policy_.uuid_
    WHERE uuid_ = _before_uuid;
  END IF;

  RETURN _policy;
END
$__$;

CREATE TABLE security_.event_log_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() PRIMARY KEY,
    operation_type_ operation_type_ NOT NULL,
    resource_definition_uuid_ uuid,
    resource_uuid_ uuid,
    data_ jsonb,
    session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL,
    event_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

PERFORM security_.register_policy_('application_.agency_', 'query', 'policy_.owner_can_query_all_agency_fields_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
