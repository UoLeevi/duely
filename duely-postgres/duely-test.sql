-- psql -U postgres -d postgres -f duely-test.sql

\echo ''
\echo 'Resetting the database before executing tests...'
\set QUIET true
\set ON_ERROR_STOP true
DROP DATABASE duely;
CREATE DATABASE duely;
\c duely
\i duely-schema.sql
\i duely-prepare.sql
\c duely duely
\conninfo

\echo 'Running tests...'

DO 
LANGUAGE plpgsql
$$
DECLARE
  _visitor_jwt text;
  _user_jwt text;
  _record RECORD;
BEGIN

  SELECT operation_.begin_visit_() INTO _visitor_jwt;
  --RAISE NOTICE E'begin_visit_:\n%', _visitor_jwt;


  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _record
  FROM operation_.start_email_address_verification_('test@test');
  --RAISE NOTICE E'start_email_address_verification_:\n%', _record;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _record
  FROM operation_.sign_up_user_('test@test', _record.verification_code_, 'test user', 'password');
  --RAISE NOTICE E'sign_up_user_:\n%', _record;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _user_jwt
  FROM operation_.log_in_user_('test@test', 'password');
  --RAISE NOTICE E'log_in_user_:\n%', _user_jwt;

  SELECT * INTO _record
  FROM operation_.end_visit_();
  --RAISE NOTICE E'end_visit_:\n%', _record;

  PERFORM operation_.end_session_();


  BEGIN
    PERFORM operation_.begin_session_(_visitor_jwt);
    RAISE EXCEPTION 'Revoked token should not be able to be reused!';
  EXCEPTION WHEN case_not_found THEN
  END;


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record
  FROM operation_.view_user_;
  --RAISE NOTICE E'view_user_:\n%', _record;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record
  FROM operation_.create_agency_('test agency', 'test');
  --RAISE NOTICE E'create_agency_:\n%', _record;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record
  FROM operation_.create_service_('test service', _record.uuid_);
  --RAISE NOTICE E'create_service_:\n%', _record;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  --TODO
  --SELECT * INTO _record
  --FROM operation_.view_agency_;
  --RAISE NOTICE E'view_agency_:\n%', _record;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record
  FROM operation_.log_out_user_();
  --RAISE NOTICE E'log_out_user_:\n%', _record;

  PERFORM operation_.end_session_();


EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'TESTS FAILED';
  RAISE;

END;
$$;

\echo 'TESTS PASSED'
