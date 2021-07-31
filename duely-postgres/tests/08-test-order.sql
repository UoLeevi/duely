-- psql -U duely -d duely -f tests/08-test-order.sql

\echo 'TEST 08 STARTED'
\set ON_ERROR_STOP true
\set QUIET true
\c duely duely

DO
LANGUAGE plpgsql
$$
DECLARE
  _data jsonb;
  _result_0 jsonb;
  _result_1 jsonb;
  _result_2 jsonb;
  _result_3 jsonb;
  _result_4 jsonb;
  _resource_name text;
  _visitor_jwt text;
  _user_jwt text;
  _record_0 RECORD;
  _record_1 RECORD;
  _record_2 RECORD;
  _cursor refcursor;
BEGIN

  SELECT * INTO _visitor_jwt FROM operation_.begin_visit_();
  PERFORM operation_.begin_session_(_visitor_jwt);
  SELECT * INTO _user_jwt FROM operation_.log_in_user_('test@duely.app', 'password');
  PERFORM operation_.end_visit_();
  PERFORM operation_.end_session_();

  PERFORM operation_.begin_session_(_user_jwt);

  -- PREPARE DEPENDENCIES
  _data := '{
    "name": "test",
    "agency": {
      "name": "Test Agency",
      "livemode": false
    }
  }';
  SELECT * INTO _result_0 FROM operation_.create_resource_('subdomain', _data);
  -- RAISE NOTICE E'create_resource_(text, jsonb):\n%', _result_0;
  ASSERT _result_0 ?& '{ id, name, agency }';

  _data := '{
    "stripe_id_ext": "acct_123456",
    "livemode": false
  }';
  _data := jsonb_set(_data, '{agency_id}', _result_0->'agency'->'id');
  SELECT * INTO _result_1 FROM operation_.create_resource_('stripe account', _data);
  --RAISE NOTICE E'create_resource_(text, jsonb):\n%', _result_1;
  ASSERT _result_1 ?& '{ id, stripe_id_ext, agency_id, livemode }';

  _data := '{
    "name": "test product",
    "url_name": "test-product",
    "stripe_prod_id_ext_test": "prod_123_test"
  }';
  _data := jsonb_set(_data, '{agency_id}', _result_1->'agency_id');
  SELECT * INTO _result_2 FROM operation_.create_resource_('product', _data);
  --RAISE NOTICE E'create_resource_(text, jsonb):\n%', _result_1;
  ASSERT _result_2 ?& '{ id, agency_id }';

  _data := '{
    "unit_amount": 123,
    "currency": "eur",
    "stripe_price_id_ext_test": "price_123_test"
  }';
  _data := jsonb_set(_data, '{product_id}', _result_2->'id');
  SELECT * INTO _result_3 FROM operation_.create_resource_('price', _data);
  --RAISE NOTICE E'create_resource_(text, jsonb):\n%', _result_1;
  ASSERT _result_3 ?& '{ id, product_id }';

  _data := '{
  }';
  _data := jsonb_set(_data, '{default_price_id}', _result_3->'id');
  PERFORM operation_.update_resource_('product', _result_2->>'id', _data);

  _data := '{
    "name": "test customer",
    "email_address": "test@example.com",
    "default_stripe_id_ext": "cus_123"
  }';
  _data := jsonb_set(_data, '{stripe_account_id}', _result_1->'id');
  SELECT * INTO _result_4 FROM operation_.create_resource_('customer', _data);
  --RAISE NOTICE E'create_resource_(text, jsonb):\n%', _result_1;
  ASSERT _result_4 ?& '{ id, name }';

  _resource_name := 'order';

  -- TEST INVALID CREATE OPERATION
  _data := '{}';
  BEGIN
    PERFORM operation_.create_resource_(_resource_name, _data);
    RAISE EXCEPTION 'Should not be able to create resource using these arguments.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID CREATE OPERATION
  _data := '{
    "stripe_checkout_session_id_ext": "cs_123",
    "state": "pending"
  }';
  _data := jsonb_set(_data, '{stripe_account_id}', _result_1->'id');
  _data := jsonb_set(_data, '{customer_id}', _result_4->'id');
  SELECT * INTO _result_1 FROM operation_.create_resource_(_resource_name, _data);
  --RAISE NOTICE E'create_resource_(text, jsonb):\n%', _result_1;
  ASSERT _result_1 ?& '{ id, stripe_checkout_session_id_ext }';


  -- TEST INVALID QUERY OPERATION
  BEGIN
    PERFORM operation_.query_resource_(_resource_name, 'ord_0');
    RAISE EXCEPTION 'Exception should be raised if no matching record was found.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID QUERY OPERATION
  SELECT * INTO _result_1 FROM operation_.query_resource_(_resource_name, _result_1->>'id');
  --RAISE NOTICE E'query_resource_:\n%', _result_1;
  ASSERT _result_1 ?& '{ id, stripe_checkout_session_id_ext }';

  PERFORM operation_.log_out_user_();
  PERFORM operation_.end_session_();


  SELECT * INTO _visitor_jwt FROM operation_.begin_visit_();
  PERFORM operation_.begin_session_(_visitor_jwt);

  -- TEST VALID QUERY OPERATION
  _data := '{
    "stripe_checkout_session_id_ext": "cs_123"
  }';
  SELECT * INTO _result_1 FROM operation_.query_resource_(_resource_name, _data, 'cs_123');
  --RAISE NOTICE E'query_resource_:\n%', _result_1;
  ASSERT _result_1 ?& '{ id, customer_id, stripe_account_id, stripe_checkout_session_id_ext, state, error, ordered_at, processed_at }';

  SELECT * INTO _result_1 FROM operation_.query_resource_('stripe account', _result_1->>'stripe_account_id');
  --RAISE NOTICE E'query_resource_:\n%', _result_1;
  ASSERT _result_1 ?& '{ id, stripe_id_ext }';

  PERFORM operation_.end_visit_();
  PERFORM operation_.end_session_();


  RAISE EXCEPTION 'TEST 08 PASSED' USING errcode = '40000'; -- transaction_rollback

EXCEPTION
  WHEN transaction_rollback THEN
    -- TEST 08 PASSED
    NULL;

  WHEN OTHERS THEN
    RAISE NOTICE 'TEST 08 FAILED';
    RAISE;

END;
$$;

\echo 'TEST 08 PASSED'
