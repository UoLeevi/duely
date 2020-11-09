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

ALTER TABLE ONLY application_.stripe_account_
    DROP CONSTRAINT stripe_account__agency_uuid__fkey,
    ADD CONSTRAINT stripe_account__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;

ALTER TABLE ONLY application_.theme_
    DROP CONSTRAINT theme__agency_uuid__fkey,
    ADD CONSTRAINT theme__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;

-- CALL internal_.setup_resource_('application_.theme_', 'theme', 'theme', '{uuid_, agency_uuid_}', 'application_.agency_');

-- CREATE OR REPLACE FUNCTION policy_.anyone_can_query_theme_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
--     LANGUAGE sql SECURITY DEFINER
--     AS $$
--   SELECT '{uuid_, name_, agency_uuid_, image_logo_uuid_, image_hero_uuid_, color_primary_, color_secondary_, color_accent_, color_background_, color_surface_, color_error_, color_success_}'::text[];
-- $$;


-- CREATE OR REPLACE FUNCTION policy_.owner_can_create_theme_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $_$
-- BEGIN
--   IF (
--     SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
--     FROM internal_.query_owner_resource_(_resource_definition, _data)
--   ) THEN
--     RETURN '{name_, agency_uuid_, image_logo_uuid_, image_hero_uuid_, color_primary_, color_secondary_, color_accent_, color_background_, color_surface_, color_error_, color_success_}'::text[];
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $_$;

-- CREATE OR REPLACE FUNCTION policy_.owner_can_change_theme_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
--     RETURN '{name_, image_logo_uuid_, image_hero_uuid_, color_primary_, color_secondary_, color_accent_, color_background_, color_surface_, color_error_, color_success_}'::text[];
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $$;

-- PERFORM security_.register_policy_('application_.theme_', 'query', 'policy_.can_query_theme_based_on_access_level_');
-- PERFORM security_.register_policy_('application_.image_', 'query', 'policy_.can_query_image_based_on_access_level_');
-- PERFORM security_.register_policy_('application_.theme_', 'query', 'policy_.anyone_can_query_theme_');
-- PERFORM security_.register_policy_('application_.theme_', 'create', 'policy_.owner_can_create_theme_');
-- PERFORM security_.register_policy_('application_.theme_', 'update', 'policy_.owner_can_change_theme_');
-- PERFORM security_.register_policy_('application_.theme_', 'delete', 'policy_.only_owner_can_delete_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
