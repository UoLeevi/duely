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

  CREATE FUNCTION operation_.query_user_invite_(_invite_uuid uuid) RETURNS TABLE(uuid_ uuid, agency_uuid_ uuid, inviter_uuid_ uuid, invitee_email_address_ text, role_uuid_ uuid, status_ text, status_at_ timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  DECLARE
    _arg RECORD;
  BEGIN
    SELECT _invite_uuid invite_uuid_, agency_uuid_ INTO _arg
    FROM application_.user_invite_
    WHERE uuid_ = _invite_uuid;
    PERFORM security_.control_operation_('query_user_invite_', _arg);

    RETURN QUERY
    SELECT uuid_, agency_uuid_, inviter_uuid_, invitee_email_address_, role_uuid_, status_, status_at_
    FROM application_.user_invite_
    WHERE uuid_ = _invite_uuid;

  END
  $$;

  INSERT INTO security_.operation_ (name_, log_events_) VALUES ('query_user_invite_', 'f');

  PERFORM security_.implement_policy_allow_('query_user_invite_', 'agent_in_agency_');
  PERFORM security_.implement_policy_allow_('query_user_invite_', 'invitee_of_user_invite_', $$
    BEGIN 
    RETURN
      EXISTS (
        SELECT 1
        FROM security_.active_subject_ s
        JOIN application_.user_invite_ ui ON s.email_address_ = ui.invitee_email_address_
        WHERE ui.uuid_ = _arg.invite_uuid_
      );
    END
  $$);

  UPDATE security_.policy_assignment_
  SET
    policy_name_ = 'invitee_of_user_invite_'
  WHERE policy_name_ IN ('invitee_can_accept_', 'invitee_can_decline_');

  DROP FUNCTION policy_.invitee_can_accept_;
  DROP FUNCTION policy_.invitee_can_decline_;

EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
