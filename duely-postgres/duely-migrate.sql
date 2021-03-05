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

CREATE TABLE application_.integration_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ text NOT NULL,
    agency_uuid_ uuid NOT NULL REFERENCES application_.agency_ (uuid_) ON DELETE CASCADE,
    credential_uuid_ uuid REFERENCES application_.credential_ (uuid_) ON DELETE CASCADE,
    data_ jsonb NOT NULL
);
CALL internal_.setup_resource_('application_.integration_', 'integration', 'inte', '{uuid_, name_, agency_uuid_}', 'application_.agency_');

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, name_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.integration_', 'query', 'policy_.serviceaccount_can_query_integration_');

CREATE OR REPLACE FUNCTION policy_.owner_can_create_integration_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, name_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.integration_', 'create', 'policy_.owner_can_create_integration_');

CREATE OR REPLACE FUNCTION policy_.owner_can_change_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{name_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.integration_', 'update', 'policy_.owner_can_change_integration_');

CREATE OR REPLACE FUNCTION policy_.owner_can_query_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, agency_uuid_, name_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.integration_', 'query', 'policy_.owner_can_query_integration_');
PERFORM security_.register_policy_('application_.integration_', 'delete', 'policy_.only_owner_can_delete_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
