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

CREATE TABLE application_.client_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL REFERENCES application_.agency_ (uuid_),
    name_ text NOT NULL,
    email_address_ text NULL,
    invite_uuid_ uuid NOT NULL REFERENCES application_.user_invite_ (uuid_),
    subject_uuid_ uuid NOT NULL REFERENCES security_.user_ (uuid_),
    UNIQUE (agency_uuid_, name_)
);

CALL internal_.setup_auditing_('application_.client_');
CALL internal_.setup_notifications_('application_.client_');

CREATE FUNCTION operation_.query_client_by_agency_(_agency_uuid uuid) RETURNS TABLE(uuid_ uuid, agency_uuid_ uuid, name_ text, email_address_ text, invite_uuid_ uuid, subject_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_ INTO _arg;
  PERFORM security_.control_operation_('query_client_by_agency_', _arg);

  RETURN QUERY
  SELECT c.uuid_, c.agency_uuid_, c.name_, c.email_address_, c.invite_uuid_, c.subject_uuid_
  FROM application_.client_ c
  WHERE c.agency_uuid_ = _agency_uuid;

END
$$;

PERFORM security_.implement_policy_allow_('query_client_by_agency_', 'agent_in_agency_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
