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

-- CALL internal_.setup_resource_('application_.service_', 'stripe account', 'stripe', '{uuid_, agency_uuid_}', 'application_.agency_');

CREATE OR REPLACE FUNCTION policy_.agent_can_query_service_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN array_cat(_keys, '{uuid_, agency_uuid_, name_, status_, default_variant_uuid_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.anyone_can_query_live_service_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT status_ = 'live'
    FROM application_.service_
    WHERE uuid_ = _resource.uuid_
  ) THEN
    RETURN array_cat(_keys, '{uuid_, agency_uuid_, name_, status_, default_variant_uuid_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_create_service_(_resource_definition security_.resource_definition_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN array_cat(_keys, '{agency_uuid_, name_, status_, default_variant_uuid_}');
  ELSE
    RETURN _keys;
  END IF;
END
$_$;

CREATE OR REPLACE FUNCTION policy_.owner_can_change_service_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN array_cat(_keys, '{uuid_, name_, status_, default_variant_uuid_}');
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

PERFORM security_.register_policy_('application_.service_', 'query', 'policy_.agent_can_query_service_');
PERFORM security_.register_policy_('application_.service_', 'query', 'policy_.anyone_can_query_live_service_');
PERFORM security_.register_policy_('application_.service_', 'create', 'policy_.owner_can_create_service_');
PERFORM security_.register_policy_('application_.service_', 'update', 'policy_.owner_can_change_service_');
PERFORM security_.register_policy_('application_.service_', 'delete', 'policy_.only_owner_can_delete_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
