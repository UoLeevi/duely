-- psql -U duely -d duely -f tests/05-test-password_reset.sql

\echo 'TEST 05 STARTED'
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

  _resource_name := 'password reset';

  -- TEST INVALID CREATE OPERATION
  _data := '{
    "email_address": "a@a"
  }';
  BEGIN
    PERFORM operation_.create_resource_(_resource_name, _data);
    RAISE EXCEPTION 'Should not be able to create resource using these arguments.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID CREATE OPERATION
  _data := '{
    "email_address": "test@duely.app"
  }';
  SELECT * INTO _result_1 FROM operation_.create_resource_(_resource_name, _data);
  -- RAISE NOTICE E'create_resource_(text, jsonb):\n%', _result_1;

  ASSERT _result_1 ?& '{ id }';


  -- TEST VALID QUERY OPERATION
  SELECT * INTO _result_1 FROM operation_.query_resource_(_result_1->>'id');
  --RAISE NOTICE E'query_resource_(text):\n%', _result_1;

  ASSERT _result_1 ?& '{ id, verification_code }';

  _data := jsonb_build_object('verification_code', _result_1->>'verification_code');
  SELECT * INTO _result_1 FROM operation_.query_resource_all_(_resource_name, _data);
  --RAISE NOTICE E'query_resource_(text):\n%', _result_1;

  ASSERT _result_1 ?& '{ id }';


  -- TEST INVALID UPDATE OPERATION
  _data := '{
    "email_address": "b@b",
    "vefified": true,
    "password": "asdf"
  }';
  BEGIN
    PERFORM operation_.update_resource_(_result_1->>'id', _data);
    RAISE EXCEPTION 'Should not be able to update resource using these arguments.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID UPDATE OPERATION
  _data := '{
    "verified": true,
    "password": "asdf"
  }';
  _data := _data || jsonb_build_object('verification_code', _result_1->>'verification_code');
  SELECT * INTO _result_1 FROM operation_.update_resource_(_result_1->>'id', _data);
  --RAISE NOTICE E'update_resource_(text, jsonb):\n%', _result_1;

  ASSERT _result_1 ?& '{ id }';


  -- TEST VALID DELETE OPERATION
  _data := '{
    "email_address": "test@duely.app"
  }';
  SELECT * INTO _result_1 FROM operation_.create_resource_(_resource_name, _data);
  SELECT * INTO _result_1 FROM operation_.delete_resource_(_result_1->>'id');
  --RAISE NOTICE E'delete_resource_(text):\n%', _result_1;


  SELECT * INTO _result_1 FROM operation_.query_resource_all_('user', '{ "email_address": "test@duely.app" }');
  --RAISE NOTICE E'query_resource_all_(text, jsonb):\n%', _result_1;

  ASSERT _result_1 IS NULL;


  SELECT * INTO _user_jwt FROM operation_.log_in_user_('test@duely.app', 'asdf');
  PERFORM operation_.end_visit_();
  PERFORM operation_.end_session_();

  PERFORM operation_.begin_session_(_user_jwt);

  PERFORM operation_.log_out_user_();
  PERFORM operation_.end_session_();

  RAISE EXCEPTION 'TEST 05 PASSED' USING errcode = '40000'; -- transaction_rollback

EXCEPTION
  WHEN transaction_rollback THEN
    -- TEST 05 PASSED
    NULL;

  WHEN OTHERS THEN
    RAISE NOTICE 'TEST 05 FAILED';
    RAISE;

END;
$$;

\echo 'TEST 05 PASSED'
