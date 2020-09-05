-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'MIGRATION STARTED'
\set QUIET true

DO 
LANGUAGE plpgsql
$_MIGRATION_$
DECLARE

BEGIN
-- MIGRATION CODE START

CREATE FUNCTION security_.unregister_policy_(_table regclass, _operation_type public.operation_type_, _policy_function regproc) RETURNS security_.policy_
    LANGUAGE plpgsql
    AS $$
DECLARE
  _resource_definition_uuid uuid;
  _policy security_.policy_;
BEGIN
  SELECT uuid_ INTO _resource_definition_uuid
  FROM security_.resource_definition_
  WHERE table_ = _table;

  DELETE FROM security_.policy_
  WHERE resource_definition_uuid_ = _resource_definition_uuid
    AND operation_type_ = _operation_type
    AND function_::regproc = _policy_function
  RETURNING * INTO _policy;

  IF _policy.after_uuid_ IS NOT NULL THEN
    UPDATE security_.policy_
    SET after_uuid_ = policy_.after_uuid_
    WHERE after_uuid_ = policy_.uuid_;
  END IF;

  RETURN _policy;
END
$$;

UPDATE security_.resource_definition_
SET
  search_ = '{verification_code_}'
WHERE name_ IN ('sign up', 'password reset');

CALL internal_.drop_auditing_('security_.sign_up_');
CALL internal_.drop_auditing_('security_.password_reset_');

ALTER TABLE security_.password_reset_ ADD COLUMN verification_code_ uuid NOT NULL DEFAULT pgcrypto_.gen_random_uuid();
ALTER TABLE security_.sign_up_ ADD COLUMN verification_code_ uuid NOT NULL DEFAULT pgcrypto_.gen_random_uuid();

CALL internal_.setup_auditing_('security_.sign_up_');
CALL internal_.setup_auditing_('security_.password_reset_');

CREATE OR REPLACE VIEW application_.password_reset_ AS
 SELECT p.uuid_,
    u.uuid_ user_uuid_,
    u.email_address_,
    p.data_,
    NULL::text AS password_,
        CASE p.status_
            WHEN 'verified'::public.verification_status_ THEN true
            ELSE false
        END AS verified_,
    p.verification_code_
   FROM security_.password_reset_ p
   JOIN security_.user_ u ON u.uuid_ = p.user_uuid_
  WHERE ((p.status_ = 'verified'::public.verification_status_) OR ((CURRENT_TIMESTAMP >= p.started_at_) AND (CURRENT_TIMESTAMP <= p.expires_at_)));

CREATE OR REPLACE VIEW application_.sign_up_ AS
 SELECT s.uuid_,
    s.user_uuid_,
    s.email_address_,
    s.name_,
    s.data_,
    NULL::text AS password_,
        CASE s.status_
            WHEN 'verified'::public.verification_status_ THEN true
            ELSE false
        END AS verified_,
    s.verification_code_
   FROM security_.sign_up_ s
  WHERE ((s.status_ = 'verified'::public.verification_status_) OR ((CURRENT_TIMESTAMP >= s.started_at_) AND (CURRENT_TIMESTAMP <= s.expires_at_)));


ALTER TABLE ONLY application_.password_reset_ ALTER COLUMN uuid_ SET DEFAULT pgcrypto_.gen_random_uuid();
ALTER TABLE ONLY application_.sign_up_ ALTER COLUMN uuid_ SET DEFAULT pgcrypto_.gen_random_uuid();

CREATE OR REPLACE FUNCTION policy_.anyone_with_verification_code_can_verify_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF _resource.search_->>'verification_code_' = _data->>'verification_code_' THEN
    RETURN array_cat(_keys, '{verified_, verification_code_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.password_reset_', 'update', 'policy_.anyone_with_verification_code_can_verify_');
PERFORM security_.register_policy_('application_.sign_up_', 'update', 'policy_.anyone_with_verification_code_can_verify_');
PERFORM security_.unregister_policy_('application_.password_reset_', 'update', 'policy_.anyone_can_verify_password_reset_');
PERFORM security_.unregister_policy_('application_.sign_up_', 'update', 'policy_.anyone_can_verify_sign_up_');

DROP FUNCTION policy_.anyone_can_verify_password_reset_;
DROP FUNCTION policy_.anyone_can_verify_sign_up_;

CREATE OR REPLACE FUNCTION policy_.password_reset_can_be_queried_by_initiator_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.password_reset_
    WHERE initiator_subject_uuid_ = internal_.current_subject_uuid_()
      AND uuid_ = _resource.uuid_
  ) THEN
    RETURN array_cat(_keys, '{uuid_, user_uuid_, data_, verification_code_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.sign_up_can_be_queried_by_initiator_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.sign_up_
    WHERE initiator_subject_uuid_ = internal_.current_subject_uuid_()
      AND uuid_ = _resource.uuid_
  ) THEN
    RETURN array_cat(_keys, '{uuid_, user_uuid_, data_, verification_code_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
