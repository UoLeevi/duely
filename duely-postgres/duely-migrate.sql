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

CREATE TABLE application_.credential_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_uuid_ uuid REFERENCES application_.agency_ (uuid_) ON DELETE CASCADE,
    key_ text NOT NULL,
    type_ text NOT NULL,
    data_ jsonb NOT NULL,
    UNIQUE (agency_uuid_, key_)
);
CALL internal_.setup_resource_('application_.credential_', 'credential', 'cred', '{uuid_, agency_uuid_, type_, key_}', 'application_.agency_');

CREATE FUNCTION policy_.serviceaccount_can_query_credential_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, type_, key_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.credential_', 'query', 'policy_.serviceaccount_can_query_credential_');

CREATE OR REPLACE FUNCTION policy_.owner_can_create_credential_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{agency_uuid_, type_, key_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.credential_', 'create', 'policy_.owner_can_create_credential_');

CREATE FUNCTION policy_.owner_can_change_credential_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.credential_', 'update', 'policy_.owner_can_change_credential_');

CREATE OR REPLACE FUNCTION policy_.owner_can_query_credential_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, agency_uuid_, type_, key_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.credential_', 'query', 'policy_.owner_can_query_credential_');
PERFORM security_.register_policy_('application_.credential_', 'delete', 'policy_.only_owner_can_delete_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
