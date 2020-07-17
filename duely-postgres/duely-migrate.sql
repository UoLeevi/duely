-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'Running migration...'
\set QUIET true

DO 
LANGUAGE plpgsql
$_$
DECLARE

BEGIN
-- MIGRATION CODE START

CREATE OR REPLACE FUNCTION operation_.query_user_() RETURNS TABLE(uuid_ uuid, name_ text, email_address_ text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  PERFORM security_.control_operation_('query_user_');

  RETURN QUERY
  SELECT s.uuid_, s.name_, u.email_address_
  FROM security_.subject_ s
  JOIN security_.user_ u ON s.uuid_ = u.uuid_;

END
$$;

CREATE OR REPLACE FUNCTION operation_.query_user_by_email_address_(_email_address text) RETURNS TABLE(uuid_ uuid, name_ text, email_address_ text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _email_address email_address_ INTO _arg; 
  PERFORM security_.control_operation_('query_user_by_email_address_', _arg);

  RETURN QUERY
  SELECT s.uuid_, s.name_, u.email_address_
  FROM security_.subject_ s
  JOIN security_.user_ u ON s.uuid_ = u.uuid_
  WHERE u.email_address_ = lower(_email_address);

END
$$;

INSERT INTO security_.operation_ (name_, log_events_) VALUES ('query_user_by_email_address_', 'f');
PERFORM security_.implement_policy_allow_('query_user_by_email_address_', 'logged_in_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
