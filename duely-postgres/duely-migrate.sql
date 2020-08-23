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

/** TODO:
 * - [x] triggers for sign up resource
 * - [x] tests for sign up resource
 * - [x] tests for user resource
 */

CREATE INDEX resource__search__idx ON application_.resource_ USING GIN (search_);

CREATE OR REPLACE FUNCTION internal_.dynamic_select_(_table regclass, _uuid uuid, _keys text[]) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
DECLARE
  _select_list text;
  _data jsonb;
BEGIN
  SELECT string_agg(format('%1$I', k), ',') INTO _select_list
  FROM unnest(_keys) k;

  EXECUTE '
    WITH
      r AS (
        SELECT ' || COALESCE(_select_list, 'uuid_') || '
        FROM ' || _table || '
        WHERE uuid_ = $1
      )
    SELECT to_jsonb(r)
    FROM r;
  '
  INTO _data
  USING _uuid;

  RETURN _data;
END
$_$;

CREATE OR REPLACE FUNCTION policy_.user_can_change_name_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    WHERE s.type_ = 'user'
      AND s.uuid_ = _resource.uuid_
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
    WHERE s.type_ = 'user'
      AND s.uuid_ = _resource.uuid_
  ) THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;
END
$$;


CREATE OR REPLACE FUNCTION policy_.user_can_query_themselves_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    WHERE s.type_ = 'user'
      AND s.uuid_ = _resource.uuid_
  ) THEN
    RETURN array_cat(_keys, '{uuid_, name_, email_address_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;


CREATE OR REPLACE FUNCTION internal_.try_verify_signup_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _uuid uuid;
  _sign_up security_.sign_up_;
  _user_uuid uuid;
BEGIN
  SELECT * INTO _sign_up
  FROM security_.sign_up_
  WHERE uuid_ = NEW.uuid_
    AND status_ = 'started'
  FOR UPDATE;

  INSERT INTO security_.user_ (email_address_, name_, password_hash_)
  SELECT _sign_up.email_address_, _sign_up.name_, _sign_up.password_hash_
  RETURNING uuid_ INTO _user_uuid;

  UPDATE security_.sign_up_
  SET 
    status_ = 'verified',
    started_at_ = CURRENT_TIMESTAMP,
    user_uuid_ = _user_uuid
  WHERE uuid_ = NEW.uuid_
    AND NEW.verified_ = true
  RETURNING uuid_ INTO _uuid;

  IF _uuid IS NULL THEN
    RETURN NULL;
  ELSE
    RETURN NEW;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION internal_.try_cancel_signup_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _uuid uuid;
BEGIN
  UPDATE security_.sign_up_
  SET 
    status_ = 'cancelled',
    started_at_ = CURRENT_TIMESTAMP
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
    RETURN array_cat(_keys, '{uuid_, user_uuid_, data_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

UPDATE security_.policy_
SET
  function_ = 'policy_.sign_up_can_be_queried_by_initiator_(security_.resource_definition_, application_.resource_, text[])'::regprocedure
WHERE function_ = 'policy_.sign_up_can_be_queried_by_initiator_subject_uuid_(security_.resource_definition_, application_.resource_, text[])'::regprocedure;

DROP FUNCTION policy_.sign_up_can_be_queried_by_initiator_subject_uuid_;


CREATE OR REPLACE FUNCTION policy_.anyone_can_verify_signup_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- NOTE: Currently, anyone who has the sign_up_id can verify the sign up.
  RETURN array_cat(_keys, '{verified_}');
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
