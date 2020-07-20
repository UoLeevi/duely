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
  _record_0 RECORD;
  _record_1 RECORD;
  _record_2 RECORD;
  _cursor refcursor;
BEGIN

  SELECT operation_.begin_visit_() INTO _visitor_jwt;
  --RAISE NOTICE E'begin_visit_:\n%', _visitor_jwt;


  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _record_0
  FROM operation_.query_active_subject_();
  --RAISE NOTICE E'query_active_subject_:\n%', _record_0;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _record_0
  FROM operation_.start_email_address_verification_('test@example.com', 'f', '{"password":"temp password","name":"test user"}');
  --RAISE NOTICE E'start_email_address_verification_:\n%', _record_0;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_visitor_jwt);

  PERFORM operation_.sign_up_user_(_record_0.uuid_);

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_visitor_jwt);
  BEGIN
    PERFORM operation_.reset_password_(_record_0.uuid_, 'malicious password');
    RAISE EXCEPTION 'Verification code should not be able to be reused!';
  EXCEPTION WHEN SQLSTATE '20000' THEN
  END;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _record_0
  FROM operation_.start_email_address_verification_('test@example.com', 't');
  --RAISE NOTICE E'start_email_address_verification_:\n%', _record_0;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _record_0
  FROM operation_.reset_password_(_record_0.uuid_, 'password');
  --RAISE NOTICE E'reset_password_:\n%', _record_0;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_visitor_jwt);

  SELECT * INTO _user_jwt
  FROM operation_.log_in_user_('test@example.com', 'password');
  --RAISE NOTICE E'log_in_user_:\n%', _user_jwt;

  SELECT * INTO _record_0
  FROM operation_.end_visit_();
  --RAISE NOTICE E'end_visit_:\n%', _record_0;

  PERFORM operation_.end_session_();


  BEGIN
    PERFORM operation_.begin_session_(_visitor_jwt);
    RAISE EXCEPTION 'Revoked token should not be able to be reused!';
  EXCEPTION WHEN case_not_found THEN
  END;


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record_0
  FROM operation_.query_active_subject_();
  --RAISE NOTICE E'query_active_subject_:\n%', _record_0;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record_0
  FROM operation_.create_agency_('test agency', 'test');
  --RAISE NOTICE E'create_agency_:\n%', _record_0;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  PERFORM operation_.create_stripe_account_(_record_0.uuid_, 'acct_test');

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record_2 FROM operation_.query_user_by_email_address_('test@example.com');

  IF _record_2 IS NULL THEN
    RAISE EXCEPTION 'A user should have been returned';
  END IF;

  SELECT * INTO _record_2 FROM operation_.query_user_by_email_address_('invitee@example.com');

  IF _record_2 IS NOT NULL THEN
    RAISE EXCEPTION 'No user should have been returned';
  END IF;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record_1 FROM operation_.invite_user_(_record_0.uuid_, 'invitee@example.com', 'client');
  --RAISE NOTICE E'invite_user_:\n%', _record_1;
  SELECT * INTO _record_1 FROM operation_.query_user_invite_(_record_1.uuid_);
  --RAISE NOTICE E'query_user_invite_:\n%', _record_1;

  OPEN _cursor FOR SELECT * FROM operation_.query_user_invite_by_agency_(_record_0.uuid_);
  LOOP
    FETCH FROM _cursor INTO _record_2;
    EXIT WHEN NOT FOUND;
    --RAISE NOTICE E'query_user_invite_by_agency_:\n%', _record_2;
  END LOOP;
  CLOSE _cursor;

  SELECT * INTO _record_1 FROM operation_.cancel_user_invite_(_record_1.uuid_);
  --RAISE NOTICE E'cancel_user_invite_:\n%', _record_1;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  PERFORM operation_.create_service_(_record_0.uuid_, 'test service 1');
  PERFORM operation_.create_service_(_record_0.uuid_, 'test service 2');

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record_0 FROM operation_.query_agency_(_record_0.uuid_);
  --RAISE NOTICE E'query_agency_:\n%', _record_0;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  OPEN _cursor FOR SELECT * FROM operation_.query_service_by_agency_(_record_0.uuid_);
  LOOP
    FETCH FROM _cursor INTO _record_0;
    EXIT WHEN NOT FOUND;
    --RAISE NOTICE E'query_service_by_agency_:\n%', _record_0;
  END LOOP;
  CLOSE _cursor;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record_0 FROM operation_.query_agency_by_subdomain_name_('test');
  SELECT * INTO _record_1 FROM operation_.query_service_by_agency_(_record_0.uuid_) WHERE name_ = 'test service 2';
  SELECT * INTO _record_1 FROM operation_.query_service_(_record_1.uuid_);
  PERFORM operation_.delete_service_(_record_1.uuid_);

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record_0 FROM operation_.query_service_by_agency_(_record_0.uuid_) WHERE name_ = 'test service 1';
  SELECT * INTO _record_1 FROM operation_.create_service_step_(_record_0.uuid_, 'test service step 2', 'form');
  SELECT * INTO _record_1 FROM operation_.create_service_step_(_record_0.uuid_, 'test service step 3', 'confirmation_by_agency', _record_1.uuid_);
  SELECT * INTO _record_1 FROM operation_.create_service_step_(_record_0.uuid_, 'test service step 4', 'document_delivery', _record_1.uuid_);
  SELECT * INTO _record_1 FROM operation_.create_service_step_(_record_0.uuid_, 'test service step 1', 'payment');
  SELECT * INTO _record_1 FROM operation_.create_service_step_(_record_0.uuid_, 'test service step del', 'payment', _record_1.uuid_);
  SELECT * INTO _record_1 FROM operation_.delete_service_step_(_record_1.uuid_);

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  OPEN _cursor FOR SELECT * FROM operation_.query_service_step_by_service_(_record_0.uuid_);
  LOOP
    FETCH FROM _cursor INTO _record_1;
    EXIT WHEN NOT FOUND;
    --RAISE NOTICE E'query_service_step_by_service_:\n%', _record_1;
  END LOOP;
  CLOSE _cursor;

  PERFORM operation_.end_session_();


  PERFORM operation_.begin_session_(_user_jwt);

  SELECT * INTO _record_0
  FROM operation_.log_out_user_();
  --RAISE NOTICE E'log_out_user_:\n%', _record_0;

  PERFORM operation_.end_session_();

EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'TESTS FAILED';
  RAISE;

END;
$$;

\echo 'TESTS PASSED'
