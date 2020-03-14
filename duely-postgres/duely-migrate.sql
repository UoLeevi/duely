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


CREATE OR REPLACE FUNCTION operation_.accept_user_invite_(_invite_uuid uuid) RETURNS application_.user_invite_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _user_invite application_.user_invite_;
  _arg RECORD;
BEGIN
  SELECT _invite_uuid invite_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('accept_user_invite_', _arg);

  IF NOT EXISTS (
    SELECT 1
    FROM security_.user_ u
    JOIN application_.user_invite_ ui ON u.email_address_ = ui.invitee_email_address_
    WHERE ui.uuid_ = _invite_uuid
  ) THEN
    RAISE 'Invite does not exist.' USING ERRCODE = '20000';
  END IF;

  UPDATE application_.user_invite_
  SET
    status_ = 'accepted',
    status_at_ = CURRENT_TIMESTAMP
  WHERE uuid_ = _invite_uuid
  RETURNING * INTO _user_invite;

  INSERT INTO security_.subject_assignment_ (role_uuid_, subdomain_uuid_, subject_uuid_)
  SELECT _user_invite.role_uuid_, a.subdomain_uuid_, u.uuid_
  FROM security_.user_ u
  JOIN application_.agency_ a ON a.uuid_ = _user_invite.agency_uuid_
  WHERE u.email_address_ = _user_invite.invitee_email_address_;

  RETURN _user_invite;
END
$$;

CREATE OR REPLACE FUNCTION operation_.decline_user_invite_(_invite_uuid uuid) RETURNS application_.user_invite_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _user_invite application_.user_invite_;
  _arg RECORD;
BEGIN
  SELECT _invite_uuid invite_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('decline_user_invite_', _arg);

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
    status_ = 'declined',
    status_at_ = CURRENT_TIMESTAMP
  WHERE uuid_ = _invite_uuid
  RETURNING * INTO _user_invite;

  RETURN _user_invite;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
