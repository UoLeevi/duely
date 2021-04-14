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

CREATE OR REPLACE FUNCTION internal_.insert_resource_token_for_order_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO security_.resource_token_ (resource_uuid_, token_, keys_)
  SELECT _order.uuid_, _order.stripe_checkout_session_id_ext_, '{uuid_, customer_uuid_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, processed_at_}'::text[]
  FROM _order;

  INSERT INTO security_.resource_token_ (resource_uuid_, token_, keys_)
  SELECT _order.customer_uuid_, _order.stripe_checkout_session_id_ext_, '{uuid_, name_, email_address_}'::text[]
  FROM _order;

  RETURN NULL;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
