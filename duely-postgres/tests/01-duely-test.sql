\echo 'TEST 01 STARTED'
DO
LANGUAGE plpgsql
$$
DECLARE
  _visitor_jwt text;
  _user_jwt text;
  _record_0 RECORD;
  _record_1 RECORD;
  _record_2 RECORD;
  _cursor refcursor;
BEGIN

  SELECT operation_.begin_visit_() INTO _visitor_jwt;
  PERFORM operation_.begin_session_(_visitor_jwt);
  SELECT * INTO _user_jwt FROM operation_.log_in_user_('test@example.com', 'password');
  PERFORM operation_.end_visit_();
  PERFORM operation_.end_session_();

  PERFORM operation_.begin_session_(_user_jwt);


  -- TEST INVALID CREATE OPERATION
  BEGIN
    PERFORM operation_.create_service_('{ "name_": "Test service" }'::json);
    RAISE EXCEPTION 'Should not be able to create resource using these arguments.';
  EXCEPTION WHEN SQLSTATE '20000' THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID CREATE OPERATION
  SELECT * INTO _record_0 FROM operation_.create_service_('{ "name_": "Test service" }'::json);
  --RAISE NOTICE E'create_service_(json):\n%', _record_0;


  -- TEST INVALID QUERY OPERATION
  BEGIN
    PERFORM operation_.query_service_('00000000-0000-0000-0000-000000000000'::uuid);
    RAISE EXCEPTION 'Exception should be raised if no matching record was found.';
  EXCEPTION WHEN SQLSTATE '20000' THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID QUERY OPERATION
  SELECT * INTO _record_0 FROM operation_.query_service_(_record_0.uuid_);
  --RAISE NOTICE E'query_service_(uuid):\n%', _record_0;


  -- TEST INVALID UPDATE OPERATION
  BEGIN
    PERFORM operation_.update_service_(_record_0.uuid_, '{ "name_": "Test service" }'::json);
    RAISE EXCEPTION 'Should not be able to update resource using these arguments.';
  EXCEPTION WHEN SQLSTATE '20000' THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID UPDATE OPERATION
  SELECT * INTO _record_0 FROM operation_.update_service_(_record_0.uuid_, '{ "name_": "Test service" }'::json);
  --RAISE NOTICE E'update_service_(uuid, json):\n%', _record_0;


  -- TEST INVALID DELETE OPERATION
  BEGIN
    PERFORM operation_.delete_service_('00000000-0000-0000-0000-000000000000'::uuid);
    RAISE EXCEPTION 'Exception should be raised if no record is deleted.';
  EXCEPTION WHEN SQLSTATE '20000' THEN
    -- EXPECTED ERROR
  END;


  -- TEST VALID DELETE OPERATION
  SELECT * INTO _record_0 FROM operation_.delete_service_(_record_0.uuid_);
  --RAISE NOTICE E'delete_service_(uuid):\n%', _record_0;


  PERFORM operation_.log_out_user_();
  PERFORM operation_.end_session_();


  ROLLBACK;

EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'TEST 01 FAILED';
  RAISE;

END;
$$;

\echo 'TEST 01 PASSED'
