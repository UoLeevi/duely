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

CREATE OR REPLACE FUNCTION operation_.remove_user_from_agency_(_agency_uuid uuid, _subject_uuid uuid) RETURNS bigint
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _count bigint;
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_, _subdomain_uuid subdomain_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('remove_user_from_agency_', _arg);

  WITH
    _deleted_sa AS (
      DELETE FROM security_.subject_assignment sa
      USING application_.agency_ a
      WHERE a.subdomain_uuid_ = sa.subdomain_uuid_
        AND a.uuid_ = _agency_uuid
        AND sa.subject_uuid_ = _subject_uuid
      RETURNING *
    ),
    _deleted_ui AS (
      DELETE FROM application_.user_invite_ ui
      USING security_.user_ u
      WHERE ui.agency_uuid_ = _agency_uuid
        AND ui.subject_uuid_ = _subject_uuid
        AND u.uuid_ = _subject_uuid
        AND u.email_address_ = ui.invitee_email_address_
      RETURNING *
    )
  SELECT (SELECT count(1) FROM _deleted_sa) + (SELECT count(1) FROM _deleted_ui) INTO _count;

  RETURN _count;
END
$$;

CREATE OR REPLACE FUNCTION operation_.invite_user_(_agency_uuid uuid, _email_address text, _role_name text DEFAULT 'agent'::text) RETURNS application_.user_invite_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _user_invite application_.user_invite_;
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_, _email_address email_address_, _role_name role_name_ INTO _arg; 
  PERFORM security_.control_operation_('invite_user_', _arg);

  IF EXISTS (
      SELECT 1
      FROM security_.subject_assignment_ sa
      JOIN security_.user_ u ON u.uuid_ = sa.subject_uuid_
      JOIN application_.agency_ a ON a.subdomain_uuid_ = sa.subdomain_uuid_
      JOIN application_.role_ r ON r.name_ = _role_name AND sa.role_uuid_ = r.uuid_
      WHERE u.email_address_ = _email_address
        AND a.uuid_ = _agency_uuid
    ) THEN
    RAISE 'User is already a % of the agency.', _role_name USING ERRCODE = '20000';
  END IF;

  INSERT INTO application_.user_invite_ (agency_uuid_, inviter_uuid_, invitee_email_address_, role_uuid_)
  SELECT _agency_uuid, current_setting('security_.token_.subject_uuid_'::text, false)::uuid, _email_address, r.uuid_
  FROM security_.role_ r
  WHERE r.name_ = _role_name
  RETURNING * INTO _user_invite;

  RETURN _user_invite;
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
    SELECT u.uuid_ INTO _invitee_uuid
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
    SELECT u.uuid_ INTO _invitee_uuid
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
