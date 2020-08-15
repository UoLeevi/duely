-- psql -U duely -d duely -f 01-duely-test.sql

\c
\echo 'TEST 01 STARTED'
\set ON_ERROR_STOP true
\set QUIET true

DO
LANGUAGE plpgsql
$$
DECLARE
  _resource_name text;
  _data jsonb;
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

  _resource_name := 'agency';

  -- TEST INVALID CREATE OPERATION
  _data := '{}';
  BEGIN
    PERFORM operation_.create_resource_(_resource_name, _data);
    RAISE EXCEPTION 'Should not be able to create resource using these arguments.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID CREATE OPERATION
  _data := '{"name": "Test Agency"}';
  SELECT * INTO _record_0 FROM operation_.create_resource_(_resource_name, _data);
  --RAISE NOTICE E'create_resource_(text, jsonb):\n%', _record_0;


  -- TEST INVALID QUERY OPERATION
  BEGIN
    PERFORM operation_.query_resource_('00000000-0000-0000-0000-000000000000'::uuid);
    RAISE EXCEPTION 'Exception should be raised if no matching record was found.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID QUERY OPERATION
  SELECT * INTO _record_0 FROM operation_.query_resource_(_record_0.uuid_);
  --RAISE NOTICE E'query_resource_(uuid):\n%', _record_0;


  -- TEST INVALID UPDATE OPERATION
  _data := '{"not existing key": "test"}';
  BEGIN
    PERFORM operation_.update_resource_(_record_0.uuid_, _data);
    RAISE EXCEPTION 'Should not be able to update resource using these arguments.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID UPDATE OPERATION
  _data := '{"name": "Test Agency Name Changed"}';
  SELECT * INTO _record_0 FROM operation_.update_resource_(_record_0.uuid_, _data);
  --RAISE NOTICE E'update_resource_(uuid, jsonb):\n%', _record_0;


  -- TEST INVALID DELETE OPERATION
  BEGIN
    PERFORM operation_.delete_resource_('00000000-0000-0000-0000-000000000000'::uuid);
    RAISE EXCEPTION 'Exception should be raised if no record is deleted.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID DELETE OPERATION
  SELECT * INTO _record_0 FROM operation_.delete_resource_(_record_0.uuid_);
  --RAISE NOTICE E'delete_resource_(uuid):\n%', _record_0;


  PERFORM operation_.log_out_user_();
  PERFORM operation_.end_session_();


  RAISE EXCEPTION 'TEST 01 PASSED' USING errcode = '40000'; -- transaction_rollback

EXCEPTION
  WHEN transaction_rollback THEN
    -- TEST 01 PASSED
    NULL;

  WHEN OTHERS THEN
    RAISE NOTICE 'TEST 01 FAILED';
    RAISE;

END;
$$;

\echo 'TEST 01 PASSED'
