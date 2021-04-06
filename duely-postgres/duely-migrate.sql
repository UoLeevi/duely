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

CREATE FUNCTION internal_.insert_resource_token_for_order_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO security_.resource_token_ (resource_uuid_, token_, keys_)
  SELECT _order.uuid_, _order.stripe_checkout_session_id_ext_, '{uuid_, customer_uuid_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, processed_at_}'::text[]
  FROM _order;

  RETURN NULL;
END
$$;

CREATE TRIGGER tr_after_insert_insert_resource_token_for_order_ AFTER INSERT ON application_.order_ REFERENCING NEW TABLE AS _order FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_resource_token_for_order_();


CREATE FUNCTION internal_.insert_resource_token_for_order_item_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO security_.resource_token_ (resource_uuid_, token_, keys_)
  SELECT _order_item.uuid_, o.stripe_checkout_session_id_ext_, '{uuid_, order_uuid_, price_uuid_, stripe_line_item_id_ext_, state_, error_, processed_at_}'::text[]
  FROM _order_item
  JOIN application_.order_ o ON o.uuid_ = _order_item.order_uuid_;

  RETURN NULL;
END
$$;

CREATE TRIGGER tr_after_insert_insert_resource_token_for_order_item_ AFTER INSERT ON application_.order_item_ REFERENCING NEW TABLE AS _order_item FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_resource_token_for_order_item_();

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
