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
      JOIN security_.role_ r ON r.name_ = _role_name AND sa.role_uuid_ = r.uuid_
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

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
