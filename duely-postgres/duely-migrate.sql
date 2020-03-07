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

  CALL internal_.drop_auditing_('application_.user_invite_');
  ALTER TABLE application_.user_invite_ ADD COLUMN status_ text NULL;
  ALTER TABLE application_.user_invite_ ADD COLUMN status_at_ timestamp with time zone NULL;
  CALL internal_.setup_auditing_('application_.user_invite_');

  CREATE OR REPLACE FUNCTION policy_.invitee_can_accept_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ 
  BEGIN 
    RETURN
      EXISTS (
        SELECT 1
        FROM security_.active_subject_ s
        JOIN application_.user_invite_ ui ON s.email_address_ = ui.invitee_email_address_
        WHERE ui.uuid_ = _arg.invite_uuid_
          AND ui.status_ IS NULL
      );
  END
  $$;

  CREATE OR REPLACE FUNCTION operation_.accept_user_invite_(_invite_uuid uuid) RETURNS application_.user_invite_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  DECLARE
    _invitee_uuid uuid;
    _user_invite application_.user_invite_;
    _arg RECORD;
  BEGIN
    SELECT _invite_uuid invite_uuid_ INTO _arg; 
    PERFORM security_.control_operation_('accept_user_invite_', _arg);

    IF NOT EXISTS (
      SELECT s.uuid_ INTO _invitee_uuid
      FROM security_.subject_ s
      JOIN application_.user_invite_ ui ON s.email_address_ = ui.invitee_email_address_
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

    INSERT INTO security_.subject_assingment_ (role_uuid_, subdomain_uuid_, subject_uuid_)
    SELECT ui.uuid_, a.subdomain_uuid_, _invitee_uuid
    FROM _user_invite ui
    JOIN application_.agency_ a ON a.uuid_ = ui.agency_uuid_;

    RETURN _user_invite;
  END
  $$;

  CREATE OR REPLACE FUNCTION operation_.decline_user_invite_(_invite_uuid uuid) RETURNS application_.user_invite_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  DECLARE
    _invitee_uuid uuid;
    _user_invite application_.user_invite_;
    _arg RECORD;
  BEGIN
    SELECT _invite_uuid invite_uuid_ INTO _arg; 
    PERFORM security_.control_operation_('decline_user_invite_', _arg);

    IF NOT EXISTS (
      SELECT s.uuid_ INTO _invitee_uuid
      FROM security_.subject_ s
      JOIN application_.user_invite_ ui ON s.email_address_ = ui.invitee_email_address_
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

  INSERT INTO security_.operation_ (name_, log_events_) VALUES ('decline_user_invite_', 't');

  PERFORM security_.implement_policy_allow_('decline_user_invite_', 'invitee_can_decline_', $$
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

EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
