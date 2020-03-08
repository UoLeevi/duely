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

CREATE FUNCTION operation_.query_user_invite_by_subject_(_subject_uuid uuid, _status text[] DEFAULT NULL::text[]) RETURNS TABLE(uuid_ uuid, agency_uuid_ uuid, inviter_uuid_ uuid, invitee_email_address_ text, role_uuid_ uuid, status_ text, status_at_ timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _subject_uuid subject_uuid_, _status invite_status_ INTO _arg;
  PERFORM security_.control_operation_('query_user_invite_by_subject_', _arg);

  RETURN QUERY
  SELECT ui.uuid_, ui.agency_uuid_, ui.inviter_uuid_, ui.invitee_email_address_, ui.role_uuid_, ui.status_, ui.status_at_
  FROM application_.user_invite_ ui
  JOIN security_.user u ON ui.invitee_email_address_ = u.email_address_
  WHERE u.uuid_ = _subject_uuid
    AND (_status IS NULL 
     OR ui.status_ = ANY (COALESCE(_status, '{}'::text[])));

END
$$;

INSERT INTO security_.operation_ (name_, log_events_) VALUES ('query_user_invite_by_subject_', 'f');
PERFORM security_.implement_policy_allow_('query_user_invite_by_subject_', 'subject_is_active_user_', $$
BEGIN
  RETURN
    EXISTS (
      SELECT 1
      FROM security_.active_user_ u
      WHERE u.uuid_ = _arg.subject_uuid_
    );
END
$$);

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
