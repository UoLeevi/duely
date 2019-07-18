-- psql -U duely -d duely -f duely-test.sql

DO 
LANGUAGE plpgsql
$$
DECLARE
  _visitor_jwt text;
  _user_jwt text;
BEGIN
  SELECT operation_.begin_visit_() INTO _visitor_jwt;
  --RAISE NOTICE '_visitor_jwt: %', _visitor_jwt;

  PERFORM operation_.begin_session_(_visitor_jwt, 'test');
  PERFORM operation_.end_visit_();
  PERFORM operation_.end_session_();

END
$$;

\echo 'TESTS PASSED'
