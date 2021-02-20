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

CREATE TABLE application_.order_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_uuid_ uuid REFERENCES application_.customer_ (uuid_) ON DELETE CASCADE,
    stripe_account_uuid_ uuid REFERENCES application_.stripe_account_ (uuid_) ON DELETE CASCADE,
    stripe_checkout_session_id_ext_ text NULL,
    state_ processing_state_ NOT NULL,
    error_ text NULL,
    ordered_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    prosessed_at_ timestamp with time zone NULL
);
CALL internal_.setup_resource_('application_.order_', 'order', 'ord', '{uuid_, customer_uuid_, stripe_account_uuid_, stripe_checkout_session_id_ext_}', 'application_.stripe_account_');

CREATE FUNCTION policy_.serviceaccount_can_query_order_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, customer_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, prosessed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.order_', 'query', 'policy_.serviceaccount_can_query_order_');

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_create_order_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{customer_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, prosessed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.order_', 'create', 'policy_.serviceaccount_can_create_order_');

CREATE FUNCTION policy_.serviceaccount_can_change_order_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{state_, error_, prosessed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.order_', 'update', 'policy_.serviceaccount_can_change_order_');

CREATE OR REPLACE FUNCTION policy_.agent_can_query_order_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, customer_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, prosessed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_change_order_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{state_, error_, prosessed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


CREATE OR REPLACE FUNCTION policy_.owner_can_create_order_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{customer_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, prosessed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.order_', 'query', 'policy_.agent_can_query_order_');
PERFORM security_.register_policy_('application_.order_', 'create', 'policy_.owner_can_create_order_');
PERFORM security_.register_policy_('application_.order_', 'update', 'policy_.owner_can_change_order_');
PERFORM security_.register_policy_('application_.order_', 'delete', 'policy_.only_owner_can_delete_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
