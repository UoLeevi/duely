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

CREATE OR REPLACE FUNCTION operation_.sign_up_user_(_verification_uuid uuid) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _user security_.user_;
  _email_address text;
  _data jsonb;
  _password text;
  _name text;
BEGIN
  PERFORM security_.control_operation_('sign_up_user_');

  UPDATE security_.email_address_verification_ SET
    status_ = 'verified',
    status_at_ = CURRENT_TIMESTAMP
  WHERE uuid_ = _verification_uuid
    AND status_ IS NULL
  RETURNING email_address_, data_ INTO _email_address, _data;

  IF _email_address IS NULL OR _data IS NULL THEN
    RAISE 'No matching verification found.' USING ERRCODE = '20000';
  END IF;

  SELECT _data->>'password', _data->>'name' INTO _password, _name;

  IF _password IS NULL OR _name IS NULL THEN
    RAISE 'Invalid data.' USING ERRCODE = '20000';
  END IF;

  INSERT INTO security_.user_ (name_, email_address_, password_hash_)
  SELECT _name, _email_address, pgcrypto_.crypt(_password, pgcrypto_.gen_salt('md5'))
  RETURNING * INTO _user;

  RETURN (SELECT operation_.log_in_user_(_email_address, _password));
END
$$;

ALTER TABLE security_.user_ ADD COLUMN name_ text;
ALTER TABLE security_.user_ ALTER COLUMN uuid_ SET DEFAULT pgcrypto_.gen_random_uuid();

UPDATE security_.user_ u
SET name_ = s.name_
FROM security_.subject_ s
WHERE s.uuid_ = u.uuid_;

ALTER TABLE security_.user_ ALTER COLUMN name_ SET NOT NULL;

CALL internal_.setup_auditing_('security_.user_');

-- CREATE VIEW security_.active_user_ AS
--  SELECT uuid_, name_, email_address_
--  FROM security_.user_
--  WHERE uuid_ = current_setting('security_.token_.subject_uuid_'::text, true)::uuid;

-- CREATE VIEW security_.active_subject_ AS
--  SELECT s.uuid_, s.type_
--  FROM security_.subject_ s
--  WHERE s.uuid_ = current_setting('security_.token_.subject_uuid_'::text, true)::uuid;

CREATE OR REPLACE FUNCTION operation_.query_active_subject_() RETURNS TABLE(uuid_ uuid, name_ text, type_ text, email_address_ text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  PERFORM security_.control_operation_('query_active_subject_');

  RETURN QUERY
  SELECT s.uuid_, COALESCE(u.name_, 'visitor') name_, s.type_, u.email_address_
  FROM security_.active_subject_ s
  LEFT JOIN security_.user_ u ON s.uuid_ = u.uuid_;

END
$$;

CALL internal_.drop_auditing_('security_.subject_');
ALTER TABLE security_.subject_ ALTER COLUMN name_ DROP NOT NULL;
-- ALTER TABLE security_.subject_ DROP COLUMN name_;

CREATE FUNCTION internal_.insert_subject_for_user_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO security_.subject_ (uuid_, type_)
  SELECT u.uuid_, 'user'
  FROM _user u;

  RETURN NULL;
END
$$;

CREATE TRIGGER tr_after_insert_insert_subject_ AFTER INSERT ON security_.user_ REFERENCING NEW TABLE AS _user FOR EACH STATEMENT EXECUTE PROCEDURE internal_.insert_subject_for_user_();

CALL internal_.setup_resource_('security_.user_', 'user', 'user');

ALTER TABLE ONLY security_.user_
    ALTER CONSTRAINT user__uuid__fkey DEFERRABLE INITIALLY DEFERRED;

CREATE OR REPLACE FUNCTION policy_.user_can_query_themselves_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    JOIN _resource r ON s.uuid_ = s.uuid_
    WHERE s.type_ = 'user'
  ) THEN
    RETURN array_cat(_keys, '{uuid_, name_, email_address_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.user_can_change_name_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    JOIN _resource r ON s.uuid_ = s.uuid_
    WHERE s.type_ = 'user'
  ) THEN
    RETURN array_cat(_keys, '{name_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.user_can_delete_only_themselves_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    JOIN _resource r ON s.uuid_ = s.uuid_
    WHERE s.type_ = 'user'
  ) THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;
END
$$;

PERFORM security_.register_policy_('security_.user_', 'query', 'policy_.user_can_query_themselves_');
-- PERFORM security_.register_policy_('security_.user_', 'create', 'policy_.');
PERFORM security_.register_policy_('security_.user_', 'update', 'policy_.user_can_change_name_');
PERFORM security_.register_policy_('security_.user_', 'delete', 'policy_.user_can_delete_only_themselves_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
