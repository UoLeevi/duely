-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'MIGRATION STARTED'
\set QUIET true

DO 
LANGUAGE plpgsql
$_MIGRATION_$
DECLARE
  _form_uuid uuid;
  _config_form_uuid uuid;
BEGIN
-- MIGRATION CODE START

DELETE FROM security_.policy_ WHERE function_::regproc IN (
  'policy_.agent_can_query_agency_settings_'::regproc,
  'policy_.owner_can_change_agency_settings_'::regproc,
  'policy_.serviceaccount_can_query_agency_settings_'::regproc
);

PERFORM security_.register_policy_('application_.agency_settings_', 'query', 'policy_.agent_can_query_agency_settings_');
PERFORM security_.register_policy_('application_.agency_settings_', 'update', 'policy_.owner_can_change_agency_settings_');
PERFORM security_.register_policy_('application_.agency_settings_', 'query', 'policy_.serviceaccount_can_query_agency_settings_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
