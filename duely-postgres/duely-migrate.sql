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

ALTER TABLE application_.webhook_event_ ADD livemode_ boolean NOT NULL;

CALL internal_.setup_resource_('application_.webhook_event_', 'webhook event', 'whevt', '{uuid_, id_ext_, source_, livemode_, agency_uuid_}', 'application_.agency_');

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_webhook_event_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, id_ext_, source_, livemode_, data_, state_, error_, agency_uuid_, event_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_create_webhook_event_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{id_ext_, source_, livemode_, data_, state_, error_, agency_uuid_, event_at_}'::text[];
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
