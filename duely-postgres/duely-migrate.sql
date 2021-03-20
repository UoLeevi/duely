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

CREATE OR REPLACE FUNCTION operation_.delete_resource_(_resource_name text, _id text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
  _data jsonb;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = _resource_name;

  IF _resource_definition.uuid_ IS NULL THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  SELECT * INTO _resource
  FROM application_.resource_
  WHERE _resource_definition.uuid_ = definition_uuid_
    AND id_ = _id;

  IF _resource.uuid_ IS NULL THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  PERFORM security_.control_delete_(_resource_definition, _resource);

  _data := operation_.query_resource_(_resource_name, _id);

  PERFORM internal_.dynamic_delete_(_resource_definition.table_, _resource.uuid_);

  RETURN _data;
END
$$;

CREATE OR REPLACE FUNCTION operation_.update_resource_(_resource_name text, _id text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
  _owned_resources_data jsonb;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = _resource_name;

  IF _resource_definition.uuid_ IS NULL THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  SELECT * INTO _resource
  FROM application_.resource_
  WHERE _resource_definition.uuid_ = definition_uuid_
    AND id_ = _id;

  IF _resource.uuid_ IS NULL THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  SELECT owner_, owned_ INTO _data, _owned_resources_data
  FROM internal_.extract_referenced_resources_jsonb_(_resource_definition.uuid_, _data);

  _data := internal_.convert_to_internal_format_(_data);

  PERFORM security_.control_update_(_resource_definition, _resource, _data);
  PERFORM internal_.dynamic_update_(_resource_definition.table_, _resource.uuid_, _data);

  _data := operation_.query_resource_(_resource_name, _id);

  SELECT jsonb_object_agg(r.key, internal_.create_or_update_owned_resource_(_resource_definition.table_, _id, r.key, r.value)) INTO _owned_resources_data
  FROM jsonb_each(_owned_resources_data) r;

  RETURN _data || COALESCE(_owned_resources_data, '{}'::jsonb);
END
$$;

ALTER TABLE application_.order_ RENAME COLUMN prosessed_at_ TO processed_at_;
ALTER TABLE application_.order_item_ RENAME COLUMN prosessed_at_ TO processed_at_;

CREATE OR REPLACE FUNCTION policy_.agent_can_query_order_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, customer_uuid_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, processed_at_}'::text[];
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
    RETURN '{state_, error_, processed_at_}'::text[];
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
    RETURN '{customer_uuid_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_query_order_item_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, order_uuid_, price_uuid_, stripe_line_item_id_ext_, state_, error_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_change_order_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{state_, error_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_change_order_item_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{state_, error_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_create_order_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{customer_uuid_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_create_order_item_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{order_uuid_, price_uuid_, stripe_line_item_id_ext_, state_, error_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_order_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, customer_uuid_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_order_item_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, order_uuid_, price_uuid_, stripe_line_item_id_ext_, state_, error_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_change_webhook_event_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{state_, error_}'::text[];
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

ALTER TABLE application_.webhook_event_ ADD COLUMN processed_at_ timestamp with time zone;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
