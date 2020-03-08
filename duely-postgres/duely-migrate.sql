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

CREATE FUNCTION operation_.cancel_user_invite_(_invite_uuid uuid) RETURNS application_.user_invite_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _user_invite application_.user_invite_;
  _arg RECORD;
BEGIN
  SELECT _invite_uuid invite_uuid_, agency_uuid_ INTO _arg
  FROM application_.user_invite_
  WHERE uuid_ = _invite_uuid;
  PERFORM security_.control_operation_('cancel_user_invite_', _arg);

  IF NOT EXISTS (
    SELECT u.uuid_
    FROM security_.user_ u
    JOIN application_.user_invite_ ui ON u.email_address_ = ui.invitee_email_address_
    WHERE ui.uuid_ = _invite_uuid
  ) THEN
    RAISE 'Invite does not exist.' USING ERRCODE = '20000';
  END IF;

  UPDATE application_.user_invite_
  SET
    status_ = 'cancelled',
    status_at_ = CURRENT_TIMESTAMP
  WHERE uuid_ = _invite_uuid
  RETURNING * INTO _user_invite;

  RETURN _user_invite;
END
$$;

INSERT INTO security_.operation_ (name_, log_events_) VALUES ('cancel_user_invite_', 'f');
PERFORM security_.implement_policy_allow_('cancel_user_invite_', 'agent_in_agency_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
