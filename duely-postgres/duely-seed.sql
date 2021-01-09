-- psql -v service_account_password="'$DUELY_SERVICE_ACCOUNT_PASSWORD'" -U duely -d duely -f duely-seed.sql

\set ON_ERROR_STOP true

\echo 'SEED STARTED'
\set QUIET true

CREATE FUNCTION pg_temp.seed_data_(_service_account_password text) RETURNS void
    LANGUAGE plpgsql
    AS $_SEED_$
DECLARE
  _visitor_jwt text;
  _data jsonb;
  _result_0 jsonb;
BEGIN

  -- CREATE TEST USER
  SELECT operation_.begin_visit_() INTO _visitor_jwt;
  PERFORM operation_.begin_session_(_visitor_jwt);

  _data := '{
    "name": "test user",
    "email_address": "test@duely.app",
    "password": "password"
  }';
  SELECT * INTO _result_0 FROM operation_.create_resource_('sign up', _data);

  _data := '{
    "verified": true
  }';
  _data := _data || jsonb_build_object('verification_code', _result_0->>'verification_code');
  PERFORM operation_.update_resource_(_result_0->>'id', _data);

  PERFORM operation_.end_visit_();
  PERFORM operation_.end_session_();


  -- CREATE SERVICE ACCOUNT
  SELECT operation_.begin_visit_() INTO _visitor_jwt;
  PERFORM operation_.begin_session_(_visitor_jwt);

  _data := '{
    "name": "serviceaccount",
    "email_address": "serviceaccount@duely.app",
    "data": {
      "private": true
    }
  }';
  _data := _data || jsonb_build_object('password', _service_account_password);
  SELECT * INTO _result_0 FROM operation_.create_resource_('sign up', _data);

  _data := '{
    "verified": true
  }';
  _data := _data || jsonb_build_object('verification_code', _result_0->>'verification_code');
  PERFORM operation_.update_resource_(_result_0->>'id', _data);

  PERFORM operation_.end_visit_();
  PERFORM operation_.end_session_();

END;
$_SEED_$;

SELECT pg_temp.seed_data_(:service_account_password);

\echo 'SEED COMPLETED'
