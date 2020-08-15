-- psql -U duely -d duely -f duely-seed.sql

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

  SELECT * INTO _record_0 FROM operation_.start_email_address_verification_('test@duely.app', 'f', '{"password":"password","name":"test user"}');
  PERFORM operation_.sign_up_user_(_record_0.uuid_);

  PERFORM operation_.end_session_();

END;
$$;
