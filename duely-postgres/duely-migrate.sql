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

CREATE OR REPLACE FUNCTION internal_.try_verify_sign_up_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _uuid uuid;
  _sign_up security_.sign_up_;
  _user_uuid uuid;
BEGIN
  IF NOT NEW.verified_ THEN
    RETURN NULL;
  END IF;

  SELECT * INTO _sign_up
  FROM security_.sign_up_
  WHERE uuid_ = NEW.uuid_
    AND status_ = 'started'
  FOR UPDATE;

  INSERT INTO security_.user_ (email_address_, name_, password_hash_)
  SELECT _sign_up.email_address_, _sign_up.name_, _sign_up.password_hash_
  RETURNING uuid_ INTO _user_uuid;

  IF _user_uuid IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE security_.sign_up_
  SET
    status_ = 'verified',
    user_uuid_ = _user_uuid
  WHERE uuid_ = NEW.uuid_
  RETURNING uuid_ INTO _uuid;

  RETURN NEW;
END
$$;

CREATE OR REPLACE FUNCTION internal_.try_cancel_sign_up_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _uuid uuid;
BEGIN
  UPDATE security_.sign_up_
  SET 
    status_ = 'cancelled'
  WHERE uuid_ = OLD.uuid_
    AND status_ IN ('started', 'cancelled')
  RETURNING uuid_ INTO _uuid;

  IF _uuid IS NULL THEN
    RETURN NULL;
  ELSE
    RETURN NEW;
  END IF;
END
$$;

CREATE TABLE security_.password_reset_ (
    uuid_ uuid PRIMARY KEY,
    user_uuid_ uuid REFERENCES security_.user_ (uuid_) NOT NULL,
    password_hash_ text NOT NULL,
    data_ jsonb DEFAULT '{}'::jsonb NOT NULL,
    started_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at_ timestamp with time zone DEFAULT (CURRENT_TIMESTAMP + '1 day'::interval) NOT NULL,
    status_ public.verification_status_ DEFAULT 'started'::public.verification_status_ NOT NULL,
    status_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    initiator_subject_uuid_ uuid DEFAULT internal_.current_subject_uuid_() REFERENCES security_.subject_ (uuid_) NOT NULL
);

CREATE VIEW application_.password_reset_ AS
 SELECT p.uuid_,
    u.uuid_ user_uuid_,
    u.email_address_,
    p.data_,
    NULL::text AS password_,
        CASE p.status_
            WHEN 'verified'::public.verification_status_ THEN true
            ELSE false
        END AS verified_
   FROM security_.password_reset_ p
   JOIN security_.user_ u ON u.uuid_ = p.user_uuid_
  WHERE ((p.status_ = 'verified'::public.verification_status_) OR ((CURRENT_TIMESTAMP >= p.started_at_) AND (CURRENT_TIMESTAMP <= p.expires_at_)));


ALTER TABLE ONLY application_.password_reset_ ALTER COLUMN uuid_ SET DEFAULT pgcrypto_.gen_random_uuid();

CALL internal_.setup_resource_('application_.password_reset_', 'password reset', 'pwd', '{}', 'security_.user_');
CALL internal_.setup_auditing_('security_.password_reset_');


CREATE FUNCTION internal_.resource_delete_password_reset_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
BEGIN

  DELETE FROM application_.resource_ r
  USING _old_table d
  WHERE d.uuid_ = r.uuid_;

  RETURN NULL;

END;
$$;

CREATE FUNCTION internal_.resource_insert_password_reset_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = 'password reset';

  PERFORM internal_.resource_insert_(_resource_definition, to_jsonb(r))
  FROM _new_table r;

  RETURN NULL;

END;
$$;

CREATE FUNCTION internal_.resource_update_password_reset_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = 'password reset';

  PERFORM internal_.resource_update_(_resource_definition, to_jsonb(r))
  FROM _new_table r;

  RETURN NULL;

END;
$$;

CREATE FUNCTION internal_.try_cancel_password_reset_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _uuid uuid;
BEGIN
  UPDATE security_.password_reset_
  SET 
    status_ = 'cancelled'
  WHERE uuid_ = OLD.uuid_
    AND status_ IN ('started', 'cancelled')
  RETURNING uuid_ INTO _uuid;

  IF _uuid IS NULL THEN
    RETURN NULL;
  ELSE
    RETURN NEW;
  END IF;
END
$$;

CREATE FUNCTION internal_.try_start_password_reset_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO security_.password_reset_(uuid_, user_uuid_, data_, password_hash_)
  SELECT NEW.uuid_, u.uuid_, COALESCE(NEW.data_, '{}'::jsonb), pgcrypto_.crypt(NEW.password_, pgcrypto_.gen_salt('md5'))
  FROM security_.user_ u
  WHERE u.email_address_ = NEW.email_address_;

  RETURN NEW;
END
$$;

CREATE OR REPLACE FUNCTION internal_.try_verify_password_reset_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _uuid uuid;
  _password_reset security_.password_reset_;
  _user_uuid uuid;
BEGIN
  IF NOT NEW.verified_ THEN
    RETURN NULL;
  END IF;

  UPDATE security_.password_reset_
  SET 
    status_ = 'verified'
  WHERE uuid_ = NEW.uuid_
    AND status_ = 'started'
  RETURNING * INTO _password_reset;

  UPDATE security_.user_
  SET
    password_hash_ = _password_reset.password_hash_
  WHERE uuid_ = _password_reset.user_uuid_
  RETURNING uuid_ INTO _user_uuid;

  IF _user_uuid IS NULL THEN
    RETURN NULL;
  ELSE
    RETURN NEW;
  END IF;
END
$$;


CREATE FUNCTION policy_.anyone_can_create_password_reset_(_resource_definition security_.resource_definition_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN array_cat(_keys, '{email_address_, data_, password_}');
END
$$;


CREATE FUNCTION policy_.anyone_can_verify_password_reset_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- NOTE: Currently, anyone who has the password_reset_id can verify the password reset.
  RETURN array_cat(_keys, '{verified_}');
END
$$;

CREATE FUNCTION policy_.password_reset_can_be_queried_by_initiator_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.password_reset_
    WHERE initiator_subject_uuid_ = internal_.current_subject_uuid_()
      AND uuid_ = _resource.uuid_
  ) THEN
    RETURN array_cat(_keys, '{uuid_, user_uuid_, data_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE FUNCTION policy_.anyone_can_cancel_password_reset_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  NULL;
END
$$;

PERFORM security_.register_policy_('application_.password_reset_', 'query', 'policy_.password_reset_can_be_queried_by_initiator_');
PERFORM security_.register_policy_('application_.password_reset_', 'create', 'policy_.anyone_can_create_password_reset_');
PERFORM security_.register_policy_('application_.password_reset_', 'update', 'policy_.anyone_can_verify_password_reset_');
PERFORM security_.register_policy_('application_.password_reset_', 'delete', 'policy_.anyone_can_cancel_password_reset_');

CREATE TRIGGER tr_instead_of_delete_try_cancel_password_reset INSTEAD OF DELETE ON application_.password_reset_ FOR EACH ROW EXECUTE PROCEDURE internal_.try_cancel_password_reset_();
CREATE TRIGGER tr_instead_of_insert_try_start_password_reset INSTEAD OF INSERT ON application_.password_reset_ FOR EACH ROW EXECUTE PROCEDURE internal_.try_start_password_reset_();
CREATE TRIGGER tr_instead_of_update_try_verify_password_reset INSTEAD OF UPDATE ON application_.password_reset_ FOR EACH ROW EXECUTE PROCEDURE internal_.try_verify_password_reset_();

CREATE TRIGGER tr_after_delete_resource_delete_password_reset AFTER DELETE ON security_.password_reset_ REFERENCING OLD TABLE AS _old_table FOR EACH ROW EXECUTE PROCEDURE internal_.resource_delete_password_reset_();
CREATE TRIGGER tr_after_insert_resource_insert_password_reset AFTER INSERT ON security_.password_reset_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE PROCEDURE internal_.resource_insert_password_reset_();
CREATE TRIGGER tr_after_update_resource_update_password_reset AFTER UPDATE ON security_.password_reset_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE PROCEDURE internal_.resource_update_password_reset_();


-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
