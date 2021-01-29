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

CREATE TYPE public.processing_state_ AS ENUM (
    'pending',
    'processing',
    'processed',
    'failed'
);

CREATE TABLE application_.webhook_event_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    id_ext_ text NOT NULL,
    source_ text NOT NULL,
    data_ jsonb NOT NULL,
    state_ processing_state_ NOT NULL,
    error_ text NULL,
    agency_uuid_ uuid REFERENCES application_.agency_ (uuid_) ON DELETE CASCADE,
    event_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (source_, id_ext_)
);
CALL internal_.setup_resource_('application_.webhook_event_', 'webhook event', 'whevt', '{uuid_, id_ext_, source_, agency_uuid_}', 'application_.agency_');

CREATE FUNCTION policy_.serviceaccount_can_query_webhook_event_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, id_ext_, source_, data_, state_, error_, agency_uuid_, event_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.webhook_event_', 'query', 'policy_.serviceaccount_can_query_webhook_event_');

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_create_webhook_event_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{id_ext_, source_, data_, state_, error_, agency_uuid_, event_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.webhook_event_', 'create', 'policy_.serviceaccount_can_create_webhook_event_');

CREATE FUNCTION policy_.serviceaccount_can_change_webhook_event_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{state_, error_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.webhook_event_', 'update', 'policy_.serviceaccount_can_change_webhook_event_');

CREATE FUNCTION policy_.delete_forbidden_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RAISE 'Unauthorized.' USING ERRCODE = '42501';
END
$$;

PERFORM security_.register_policy_('application_.webhook_event_', 'delete', 'policy_.delete_forbidden_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
