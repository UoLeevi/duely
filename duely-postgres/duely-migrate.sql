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

ALTER TABLE ONLY application_.service_
    DROP CONSTRAINT service__default_variant_uuid__fkey,
    ADD CONSTRAINT service__default_variant_uuid__fkey FOREIGN KEY (default_variant_uuid_) REFERENCES application_.service_variant_(uuid_) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY application_.service_variant_
    DROP CONSTRAINT service_variant__default_price_uuid__fkey,
    ADD CONSTRAINT service_variant__default_price_uuid__fkey FOREIGN KEY (default_price_uuid_) REFERENCES application_.price_(uuid_) ON DELETE SET NULL;

ALTER TABLE ONLY application_.service_variant_
    DROP CONSTRAINT service_variant__service_uuid__fkey,
    ADD CONSTRAINT service_variant__service_uuid__fkey FOREIGN KEY (service_uuid_) REFERENCES application_.service_(uuid_) ON DELETE CASCADE;


-- CREATE OR REPLACE FUNCTION policy_.agent_can_query_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
--     RETURN '{uuid_, service_variant_uuid_, stripe_id_ext_, type_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $$;

-- CREATE OR REPLACE FUNCTION policy_.anyone_can_query_live_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF (
--     SELECT status_ = 'live'
--     FROM application_.price_
--     WHERE uuid_ = _resource.uuid_
--   ) THEN
--     RETURN '{uuid_, service_variant_uuid_, stripe_id_ext_, type_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $$;

-- CREATE OR REPLACE FUNCTION policy_.owner_can_change_price_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
--     RETURN '{unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $$;

-- CREATE OR REPLACE FUNCTION policy_.owner_can_create_price_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF (
--     SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
--     FROM internal_.query_owner_resource_(_resource_definition, _data)
--   ) THEN
--     RETURN '{service_variant_uuid_, stripe_id_ext_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $$;


-- PERFORM security_.register_policy_('application_.price_', 'query', 'policy_.agent_can_query_price_');
-- PERFORM security_.register_policy_('application_.price_', 'query', 'policy_.anyone_can_query_live_price_');
-- PERFORM security_.register_policy_('application_.price_', 'create', 'policy_.owner_can_create_price_');
-- PERFORM security_.register_policy_('application_.price_', 'update', 'policy_.owner_can_change_price_');
-- PERFORM security_.register_policy_('application_.price_', 'delete', 'policy_.only_owner_can_delete_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
