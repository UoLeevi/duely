-- psql -U duely -d duely -f tests/03-test-image.sql

\echo 'TEST 03 STARTED'
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

  _resource_name := 'image';

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
    "name": "Test Image",
    "data": "asdasd",
    "color": "#123456",
    "access": "public"
  }';
  _data := jsonb_set(_data, '{agency_id}', _result_0->'agency'->'id');
  SELECT * INTO _result_1 FROM operation_.create_resource_(_resource_name, _data);
  --RAISE NOTICE E'create_resource_(text, jsonb):\n%', _result_1;
  ASSERT _result_1 ?& '{ id, name, data, color, access }';


  -- TEST INVALID QUERY OPERATION
  BEGIN
    PERFORM operation_.query_resource_('image', 'img_0');
    RAISE EXCEPTION 'Exception should be raised if no matching record was found.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID QUERY OPERATION
  SELECT * INTO _result_1 FROM operation_.query_resource_('image', _result_1->>'id');
  --RAISE NOTICE E'query_resource_:\n%', _result_1;
  ASSERT _result_1 ?& '{ id, name, data, color }';


  -- TEST INVALID UPDATE OPERATION
  _data := '{
    "agency_id": "agcy_123123"
  }';
  BEGIN
    PERFORM operation_.update_resource_(_resource_name, _result_1->>'id', _data);
    RAISE EXCEPTION 'Should not be able to update resource using these arguments.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID UPDATE OPERATION
  _data := '{
    "color": "#000000"
  }';
  SELECT * INTO _result_1 FROM operation_.update_resource_(_resource_name, _result_1->>'id', _data);
  --RAISE NOTICE E'update_resource_(text, jsonb):\n%', _result_1;
  ASSERT _result_1 ?& '{ id, name, data, color }';


  -- TEST INVALID DELETE OPERATION
  BEGIN
    PERFORM operation_.delete_resource_(_resource_name, 'img_0');
    RAISE EXCEPTION 'Exception should be raised if no record is deleted.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID DELETE OPERATION
  SELECT * INTO _result_1 FROM operation_.delete_resource_(_resource_name, _result_1->>'id');
  --RAISE NOTICE E'delete_resource_:\n%', _result_1;
  ASSERT _result_1 ?& '{ id, name, data, color }';


  PERFORM operation_.log_out_user_();
  PERFORM operation_.end_session_();


  RAISE EXCEPTION 'TEST 03 PASSED' USING errcode = '40000'; -- transaction_rollback

EXCEPTION
  WHEN transaction_rollback THEN
    -- TEST 03 PASSED
    NULL;

  WHEN OTHERS THEN
    RAISE NOTICE 'TEST 03 FAILED';
    RAISE;

END;
$$;

\echo 'TEST 03 PASSED'
