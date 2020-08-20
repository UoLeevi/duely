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

CREATE OR REPLACE PROCEDURE internal_.setup_resource_(_table regclass, _name text, _id_prefix text, _search text[] DEFAULT '{uuid_,name_}'::text[], _owner_table regclass DEFAULT NULL::regclass)
    LANGUAGE plpgsql
    AS $$
DECLARE
  _owner_resource_definition_uuid uuid;
  _table_name name;
  _table_schema name;
BEGIN
  SELECT c.relname, ns.nspname INTO _table_name, _table_schema
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace ns ON c.relnamespace = ns.oid
  WHERE c.oid = _table;

  SELECT uuid_ INTO _owner_resource_definition_uuid
  FROM security_.resource_definition_
  WHERE table_ = _owner_table;

  INSERT INTO security_.resource_definition_ (id_prefix_, name_, table_, owner_uuid_, search_)
  VALUES (_id_prefix, _name, _table, _owner_resource_definition_uuid, _search)
  ON CONFLICT (table_) DO UPDATE
  SET 
    id_prefix_ = _id_prefix,
    name_ = _name,
    table_ = _table,
    search_ = _search,
    owner_uuid_ = _owner_resource_definition_uuid;

  IF EXISTS (
    SELECT 1
    FROM pg_class
    WHERE oid = _table AND relkind = 'r'
  ) THEN
    EXECUTE '
      DROP TRIGGER IF EXISTS tr_after_insert_resource_insert_ ON ' || _table || ';
      CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON ' || _table || ' REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();
      DROP TRIGGER IF EXISTS tr_after_update_resource_update_ ON ' || _table || ';
      CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON ' || _table || ' REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();
      DROP TRIGGER IF EXISTS tr_after_delete_resource_delete_ ON ' || _table || ';
      CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON ' || _table || ' REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();
    ';
  ELSEIF EXISTS (
    SELECT 1
    FROM pg_class
    WHERE oid = _table AND relkind = 'v'
  ) THEN
    -- No triggers for views. Resource need to be updated manually with AFTER TRIGGERS on the base tables;
    NULL;
  ELSE
    RAISE 'Resource is not table or view.' USING ERRCODE = '20000';
  END IF;
END
$$;

DROP FUNCTION internal_.create_or_update_owned_resource_;
CREATE FUNCTION internal_.create_or_update_owned_resource_(_owner_table regclass, _owner_id text, _resource_name text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _id text;
  _owner_column text;
BEGIN
  SELECT relname || 'id' INTO _owner_column
  FROM pg_class 
  WHERE oid = _owner_table;

  _data := _data || jsonb_build_object(_owner_column, _owner_id);

  IF _data ? 'id' THEN
    _id := _data->>'id';
    _data := _data - 'id';
    _data := operation_.update_resource_(id_, _data);
  ELSE
    _data := operation_.create_resource_(_resource_name, _data);
  END IF;

  RETURN _data;
END
$$;

CREATE OR REPLACE FUNCTION operation_.create_resource_(_resource_name text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
  _column_list text;
  _select_list text;
  _uuid uuid;
  _id text;
  _owned_resources_data jsonb;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_ WHERE name_ = _resource_name;

  SELECT owner_, owned_ INTO _data, _owned_resources_data
  FROM internal_.extract_referenced_resources_jsonb_(_resource_definition.uuid_, _data);

  _data := internal_.convert_to_internal_format_(_data);

  PERFORM security_.control_create_(_resource_definition, _data);

  _uuid := internal_.dynamic_insert_(_resource_definition.table_, _data);

  SELECT id_ INTO _id FROM application_.resource_ WHERE uuid_ = _uuid;

  _data := operation_.query_resource_(_id);

  SELECT jsonb_object_agg(r.key, internal_.create_or_update_owned_resource_(_resource_definition.table_, _id, r.key, r.value)) INTO _owned_resources_data
  FROM jsonb_each(_owned_resources_data) r;

  RETURN _data || COALESCE(_owned_resources_data, '{}'::jsonb);
END
$$;

CREATE OR REPLACE FUNCTION operation_.update_resource_(_id text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
  _update_list text;
  _owned_resources_data jsonb;
BEGIN
  SELECT * INTO _resource
  FROM application_.resource_ WHERE id_ = _id;

  SELECT * INTO _resource_definition
  FROM security_.resource_definition_ WHERE uuid_ = _resource.definition_uuid_;

  SELECT owner_, owned_ INTO _data, _owned_resources_data
  FROM internal_.extract_referenced_resources_jsonb_(_resource_definition.uuid_, _data);

  _data := internal_.convert_to_internal_format_(_data);

  PERFORM security_.control_update_(_resource_definition, _resource, _data);
  PERFORM internal_.dynamic_update_(_resource_definition.table_, _resource.uuid_, _data);

  _data := operation_.query_resource_(_id);

  SELECT jsonb_object_agg(r.key, internal_.create_or_update_owned_resource_(_resource_definition.table_, _id, r.key, r.value)) INTO _owned_resources_data
  FROM jsonb_each(_owned_resources_data) r;

  RETURN _data || COALESCE(_owned_resources_data, '{}'::jsonb);
END
$$;


CREATE TYPE public.verification_status_ AS ENUM (
    'started',
    'verified',
    'cancelled',
    'expired'
);

CREATE FUNCTION internal_.current_user_uuid_() RETURNS uuid
    LANGUAGE sql STABLE
    AS
$$
  SELECT current_setting('security_.token_.subject_uuid_'::text, true)::uuid;
$$;


CREATE TABLE security_.sign_up_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() PRIMARY KEY,
    user_uuid_ uuid REFERENCES security_.user_ (uuid_),
    email_address_ text NOT NULL,
    name_ text NOT NULL,
    password_hash_ text NOT NULL,
    data_ jsonb NOT NULL,
    started_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP + interval '1 hour' NOT NULL,
    status_ verification_status_ NOT NULL DEFAULT 'started',
    status_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    initiator_subject_uuid_ uuid NOT NULL REFERENCES security_.subject_ (uuid_) DEFAULT internal_.current_user_uuid_()
);

CREATE UNIQUE INDEX sign_up__email_address__idx ON security_.sign_up_ USING btree (email_address_) WHERE (status_ = 'started');

CALL internal_.setup_auditing_('security_.sign_up_');

CREATE VIEW application_.sign_up_ AS
  SELECT s.uuid_, s.user_uuid_, s.email_address_, s.name_, s.data_, NULL::text password_, CASE s.status_ WHEN 'verified' THEN 't'::boolean ELSE 'f'::boolean END verified_
  FROM security_.sign_up_ s
  WHERE s.status_ = 'verified'
     OR CURRENT_TIMESTAMP BETWEEN s.started_at_ AND s.expires_at_;

CREATE FUNCTION internal_.try_start_signup_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO security_.sign_up_(email_address_, name_, data_, password_hash_)
  SELECT NEW.email_address_, NEW.name_, NEW.data_, pgcrypto_.crypt(NEW.password_, pgcrypto_.gen_salt('md5'));

  RETURN NULL;
END
$$;

CREATE TRIGGER tr_instead_of_insert_try_start_signup_
INSTEAD OF INSERT ON application_.sign_up_
FOR EACH ROW EXECUTE FUNCTION internal_.try_start_signup_();

CREATE FUNCTION internal_.try_verify_signup_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
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
  WHERE uuid_ = _sign_up.uuid_;

  RETURN NULL;
END
$$;

CREATE TRIGGER tr_instead_of_update_try_verify_signup_
INSTEAD OF UPDATE ON application_.sign_up_
FOR EACH ROW EXECUTE FUNCTION internal_.try_verify_signup_();

CREATE FUNCTION internal_.try_cancel_signup_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE security_.sign_up_
  SET 
    status_ = 'cancelled',
    started_at_ = CURRENT_TIMESTAMP
  WHERE uuid_ = OLD.uuid_
    AND status_ IN ('started', 'cancelled');

  RETURN NULL;
END
$$;

CREATE TRIGGER tr_instead_of_delete_try_cancel_signup_
INSTEAD OF DELETE ON application_.sign_up_
FOR EACH ROW EXECUTE FUNCTION internal_.try_cancel_signup_();

CALL internal_.setup_resource_('application_.sign_up_', 'sign up', 'su', '{}');

CREATE OR REPLACE FUNCTION policy_.sign_up_can_be_queried_by_initiator_subject_uuid_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.sign_up_
    WHERE initiator_subject_uuid_ = internal_.current_user_uuid_()
  ) THEN
    RETURN array_cat(_keys, '{uuid_, user_uuid_, data_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.anyone_can_create_sign_up_(_resource_definition security_.resource_definition_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
BEGIN
  RETURN array_cat(_keys, '{email_address_, name_, data_, password_}');
END
$_$;

CREATE OR REPLACE FUNCTION policy_.anyone_can_verify_signup_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN array_cat(_keys, '{verified_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.anyone_can_cancel_signup_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  NULL;
END
$$;

PERFORM security_.register_policy_('application_.sign_up_', 'query', 'policy_.sign_up_can_be_queried_by_initiator_subject_uuid_');
PERFORM security_.register_policy_('application_.sign_up_', 'create', 'policy_.anyone_can_create_sign_up_');
PERFORM security_.register_policy_('application_.sign_up_', 'update', 'policy_.anyone_can_verify_signup_');
PERFORM security_.register_policy_('application_.sign_up_', 'delete', 'policy_.anyone_can_cancel_signup_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
