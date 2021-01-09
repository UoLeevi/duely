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

CALL internal_.drop_auditing_('application_.price_');

ALTER TABLE application_.price_ ADD COLUMN stripe_price_id_ext_live_ text;
ALTER TABLE application_.price_ ADD COLUMN stripe_price_id_ext_test_ text;
ALTER TABLE application_.price_ DROP COLUMN stripe_id_ext_;

CALL internal_.setup_auditing_('application_.price_');

CALL internal_.drop_auditing_('application_.service_variant_');

ALTER TABLE application_.service_variant_ ADD COLUMN stripe_prod_id_ext_live_ text;
ALTER TABLE application_.service_variant_ ADD COLUMN stripe_prod_id_ext_test_ text;
ALTER TABLE application_.service_variant_ DROP COLUMN stripe_id_ext_;

CALL internal_.setup_auditing_('application_.service_variant_');

CREATE OR REPLACE FUNCTION policy_.agent_can_query_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, service_variant_uuid_, stripe_price_id_ext_live_, stripe_price_id_ext_test_, type_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_create_price_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{service_variant_uuid_, stripe_price_id_ext_live_, stripe_price_id_ext_test_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.agent_can_query_service_variant_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, service_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.anyone_can_query_live_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT status_ = 'live'
    FROM application_.price_
    WHERE uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, service_variant_uuid_, stripe_price_id_ext_live_, stripe_price_id_ext_test_, type_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.anyone_can_query_live_service_variant_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT status_ = 'live'
    FROM application_.service_variant_
    WHERE uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, service_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_create_service_variant_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{service_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
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
