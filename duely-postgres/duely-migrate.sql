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

ALTER TABLE ONLY security_.resource_definition_ DROP CONSTRAINT resource_definition__id_prefix__key;

UPDATE security_.resource_definition_
SET id_prefix_ = 'set'
WHERE name_ LIKE '% setting';

CREATE TABLE application_.agency_thank_you_page_setting_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_uuid_ uuid NOT NULL REFERENCES application_.agency_ (uuid_),
    url_ text NOT NULL,
    UNIQUE (agency_uuid_)
);
CALL internal_.setup_auditing_('application_.agency_thank_you_page_setting_');
CALL internal_.setup_resource_('application_.agency_thank_you_page_setting_', 'agency thank you page setting', 'set', '{uuid_, agency_uuid_, url_}', 'application_.agency_');


CREATE TABLE application_.service_thank_you_page_setting_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_thank_you_page_setting_uuid_ uuid NOT NULL REFERENCES application_.agency_thank_you_page_setting_ (uuid_),
    service_uuid_ uuid NOT NULL REFERENCES application_.service_ (uuid_),
    url_ text NOT NULL,
    UNIQUE (agency_thank_you_page_setting_uuid_, service_uuid_)
);
CALL internal_.setup_auditing_('application_.service_thank_you_page_setting_');
CALL internal_.setup_resource_('application_.service_thank_you_page_setting_', 'service thank you page setting', 'set', '{uuid_, agency_thank_you_page_setting_uuid_, service_uuid_, url_}', 'application_.service_');


CREATE OR REPLACE FUNCTION policy_.agent_can_query_agency_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, agency_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE FUNCTION policy_.serviceaccount_can_query_agency_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.agent_can_query_service_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, agency_thank_you_page_setting_uuid_, service_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE FUNCTION policy_.serviceaccount_can_query_service_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_thank_you_page_setting_uuid_, service_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_change_agency_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_change_service_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_create_agency_thank_you_page_setting_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_create_service_thank_you_page_setting_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_thank_you_page_setting_uuid_, service_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.agency_thank_you_page_setting_', 'query', 'policy_.agent_can_query_agency_thank_you_page_setting_');
PERFORM security_.register_policy_('application_.agency_thank_you_page_setting_', 'query', 'policy_.serviceaccount_can_query_agency_thank_you_page_setting_');
PERFORM security_.register_policy_('application_.service_thank_you_page_setting_', 'query', 'policy_.agent_can_query_service_thank_you_page_setting_');
PERFORM security_.register_policy_('application_.service_thank_you_page_setting_', 'query', 'policy_.serviceaccount_can_query_service_thank_you_page_setting_');
PERFORM security_.register_policy_('application_.agency_thank_you_page_setting_', 'create', 'policy_.owner_can_create_agency_thank_you_page_setting_');
PERFORM security_.register_policy_('application_.service_thank_you_page_setting_', 'create', 'policy_.owner_can_create_service_thank_you_page_setting_');
PERFORM security_.register_policy_('application_.agency_thank_you_page_setting_', 'update', 'policy_.owner_can_change_agency_thank_you_page_setting_');
PERFORM security_.register_policy_('application_.service_thank_you_page_setting_', 'update', 'policy_.owner_can_change_service_thank_you_page_setting_');
PERFORM security_.register_policy_('application_.agency_thank_you_page_setting_', 'delete', 'policy_.only_owner_can_delete_');
PERFORM security_.register_policy_('application_.service_thank_you_page_setting_', 'delete', 'policy_.only_owner_can_delete_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
