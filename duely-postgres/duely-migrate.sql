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

CREATE TABLE application_.order_item_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_uuid_ uuid REFERENCES application_.order_ (uuid_) ON DELETE CASCADE,
    price_uuid_ uuid REFERENCES application_.price_ (uuid_),
    stripe_line_item_id_ext_ text NULL UNIQUE,
    state_ processing_state_ NOT NULL,
    error_ text NULL,
    prosessed_at_ timestamp with time zone NULL
);
CALL internal_.setup_resource_('application_.order_item_', 'order item', 'orditm', '{uuid_, order_uuid_, stripe_line_item_id_ext_}', 'application_.order_');

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_order_item_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, order_uuid_, price_uuid_, stripe_line_item_id_ext_, state_, error_, prosessed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.order_item_', 'query', 'policy_.serviceaccount_can_query_order_item_');

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_create_order_item_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{order_uuid_, price_uuid_, stripe_line_item_id_ext_, state_, error_, prosessed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.order_item_', 'create', 'policy_.serviceaccount_can_create_order_item_');

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_change_order_item_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{state_, error_, prosessed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.order_item_', 'update', 'policy_.serviceaccount_can_change_order_item_');

CREATE OR REPLACE FUNCTION policy_.owner_can_query_order_item_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, order_uuid_, price_uuid_, stripe_line_item_id_ext_, state_, error_, prosessed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.order_item_', 'query', 'policy_.owner_can_query_order_item_');


-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
