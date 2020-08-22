-- psql -U postgres -d duely -f tests/00-test-internal.sql

\echo 'TEST 00 STARTED'
\set ON_ERROR_STOP true
\set QUIET true
\c duely postgres

DO
LANGUAGE plpgsql
$$
DECLARE
  _data jsonb;
  _uuid_0 uuid;
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

  -- FUNCTION internal_.internal_.current_subject_uuid_()

  SELECT * INTO _uuid_0 FROM internal_.current_subject_uuid_();
  -- RAISE NOTICE E'current_subject_uuid_:\n%', _uuid_0;
  ASSERT _uuid_0 = '00000000-0000-0000-0000-000000000000';

  SELECT * INTO _visitor_jwt FROM operation_.begin_visit_();
  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _uuid_0 FROM internal_.current_subject_uuid_();
  -- RAISE NOTICE E'current_subject_uuid_:\n%', _uuid_0;
  ASSERT _uuid_0 <> '00000000-0000-0000-0000-000000000000';

  PERFORM operation_.end_session_();

  SELECT * INTO _uuid_0 FROM internal_.current_subject_uuid_();
  -- RAISE NOTICE E'current_subject_uuid_:\n%', _uuid_0;
  ASSERT _uuid_0 = '00000000-0000-0000-0000-000000000000';

  PERFORM operation_.begin_session_(_visitor_jwt);
  SELECT * INTO _user_jwt FROM operation_.log_in_user_('test@duely.app', 'password');
  PERFORM operation_.end_visit_();

  SELECT * INTO _uuid_0 FROM internal_.current_subject_uuid_();
  -- RAISE NOTICE E'current_subject_uuid_:\n%', _uuid_0;
  ASSERT _uuid_0 <> '00000000-0000-0000-0000-000000000000';

  PERFORM operation_.end_session_();

  SELECT * INTO _uuid_0 FROM internal_.current_subject_uuid_();
  -- RAISE NOTICE E'current_subject_uuid_:\n%', _uuid_0;
  ASSERT _uuid_0 = '00000000-0000-0000-0000-000000000000';

  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _uuid_0 FROM internal_.current_subject_uuid_();
  -- RAISE NOTICE E'current_subject_uuid_:\n%', _uuid_0;
  ASSERT _uuid_0 <> '00000000-0000-0000-0000-000000000000';

  PERFORM operation_.log_out_user_();

  SELECT * INTO _uuid_0 FROM internal_.current_subject_uuid_();
  -- RAISE NOTICE E'current_subject_uuid_:\n%', _uuid_0;
  ASSERT _uuid_0 <> '00000000-0000-0000-0000-000000000000';

  PERFORM operation_.end_session_();

  SELECT * INTO _uuid_0 FROM internal_.current_subject_uuid_();
  -- RAISE NOTICE E'current_subject_uuid_:\n%', _uuid_0;
  ASSERT _uuid_0 = '00000000-0000-0000-0000-000000000000';


  RAISE EXCEPTION 'TEST 00 PASSED' USING errcode = '40000'; -- transaction_rollback

EXCEPTION
  WHEN transaction_rollback THEN
    -- TEST 00 PASSED
    NULL;

  WHEN OTHERS THEN
    RAISE NOTICE 'TEST 00 FAILED';
    RAISE;

END;
$$;

\echo 'TEST 00 PASSED'
