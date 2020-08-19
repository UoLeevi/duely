-- psql -U duely -d duely -f tests/02-duely-test.sql

\c
\echo 'TEST 02 STARTED'
\set ON_ERROR_STOP true
\set QUIET true

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
      "name": "Test Agency"
    }
  }';
  SELECT * INTO _result_0 FROM operation_.create_resource_('subdomain', _data);
  -- RAISE NOTICE E'create_resource_(text, jsonb):\n%', _result_0;
  ASSERT _result_0 ?& '{ id, name, agency }';

  _resource_name := 'theme';

  -- TEST INVALID CREATE OPERATION
  _data := '{
    "name": "missing agency",
    "color_primary": "#000000",
    "color_secondary": "#000000",
    "color_accent": "#000000",
    "color_background": "#000000",
    "color_surface": "#000000",
    "color_error": "#000000",
    "color_success": "#000000",
    "agency_id": "agcy_0"
  }';
  BEGIN
    PERFORM operation_.create_resource_(_resource_name, _data);
    RAISE EXCEPTION 'Should not be able to create resource using these arguments.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID CREATE OPERATION
  _data := _data || '{ "name": "all black" }';
  _data := jsonb_set(_data, '{agency_id}', _result_0->'agency'->'id');
  SELECT * INTO _result_1 FROM operation_.create_resource_(_resource_name, _data);
  -- RAISE NOTICE E'create_resource_(text, jsonb):\n%', _result_1;
  ASSERT _result_1 ?& '{ id, name, color_primary, color_secondary, color_accent, color_background, color_surface, color_error, color_success, agency_id }';


  -- TEST INVALID QUERY OPERATION
  BEGIN
    PERFORM operation_.query_resource_('theme_0');
    RAISE EXCEPTION 'Exception should be raised if no matching record was found.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID QUERY OPERATION
  SELECT * INTO _result_1 FROM operation_.query_resource_(_result_1->>'id');
  -- RAISE NOTICE E'query_resource_(text):\n%', _result_1;
  ASSERT _result_1 ?& '{ id, name, color_primary, color_secondary, color_accent, color_background, color_surface, color_error, color_success, agency_id }';


  -- TEST INVALID UPDATE OPERATION
  _data := '{
    "agency_id": "agcy_0"
  }';
  BEGIN
    PERFORM operation_.update_resource_(_result_1->>'id', _data);
    RAISE EXCEPTION 'Should not be able to update resource using these arguments.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID UPDATE OPERATION
  _data := '{
    "color_primary": "#ffffff"
  }';
  SELECT * INTO _result_1 FROM operation_.update_resource_(_result_1->>'id', _data);
  --RAISE NOTICE E'update_resource_(text, jsonb):\n%', _result_1;
  ASSERT _result_1 ?& '{ id, name, color_primary, color_secondary, color_accent, color_background, color_surface, color_error, color_success, agency_id }';


  -- TEST INVALID DELETE OPERATION
  BEGIN
    PERFORM operation_.delete_resource_('theme_0');
    RAISE EXCEPTION 'Exception should be raised if no record is deleted.';
  EXCEPTION WHEN OTHERS THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID DELETE OPERATION
  SELECT * INTO _result_1 FROM operation_.delete_resource_(_result_1->>'id');
  --RAISE NOTICE E'delete_resource_(text):\n%', _result_1;
  ASSERT _result_1 ?& '{ id, name, color_primary, color_secondary, color_accent, color_background, color_surface, color_error, color_success, agency_id }';


  PERFORM operation_.log_out_user_();
  PERFORM operation_.end_session_();


  RAISE EXCEPTION 'TEST 02 PASSED' USING errcode = '40000'; -- transaction_rollback

EXCEPTION
  WHEN transaction_rollback THEN
    -- TEST 02 PASSED
    NULL;

  WHEN OTHERS THEN
    RAISE NOTICE 'TEST 02 FAILED';
    RAISE;

END;
$$;

\echo 'TEST 02 PASSED'
