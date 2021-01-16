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

CREATE TABLE application_.customer_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ text,
    email_address_ text NOT NULL,
    default_stripe_id_ext_ text NOT NULL UNIQUE,
    stripe_account_uuid_ uuid NOT NULL REFERENCES application_.stripe_account_ (uuid_) ON DELETE CASCADE,
    user_uuid_ uuid REFERENCES security_.user_ (uuid_) ON DELETE SET NULL,
    UNIQUE (stripe_account_uuid_, email_address_)
);
CALL internal_.setup_auditing_('application_.customer_');
CALL internal_.setup_resource_('application_.customer_', 'customer', 'cus', '{uuid_, name_, email_address_, default_stripe_id_ext_, stripe_account_uuid_, user_uuid_}', 'application_.stripe_account_');

CREATE FUNCTION policy_.serviceaccount_can_query_customer_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, name_, email_address_, default_stripe_id_ext_, stripe_account_uuid_, user_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.customer_', 'query', 'policy_.serviceaccount_can_query_customer_');

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_create_customer_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{name_, email_address_, default_stripe_id_ext_, stripe_account_uuid_, user_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.customer_', 'create', 'policy_.serviceaccount_can_create_customer_');

CREATE FUNCTION policy_.serviceaccount_can_change_customer_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{name_, email_address_, default_stripe_id_ext_, user_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.customer_', 'update', 'policy_.serviceaccount_can_change_customer_');

CREATE OR REPLACE FUNCTION policy_.owner_can_create_customer_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{name_, email_address_, default_stripe_id_ext_, stripe_account_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.customer_', 'create', 'policy_.owner_can_create_customer_');

CREATE OR REPLACE FUNCTION policy_.agent_can_query_customer_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, name_, email_address_, default_stripe_id_ext_, stripe_account_uuid_, user_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.customer_', 'query', 'policy_.agent_can_query_customer_');

CREATE FUNCTION policy_.owner_can_change_customer_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{name_, email_address_, default_stripe_id_ext_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.customer_', 'update', 'policy_.owner_can_change_customer_');

PERFORM security_.register_policy_('application_.customer_', 'delete', 'policy_.only_owner_can_delete_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
