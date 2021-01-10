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

CALL internal_.drop_auditing_('application_.agency_');
ALTER TABLE application_.agency_ ADD COLUMN livemode_ boolean NOT NULL;
CALL internal_.setup_auditing_('application_.agency_');

CREATE OR REPLACE FUNCTION policy_.anyone_can_query_basic_agency_fields_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, subdomain_uuid_, name_, livemode_}'::text[];
$$;

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
    RETURN '{uuid_, subdomain_uuid_, name_, livemode_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_stripe_account_for_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, stripe_id_ext_, livemode_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.anyone_can_query_stripe_account_for_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, agency_uuid_, stripe_id_ext_, livemode_}'::text[];
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_create_stripe_account_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, stripe_id_ext_, livemode_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_query_stripe_account_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, agency_uuid_, stripe_id_ext_, livemode_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
