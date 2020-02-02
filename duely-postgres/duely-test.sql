-- psql -U postgres -d postgres -f duely-test.sql

\echo ''
\echo 'Resetting the database before executing tests...'
\o /dev/null
\set QUIET true
\set ON_ERROR_STOP true
REVOKE CONNECT ON DATABASE duely FROM duely;

SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid <> pg_backend_pid()
  AND datname = 'duely';

DROP DATABASE duely;
CREATE DATABASE duely;
\c duely
\i duely-schema.sql
\i duely-prepare.sql
\c duely duely
\o
\conninfo
\echo 'Running tests...'

DO 
LANGUAGE plpgsql
$$
DECLARE
  _visitor_jwt text;
  _user_jwt text;
  _record RECORD;
  _cursor refcursor;
BEGIN

  SELECT operation_.begin_visit_() INTO _visitor_jwt;
  --RAISE NOTICE E'begin_visit_:\n%', _visitor_jwt;


  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _record
  FROM operation_.query_active_subject_();
  --RAISE NOTICE E'query_active_subject_:\n%', _record;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _record
  FROM operation_.start_email_address_verification_('test@example.com');
  --RAISE NOTICE E'start_email_address_verification_:\n%', _record;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _record
  FROM operation_.sign_up_user_('test@example.com', _record.verification_code_, 'test user', 'password');
  --RAISE NOTICE E'sign_up_user_:\n%', _record;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _user_jwt
  FROM operation_.log_in_user_('test@example.com', 'password');
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
  FROM operation_.query_active_subject_();
  --RAISE NOTICE E'query_active_subject_:\n%', _record;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record
  FROM operation_.create_agency_('test agency', 'test');
  --RAISE NOTICE E'create_agency_:\n%', _record;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  PERFORM operation_.create_stripe_account_(_record.uuid_, 'acct_test');

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  PERFORM operation_.create_service_(_record.uuid_, 'test service 1');
  PERFORM operation_.create_service_(_record.uuid_, 'test service 2');

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record FROM operation_.query_agency_(_record.uuid_);
  --RAISE NOTICE E'query_agency_:\n%', _record;

  PERFORM operation_.end_session_();

  PERFORM operation_.begin_session_(_user_jwt);

  OPEN _cursor FOR SELECT * FROM operation_.query_service_(_record.uuid_);
  LOOP
    FETCH FROM _cursor INTO _record;
    --RAISE NOTICE E'query_service_:\n%', _record;
    EXIT WHEN NOT FOUND;
  END LOOP;
  CLOSE _cursor;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record FROM operation_.query_agency_by_subdomain_name_('test');
  SELECT * INTO _record FROM operation_.query_service_(_record.uuid_) LIMIT 1;
  PERFORM operation_.delete_service_(_record.uuid_);

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
