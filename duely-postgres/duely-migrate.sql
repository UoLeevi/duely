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
 * - [ ] tests for sign up resource
 * - [ ] tests for user resource
 */

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
  WHERE uuid_ = _sign_up.uuid_
  RETURNING uuid_ INTO _uuid;

  IF uuid_ IS NULL THEN
    RETURN NULL;
  ELSE
    RETURN NEW;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION internal_.try_start_signup_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO security_.sign_up_(uuid_, email_address_, name_, data_, password_hash_)
  SELECT NEW.uuid_, NEW.email_address_, NEW.name_, COALESCE(NEW.data_, '{}'::jsonb), pgcrypto_.crypt(NEW.password_, pgcrypto_.gen_salt('md5'));

  RETURN NEW;
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

  IF uuid_ IS NULL THEN
    RETURN NULL;
  ELSE
    RETURN NEW;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION internal_.dynamic_insert_(_table regclass, _data jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
DECLARE
  _column_list text;
  _select_list text;
  _uuid uuid;
BEGIN
  SELECT string_agg(format('%1$I', k), ','), string_agg(format('d.%1$I', k), ',') INTO _column_list, _select_list
  FROM jsonb_object_keys(_data) k;

  EXECUTE '
    INSERT INTO ' || _table || ' (' || _column_list || ')
    SELECT ' || _select_list || '
    FROM jsonb_populate_record(NULL::' || _table || ', $1) d
    RETURNING uuid_;
  '
  INTO _uuid
  USING _data;

  ASSERT _uuid IS NOT NULL, 'internal_.dynamic_insert_ returned NULL';

  RETURN _uuid;
END
$_$;

CREATE OR REPLACE FUNCTION internal_.dynamic_update_(_table regclass, _uuid uuid, _data jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
DECLARE
  _update_list text;
BEGIN
  SELECT string_agg(format('%1$I = d.%1$I', k), ',') INTO _update_list
  FROM jsonb_object_keys(_data) k;

  EXECUTE '
    UPDATE ' || _table || ' r
    SET ' || _update_list || '
    FROM jsonb_populate_record(NULL::' || _table || ', $1) d
    WHERE r.uuid_ = $2
    RETURNING r.uuid_;
  '
  INTO _uuid
  USING _data, _uuid;

  ASSERT _uuid IS NOT NULL, 'internal_.dynamic_update_ returned NULL';

  RETURN _uuid;
END
$_$;

CREATE OR REPLACE FUNCTION policy_.sign_up_can_be_queried_by_initiator_subject_uuid_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
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

CREATE OR REPLACE FUNCTION internal_.extract_referenced_resources_jsonb_(_resource_definition_uuid uuid, _data jsonb) RETURNS TABLE(owner_ jsonb, owned_ jsonb)
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  -- NOTE: This function expects input in external format (i.e. before internal_.convert_from_internal_format_)
  WITH
    _owned AS (
      SELECT jsonb_object_agg(r.key, r.value) data_
      FROM jsonb_each(_data) r
      JOIN pg_class c ON c.relname = r.key || '_'
      JOIN security_.resource_definition_ d ON d.table_ = c.oid
      WHERE d.owner_uuid_ = _resource_definition_uuid
    )
  SELECT _data - ARRAY(SELECT jsonb_object_keys(_owned.data_)) owner_, _owned.data_ owned_
  FROM _owned;
$$;

CREATE OR REPLACE FUNCTION internal_.current_subject_uuid_() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT COALESCE(current_setting('security_.token_.subject_uuid_'::text, true)::uuid, '00000000-0000-0000-0000-000000000000'::uuid);
$$;

ALTER TABLE security_.sign_up_ ALTER COLUMN initiator_subject_uuid_ SET DEFAULT internal_.current_subject_uuid_();

DROP FUNCTION internal_.current_user_uuid_;

ALTER TABLE security_.sign_up_ ALTER COLUMN data_ SET DEFAULT '{}'::jsonb;
ALTER TABLE security_.sign_up_ ALTER COLUMN uuid_ DROP DEFAULT;
ALTER TABLE application_.sign_up_ ALTER COLUMN uuid_ SET DEFAULT pgcrypto_.gen_random_uuid();

DROP FUNCTION internal_.resource_insert_(_resource_definition security_.resource_definition_, _record anyelement);
CREATE OR REPLACE FUNCTION internal_.resource_insert_(_resource_definition security_.resource_definition_, _record jsonb) RETURNS application_.resource_
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource application_.resource_;
  _owner_resource_definition security_.resource_definition_;
  _uuid uuid;
  _owner_uuid uuid;
  _select_list text;
  _search jsonb DEFAULT '{}'::jsonb;
  _id_len int := 6;
BEGIN
  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN
    EXECUTE format('
      SELECT ($1->>%1$L)::uuid;
    ',
    _owner_resource_definition.name_ || '_uuid_')
    INTO _owner_uuid
    USING _record;
  END IF;

  IF _resource_definition.search_ <> '{}'::text[] THEN
    SELECT string_agg(format('
      $1->%1$L %1$I
    ', k), ',') INTO _select_list
    FROM unnest(_resource_definition.search_) k;

    EXECUTE '
      WITH
        r AS (
          SELECT ' || _select_list || '
        )
      SELECT to_jsonb(r)
      FROM r;
    '
    INTO _search
    USING _record;
  END IF;

  LOOP
    BEGIN
      INSERT INTO application_.resource_ (uuid_, search_, owner_uuid_, definition_uuid_, id_)
      SELECT (_record->>'uuid_')::uuid, _search, _owner_uuid, _resource_definition.uuid_, _resource_definition.id_prefix_ || '_' || substring(replace(_record->>'uuid_', '-', '' ) FOR _id_len)
      RETURNING * INTO _resource;
      EXIT;
    EXCEPTION WHEN unique_violation THEN
      _id_len := _id_len + 2;
    END;
  END LOOP;

  RETURN _resource;
END
$_$;

CREATE OR REPLACE FUNCTION internal_.resource_insert_() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource_definition security_.resource_definition_;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE table_ = format('%1$I.%2I', TG_TABLE_SCHEMA, TG_TABLE_NAME)::regclass;

  PERFORM internal_.resource_insert_(_resource_definition, to_jsonb(r))
  FROM _new_table r;

  RETURN NULL;
END
$_$;

CREATE OR REPLACE FUNCTION internal_.resource_update_(_resource_definition security_.resource_definition_, _record jsonb) RETURNS application_.resource_
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource application_.resource_;
  _owner_resource_definition security_.resource_definition_;
  _uuid uuid;
  _owner_uuid uuid;
  _select_list text;
  _search jsonb DEFAULT '{}'::jsonb;
BEGIN
  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN
    EXECUTE format('
      SELECT ($1->>%1$L)::uuid;
    ',
    _owner_resource_definition.name_ || '_uuid_')
    INTO _owner_uuid
    USING _record;
  END IF;

  IF _resource_definition.search_ <> '{}'::text[] THEN
    SELECT string_agg(format('
      $1->%1$L %1$I
    ', k), ',') INTO _select_list
    FROM unnest(_resource_definition.search_) k;

    EXECUTE '
      WITH
        r AS (
          SELECT ' || _select_list || '
        )
      SELECT to_jsonb(r)
      FROM r;
    '
    INTO _search
    USING _record;
  END IF;

  UPDATE application_.resource_ r
  SET
    search_ = _search,
    owner_uuid_ = _owner_uuid
  WHERE r.uuid_ = (_record->>'uuid_')::uuid
  RETURNING * INTO _resource;

  RETURN _resource;
END
$_$;


CREATE OR REPLACE FUNCTION internal_.resource_update_() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource_definition security_.resource_definition_;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE table_ = format('%1$I.%2I', TG_TABLE_SCHEMA, TG_TABLE_NAME)::regclass;

  PERFORM internal_.resource_update_(_resource_definition, to_jsonb(r))
  FROM _new_table r;

  RETURN NULL;
END
$_$;

CREATE OR REPLACE FUNCTION internal_.resource_insert_sign_up_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = 'sign up';

  PERFORM internal_.resource_insert_(_resource_definition, to_jsonb(r))
  FROM _new_table r;

  RETURN NULL;

END;
$$;

CREATE OR REPLACE FUNCTION internal_.resource_update_sign_up_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = 'sign up';

  PERFORM internal_.resource_update_(_resource_definition, to_jsonb(r))
  FROM _new_table r;

  RETURN NULL;

END;
$$;


CREATE OR REPLACE FUNCTION internal_.resource_delete_sign_up_() RETURNS trigger
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

CREATE TRIGGER tr_after_insert_resource_insert_sign_up_ AFTER INSERT ON security_.sign_up_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE PROCEDURE internal_.resource_insert_sign_up_();
CREATE TRIGGER tr_after_update_resource_update_sign_up_ AFTER UPDATE ON security_.sign_up_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE PROCEDURE internal_.resource_update_sign_up_();
CREATE TRIGGER tr_after_delete_resource_delete_sign_up_ AFTER DELETE ON security_.sign_up_ REFERENCING OLD TABLE AS _old_table FOR EACH ROW EXECUTE PROCEDURE internal_.resource_delete_sign_up_();

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
