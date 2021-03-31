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

CREATE TABLE internal_.integration_type_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    form_uuid_ uuid REFERENCES internal_.form_ (uuid_) ON DELETE CASCADE,
    name_ text NULL UNIQUE
);
CALL internal_.setup_resource_('internal_.integration_type_', 'integration type', 'intetype', '{uuid_, form_uuid_, name_}');

CREATE FUNCTION policy_.anyone_can_query_integration_type_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, form_uuid_, name_}'::text[];
$$;

PERFORM security_.register_policy_('internal_.integration_type_', 'query', 'policy_.anyone_can_query_integration_type_');

PERFORM security_.register_policy_('internal_.integration_type_', 'delete', 'policy_.delete_forbidden_');

CREATE OR REPLACE FUNCTION policy_.owner_can_change_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


CREATE OR REPLACE FUNCTION policy_.owner_can_create_integration_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;



CREATE OR REPLACE FUNCTION policy_.owner_can_query_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, agency_uuid_, integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

ALTER TABLE application_.integration_ DROP COLUMN name_;
ALTER TABLE application_.integration_ ADD COLUMN integration_type_uuid_ uuid NOT NULL REFERENCES internal_.integration_type_ (uuid_);



-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
