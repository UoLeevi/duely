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

CREATE OR REPLACE FUNCTION policy_.anyone_can_query_basic_agency_fields_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, subdomain_uuid_, name_, livemode_, default_pricing_currency_}'::text[];
$$;

CREATE FUNCTION policy_.owner_can_change_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{default_pricing_currency_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.agency_', 'update', 'policy_.owner_can_change_agency_');

CREATE OR REPLACE FUNCTION policy_.owner_can_create_agency_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_role_
    WHERE name_ = 'owner'
      AND subdomain_uuid_ = (_data->>'subdomain_uuid_')::uuid
  ) THEN
    RETURN '{uuid_, subdomain_uuid_, name_, livemode_, default_pricing_currency_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CALL internal_.drop_auditing_('application_.agency_');
ALTER TABLE application_.agency_ ADD COLUMN default_pricing_currency_ text NULL;
CALL internal_.setup_auditing_('application_.agency_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
