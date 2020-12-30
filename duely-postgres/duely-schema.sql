--
-- PostgreSQL database dump
--

-- Dumped from database version 13.0 (Debian 13.0-1.pgdg100+1)
-- Dumped by pg_dump version 13.0 (Debian 13.0-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: application_; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA application_;


ALTER SCHEMA application_ OWNER TO postgres;

--
-- Name: application__audit_; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA application__audit_;


ALTER SCHEMA application__audit_ OWNER TO postgres;

--
-- Name: internal_; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA internal_;


ALTER SCHEMA internal_ OWNER TO postgres;

--
-- Name: internal__audit_; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA internal__audit_;


ALTER SCHEMA internal__audit_ OWNER TO postgres;

--
-- Name: operation_; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA operation_;


ALTER SCHEMA operation_ OWNER TO postgres;

--
-- Name: pgcrypto_; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pgcrypto_;


ALTER SCHEMA pgcrypto_ OWNER TO postgres;

--
-- Name: policy_; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA policy_;


ALTER SCHEMA policy_ OWNER TO postgres;

--
-- Name: security_; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA security_;


ALTER SCHEMA security_ OWNER TO postgres;

--
-- Name: security__audit_; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA security__audit_;


ALTER SCHEMA security__audit_ OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA pgcrypto_;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: access_level_; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.access_level_ AS ENUM (
    'owner',
    'manager',
    'agent',
    'client',
    'public'
);


ALTER TYPE public.access_level_ OWNER TO postgres;

--
-- Name: operation_type_; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.operation_type_ AS ENUM (
    'query',
    'create',
    'update',
    'delete'
);


ALTER TYPE public.operation_type_ OWNER TO postgres;

--
-- Name: verification_status_; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.verification_status_ AS ENUM (
    'started',
    'verified',
    'cancelled',
    'expired'
);


ALTER TYPE public.verification_status_ OWNER TO postgres;

--
-- Name: price_type_(text); Type: FUNCTION; Schema: application_; Owner: postgres
--

CREATE FUNCTION application_.price_type_(_recurring_interval text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
    SELECT CASE WHEN _recurring_interval IS NULL THEN 'one_time' ELSE 'recurring' END;
$$;


ALTER FUNCTION application_.price_type_(_recurring_interval text) OWNER TO postgres;

--
-- Name: assign_subdomain_owner_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.assign_subdomain_owner_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO security_.subject_assignment_ (role_uuid_, subdomain_uuid_, subject_uuid_)
  SELECT r.uuid_, _subdomain.uuid_, current_setting('security_.token_.subject_uuid_'::text, false)::uuid
  FROM security_.role_ r
  CROSS JOIN _subdomain
  WHERE r.name_ = 'owner';

  RETURN NULL;
END
$$;


ALTER FUNCTION internal_.assign_subdomain_owner_() OWNER TO postgres;

--
-- Name: audit_delete_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.audit_delete_() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _columns text;
BEGIN
  WITH
    cte1 AS (
      SELECT attname
      FROM pg_attribute
      WHERE attrelid = TG_RELID
        AND NOT attisdropped
        AND attnum > 0
        AND attname NOT IN ('audit_at_', 'audit_session_uuid_')
    )
  SELECT INTO _columns
    string_agg(quote_ident(cte1.attname), ', ')
  FROM cte1;
  EXECUTE format(
    'INSERT INTO %1$I.%2$I(%3$s, audit_at_, audit_session_uuid_, audit_op_) SELECT %3$s, %4$L, %5$L, %6$L FROM _old_table o', 
    TG_TABLE_SCHEMA || '_audit_', 
    TG_TABLE_NAME, 
    _columns, 
    CURRENT_TIMESTAMP, 
    COALESCE(current_setting('security_.session_.uuid_', 't'), '00000000-0000-0000-0000-000000000000')::uuid, 
    LEFT(TG_OP, 1));
  RETURN NULL;
END
$_$;


ALTER FUNCTION internal_.audit_delete_() OWNER TO postgres;

--
-- Name: audit_insert_or_update_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.audit_insert_or_update_() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _columns text;
BEGIN
  WITH
    cte1 AS (
      SELECT attname
      FROM pg_attribute
      WHERE attrelid = TG_RELID
        AND NOT attisdropped
        AND attnum > 0
    )
  SELECT INTO _columns
    string_agg(quote_ident(cte1.attname), ', ')
  FROM cte1;
  EXECUTE format(
    'INSERT INTO %1$I.%2$I(%3$s, audit_op_) SELECT %3$s, %4$L FROM _new_table n',
    TG_TABLE_SCHEMA || '_audit_',
    TG_TABLE_NAME,
    _columns,
    LEFT(TG_OP, 1));
  RETURN NULL;
END
$_$;


ALTER FUNCTION internal_.audit_insert_or_update_() OWNER TO postgres;

--
-- Name: audit_stamp_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.audit_stamp_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.audit_at_ := CURRENT_TIMESTAMP;
  NEW.audit_session_uuid_ := COALESCE(current_setting('security_.session_.uuid_', 't'), '00000000-0000-0000-0000-000000000000')::uuid;
  RETURN NEW;
END;
$$;


ALTER FUNCTION internal_.audit_stamp_() OWNER TO postgres;

--
-- Name: base64url_decode_(text); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.base64url_decode_(_string text) RETURNS bytea
    LANGUAGE sql IMMUTABLE
    AS $$
  WITH 
    cte1 AS (
      SELECT replace(replace(_string, '-', '+'), '_', '/') data_
    ),
    cte2 AS (
      SELECT octet_length(cte1.data_) % 4 mod_ FROM cte1
    )
    SELECT decode(CASE WHEN cte2.mod_ = 0 THEN cte1.data_ ELSE cte1.data_ || repeat('=', 4 - cte2.mod_) END, 'base64') FROM cte1, cte2;
$$;


ALTER FUNCTION internal_.base64url_decode_(_string text) OWNER TO postgres;

--
-- Name: base64url_encode_(bytea); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.base64url_encode_(_data bytea) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
  SELECT replace(replace(replace(regexp_replace(encode(_data, 'base64'), '\r|\n', '', 'g'), '+', '-'), '/', '_'), '=', '');
$$;


ALTER FUNCTION internal_.base64url_encode_(_data bytea) OWNER TO postgres;

--
-- Name: check_current_user_is_serviceaccount_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.check_current_user_is_serviceaccount_() RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.security_data_ s
    JOIN security_.user_ u ON s.key_ = 'email_address:' || u.email_address_
    WHERE u.uuid_ = internal_.current_subject_uuid_()
      AND (s.data_->>'is_service_account')::boolean
  ) THEN
    RETURN 't';
  ELSE
    RETURN 'f';
  END IF;
END
$$;


ALTER FUNCTION internal_.check_current_user_is_serviceaccount_() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: resource_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.resource_ (
    uuid_ uuid NOT NULL,
    id_ text NOT NULL,
    owner_uuid_ uuid,
    definition_uuid_ uuid NOT NULL,
    data_ jsonb DEFAULT '{}'::jsonb NOT NULL,
    search_ jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE application_.resource_ OWNER TO postgres;

--
-- Name: resource_definition_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.resource_definition_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    id_prefix_ text NOT NULL,
    name_ text NOT NULL,
    table_ regclass NOT NULL,
    owner_uuid_ uuid,
    search_ text[] DEFAULT '{uuid_,name_}'::text[] NOT NULL
);


ALTER TABLE security_.resource_definition_ OWNER TO postgres;

--
-- Name: check_resource_access_(security_.resource_definition_, application_.resource_, public.access_level_); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.check_resource_access_(_resource_definition security_.resource_definition_, _resource application_.resource_, _access public.access_level_) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
BEGIN
  IF _access = 'public' THEN
    RETURN 't';
  ELSEIF _access = 'owner' THEN
    RETURN internal_.check_resource_role_(_resource_definition, _resource, 'owner');
  ELSEIF _access = 'manager' THEN
    RETURN internal_.check_resource_role_(_resource_definition, _resource, 'manager');
  ELSEIF _access = 'agent' THEN
    RETURN internal_.check_resource_role_(_resource_definition, _resource, 'agent');
  ELSEIF _access = 'client' THEN
    RETURN internal_.check_resource_role_(_resource_definition, _resource, 'agent')
        OR internal_.check_resource_role_(_resource_definition, _resource, 'client');
  ELSE
    RETURN 'f';
  END IF;
END
$$;


ALTER FUNCTION internal_.check_resource_access_(_resource_definition security_.resource_definition_, _resource application_.resource_, _access public.access_level_) OWNER TO postgres;

--
-- Name: check_resource_role_(security_.resource_definition_, application_.resource_, text); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.check_resource_role_(_resource_definition security_.resource_definition_, _resource application_.resource_, _role_name text) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
DECLARE
  _subdomain_uuid uuid;
BEGIN
  _subdomain_uuid := internal_.query_resource_owner_uuid_(_resource.id_);

  IF EXISTS (
    SELECT 1
    FROM security_.active_role_ r
    JOIN security_.subdomain_ d ON r.subdomain_uuid_ = d.uuid_
    WHERE d.uuid_ = _subdomain_uuid
      AND r.name_ = _role_name
  ) THEN
    RETURN 't';
  ELSE
    RETURN 'f';
  END IF;
END
$$;


ALTER FUNCTION internal_.check_resource_role_(_resource_definition security_.resource_definition_, _resource application_.resource_, _role_name text) OWNER TO postgres;

--
-- Name: convert_from_internal_format_(jsonb); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.convert_from_internal_format_(_data jsonb) RETURNS jsonb
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  WITH
    _uuid_fields AS (
      SELECT k, LEFT(k, length(k) - 5) || 'id_' f, r.id_
      FROM jsonb_object_keys(_data) k
      LEFT JOIN application_.resource_ r ON r.uuid_ = (_data->>k)::uuid
      WHERE k LIKE '%uuid\_'
    )
  SELECT jsonb_object_agg(rtrim(COALESCE(i.f, d.key), '_'), COALESCE(to_jsonb(i.id_), d.value)) data_
  FROM jsonb_each(_data) d
  LEFT JOIN _uuid_fields i ON i.k = d.key;
$$;


ALTER FUNCTION internal_.convert_from_internal_format_(_data jsonb) OWNER TO postgres;

--
-- Name: convert_to_internal_format_(jsonb); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.convert_to_internal_format_(_data jsonb) RETURNS jsonb
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  WITH
    _id_fields AS (
      SELECT k, LEFT(k, length(k) - 2) || 'uuid' f, r.uuid_
      FROM jsonb_object_keys(_data) k
      LEFT JOIN application_.resource_ r ON r.id_ = _data->>k
      WHERE k LIKE '%id'
    )
  SELECT jsonb_object_agg(COALESCE(i.f, d.key) || '_', COALESCE(to_jsonb(i.uuid_), d.value)) data_
  FROM jsonb_each(_data) d
  LEFT JOIN _id_fields i ON i.k = d.key;
$$;


ALTER FUNCTION internal_.convert_to_internal_format_(_data jsonb) OWNER TO postgres;

--
-- Name: create_or_update_owned_resource_(regclass, text, text, jsonb); Type: FUNCTION; Schema: internal_; Owner: postgres
--

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


ALTER FUNCTION internal_.create_or_update_owned_resource_(_owner_table regclass, _owner_id text, _resource_name text, _data jsonb) OWNER TO postgres;

--
-- Name: current_subject_uuid_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.current_subject_uuid_() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT COALESCE(current_setting('security_.token_.subject_uuid_'::text, true)::uuid, '00000000-0000-0000-0000-000000000000'::uuid);
$$;


ALTER FUNCTION internal_.current_subject_uuid_() OWNER TO postgres;

--
-- Name: drop_auditing_(regclass); Type: PROCEDURE; Schema: internal_; Owner: postgres
--

CREATE PROCEDURE internal_.drop_auditing_(_table regclass)
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _table_name name;
  _table_schema name;
  _audit_schema name;
BEGIN
  SELECT c.relname, ns.nspname, ns.nspname || '_audit_' INTO _table_name, _table_schema, _audit_schema
  FROM pg_catalog.pg_class AS c
  JOIN pg_catalog.pg_namespace AS ns ON c.relnamespace = ns.oid
  WHERE c.oid = _table;

  EXECUTE format(
    $$
    DROP TRIGGER tr_after_delete_audit_delete_ ON %1$I.%2$I;
    DROP TRIGGER tr_after_update_audit_insert_or_update_ ON %1$I.%2$I;
    DROP TRIGGER tr_after_insert_audit_insert_or_update_ ON %1$I.%2$I;
    DROP TRIGGER tr_before_update_audit_stamp_ ON %1$I.%2$I;
    DROP TABLE %3$I.%2$I;
    ALTER TABLE %1$I.%2$I DROP COLUMN audit_session_uuid_;
    ALTER TABLE %1$I.%2$I DROP COLUMN audit_at_;
    $$,
    _table_schema, _table_name, _audit_schema);
END
$_$;


ALTER PROCEDURE internal_.drop_auditing_(_table regclass) OWNER TO postgres;

--
-- Name: drop_notifications_(regclass); Type: PROCEDURE; Schema: internal_; Owner: postgres
--

CREATE PROCEDURE internal_.drop_notifications_(_table regclass)
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _table_name name;
  _table_schema name;
BEGIN
  SELECT c.relname, ns.nspname INTO _table_name, _table_schema
  FROM pg_catalog.pg_class AS c
  JOIN pg_catalog.pg_namespace AS ns ON c.relnamespace = ns.oid
  WHERE c.oid = _table;

  EXECUTE format(
    $$
    DROP TRIGGER tr_after_insert_notify_jsonb_ ON %1$I.%2$I;
    DROP TRIGGER tr_after_update_notify_jsonb_ ON %1$I.%2$I;
    DROP TRIGGER tr_after_delete_notify_jsonb_ ON %1$I.%2$I;
    $$,
    _table_schema, _table_name);
END
$_$;


ALTER PROCEDURE internal_.drop_notifications_(_table regclass) OWNER TO postgres;

--
-- Name: drop_resource_(regclass); Type: PROCEDURE; Schema: internal_; Owner: postgres
--

CREATE PROCEDURE internal_.drop_resource_(_table regclass)
    LANGUAGE plpgsql
    AS $$
DECLARE
  _table_name name;
  _table_schema name;
BEGIN
  DELETE FROM security_.resource_definition_
  WHERE table_ = _table;

  EXECUTE '
    DROP TRIGGER tr_after_insert_resource_insert_ ON ' || _table || ';
    DROP TRIGGER tr_after_insert_resource_insert_ ON ' || _table || ';
    DROP TRIGGER tr_after_delete_resource_delete_ ON ' || _table || ';
  ';
END
$$;


ALTER PROCEDURE internal_.drop_resource_(_table regclass) OWNER TO postgres;

--
-- Name: dynamic_delete_(regclass, uuid); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.dynamic_delete_(_table regclass, _uuid uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
BEGIN
  EXECUTE '
    DELETE FROM ' || _table || '
    WHERE uuid_ = $1
    RETURNING uuid_;
  '
  INTO _uuid
  USING _uuid;

  RETURN _uuid;
END
$_$;


ALTER FUNCTION internal_.dynamic_delete_(_table regclass, _uuid uuid) OWNER TO postgres;

--
-- Name: dynamic_insert_(regclass, jsonb); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.dynamic_insert_(_table regclass, _data jsonb) RETURNS uuid
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


ALTER FUNCTION internal_.dynamic_insert_(_table regclass, _data jsonb) OWNER TO postgres;

--
-- Name: dynamic_select_(regclass, uuid, text[]); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.dynamic_select_(_table regclass, _uuid uuid, _keys text[]) RETURNS jsonb
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


ALTER FUNCTION internal_.dynamic_select_(_table regclass, _uuid uuid, _keys text[]) OWNER TO postgres;

--
-- Name: dynamic_update_(regclass, uuid, jsonb); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.dynamic_update_(_table regclass, _uuid uuid, _data jsonb) RETURNS uuid
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


ALTER FUNCTION internal_.dynamic_update_(_table regclass, _uuid uuid, _data jsonb) OWNER TO postgres;

--
-- Name: extract_referenced_resources_jsonb_(uuid, jsonb); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.extract_referenced_resources_jsonb_(_resource_definition_uuid uuid, _data jsonb) RETURNS TABLE(owner_ jsonb, owned_ jsonb)
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


ALTER FUNCTION internal_.extract_referenced_resources_jsonb_(_resource_definition_uuid uuid, _data jsonb) OWNER TO postgres;

--
-- Name: insert_subject_for_user_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

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


ALTER FUNCTION internal_.insert_subject_for_user_() OWNER TO postgres;

--
-- Name: jsonb_strip_values_(jsonb); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.jsonb_strip_values_(_data jsonb) RETURNS jsonb
    LANGUAGE sql IMMUTABLE SECURITY DEFINER
    AS $$
  SELECT COALESCE(jsonb_object_agg(k, NULL), '{}'::jsonb)
  FROM jsonb_object_keys(_data) k;
$$;


ALTER FUNCTION internal_.jsonb_strip_values_(_data jsonb) OWNER TO postgres;

--
-- Name: jwt_sign_hs256_(jsonb, bytea); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.jwt_sign_hs256_(_payload jsonb, _secret bytea) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
  WITH
    cte1 AS (
      SELECT 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' || internal_.base64url_encode_(_payload::text::bytea) base64url_header_and_payload_
    )
    SELECT cte1.base64url_header_and_payload_ || '.' || internal_.base64url_encode_(pgcrypto_.hmac(cte1.base64url_header_and_payload_::bytea, _secret, 'sha256')) FROM cte1;
$$;


ALTER FUNCTION internal_.jwt_sign_hs256_(_payload jsonb, _secret bytea) OWNER TO postgres;

--
-- Name: jwt_verify_hs256_(text, bytea); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.jwt_verify_hs256_(_jwt text, _secret bytea) RETURNS jsonb
    LANGUAGE sql IMMUTABLE
    AS $$
  WITH
    _base64 AS (
      SELECT split_part(_jwt, '.', 1) header_, split_part(_jwt, '.', 2) payload_, split_part(_jwt, '.', 3) signature_
    )
    SELECT 
      CASE WHEN _base64.signature_ = internal_.base64url_encode_(pgcrypto_.hmac((_base64.header_ || '.' || _base64.payload_)::bytea, _secret, 'sha256')) 
        THEN convert_from(internal_.base64url_decode_(_base64.payload_), 'UTF-8')::jsonb
        ELSE NULL 
      END payload_
    FROM _base64;
$$;


ALTER FUNCTION internal_.jwt_verify_hs256_(_jwt text, _secret bytea) OWNER TO postgres;

--
-- Name: notify_jsonb_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.notify_jsonb_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM pg_notify(TG_TABLE_SCHEMA::text || '.' || TG_TABLE_NAME::text, jsonb_build_object('op', LEFT(TG_OP, 1), 'uuid_', t.uuid_::text)::text)
  FROM _transition_table t;
  RETURN NULL;
END;
$$;


ALTER FUNCTION internal_.notify_jsonb_() OWNER TO postgres;

--
-- Name: query_owner_resource_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.query_owner_resource_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS TABLE(resource_definition_ security_.resource_definition_, resource_ application_.resource_)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $_$
DECLARE
  _owner_resource_definition security_.resource_definition_;
  _owner_resource_table_name name;
  _owner_resource application_.resource_;
BEGIN
  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  SELECT c.relname INTO _owner_resource_table_name
  FROM pg_catalog.pg_class AS c
  WHERE c.oid = _owner_resource_definition.table_;

  EXECUTE format($$
    SELECT *
    FROM application_.resource_
    WHERE uuid_ = ($1->>'%1$I')::uuid
  $$,
  _owner_resource_table_name || 'uuid_')
  INTO _owner_resource
  USING _data;

  RETURN QUERY
    SELECT _owner_resource_definition resource_definition_, _owner_resource resource_;
END
$_$;


ALTER FUNCTION internal_.query_owner_resource_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: query_resource_owner_uuid_(text, text); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.query_resource_owner_uuid_(_id text, _owner_resource_name text DEFAULT 'subdomain'::text) RETURNS uuid
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
DECLARE
  _uuid uuid;
  _owner_uuid uuid;
  _resource_name text;
BEGIN

  LOOP
    SELECT o.id_, r.uuid_, r.owner_uuid_, d.name_ INTO _id, _uuid, _owner_uuid, _resource_name
    FROM application_.resource_ r
    JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
    LEFT JOIN application_.resource_ o ON o.uuid_ = r.owner_uuid_
    WHERE r.id_ = _id;

    IF _resource_name = _owner_resource_name THEN
      RETURN _uuid;
    END IF;

    IF _id IS NULL THEN
      RETURN NULL;
    END IF;
  END LOOP;

  RETURN NULL;
END
$$;


ALTER FUNCTION internal_.query_resource_owner_uuid_(_id text, _owner_resource_name text) OWNER TO postgres;

--
-- Name: resource_delete_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.resource_delete_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM application_.resource_ r
  USING _old_table t
  WHERE r.uuid_ = t.uuid_;

  RETURN NULL;
END
$$;


ALTER FUNCTION internal_.resource_delete_() OWNER TO postgres;

--
-- Name: resource_delete_membership_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.resource_delete_membership_() RETURNS trigger
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


ALTER FUNCTION internal_.resource_delete_membership_() OWNER TO postgres;

--
-- Name: resource_delete_password_reset_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

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


ALTER FUNCTION internal_.resource_delete_password_reset_() OWNER TO postgres;

--
-- Name: resource_delete_sign_up_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.resource_delete_sign_up_() RETURNS trigger
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


ALTER FUNCTION internal_.resource_delete_sign_up_() OWNER TO postgres;

--
-- Name: resource_insert_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.resource_insert_() RETURNS trigger
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


ALTER FUNCTION internal_.resource_insert_() OWNER TO postgres;

--
-- Name: resource_insert_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.resource_insert_(_resource_definition security_.resource_definition_, _record jsonb) RETURNS application_.resource_
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource application_.resource_;
  _owner_resource_definition security_.resource_definition_;
  _owner_resource_table_name name;
  _uuid uuid;
  _owner_uuid uuid;
  _select_list text;
  _search jsonb DEFAULT '{}'::jsonb;
  _id_len int := 6;
BEGIN
  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  SELECT c.relname INTO _owner_resource_table_name
  FROM pg_catalog.pg_class AS c
  WHERE c.oid = _owner_resource_definition.table_;

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN
    EXECUTE format('
      SELECT ($1->>%1$L)::uuid;
    ',
    _owner_resource_table_name || 'uuid_')
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


ALTER FUNCTION internal_.resource_insert_(_resource_definition security_.resource_definition_, _record jsonb) OWNER TO postgres;

--
-- Name: resource_insert_membership_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.resource_insert_membership_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = 'membership';

  PERFORM internal_.resource_insert_(_resource_definition, to_jsonb(r))
  FROM (
    SELECT 
      sa.uuid_,
      r.name_::access_level_ access_,
      u.uuid_ user_uuid_,
      sa.subdomain_uuid_
    FROM _new_table sa
    JOIN security_.role_ r ON r.uuid_ = sa.role_uuid_
    JOIN security_.user_ u ON u.uuid_ = sa.subject_uuid_
  ) r;

  RETURN NULL;

END;
$$;


ALTER FUNCTION internal_.resource_insert_membership_() OWNER TO postgres;

--
-- Name: resource_insert_password_reset_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

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


ALTER FUNCTION internal_.resource_insert_password_reset_() OWNER TO postgres;

--
-- Name: resource_insert_sign_up_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.resource_insert_sign_up_() RETURNS trigger
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


ALTER FUNCTION internal_.resource_insert_sign_up_() OWNER TO postgres;

--
-- Name: resource_update_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.resource_update_() RETURNS trigger
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


ALTER FUNCTION internal_.resource_update_() OWNER TO postgres;

--
-- Name: resource_update_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.resource_update_(_resource_definition security_.resource_definition_, _record jsonb) RETURNS application_.resource_
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource application_.resource_;
  _owner_resource_definition security_.resource_definition_;
  _owner_resource_table_name name;
  _uuid uuid;
  _owner_uuid uuid;
  _select_list text;
  _search jsonb DEFAULT '{}'::jsonb;
BEGIN
  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  SELECT c.relname INTO _owner_resource_table_name
  FROM pg_catalog.pg_class AS c
  WHERE c.oid = _owner_resource_definition.table_;

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN
    EXECUTE format('
      SELECT ($1->>%1$L)::uuid;
    ',
    _owner_resource_table_name || 'uuid_')
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


ALTER FUNCTION internal_.resource_update_(_resource_definition security_.resource_definition_, _record jsonb) OWNER TO postgres;

--
-- Name: resource_update_membership_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.resource_update_membership_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = 'membership';

  PERFORM internal_.resource_update_(_resource_definition, to_jsonb(r))
  FROM (
    SELECT 
      sa.uuid_,
      r.name_::access_level_ access_,
      u.uuid_ user_uuid_,
      sa.subdomain_uuid_
    FROM _new_table sa
    JOIN security_.role_ r ON r.uuid_ = sa.role_uuid_
    JOIN security_.user_ u ON u.uuid_ = sa.subject_uuid_
  ) r;

  RETURN NULL;

END;
$$;


ALTER FUNCTION internal_.resource_update_membership_() OWNER TO postgres;

--
-- Name: resource_update_password_reset_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

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


ALTER FUNCTION internal_.resource_update_password_reset_() OWNER TO postgres;

--
-- Name: resource_update_sign_up_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.resource_update_sign_up_() RETURNS trigger
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


ALTER FUNCTION internal_.resource_update_sign_up_() OWNER TO postgres;

--
-- Name: setup_auditing_(regclass); Type: PROCEDURE; Schema: internal_; Owner: postgres
--

CREATE PROCEDURE internal_.setup_auditing_(_table regclass)
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _table_name name;
  _table_schema name;
  _audit_schema name;
BEGIN
  SELECT c.relname, ns.nspname, ns.nspname || '_audit_' INTO _table_name, _table_schema, _audit_schema
  FROM pg_catalog.pg_class AS c
  JOIN pg_catalog.pg_namespace AS ns ON c.relnamespace = ns.oid
  WHERE c.oid = _table;

  EXECUTE format($$
    ALTER TABLE %1$I.%2$I ADD COLUMN audit_at_ timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE %1$I.%2$I ADD COLUMN audit_session_uuid_ uuid NOT NULL NOT NULL DEFAULT COALESCE(current_setting('security_.session_.uuid_', 't'), '00000000-0000-0000-0000-000000000000')::uuid;
    CREATE TABLE %3$I.%2$I AS TABLE %1$I.%2$I;
    ALTER TABLE %3$I.%2$I ADD COLUMN audit_op_ char(1) NOT NULL DEFAULT 'I';
    CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON %1$I.%2$I FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();
    CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON %1$I.%2$I REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();
    CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON %1$I.%2$I REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();
    CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON %1$I.%2$I REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();
    $$,
    _table_schema, _table_name, _audit_schema);
END
$_$;


ALTER PROCEDURE internal_.setup_auditing_(_table regclass) OWNER TO postgres;

--
-- Name: setup_notifications_(regclass); Type: PROCEDURE; Schema: internal_; Owner: postgres
--

CREATE PROCEDURE internal_.setup_notifications_(_table regclass)
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _table_name name;
  _table_schema name;
BEGIN
  SELECT c.relname, ns.nspname INTO _table_name, _table_schema
  FROM pg_catalog.pg_class AS c
  JOIN pg_catalog.pg_namespace AS ns ON c.relnamespace = ns.oid
  WHERE c.oid = _table;

  EXECUTE format(
    $$
    CREATE TRIGGER tr_after_insert_notify_jsonb_
    AFTER INSERT ON %1$I.%2$I
    REFERENCING NEW TABLE AS _transition_table
    FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();

    CREATE TRIGGER tr_after_update_notify_jsonb_
    AFTER UPDATE ON %1$I.%2$I
    REFERENCING NEW TABLE AS _transition_table
    FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();

    CREATE TRIGGER tr_after_delete_notify_jsonb_
    AFTER DELETE ON %1$I.%2$I
    REFERENCING OLD TABLE AS _transition_table
    FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();
    $$,
    _table_schema, _table_name);
END
$_$;


ALTER PROCEDURE internal_.setup_notifications_(_table regclass) OWNER TO postgres;

--
-- Name: setup_resource_(regclass, text, text, text[], regclass); Type: PROCEDURE; Schema: internal_; Owner: postgres
--

CREATE PROCEDURE internal_.setup_resource_(_table regclass, _name text, _id_prefix text, _search text[] DEFAULT '{uuid_,name_}'::text[], _owner_table regclass DEFAULT NULL::regclass)
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


ALTER PROCEDURE internal_.setup_resource_(_table regclass, _name text, _id_prefix text, _search text[], _owner_table regclass) OWNER TO postgres;

--
-- Name: try_cancel_password_reset_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

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


ALTER FUNCTION internal_.try_cancel_password_reset_() OWNER TO postgres;

--
-- Name: try_cancel_sign_up_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.try_cancel_sign_up_() RETURNS trigger
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


ALTER FUNCTION internal_.try_cancel_sign_up_() OWNER TO postgres;

--
-- Name: try_start_password_reset_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.try_start_password_reset_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE security_.password_reset_ p
  SET
    status_ = 'cancelled'
  FROM security_.user_ u
  WHERE u.uuid_ = p.user_uuid_
    AND u.email_address_ = NEW.email_address_
    AND p.status_ = 'started';

  INSERT INTO security_.password_reset_(uuid_, user_uuid_, data_)
  SELECT NEW.uuid_, u.uuid_, COALESCE(NEW.data_, '{}'::jsonb)
  FROM security_.user_ u
  WHERE u.email_address_ = NEW.email_address_;

  RETURN NEW;
END
$$;


ALTER FUNCTION internal_.try_start_password_reset_() OWNER TO postgres;

--
-- Name: try_start_sign_up_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.try_start_sign_up_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE security_.sign_up_
  SET
    status_ = 'cancelled'
  WHERE email_address_ = NEW.email_address_
    AND status_ = 'started';

  INSERT INTO security_.sign_up_(uuid_, email_address_, name_, data_, password_hash_)
  SELECT NEW.uuid_, NEW.email_address_, NEW.name_, COALESCE(NEW.data_, '{}'::jsonb), pgcrypto_.crypt(NEW.password_, pgcrypto_.gen_salt('md5'));

  RETURN NEW;
END
$$;


ALTER FUNCTION internal_.try_start_sign_up_() OWNER TO postgres;

--
-- Name: try_verify_password_reset_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.try_verify_password_reset_() RETURNS trigger
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
    password_hash_ = pgcrypto_.crypt(NEW.password_, pgcrypto_.gen_salt('md5'))
  WHERE uuid_ = _password_reset.user_uuid_
  RETURNING uuid_ INTO _user_uuid;

  IF _user_uuid IS NULL THEN
    RETURN NULL;
  ELSE
    RETURN NEW;
  END IF;
END
$$;


ALTER FUNCTION internal_.try_verify_password_reset_() OWNER TO postgres;

--
-- Name: try_verify_sign_up_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.try_verify_sign_up_() RETURNS trigger
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


ALTER FUNCTION internal_.try_verify_sign_up_() OWNER TO postgres;

--
-- Name: user_invite_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.user_invite_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL,
    inviter_uuid_ uuid NOT NULL,
    invitee_email_address_ text NOT NULL,
    role_uuid_ uuid NOT NULL,
    status_ text,
    status_at_ timestamp with time zone,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.user_invite_ OWNER TO postgres;

--
-- Name: accept_user_invite_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.accept_user_invite_(_invite_uuid uuid) RETURNS application_.user_invite_
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


ALTER FUNCTION operation_.accept_user_invite_(_invite_uuid uuid) OWNER TO postgres;

--
-- Name: session_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.session_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    begin_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_at_ timestamp with time zone,
    token_uuid_ uuid NOT NULL,
    tag_ text,
    nesting_ integer DEFAULT 0 NOT NULL
);


ALTER TABLE security_.session_ OWNER TO postgres;

--
-- Name: begin_session_(text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.begin_session_(_jwt text, _tag text DEFAULT NULL::text) RETURNS security_.session_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _claims jsonb;
  _token_uuid uuid;
  _subject_uuid uuid;
  _session security_.session_;
BEGIN
  UPDATE security_.session_
  SET
    nesting_ = nesting_ + 1
  WHERE uuid_ = current_setting('security_.session_.uuid_'::text, true)::uuid
  RETURNING * INTO _session;

  IF _session IS NULL THEN
    SELECT internal_.jwt_verify_hs256_(_jwt, x.value_) INTO _claims
    FROM security_.secret_ x
    WHERE x.name_ = 'jwt_hs256';

    IF _claims IS NULL THEN
      RAISE 'Invalid JWT.' USING ERRCODE = '20000';
    END IF;

    SELECT t.uuid_, t.subject_uuid_ INTO _token_uuid, _subject_uuid
    FROM security_.token_ t
    WHERE t.uuid_ = (_claims->>'jti')::uuid
      AND t.revoked_at_ IS NULL;

    IF _token_uuid IS NULL THEN
      RAISE 'Invalid JWT.' USING ERRCODE = '20000';
    END IF;

    INSERT INTO security_.session_ (token_uuid_, tag_)
    VALUES (_token_uuid, _tag)
    RETURNING * INTO _session;

    PERFORM set_config('security_.token_.subject_uuid_', _subject_uuid::text, 'f');
    PERFORM set_config('security_.session_.uuid_', _session.uuid_::text, 'f');
  END IF;

  RETURN _session;
END
$$;


ALTER FUNCTION operation_.begin_session_(_jwt text, _tag text) OWNER TO postgres;

--
-- Name: begin_visit_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.begin_visit_() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _uuid uuid := gen_random_uuid();
  _iat bigint := FLOOR(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP));
  _subject_uuid uuid;
  _secret bytea;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid <> '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'Active session already exists.' USING ERRCODE = '20000';
  END IF;

  INSERT INTO security_.subject_ (type_)
  VALUES ('visitor')
  RETURNING uuid_ INTO _subject_uuid;

  SELECT x.value_ INTO _secret
  FROM security_.secret_ x
  WHERE x.name_ = 'jwt_hs256';

  IF _secret IS NULL THEN
    RAISE 'Invalid secret configuration.' USING ERRCODE = '55000';
  END IF;

  INSERT INTO security_.token_ (uuid_, subject_uuid_)
  VALUES (_uuid, _subject_uuid);

  RETURN 
    internal_.jwt_sign_hs256_(
      jsonb_build_object(
        'iss', 'duely.app',
        'sub', _subject_uuid,
        'jti', _uuid,
        'iat', _iat
      ),
      _secret
    );
END
$$;


ALTER FUNCTION operation_.begin_visit_() OWNER TO postgres;

--
-- Name: cancel_user_invite_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.cancel_user_invite_(_invite_uuid uuid) RETURNS application_.user_invite_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _user_invite application_.user_invite_;
  _arg RECORD;
BEGIN
  SELECT _invite_uuid invite_uuid_, ui.agency_uuid_ INTO _arg
  FROM application_.user_invite_ ui
  WHERE ui.uuid_ = _invite_uuid;
  PERFORM security_.control_operation_('cancel_user_invite_', _arg);

  IF NOT EXISTS (
    SELECT ui.uuid_
    FROM application_.user_invite_ ui
    WHERE ui.uuid_ = _invite_uuid
  ) THEN
    RAISE 'Invite does not exist.' USING ERRCODE = '20000';
  END IF;

  UPDATE application_.user_invite_
  SET
    status_ = 'cancelled',
    status_at_ = CURRENT_TIMESTAMP
  WHERE uuid_ = _invite_uuid
  RETURNING * INTO _user_invite;

  RETURN _user_invite;
END
$$;


ALTER FUNCTION operation_.cancel_user_invite_(_invite_uuid uuid) OWNER TO postgres;

--
-- Name: agency_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.agency_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    subdomain_uuid_ uuid NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.agency_ OWNER TO postgres;

--
-- Name: create_agency_(text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.create_agency_(_name text, _subdomain_name text) RETURNS application_.agency_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _subdomain_uuid uuid;
  _agency application_.agency_;
  _arg RECORD;
BEGIN
  -- DEPRECATED: Use create_resource_ instead.

  SELECT _name agency_name_, _subdomain_name subdomain_name_ INTO _arg; 
  PERFORM security_.control_operation_('create_agency_', _arg);

  INSERT INTO security_.subdomain_ (name_)
  VALUES (_subdomain_name)
  RETURNING uuid_ INTO _subdomain_uuid;

  INSERT INTO application_.agency_ (subdomain_uuid_, name_)
  VALUES (_subdomain_uuid, _name)
  RETURNING * INTO _agency;

  RETURN _agency;
END
$$;


ALTER FUNCTION operation_.create_agency_(_name text, _subdomain_name text) OWNER TO postgres;

--
-- Name: client_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.client_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL,
    name_ text NOT NULL,
    email_address_ text,
    invite_uuid_ uuid,
    subject_uuid_ uuid,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.client_ OWNER TO postgres;

--
-- Name: create_client_(uuid, text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.create_client_(_agency_uuid uuid, _name text, _email_address text DEFAULT NULL::text) RETURNS application_.client_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _client application_.client_;
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_, _name client_name_ INTO _arg; 
  PERFORM security_.control_operation_('create_client_', _arg);

  INSERT INTO application_.client_ (agency_uuid_, name_, email_address_)
  VALUES (_agency_uuid, _name, _email_address)
  RETURNING * INTO _client;

  RETURN _client;
END
$$;


ALTER FUNCTION operation_.create_client_(_agency_uuid uuid, _name text, _email_address text) OWNER TO postgres;

--
-- Name: create_resource_(text, jsonb); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.create_resource_(_resource_name text, _data jsonb) RETURNS jsonb
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

  _data := jsonb_strip_nulls(_data);

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


ALTER FUNCTION operation_.create_resource_(_resource_name text, _data jsonb) OWNER TO postgres;

--
-- Name: service_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.service_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL,
    name_ text NOT NULL,
    status_ text DEFAULT 'draft'::text NOT NULL,
    default_variant_uuid_ uuid,
    url_name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.service_ OWNER TO postgres;

--
-- Name: create_service_(uuid, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.create_service_(_agency_uuid uuid, _name text) RETURNS application_.service_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _service application_.service_;
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('create_service_', _arg);

  INSERT INTO application_.service_ (agency_uuid_, name_)
  VALUES (_agency_uuid, _name)
  RETURNING * INTO _service;

  RETURN _service;
END
$$;


ALTER FUNCTION operation_.create_service_(_agency_uuid uuid, _name text) OWNER TO postgres;

--
-- Name: service_step_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.service_step_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    service_uuid_ uuid,
    previous_service_step_uuid_ uuid,
    name_ text NOT NULL,
    type_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.service_step_ OWNER TO postgres;

--
-- Name: create_service_step_(uuid, text, text, uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.create_service_step_(_service_uuid uuid, _name text, _type text, _previous_service_step_uuid uuid DEFAULT NULL::uuid) RETURNS application_.service_step_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _service_step application_.service_step_;
  _next_service_step_uuid uuid;
  _arg RECORD;
BEGIN
  SELECT _service_uuid service_uuid_, s.agency_uuid_ INTO _arg
  FROM application_.service_ s
  WHERE s.uuid_ = _service_uuid; 
  PERFORM security_.control_operation_('create_service_step_', _arg);

  IF _previous_service_step_uuid IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM application_.service_step_ s
    WHERE s.service_uuid_ = _service_uuid
      AND s.uuid_ = _previous_service_step_uuid
  ) THEN
    RAISE 'Invalid value for "_previous_service_step_uuid" argument' USING ERRCODE = '20000';
  END IF;

  SELECT s.uuid_ INTO _next_service_step_uuid
  FROM application_.service_step_ s
  WHERE s.previous_service_step_uuid_ IS NOT DISTINCT FROM _previous_service_step_uuid
    AND s.service_uuid_ = _service_uuid;

  INSERT INTO application_.service_step_ (service_uuid_, name_, type_, previous_service_step_uuid_)
  VALUES (_service_uuid, _name, _type, _previous_service_step_uuid)
  RETURNING * INTO _service_step;

  IF _next_service_step_uuid IS NOT NULL THEN
    UPDATE application_.service_step_
    SET
      previous_service_step_uuid_ = _service_step.uuid_
    WHERE uuid_ = _next_service_step_uuid;
  END IF;

  RETURN _service_step;
END
$$;


ALTER FUNCTION operation_.create_service_step_(_service_uuid uuid, _name text, _type text, _previous_service_step_uuid uuid) OWNER TO postgres;

--
-- Name: stripe_account_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.stripe_account_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL,
    stripe_id_ext_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.stripe_account_ OWNER TO postgres;

--
-- Name: create_stripe_account_(uuid, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.create_stripe_account_(_agency_uuid uuid, _stripe_acct_id text) RETURNS application_.stripe_account_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _stripe_account application_.stripe_account_;
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_, _stripe_acct_id stripe_acct_id_ INTO _arg; 
  PERFORM security_.control_operation_('create_stripe_account_', _arg);

  INSERT INTO application_.stripe_account_(agency_uuid_, stripe_id_)
  VALUES (_agency_uuid, _stripe_acct_id)
  RETURNING * INTO _stripe_account;

  RETURN _stripe_account;
END
$$;


ALTER FUNCTION operation_.create_stripe_account_(_agency_uuid uuid, _stripe_acct_id text) OWNER TO postgres;

--
-- Name: decline_user_invite_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.decline_user_invite_(_invite_uuid uuid) RETURNS application_.user_invite_
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


ALTER FUNCTION operation_.decline_user_invite_(_invite_uuid uuid) OWNER TO postgres;

--
-- Name: delete_agency_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.delete_agency_(_agency_uuid uuid) RETURNS application_.agency_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _agency application_.agency_;
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('delete_agency_', _arg);

  DELETE FROM application_.agency_
  WHERE uuid_ = _agency_uuid
  RETURNING * INTO _agency;

  DELETE FROM security_.subdomain_
  WHERE uuid_ = _agency.subdomain_uuid_;

  RETURN _agency;
END
$$;


ALTER FUNCTION operation_.delete_agency_(_agency_uuid uuid) OWNER TO postgres;

--
-- Name: delete_client_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.delete_client_(_client_uuid uuid) RETURNS application_.client_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _client application_.client_;
  _arg RECORD;
BEGIN
  SELECT _client_uuid client_uuid_, c.agency_uuid_ INTO _arg
  FROM application_.client_ c
  WHERE c.uuid_ = _client_uuid; 
  PERFORM security_.control_operation_('delete_client_', _arg);

  DELETE FROM application_.client_
  WHERE uuid_ = _client_uuid
  RETURNING * INTO _client;

  RETURN _client;
END
$$;


ALTER FUNCTION operation_.delete_client_(_client_uuid uuid) OWNER TO postgres;

--
-- Name: delete_resource_(text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.delete_resource_(_id text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
  _data jsonb;
BEGIN
  SELECT * INTO _resource
  FROM application_.resource_ WHERE id_ = _id;

  SELECT * INTO _resource_definition
  FROM security_.resource_definition_ WHERE uuid_ = _resource.definition_uuid_;

  PERFORM security_.control_delete_(_resource_definition, _resource);

  _data := operation_.query_resource_(_id);

  PERFORM internal_.dynamic_delete_(_resource_definition.table_, _resource.uuid_);

  RETURN _data;
END
$$;


ALTER FUNCTION operation_.delete_resource_(_id text) OWNER TO postgres;

--
-- Name: delete_service_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.delete_service_(_service_uuid uuid) RETURNS application_.service_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _service application_.service_;
  _arg RECORD;
BEGIN
  SELECT _service_uuid service_uuid_, s.agency_uuid_ INTO _arg
  FROM application_.service_ s
  WHERE s.uuid_ = _service_uuid; 
  PERFORM security_.control_operation_('delete_service_', _arg);

  DELETE FROM application_.service_
  WHERE uuid_ = _service_uuid
  RETURNING * INTO _service;

  RETURN _service;
END
$$;


ALTER FUNCTION operation_.delete_service_(_service_uuid uuid) OWNER TO postgres;

--
-- Name: delete_service_step_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.delete_service_step_(_service_step_uuid uuid) RETURNS application_.service_step_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _service_step application_.service_step_;
  _arg RECORD;
BEGIN
  SELECT _service_step_uuid service_step_uuid_, ss.service_uuid_, s.agency_uuid_ INTO _arg
  FROM application_.service_step_ ss
  JOIN application_.service_ s ON s.uuid_ = ss.service_uuid_
  WHERE ss.uuid_ = _service_step_uuid;
  PERFORM security_.control_operation_('delete_service_step_', _arg);

  UPDATE application_.service_step_ ss_next
  SET
    previous_service_step_uuid_ = ss_prev.uuid_
  FROM application_.service_step_ ss
  LEFT JOIN application_.service_step_ ss_prev ON ss_prev.uuid_ = ss.previous_service_step_uuid_
  WHERE ss.uuid_ = _service_step_uuid
    AND ss.uuid_ = ss_next.previous_service_step_uuid_;

  DELETE FROM application_.service_step_
  WHERE uuid_ = _service_step_uuid
  RETURNING * INTO _service_step;

  RETURN _service_step;
END
$$;


ALTER FUNCTION operation_.delete_service_step_(_service_step_uuid uuid) OWNER TO postgres;

--
-- Name: theme_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.theme_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    image_logo_uuid_ uuid,
    image_hero_uuid_ uuid,
    color_primary_ text,
    color_secondary_ text,
    color_accent_ text,
    color_background_ text,
    color_surface_ text,
    color_error_ text,
    color_success_ text,
    agency_uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.theme_ OWNER TO postgres;

--
-- Name: edit_agency_theme_(uuid, uuid, uuid, text, text, text, text, text, text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.edit_agency_theme_(_agency_uuid uuid, _image_logo_uuid uuid, _image_hero_uuid uuid, _color_primary text, _color_secondary text, _color_accent text, _color_background text, _color_surface text, _color_error text, _color_success text) RETURNS application_.theme_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _theme application_.theme_;
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('edit_agency_theme_', _arg);

  INSERT INTO application_.theme_ (name_, agency_uuid_, image_logo_uuid_, image_hero_uuid_, color_primary_, color_secondary_, color_accent_, color_background_, color_surface_, color_error_, color_success_)
  VALUES ('default', _agency_uuid, _image_logo_uuid, _image_hero_uuid, _color_primary, _color_secondary, _color_accent, _color_background, _color_surface, _color_error, _color_success)
  ON CONFLICT (agency_uuid_) DO UPDATE
  SET
    image_logo_uuid_ = _image_logo_uuid,
    image_hero_uuid_ = _image_hero_uuid,
    color_primary_ = _color_primary,
    color_secondary_ = _color_secondary,
    color_accent_ = _color_accent,
    color_background_ = _color_background,
    color_surface_ = _color_surface,
    color_error_ = _color_error,
    color_success_ = _color_success
  RETURNING * INTO _theme;

  RETURN _theme;
END
$$;


ALTER FUNCTION operation_.edit_agency_theme_(_agency_uuid uuid, _image_logo_uuid uuid, _image_hero_uuid uuid, _color_primary text, _color_secondary text, _color_accent text, _color_background text, _color_surface text, _color_error text, _color_success text) OWNER TO postgres;

--
-- Name: image_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.image_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    data_ text NOT NULL,
    color_ text NOT NULL,
    agency_uuid_ uuid,
    access_ public.access_level_ DEFAULT 'owner'::public.access_level_ NOT NULL
);


ALTER TABLE application_.image_ OWNER TO postgres;

--
-- Name: edit_image_(uuid, text, text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.edit_image_(_agency_uuid uuid, _image_name text, _image_data text, _image_color text) RETURNS application_.image_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _image application_.image_;
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('edit_image_', _arg);

  INSERT INTO application_.image_ (agency_uuid_, name_, data_, color_)
  VALUES (_agency_uuid, _image_name, _image_data, _image_color)
  ON CONFLICT (name_, agency_uuid_) DO UPDATE
  SET
    data_ = _image_data,
    color_ = _image_color
  RETURNING * INTO _image;

  RETURN _image;
END
$$;


ALTER FUNCTION operation_.edit_image_(_agency_uuid uuid, _image_name text, _image_data text, _image_color text) OWNER TO postgres;

--
-- Name: edit_service_(uuid, text, text, text, integer, text, uuid, uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.edit_service_(_service_uuid uuid, _name text, _description text, _duration text, _price integer, _currency text, _image_logo_uuid uuid, _image_hero_uuid uuid) RETURNS application_.service_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _service application_.service_;
  _arg RECORD;
BEGIN
  SELECT _service_uuid service_uuid_, s.agency_uuid_ INTO _arg
  FROM application_.service_ s
  WHERE s.uuid_ = _service_uuid; 
  PERFORM security_.control_operation_('edit_service_', _arg);

  UPDATE application_.service_
  SET
    name_ = _name,
    description_ = _description,
    duration_ = _duration,
    price_ = _price,
    currency_ = _currency,
    image_logo_uuid_ = _image_logo_uuid,
    image_hero_uuid_ = _image_hero_uuid
  WHERE uuid_ = _service_uuid
  RETURNING * INTO _service;

  RETURN _service;
END
$$;


ALTER FUNCTION operation_.edit_service_(_service_uuid uuid, _name text, _description text, _duration text, _price integer, _currency text, _image_logo_uuid uuid, _image_hero_uuid uuid) OWNER TO postgres;

--
-- Name: end_session_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.end_session_() RETURNS security_.session_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _session security_.session_;
BEGIN
  SELECT * INTO _session
  FROM security_.session_
  WHERE uuid_ = current_setting('security_.session_.uuid_'::text, true)::uuid
  FOR UPDATE;

  IF _session IS NULL THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  ELSEIF _session.nesting_ > 0 THEN
    UPDATE security_.session_
    SET
      nesting_ = nesting_ - 1
    WHERE uuid_ = _session.uuid_
    RETURNING * INTO _session;
  ELSE
    UPDATE security_.session_
    SET
      end_at_ = CURRENT_TIMESTAMP
    WHERE uuid_ = _session.uuid_
    RETURNING * INTO _session;

    PERFORM set_config('security_.token_.subject_uuid_', '00000000-0000-0000-0000-000000000000', 'f');
    PERFORM set_config('security_.session_.uuid_', '00000000-0000-0000-0000-000000000000', 'f');
  END IF;

  RETURN _session;
END
$$;


ALTER FUNCTION operation_.end_session_() OWNER TO postgres;

--
-- Name: token_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.token_ (
    uuid_ uuid NOT NULL,
    subject_uuid_ uuid NOT NULL,
    issued_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    revoked_at_ timestamp with time zone
);


ALTER TABLE security_.token_ OWNER TO postgres;

--
-- Name: end_visit_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.end_visit_() RETURNS security_.token_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _token security_.token_;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  UPDATE security_.token_ t
  SET
    revoked_at_ = CURRENT_TIMESTAMP
  FROM security_.session_ se
  CROSS JOIN security_.subject_ s
  WHERE t.uuid_ = se.token_uuid_
  AND t.revoked_at_ IS NULL
  AND s.uuid_ = t.subject_uuid_
  AND s.type_ = 'visitor'
  AND se.uuid_ = current_setting('security_.session_.uuid_'::text, false)::uuid
  RETURNING * INTO _token;

  RETURN _token;
END
$$;


ALTER FUNCTION operation_.end_visit_() OWNER TO postgres;

--
-- Name: invite_user_(uuid, text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.invite_user_(_agency_uuid uuid, _email_address text, _role_name text DEFAULT 'agent'::text) RETURNS application_.user_invite_
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


ALTER FUNCTION operation_.invite_user_(_agency_uuid uuid, _email_address text, _role_name text) OWNER TO postgres;

--
-- Name: log_in_user_(text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.log_in_user_(_email_address text, _password text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _uuid uuid := gen_random_uuid();
  _iat bigint := FLOOR(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP));
  _subject_uuid uuid;
  _secret bytea;
  _arg RECORD;
BEGIN
  SELECT _email_address email_address_ INTO _arg; 
  PERFORM security_.control_operation_('log_in_user_', _arg);

  SELECT u.uuid_ INTO _subject_uuid
  FROM security_.user_ u
  WHERE u.email_address_ = _email_address
    AND u.password_hash_ = pgcrypto_.crypt(_password, u.password_hash_);

  IF _subject_uuid IS NULL THEN
    RAISE 'Email address and password do not match.' USING ERRCODE = '20000';
  END IF;

  SELECT x.value_ INTO _secret
  FROM security_.secret_ x
  WHERE x.name_ = 'jwt_hs256';

  IF _secret IS NULL THEN
    RAISE 'Invalid secret configuration.' USING ERRCODE = '55000';
  END IF;

  INSERT INTO security_.token_ (uuid_, subject_uuid_)
  VALUES (_uuid, _subject_uuid);

  RETURN 
    internal_.jwt_sign_hs256_(
      jsonb_build_object(
        'iss', 'duely.app',
        'sub', _subject_uuid,
        'jti', _uuid,
        'iat', _iat
      ),
      _secret
    );
END
$$;


ALTER FUNCTION operation_.log_in_user_(_email_address text, _password text) OWNER TO postgres;

--
-- Name: log_out_user_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.log_out_user_() RETURNS security_.token_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _token security_.token_;
BEGIN
  PERFORM security_.control_operation_('log_out_user_');

  UPDATE security_.token_ t
  SET
    revoked_at_ = CURRENT_TIMESTAMP
  FROM security_.session_ se
  CROSS JOIN security_.subject_ s
  WHERE t.uuid_ = se.token_uuid_
  AND t.revoked_at_ IS NULL
  AND s.uuid_ = t.subject_uuid_
  AND s.type_ = 'user'
  AND se.uuid_ = current_setting('security_.session_.uuid_'::text, false)::uuid
  RETURNING * INTO _token;

  RETURN _token;
END
$$;


ALTER FUNCTION operation_.log_out_user_() OWNER TO postgres;

--
-- Name: query_active_subject_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_active_subject_() RETURNS TABLE(uuid_ uuid, name_ text, type_ text, email_address_ text)
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


ALTER FUNCTION operation_.query_active_subject_() OWNER TO postgres;

--
-- Name: query_agency_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_agency_(_agency_uuid uuid DEFAULT NULL::uuid) RETURNS TABLE(uuid_ uuid, subdomain_uuid_ uuid, theme_uuid_ uuid, name_ text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('query_agency_', _arg);

  RETURN QUERY
  SELECT a.uuid_, a.subdomain_uuid_, t.uuid_ theme_uuid_, a.name_
  FROM application_.agency_ a
  LEFT JOIN application_.theme_ t ON a.uuid_ = t.agency_uuid_
  WHERE _agency_uuid IS NULL 
     OR _agency_uuid IS NOT DISTINCT FROM a.uuid_;

END
$$;


ALTER FUNCTION operation_.query_agency_(_agency_uuid uuid) OWNER TO postgres;

--
-- Name: query_agency_by_subdomain_name_(text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_agency_by_subdomain_name_(_subdomain_name text) RETURNS TABLE(uuid_ uuid, subdomain_uuid_ uuid, theme_uuid_ uuid, name_ text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _subdomain_name subdomain_name_ INTO _arg; 
  PERFORM security_.control_operation_('query_agency_by_subdomain_name_', _arg);

  RETURN QUERY
  SELECT a.uuid_, a.subdomain_uuid_, t.uuid_ theme_uuid_, a.name_
  FROM application_.agency_ a
  LEFT JOIN application_.theme_ t ON a.uuid_ = t.agency_uuid_
  JOIN security_.subdomain_ d ON d.uuid_ = a.subdomain_uuid_
  WHERE d.name_ = _subdomain_name
  GROUP BY a.uuid_, a.subdomain_uuid_, t.uuid_, a.name_;

END
$$;


ALTER FUNCTION operation_.query_agency_by_subdomain_name_(_subdomain_name text) OWNER TO postgres;

--
-- Name: query_agency_user_(uuid, uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_agency_user_(_agency_uuid uuid, _subject_uuid uuid DEFAULT NULL::uuid) RETURNS TABLE(uuid_ uuid, name_ text, email_address_ text, type_ text, role_names_ text[])
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_, _subject_uuid subject_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('query_agency_user_', _arg);

  RETURN QUERY
  SELECT s.uuid_, s.name_, u.email_address_, s.type_, array_remove(array_agg(r.name_), NULL) role_names_
  FROM application_.agency_ a
  LEFT JOIN security_.subject_assignment_flat_ sa ON a.subdomain_uuid_ = sa.subdomain_uuid_
  LEFT JOIN security_.role_ r ON r.uuid_ = sa.role_uuid_
  LEFT JOIN security_.subject_ s ON s.uuid_ = sa.subject_uuid_
  LEFT JOIN security_.user_ u ON s.uuid_ = u.uuid_
  WHERE a.uuid_ = _agency_uuid
    AND (_subject_uuid IS NULL OR _subject_uuid IS NOT DISTINCT FROM s.uuid_)
  GROUP BY s.uuid_, s.name_, u.email_address_, s.type_;

END
$$;


ALTER FUNCTION operation_.query_agency_user_(_agency_uuid uuid, _subject_uuid uuid) OWNER TO postgres;

--
-- Name: query_client_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_client_(_client_uuid uuid) RETURNS TABLE(uuid_ uuid, agency_uuid_ uuid, name_ text, email_address_ text, invite_uuid_ uuid, subject_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT c.agency_uuid_, _client_uuid client_uuid_ INTO _arg
  FROM application_.client_ c
  WHERE c.uuid_ = _client_uuid;
  PERFORM security_.control_operation_('query_client_', _arg);

  RETURN QUERY
  SELECT c.uuid_, c.agency_uuid_, c.name_, c.email_address_, c.invite_uuid_, c.subject_uuid_
  FROM application_.client_ c
  WHERE c.uuid_ = _client_uuid;

END
$$;


ALTER FUNCTION operation_.query_client_(_client_uuid uuid) OWNER TO postgres;

--
-- Name: query_client_by_agency_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_client_by_agency_(_agency_uuid uuid) RETURNS TABLE(uuid_ uuid, agency_uuid_ uuid, name_ text, email_address_ text, invite_uuid_ uuid, subject_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_ INTO _arg;
  PERFORM security_.control_operation_('query_client_by_agency_', _arg);

  RETURN QUERY
  SELECT c.uuid_, c.agency_uuid_, c.name_, c.email_address_, c.invite_uuid_, c.subject_uuid_
  FROM application_.client_ c
  WHERE c.agency_uuid_ = _agency_uuid;

END
$$;


ALTER FUNCTION operation_.query_client_by_agency_(_agency_uuid uuid) OWNER TO postgres;

--
-- Name: query_current_user_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_current_user_() RETURNS jsonb
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT operation_.query_resource_(r.id_)
  FROM application_.resource_ r
  WHERE r.uuid_ = internal_.current_subject_uuid_()
$$;


ALTER FUNCTION operation_.query_current_user_() OWNER TO postgres;

--
-- Name: query_image_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_image_(_image_uuid uuid DEFAULT NULL::uuid) RETURNS TABLE(uuid_ uuid, name_ text, data_ text, color_ text, agency_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _image_uuid theme_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('query_image_', _arg);

  RETURN QUERY
  SELECT i.uuid_, i.name_, i.data_, i.color_, i.agency_uuid_
  FROM application_.image_ i
  WHERE (_image_uuid IS NULL AND i.agency_uuid_ IS NULL)
     OR (_image_uuid IS NOT DISTINCT FROM i.uuid_);

END
$$;


ALTER FUNCTION operation_.query_image_(_image_uuid uuid) OWNER TO postgres;

--
-- Name: query_resource_(text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_resource_(_id text) RETURNS jsonb
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT internal_.convert_from_internal_format_(
    internal_.dynamic_select_(d.table_, r.uuid_, keys_)
  ) data_
  FROM application_.resource_ r
  JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
  CROSS JOIN security_.control_query_(d, r) keys_
  WHERE r.id_ = _id
$$;


ALTER FUNCTION operation_.query_resource_(_id text) OWNER TO postgres;

--
-- Name: query_resource_access_(text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_resource_access_(_id text) RETURNS public.access_level_
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
SELECT r.name_::access_level_
FROM security_.subdomain_ d
JOIN security_.subject_assignment_ sa ON sa.subdomain_uuid_ = d.uuid_
JOIN security_.role_ r ON sa.role_uuid_ = r.uuid_
WHERE d.uuid_ = internal_.query_resource_owner_uuid_(_id)
  AND sa.subject_uuid_ = internal_.current_subject_uuid_();
$$;


ALTER FUNCTION operation_.query_resource_access_(_id text) OWNER TO postgres;

--
-- Name: query_resource_all_(text, jsonb); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_resource_all_(_resource_name text, _containing jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF _containing = '{}'::jsonb THEN
    RETURN;
  END IF;

  IF _containing - 'id' = '{}'::jsonb THEN
    RETURN QUERY
      SELECT operation_.query_resource_(_containing->>'id');
  END IF;

  _containing := internal_.convert_to_internal_format_(_containing);

  RETURN QUERY
    WITH
      all_ AS (
        SELECT internal_.dynamic_select_(d.table_, r.uuid_, keys_) data_
        FROM application_.resource_ r
        JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
        CROSS JOIN security_.control_query_(d, r) keys_
        WHERE d.name_ = _resource_name
          AND r.search_ @> _containing
      )
    SELECT internal_.convert_from_internal_format_(all_.data_) query_resource_all_
    FROM all_
    WHERE all_.data_ @> _containing;
END
$$;


ALTER FUNCTION operation_.query_resource_all_(_resource_name text, _containing jsonb) OWNER TO postgres;

--
-- Name: query_resource_definition_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_resource_definition_(_resource_definition_uuid uuid) RETURNS security_.resource_definition_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition_uuid;

  PERFORM security_.control_operation_('query_resource_definition_', _resource_definition);

  RETURN _resource_definition;
END
$$;


ALTER FUNCTION operation_.query_resource_definition_(_resource_definition_uuid uuid) OWNER TO postgres;

--
-- Name: query_role_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_role_(_role_uuid uuid) RETURNS TABLE(uuid_ uuid, name_ text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  DECLARE
    _arg RECORD;
  BEGIN
    SELECT _role_uuid role_uuid_ INTO _arg;
    PERFORM security_.control_operation_('query_role_', _arg);

    RETURN QUERY
    SELECT uuid_, name_
    FROM security_.role_
    WHERE uuid_ = _role_uuid;

  END
  $$;


ALTER FUNCTION operation_.query_role_(_role_uuid uuid) OWNER TO postgres;

--
-- Name: query_service_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_service_(_service_uuid uuid) RETURNS TABLE(uuid_ uuid, name_ text, agency_uuid_ uuid, status_ text, default_variant_uuid_ uuid, default_variant_name_ text, description_ text, duration_ text, price_ integer, currency_ text, image_logo_uuid_ uuid, image_hero_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _service_uuid service_uuid_, s.agency_uuid_, s.status_ service_status_ INTO _arg
  FROM application_.service_ s
  WHERE s.uuid_ = _service_uuid;
  PERFORM security_.control_operation_('query_service_', _arg);

  RETURN QUERY
  SELECT s.uuid_, s.name_, s.agency_uuid_, s.status_, s.default_variant_uuid_, v.name_ default_variant_uuid_, v.description_, v.duration_, v.price_, v.currency_, v.image_logo_uuid_, v.image_hero_uuid_
  FROM application_.service_ s
  LEFT JOIN application_.service_variant_ v ON s.default_variant_uuid_ = v.uuid_
  WHERE s.uuid_ = _service_uuid;

END
$$;


ALTER FUNCTION operation_.query_service_(_service_uuid uuid) OWNER TO postgres;

--
-- Name: query_service_by_agency_(uuid, text[]); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_service_by_agency_(_agency_uuid uuid, _status text[] DEFAULT NULL::text[]) RETURNS TABLE(uuid_ uuid, name_ text, agency_uuid_ uuid, status_ text, default_variant_uuid_ uuid, default_variant_name_ text, description_ text, duration_ text, price_ integer, currency_ text, image_logo_uuid_ uuid, image_hero_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_, _status service_status_ INTO _arg; 
  PERFORM security_.control_operation_('query_service_by_agency_', _arg);

  RETURN QUERY
  SELECT s.uuid_, s.name_, s.agency_uuid_, s.status_, s.default_variant_uuid_, v.name_ default_variant_uuid_, v.description_, v.duration_, v.price_, v.currency_, v.image_logo_uuid_, v.image_hero_uuid_
  FROM application_.service_ s
  LEFT JOIN application_.service_variant_ v ON s.default_variant_uuid_ = v.uuid_
  WHERE s.agency_uuid_ = _agency_uuid
    AND (_status IS NULL 
     OR s.status_ = ANY (COALESCE(_status, '{}'::text[])));

END
$$;


ALTER FUNCTION operation_.query_service_by_agency_(_agency_uuid uuid, _status text[]) OWNER TO postgres;

--
-- Name: query_service_step_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_service_step_(_service_step_uuid uuid) RETURNS TABLE(uuid_ uuid, service_uuid_ uuid, name_ text, type_ text, previous_service_step_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _service_step_uuid service_step_uuid_, ss.service_uuid_, s.agency_uuid_, s.status_ service_status_ INTO _arg
  FROM application_.service_step_ ss
  JOIN application_.service_ s ON s.uuid_ = ss.service_uuid_
  WHERE ss.uuid_ = _service_step_uuid;
  PERFORM security_.control_operation_('query_service_step_', _arg);

  RETURN QUERY
  SELECT s.uuid_, s.service_uuid_, s.name_, s.type_, s.previous_service_step_uuid_
  FROM application_.service_step_ s
  WHERE s.uuid_ = _service_step_uuid;

END
$$;


ALTER FUNCTION operation_.query_service_step_(_service_step_uuid uuid) OWNER TO postgres;

--
-- Name: query_service_step_by_service_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_service_step_by_service_(_service_uuid uuid) RETURNS TABLE(uuid_ uuid, service_uuid_ uuid, name_ text, type_ text, previous_service_step_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _service_uuid service_uuid_, s.agency_uuid_, s.status_ service_status_ INTO _arg
  FROM application_.service_ s
  WHERE s.uuid_ = _service_uuid;
  PERFORM security_.control_operation_('query_service_step_by_service_', _arg);

  RETURN QUERY
  WITH RECURSIVE _previous_steps(uuid_, service_uuid_, name_, type_, previous_service_step_uuid_) AS (
      SELECT s.uuid_, s.service_uuid_, s.name_, s.type_, s.previous_service_step_uuid_
      FROM application_.service_step_ s
      WHERE s.service_uuid_ = _service_uuid
        AND s.previous_service_step_uuid_ IS NULL
    UNION
      SELECT s.uuid_, s.service_uuid_, s.name_, s.type_, s.previous_service_step_uuid_
      FROM application_.service_step_ s
      JOIN _previous_steps p ON s.previous_service_step_uuid_ = p.uuid_
  )
  SELECT * FROM _previous_steps;

END
$$;


ALTER FUNCTION operation_.query_service_step_by_service_(_service_uuid uuid) OWNER TO postgres;

--
-- Name: query_service_variant_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_service_variant_(_service_variant_uuid uuid) RETURNS TABLE(uuid_ uuid, name_ text, service_uuid_ uuid, status_ text, description_ text, duration_ text, price_ integer, currency_ text, image_logo_uuid_ uuid, image_hero_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _service_variant_uuid service_variant_uuid_, s.service_uuid_, s.agency_uuid_, s.status_ service_status_, v.status_ service_variant_status_ INTO _arg
  FROM application_.service_variant_ v
  JOIN application_.service_ s ON s.uuid_ = v.service_uuid_
  WHERE v.uuid_ = _service_variant_uuid;
  PERFORM security_.control_operation_('query_service_variant_', _arg);

  RETURN QUERY
  SELECT v.uuid_, v.name_, v.service_uuid_, v.status_, v.description_, v.duration_, v.price_, v.currency_, v.image_logo_uuid_, v.image_hero_uuid_
  FROM application_.service_variant_ v
  WHERE v.uuid_ = _service_variant_uuid;

END
$$;


ALTER FUNCTION operation_.query_service_variant_(_service_variant_uuid uuid) OWNER TO postgres;

--
-- Name: query_service_variant_by_service_(uuid, text[]); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_service_variant_by_service_(_service_uuid uuid, _status text[] DEFAULT NULL::text[]) RETURNS TABLE(uuid_ uuid, name_ text, service_uuid_ uuid, status_ text, description_ text, duration_ text, price_ integer, currency_ text, image_logo_uuid_ uuid, image_hero_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT s.uuid_ service_uuid_, s.agency_uuid_, s.status_ service_status_, _status service_variant_status_ INTO _arg
  FROM  application_.service_ s
  WHERE s.uuid_ = _service_uuid;
  PERFORM security_.control_operation_('query_service_variant_by_service_', _arg);

  RETURN QUERY
  SELECT v.uuid_, v.name_, v.service_uuid_, v.status_, v.description_, v.duration_, v.price_, v.currency_, v.image_logo_uuid_, v.image_hero_uuid_
  FROM application_.service_variant_ v
  WHERE v.service_uuid_ = _service_uuid
    AND (_status IS NULL 
     OR v.status_ = ANY (COALESCE(_status, '{}'::text[])));

END
$$;


ALTER FUNCTION operation_.query_service_variant_by_service_(_service_uuid uuid, _status text[]) OWNER TO postgres;

--
-- Name: query_shared_agency_(uuid, uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_shared_agency_(_subject_uuid uuid, _agency_uuid uuid DEFAULT NULL::uuid) RETURNS TABLE(uuid_ uuid, name_ text, subdomain_uuid_ uuid, theme_uuid_ uuid, role_names_ text[])
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
  _info RECORD;
BEGIN
  SELECT _subject_uuid subject_uuid_, _agency_uuid agency_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('query_shared_agency_', _arg);

  RETURN QUERY
  SELECT a.uuid_, a.name_, a.subdomain_uuid_, t.uuid_ theme_uuid_, array_remove(array_agg(r.name_), NULL) role_names_
  FROM security_.user_ u
  JOIN security_.subject_assignment_flat_ sa ON u.uuid_ = sa.subject_uuid_
  JOIN security_.role_ r ON r.uuid_ = sa.role_uuid_
  JOIN application_.agency_ a ON a.subdomain_uuid_ = sa.subdomain_uuid_
  JOIN security_.active_role_ ar ON a.subdomain_uuid_ = ar.subdomain_uuid_ AND r.uuid_ = ar.uuid_
  LEFT JOIN application_.theme_ t ON a.uuid_ = t.agency_uuid_
  CROSS JOIN security_.active_user_ au
  WHERE u.uuid_ = _subject_uuid
    AND (ar.name_ = 'agent' OR _subject_uuid = au.uuid_)
    AND (_agency_uuid IS NULL OR _agency_uuid IS NOT DISTINCT FROM a.uuid_)
  GROUP BY a.uuid_, a.name_, a.subdomain_uuid_, t.uuid_;

END
$$;


ALTER FUNCTION operation_.query_shared_agency_(_subject_uuid uuid, _agency_uuid uuid) OWNER TO postgres;

--
-- Name: query_subdomain_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_subdomain_(_subdomain_uuid uuid DEFAULT NULL::uuid) RETURNS TABLE(uuid_ uuid, name_ text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _subdomain_uuid subdomain_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('query_subdomain_', _arg);

  RETURN QUERY
  SELECT d.uuid_, d.name_
  FROM security_.subdomain_ d
  WHERE _subdomain_uuid IS NULL 
     OR _subdomain_uuid IS NOT DISTINCT FROM d.uuid_;

END
$$;


ALTER FUNCTION operation_.query_subdomain_(_subdomain_uuid uuid) OWNER TO postgres;

--
-- Name: query_theme_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_theme_(_theme_uuid uuid DEFAULT NULL::uuid) RETURNS TABLE(uuid_ uuid, name_ text, image_logo_uuid_ uuid, image_hero_uuid_ uuid, color_primary_ text, color_secondary_ text, color_accent_ text, color_background_ text, color_surface_ text, color_error_ text, color_success_ text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _theme_uuid theme_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('query_theme_', _arg);

  RETURN QUERY
  SELECT t.uuid_, t.name_, t.image_logo_uuid_, t.image_hero_uuid_, t.color_primary_, t.color_secondary_, t.color_accent_, t.color_background_, t.color_surface_, t.color_error_, t.color_success_
  FROM application_.theme_ t
  WHERE (_theme_uuid IS NULL AND t.agency_uuid_ IS NULL AND t.standard_ = 't')
     OR (_theme_uuid IS NOT DISTINCT FROM t.uuid_);

END
$$;


ALTER FUNCTION operation_.query_theme_(_theme_uuid uuid) OWNER TO postgres;

--
-- Name: query_user_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_user_() RETURNS TABLE(uuid_ uuid, name_ text, email_address_ text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  PERFORM security_.control_operation_('query_user_');

  RETURN QUERY
  SELECT s.uuid_, s.name_, u.email_address_
  FROM security_.subject_ s
  JOIN security_.user_ u ON s.uuid_ = u.uuid_;

END
$$;


ALTER FUNCTION operation_.query_user_() OWNER TO postgres;

--
-- Name: query_user_by_email_address_(text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_user_by_email_address_(_email_address text) RETURNS TABLE(uuid_ uuid, name_ text, email_address_ text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _email_address email_address_ INTO _arg; 
  PERFORM security_.control_operation_('query_user_by_email_address_', _arg);

  RETURN QUERY
  SELECT u.uuid_, u.name_, u.email_address_
  FROM security_.user_ u
  WHERE u.email_address_ = lower(_email_address);

END
$$;


ALTER FUNCTION operation_.query_user_by_email_address_(_email_address text) OWNER TO postgres;

--
-- Name: query_user_invite_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_user_invite_(_invite_uuid uuid) RETURNS TABLE(uuid_ uuid, agency_uuid_ uuid, inviter_uuid_ uuid, invitee_email_address_ text, role_uuid_ uuid, status_ text, status_at_ timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  DECLARE
    _arg RECORD;
  BEGIN
    SELECT _invite_uuid invite_uuid_, ui.agency_uuid_ INTO _arg
    FROM application_.user_invite_ ui
    WHERE ui.uuid_ = _invite_uuid;
    PERFORM security_.control_operation_('query_user_invite_', _arg);

    RETURN QUERY
    SELECT ui.uuid_, ui.agency_uuid_, ui.inviter_uuid_, ui.invitee_email_address_, ui.role_uuid_, ui.status_, ui.status_at_
    FROM application_.user_invite_ ui
    WHERE ui.uuid_ = _invite_uuid;

  END
  $$;


ALTER FUNCTION operation_.query_user_invite_(_invite_uuid uuid) OWNER TO postgres;

--
-- Name: query_user_invite_by_agency_(uuid, text[]); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_user_invite_by_agency_(_agency_uuid uuid, _status text[] DEFAULT NULL::text[]) RETURNS TABLE(uuid_ uuid, agency_uuid_ uuid, inviter_uuid_ uuid, invitee_email_address_ text, role_uuid_ uuid, status_ text, status_at_ timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_, _status invite_status_ INTO _arg;
  PERFORM security_.control_operation_('query_user_invite_by_agency_', _arg);

  RETURN QUERY
  SELECT ui.uuid_, ui.agency_uuid_, ui.inviter_uuid_, ui.invitee_email_address_, ui.role_uuid_, ui.status_, ui.status_at_
  FROM application_.user_invite_ ui
  WHERE ui.agency_uuid_ = _agency_uuid
    AND (_status IS NULL 
      OR ui.status_ = ANY (COALESCE(_status, '{}'::text[])));

END
$$;


ALTER FUNCTION operation_.query_user_invite_by_agency_(_agency_uuid uuid, _status text[]) OWNER TO postgres;

--
-- Name: query_user_invite_by_subject_(uuid, text[]); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_user_invite_by_subject_(_subject_uuid uuid, _status text[] DEFAULT NULL::text[]) RETURNS TABLE(uuid_ uuid, agency_uuid_ uuid, inviter_uuid_ uuid, invitee_email_address_ text, role_uuid_ uuid, status_ text, status_at_ timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _subject_uuid subject_uuid_, _status invite_status_ INTO _arg;
  PERFORM security_.control_operation_('query_user_invite_by_subject_', _arg);

  RETURN QUERY
  SELECT ui.uuid_, ui.agency_uuid_, ui.inviter_uuid_, ui.invitee_email_address_, ui.role_uuid_, ui.status_, ui.status_at_
  FROM application_.user_invite_ ui
  JOIN security_.user_ u ON ui.invitee_email_address_ = u.email_address_
  WHERE u.uuid_ = _subject_uuid
    AND (_status IS NULL 
     OR ui.status_ = ANY (COALESCE(_status, '{}'::text[])));

END
$$;


ALTER FUNCTION operation_.query_user_invite_by_subject_(_subject_uuid uuid, _status text[]) OWNER TO postgres;

--
-- Name: remove_user_from_agency_(uuid, uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.remove_user_from_agency_(_agency_uuid uuid, _subject_uuid uuid) RETURNS bigint
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


ALTER FUNCTION operation_.remove_user_from_agency_(_agency_uuid uuid, _subject_uuid uuid) OWNER TO postgres;

--
-- Name: reset_password_(uuid, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.reset_password_(_verification_uuid uuid, _password text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _user security_.user_;
  _email_address text;
BEGIN
  PERFORM security_.control_operation_('reset_password_');

  UPDATE security_.email_address_verification_ SET
    status_ = 'verified',
    status_at_ = CURRENT_TIMESTAMP
  WHERE uuid_ = _verification_uuid
    AND status_ IS NULL
  RETURNING email_address_ INTO _email_address;

  IF _email_address IS NULL THEN
    RAISE 'No matching verification found.' USING ERRCODE = '20000';
  END IF;

  UPDATE security_.user_
  SET
    password_hash_ = pgcrypto_.crypt(_password, pgcrypto_.gen_salt('md5'))
  WHERE email_address_ = _email_address
  RETURNING * INTO _user;

  IF _user IS NULL THEN
    RAISE 'No user matching email address found: %', _email_address USING ERRCODE = '20000';
  END IF;

  RETURN (SELECT operation_.log_in_user_(_email_address, _password));
END
$$;


ALTER FUNCTION operation_.reset_password_(_verification_uuid uuid, _password text) OWNER TO postgres;

--
-- Name: set_service_status_(uuid, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.set_service_status_(_service_uuid uuid, _status text) RETURNS application_.service_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _service application_.service_;
  _arg RECORD;
BEGIN
  SELECT _service_uuid service_uuid_, _status service_status_, s.agency_uuid_ INTO _arg
  FROM application_.service_ s
  WHERE s.uuid_ = _service_uuid;
  PERFORM security_.control_operation_('set_service_status_', _arg);

  IF _status NOT IN ('draft', 'live') THEN
    RAISE 'Invalid service status: %', _status USING ERRCODE = '20000';
  END IF;

  UPDATE application_.service_
  SET
    status_ = _status
  WHERE uuid_ = _service_uuid
  RETURNING * INTO _service;

  RETURN _service;
END
$$;


ALTER FUNCTION operation_.set_service_status_(_service_uuid uuid, _status text) OWNER TO postgres;

--
-- Name: sign_up_user_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.sign_up_user_(_verification_uuid uuid) RETURNS text
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


ALTER FUNCTION operation_.sign_up_user_(_verification_uuid uuid) OWNER TO postgres;

--
-- Name: email_address_verification_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.email_address_verification_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    email_address_ text NOT NULL,
    started_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status_ text,
    status_at_ timestamp with time zone,
    data_ jsonb,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.email_address_verification_ OWNER TO postgres;

--
-- Name: start_email_address_verification_(text, boolean, jsonb); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.start_email_address_verification_(_email_address text, _is_existing_user boolean, _data jsonb DEFAULT NULL::jsonb) RETURNS security_.email_address_verification_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _email_address_verification security_.email_address_verification_;
BEGIN
  PERFORM security_.control_operation_('start_email_address_verification_');

  IF _is_existing_user THEN
    IF NOT EXISTS (
      SELECT 1
      FROM security_.user_
      WHERE email_address_ = lower(_email_address)
    ) THEN
      RAISE 'User does not exist.' USING ERRCODE = '20000';
    END IF;
  ELSE
    IF EXISTS (
      SELECT 1
      FROM security_.user_
      WHERE email_address_ = lower(_email_address)
    ) THEN
      RAISE 'User already exists.' USING ERRCODE = '20000';
    END IF;
  END IF;

  INSERT INTO security_.email_address_verification_ (email_address_, data_)
  VALUES (lower(_email_address), _data)
  ON CONFLICT (email_address_) WHERE (status_ IS NULL) DO UPDATE
  SET
    data_ = _data,
    started_at_ = DEFAULT
  WHERE security_.email_address_verification_.email_address_ = lower(_email_address)
  AND security_.email_address_verification_.status_ IS NULL
  RETURNING * INTO _email_address_verification;

  RETURN _email_address_verification;
END
$$;


ALTER FUNCTION operation_.start_email_address_verification_(_email_address text, _is_existing_user boolean, _data jsonb) OWNER TO postgres;

--
-- Name: update_resource_(text, jsonb); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.update_resource_(_id text, _data jsonb) RETURNS jsonb
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


ALTER FUNCTION operation_.update_resource_(_id text, _data jsonb) OWNER TO postgres;

--
-- Name: agent_can_query_agency_thank_you_page_setting_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.agent_can_query_agency_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, agency_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.agent_can_query_agency_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: agent_can_query_price_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.agent_can_query_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, service_variant_uuid_, stripe_id_ext_, type_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.agent_can_query_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: agent_can_query_service_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.agent_can_query_service_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, agency_uuid_, name_, url_name_, status_, default_variant_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.agent_can_query_service_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: agent_can_query_service_thank_you_page_setting_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.agent_can_query_service_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, service_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.agent_can_query_service_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: agent_can_query_service_variant_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.agent_can_query_service_variant_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, service_uuid_, stripe_id_ext_, name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.agent_can_query_service_variant_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: agent_in_agency_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.agent_in_agency_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ 
BEGIN 
  RETURN
    EXISTS (
      SELECT 1
      FROM security_.active_role_ r
      JOIN application_.agency_ a ON a.subdomain_uuid_ = r.subdomain_uuid_
      WHERE r.name_ = 'agent'
        AND a.uuid_ = _arg.agency_uuid_
    );
END
 $$;


ALTER FUNCTION policy_.agent_in_agency_(_arg anyelement) OWNER TO postgres;

--
-- Name: anyone_can_cancel_password_reset_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_cancel_password_reset_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  NULL;
END
$$;


ALTER FUNCTION policy_.anyone_can_cancel_password_reset_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_cancel_sign_up_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_cancel_sign_up_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  NULL;
END
$$;


ALTER FUNCTION policy_.anyone_can_cancel_sign_up_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_create_password_reset_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_create_password_reset_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN '{email_address_, data_}'::text[];
END
$$;


ALTER FUNCTION policy_.anyone_can_create_password_reset_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: anyone_can_create_sign_up_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_create_sign_up_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN '{email_address_, name_, data_, password_}'::text[];
END
$$;


ALTER FUNCTION policy_.anyone_can_create_sign_up_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: anyone_can_query_basic_agency_fields_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_basic_agency_fields_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, subdomain_uuid_, name_}'::text[];
$$;


ALTER FUNCTION policy_.anyone_can_query_basic_agency_fields_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_form_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_form_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_}'::text[];
$$;


ALTER FUNCTION policy_.anyone_can_query_form_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_form_field_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_form_field_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, name_, type_, form_uuid_, default_}'::text[];
$$;


ALTER FUNCTION policy_.anyone_can_query_form_field_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_live_price_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_live_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT status_ = 'live'
    FROM application_.price_
    WHERE uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, service_variant_uuid_, stripe_id_ext_, type_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.anyone_can_query_live_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_live_service_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_live_service_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT status_ = 'live'
    FROM application_.service_
    WHERE uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, agency_uuid_, name_, url_name_, status_, default_variant_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.anyone_can_query_live_service_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_live_service_variant_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_live_service_variant_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT status_ = 'live'
    FROM application_.service_variant_
    WHERE uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, service_uuid_, stripe_id_ext_, name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.anyone_can_query_live_service_variant_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_notification_definition_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_notification_definition_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN '{uuid_, name_, description_, stripe_event_, feed_template_, feed_notification_enabled_, feed_notification_default_, email_template_, email_notifications_enabled_, email_notifications_default_}'::text[];
END
$$;


ALTER FUNCTION policy_.anyone_can_query_notification_definition_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_own_membership_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_own_membership_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.subject_assignment_ sa
    WHERE uuid_ = _resource.uuid_
      AND subject_uuid_ = internal_.current_subject_uuid_()
  ) THEN
    RETURN '{uuid_, access_, user_uuid_, subdomain_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.anyone_can_query_own_membership_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_page_block_definition_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_page_block_definition_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, name_, page_definition_uuid_, form_uuid_}'::text[];
$$;


ALTER FUNCTION policy_.anyone_can_query_page_block_definition_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_page_definition_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_page_definition_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, name_}'::text[];
$$;


ALTER FUNCTION policy_.anyone_can_query_page_definition_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_stripe_account_for_agency_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_stripe_account_for_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, agency_uuid_, stripe_id_ext_}'::text[];
$$;


ALTER FUNCTION policy_.anyone_can_query_stripe_account_for_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_subdomain_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_subdomain_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT '{uuid_, name_}'::text[];
$$;


ALTER FUNCTION policy_.anyone_can_query_subdomain_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_theme_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_theme_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT '{uuid_, name_, agency_uuid_, image_logo_uuid_, image_hero_uuid_, color_primary_, color_secondary_, color_accent_, color_background_, color_surface_, color_error_, color_success_}'::text[];
$$;


ALTER FUNCTION policy_.anyone_can_query_theme_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_with_verification_code_can_verify_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_with_verification_code_can_verify_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF _resource.search_->>'verification_code_' = _data->>'verification_code_' THEN
    RETURN '{verified_, verification_code_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.anyone_with_verification_code_can_verify_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: anyone_with_verification_code_can_verify_password_reset_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_with_verification_code_can_verify_password_reset_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF _resource.search_->>'verification_code_' = _data->>'verification_code_' THEN
    RETURN '{password_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.anyone_with_verification_code_can_verify_password_reset_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: argument_is_not_null_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.argument_is_not_null_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ 
BEGIN
  RETURN (
    SELECT _arg IS NOT NULL
  );
END
 $$;


ALTER FUNCTION policy_.argument_is_not_null_(_arg anyelement) OWNER TO postgres;

--
-- Name: can_query_image_based_on_access_level_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.can_query_image_based_on_access_level_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_access_(_resource_definition, _resource, access_)
    FROM application_.image_
    WHERE uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, name_, data_, access_, color_, agency_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.can_query_image_based_on_access_level_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: can_query_markdown_based_on_access_level_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.can_query_markdown_based_on_access_level_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_access_(_resource_definition, _resource, access_)
    FROM application_.markdown_
    WHERE uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, name_, data_, access_, agency_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.can_query_markdown_based_on_access_level_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: can_query_page_based_on_access_level_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.can_query_page_based_on_access_level_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_access_(_resource_definition, _resource, access_)
    FROM application_.page_
    WHERE uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, access_, page_definition_uuid_, agency_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.can_query_page_based_on_access_level_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: can_query_page_block_based_on_page_access_level_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.can_query_page_block_based_on_page_access_level_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_access_(_resource_definition, _resource, access_)
    FROM application_.page_block_ b
    JOIN application_.page_ p ON p.uuid_ = b.page_uuid_
    WHERE b.uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, page_block_definition_uuid_, page_uuid_, data_, after_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.can_query_page_block_based_on_page_access_level_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: invitee_of_user_invite_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.invitee_of_user_invite_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ 
    BEGIN 
    RETURN
      EXISTS (
        SELECT 1
        FROM security_.active_subject_ s
        JOIN application_.user_invite_ ui ON s.email_address_ = ui.invitee_email_address_
        WHERE ui.uuid_ = _arg.invite_uuid_
      );
    END
   $$;


ALTER FUNCTION policy_.invitee_of_user_invite_(_arg anyelement) OWNER TO postgres;

--
-- Name: logged_in_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.logged_in_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ 
BEGIN
  RETURN EXISTS(
    SELECT 1
    FROM security_.active_subject_
    WHERE type_ = 'user'
  );
END;
 $$;


ALTER FUNCTION policy_.logged_in_(_arg anyelement) OWNER TO postgres;

--
-- Name: logged_in_user_can_create_subdomain_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.logged_in_user_can_create_subdomain_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
SELECT 1
    FROM security_.active_subject_
    WHERE type_ = 'user'
  ) THEN
    RETURN '{uuid_, name_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.logged_in_user_can_create_subdomain_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: logged_in_user_can_query_image_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.logged_in_user_can_query_image_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_
    WHERE type_ = 'user'
  ) THEN
    RETURN '{uuid_, name_, data_, color_, agency_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.logged_in_user_can_query_image_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: logged_in_user_can_query_name_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.logged_in_user_can_query_name_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
SELECT 1
    FROM security_.active_subject_
    WHERE type_ = 'user'
  ) THEN
    RETURN '{uuid_, name_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.logged_in_user_can_query_name_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: logged_in_user_can_query_theme_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.logged_in_user_can_query_theme_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_
    WHERE type_ = 'user'
  ) THEN
    RETURN '{uuid_, name_, image_logo_uuid_, image_hero_uuid_, color_primary_, color_secondary_, color_accent_, color_background_, color_surface_, color_error_, color_success_, agency_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.logged_in_user_can_query_theme_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: manager_in_agency_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.manager_in_agency_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN 
  RETURN
    EXISTS (
      SELECT 1
      FROM security_.active_role_ r
      JOIN application_.agency_ a ON a.subdomain_uuid_ = r.subdomain_uuid_
      WHERE r.name_ = 'manager'
        AND a.uuid_ = _arg.agency_uuid_
    );
END
 $$;


ALTER FUNCTION policy_.manager_in_agency_(_arg anyelement) OWNER TO postgres;

--
-- Name: only_owner_can_delete_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.only_owner_can_delete_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF NOT internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;
END
$$;


ALTER FUNCTION policy_.only_owner_can_delete_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: owner_can_change_agency_thank_you_page_setting_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_agency_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_agency_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_image_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_image_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{name_, data_, color_, access_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_image_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_markdown_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_markdown_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{name_, data_, access_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_markdown_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_name_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_name_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{name_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_name_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_page_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_page_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{access_, page_definition_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_page_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_page_block_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_page_block_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{data_, after_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_page_block_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_price_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_price_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_price_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_service_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_service_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, name_, url_name_, status_, default_variant_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_service_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_service_thank_you_page_setting_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_service_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_service_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_service_variant_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_service_variant_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_service_variant_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_stripe_account_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_stripe_account_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_stripe_account_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_theme_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_theme_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{name_, image_logo_uuid_, image_hero_uuid_, color_primary_, color_secondary_, color_accent_, color_background_, color_surface_, color_error_, color_success_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_theme_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_agency_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_agency_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_role_
    WHERE name_ = 'owner'
      AND subdomain_uuid_ = (_data->>'subdomain_uuid_')::uuid
  ) THEN
    RETURN '{uuid_, subdomain_uuid_, name_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_agency_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_agency_thank_you_page_setting_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_agency_thank_you_page_setting_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_agency_thank_you_page_setting_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_image_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_image_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)  
  ) THEN
    RETURN '{name_, data_, color_, agency_uuid_, access_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_image_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_markdown_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_markdown_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{name_, data_, agency_uuid_, access_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_markdown_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_page_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_page_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{access_, page_definition_uuid_, agency_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_page_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_page_block_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_page_block_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{page_block_definition_uuid_, page_uuid_, data_, after_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_page_block_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_price_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_price_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{service_variant_uuid_, stripe_id_ext_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_price_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_service_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_service_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, name_, url_name_, status_, default_variant_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_service_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_service_thank_you_page_setting_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_service_thank_you_page_setting_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{service_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_service_thank_you_page_setting_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_service_variant_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_service_variant_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{service_uuid_, stripe_id_ext_, name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_service_variant_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_stripe_account_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_stripe_account_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, stripe_id_ext_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_stripe_account_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_theme_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_theme_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{name_, agency_uuid_, image_logo_uuid_, image_hero_uuid_, color_primary_, color_secondary_, color_accent_, color_background_, color_surface_, color_error_, color_success_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_theme_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_invite_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_invite_(_arg anyelement DEFAULT NULL::unknown) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ 
BEGIN 
  RETURN
    EXISTS (
      SELECT 1
      FROM security_.active_role_ r
      JOIN application_.agency_ a ON a.subdomain_uuid_ = r.subdomain_uuid_
      WHERE r.name_ = 'owner'
        AND a.uuid_ = _arg.agency_uuid_
    );
END
 $$;


ALTER FUNCTION policy_.owner_can_invite_(_arg anyelement) OWNER TO postgres;

--
-- Name: owner_can_query_markdown_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_query_markdown_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, name_, access_, data_, agency_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_query_markdown_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: owner_can_query_stripe_account_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_query_stripe_account_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, agency_uuid_, stripe_id_ext_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_query_stripe_account_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: owner_in_agency_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_in_agency_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN 
  RETURN
    EXISTS (
      SELECT 1
      FROM security_.active_role_ r
      JOIN application_.agency_ a ON a.subdomain_uuid_ = r.subdomain_uuid_
      WHERE r.name_ = 'owner'
        AND a.uuid_ = _arg.agency_uuid_
    );
END
$$;


ALTER FUNCTION policy_.owner_in_agency_(_arg anyelement) OWNER TO postgres;

--
-- Name: password_reset_can_be_queried_by_initiator_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.password_reset_can_be_queried_by_initiator_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.password_reset_
    WHERE initiator_subject_uuid_ = internal_.current_subject_uuid_()
      AND uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, user_uuid_, data_, verification_code_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.password_reset_can_be_queried_by_initiator_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: service_status_contains_only_live_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.service_status_contains_only_live_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$  
BEGIN
  RETURN (
    SELECT _arg.service_status_ IS NOT NULL AND 'live' = ALL (_arg.service_status_) AND 'live' = ANY (_arg.service_status_)
  );
END
 $$;


ALTER FUNCTION policy_.service_status_contains_only_live_(_arg anyelement) OWNER TO postgres;

--
-- Name: service_status_is_live_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.service_status_is_live_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$  
BEGIN
  RETURN (
    SELECT _arg.service_status_ IS NOT DISTINCT FROM 'live'
  );
END
 $$;


ALTER FUNCTION policy_.service_status_is_live_(_arg anyelement) OWNER TO postgres;

--
-- Name: service_variant_status_contains_only_live_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.service_variant_status_contains_only_live_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$   
BEGIN
  RETURN (
    SELECT _arg.service_variant_status_ IS NOT NULL AND 'live' = ALL (_arg.service_variant_status_) AND 'live' = ANY (_arg.service_variant_status_)
  );
END
 $$;


ALTER FUNCTION policy_.service_variant_status_contains_only_live_(_arg anyelement) OWNER TO postgres;

--
-- Name: serviceaccount_can_change_markdown_without_agency_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_change_markdown_without_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF _resource.owner_uuid_ IS NULL AND internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{name_, data_, access_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_change_markdown_without_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: serviceaccount_can_create_markdown_without_agency_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_create_markdown_without_agency_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT (_data ? 'agency_uuid_') = false AND internal_.check_current_user_is_serviceaccount_()
  ) THEN
    RETURN '{name_, data_, access_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_create_markdown_without_agency_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_agency_thank_you_page_setting_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_agency_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_agency_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_markdown_without_agency_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_markdown_without_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF _resource.owner_uuid_ IS NULL AND internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, name_, access_, data_, agency_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_markdown_without_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_service_thank_you_page_setting_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_service_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, service_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_service_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_stripe_account_for_agency_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_stripe_account_for_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, stripe_id_ext_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_stripe_account_for_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: sign_up_can_be_queried_by_initiator_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.sign_up_can_be_queried_by_initiator_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.sign_up_
    WHERE initiator_subject_uuid_ = internal_.current_subject_uuid_()
      AND uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, user_uuid_, data_, verification_code_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.sign_up_can_be_queried_by_initiator_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: subject_is_active_user_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.subject_is_active_user_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ 
BEGIN
  RETURN
    EXISTS (
      SELECT 1
      FROM security_.active_user_ u
      WHERE u.uuid_ = _arg.subject_uuid_
    );
END
 $$;


ALTER FUNCTION policy_.subject_is_active_user_(_arg anyelement) OWNER TO postgres;

--
-- Name: user_can_change_name_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.user_can_change_name_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    WHERE s.type_ = 'user'
      AND s.uuid_ = _resource.uuid_
  ) THEN
    RETURN '{name_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.user_can_change_name_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: user_can_change_their_notification_setting_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.user_can_change_their_notification_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    WHERE s.type_ = 'user'
      AND s.uuid_ = query_resource_owner_uuid_(_resource.id_, 'user')
  ) THEN
    RETURN '{feed_notification_, email_notification_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.user_can_change_their_notification_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: user_can_create_their_notification_setting_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.user_can_create_their_notification_setting_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    WHERE s.type_ = 'user'
      AND s.uuid_ = (_data->>'user_uuid_')::uuid
  ) THEN
    RETURN '{user_uuid_, subdomain_uuid_, notification_definition_uuid_, feed_notification_, email_notification_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.user_can_create_their_notification_setting_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: user_can_delete_only_themselves_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.user_can_delete_only_themselves_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
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


ALTER FUNCTION policy_.user_can_delete_only_themselves_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: user_can_query_their_notification_setting_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.user_can_query_their_notification_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    WHERE s.type_ = 'user'
      AND s.uuid_ = query_resource_owner_uuid_(_resource.id_, 'user')
  ) THEN
    RETURN '{uuid_, user_uuid_, subdomain_uuid_, notification_definition_uuid_, feed_notification_, email_notification_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.user_can_query_their_notification_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: user_can_query_themselves_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.user_can_query_themselves_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    WHERE s.type_ = 'user'
      AND s.uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, name_, email_address_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.user_can_query_themselves_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: users_can_remove_themselves_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.users_can_remove_themselves_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ 
BEGIN 
  RETURN
    EXISTS (
      SELECT 1
      FROM security_.subject_assgnment_flat sa
      JOIN security_.active_subject_ s ON s.uuid_ = sa.subject_uuid_
      JOIN application_.agency_ a ON a.subdomain_uuid_ = sa.subdomain_uuid_
        AND a.uuid_ = _arg.agency_uuid_
        AND s.uuid_ = _arg.subject_uuid_
    );
END
 $$;


ALTER FUNCTION policy_.users_can_remove_themselves_(_arg anyelement) OWNER TO postgres;

--
-- Name: visitor_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.visitor_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ 
BEGIN
  RETURN EXISTS(
    SELECT 1
    FROM security_.active_subject_
    WHERE type_ = 'visitor'
  );
END;
 $$;


ALTER FUNCTION policy_.visitor_(_arg anyelement) OWNER TO postgres;

--
-- Name: control_create_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: security_; Owner: postgres
--

CREATE FUNCTION security_.control_create_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
  _keys text[];
  _unauthorized_data jsonb;
  _fields_list text;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  IF _data IS NULL OR _data = '{}'::jsonb THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;

  _unauthorized_data := internal_.jsonb_strip_values_(_data);

  LOOP
    SELECT uuid_, function_ INTO _policy_uuid, _policy_function
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND after_uuid_ IS NOT DISTINCT FROM _policy_uuid
      AND operation_type_ = 'create';

    IF _policy_function IS NULL THEN
      EXIT;
    END IF;

    EXECUTE '
      SELECT ' || _policy_function::regproc || '($1, $2);
    '
    INTO _keys
    USING _resource_definition, _data;

    _unauthorized_data := _unauthorized_data - COALESCE(_keys, '{}');

    IF _unauthorized_data = '{}'::jsonb THEN
      -- Result: authorized
      INSERT INTO security_.event_log_ (operation_type_, resource_definition_uuid_, data_)
      VALUES ('create', _resource_definition.uuid_, _data);
      RETURN;
    END IF;
  END LOOP;

  -- Result: not authorized

  _unauthorized_data := internal_.convert_from_internal_format_(_unauthorized_data);

  SELECT string_agg(k, ', ') INTO _fields_list
  FROM jsonb_object_keys(_unauthorized_data) k;

  RAISE 'Unauthorized. Not allowed to set fields: %', _fields_list USING ERRCODE = '42501';
END
$_$;


ALTER FUNCTION security_.control_create_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: control_delete_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: security_; Owner: postgres
--

CREATE FUNCTION security_.control_delete_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND operation_type_ = 'delete'
  ) THEN
    RAISE 'Unauthorized. No access policies defined.' USING ERRCODE = '42501';
  END IF;

  LOOP
    SELECT uuid_, function_ INTO _policy_uuid, _policy_function
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND after_uuid_ IS NOT DISTINCT FROM _policy_uuid
      AND operation_type_ = 'delete';

    IF _policy_function IS NULL THEN
      EXIT;
    END IF;

    EXECUTE '
      SELECT ' || _policy_function::regproc || '($1, $2);
    '
    USING _resource_definition, _resource;
  END LOOP;

  INSERT INTO security_.event_log_ (operation_type_, resource_definition_uuid_, resource_uuid_)
  VALUES ('delete', _resource_definition.uuid_, _resource.uuid_);
END
$_$;


ALTER FUNCTION security_.control_delete_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: event_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.event_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    operation_uuid_ uuid NOT NULL,
    session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL,
    arg_ text,
    event_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE security_.event_ OWNER TO postgres;

--
-- Name: control_operation_(text, anyelement); Type: FUNCTION; Schema: security_; Owner: postgres
--

CREATE FUNCTION security_.control_operation_(_operation_name text, _arg anyelement DEFAULT NULL::text) RETURNS security_.event_
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _event security_.event_;
  _policy text;
  _deny boolean := 'f';
  _allow boolean := 'f';
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  FOR _policy IN
    SELECT p.policy_name_
    FROM security_.policy_assignment_ p
    JOIN security_.operation_ o ON p.operation_uuid_ = o.uuid_
    WHERE o.name_ = _operation_name
      AND p.type_ = 'deny'
  LOOP
    EXECUTE format('SELECT policy_.%1$I($1)', _policy) INTO _deny USING _arg;
    IF _deny THEN
      RAISE 'Unauthorized.' USING ERRCODE = '42501';
    END IF;
  END LOOP;

  FOR _policy IN
    SELECT p.policy_name_
    FROM security_.policy_assignment_ p
    JOIN security_.operation_ o ON p.operation_uuid_ = o.uuid_
    WHERE o.name_ = _operation_name
      AND p.type_ = 'allow'
  LOOP
    EXECUTE format('SELECT policy_.%1$I($1)', _policy) INTO _allow USING _arg;
    IF _allow THEN
      EXIT;
    END IF;
  END LOOP;

  IF NOT _allow THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;

  IF (
    SELECT o.log_events_
    FROM security_.operation_ o
    WHERE o.name_ = _operation_name
  ) THEN
    INSERT INTO security_.event_ (operation_uuid_, arg_)
    SELECT o.uuid_, _arg::text
    FROM security_.operation_ o
    WHERE o.name_ = _operation_name
    RETURNING * INTO _event;
  END IF;

  RETURN _event;
END
$_$;


ALTER FUNCTION security_.control_operation_(_operation_name text, _arg anyelement) OWNER TO postgres;

--
-- Name: control_query_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: security_; Owner: postgres
--

CREATE FUNCTION security_.control_query_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
  _keys text[];
  _authorized_keys text[] := '{}'::text[];
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  LOOP
    SELECT uuid_, function_ INTO _policy_uuid, _policy_function
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND after_uuid_ IS NOT DISTINCT FROM _policy_uuid
      AND operation_type_ = 'query';

    IF _policy_function IS NULL THEN
      EXIT;
    END IF;

    EXECUTE '
      SELECT ' || _policy_function::regproc || '($1, $2);
    '
    INTO _keys
    USING _resource_definition, _resource;

    _authorized_keys := array_cat(_authorized_keys, COALESCE(_keys, '{}'));
  END LOOP;

  IF array_length(COALESCE(_authorized_keys, '{}'), 1) = 0 THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;

  SELECT array_agg(DISTINCT k) INTO _authorized_keys
  FROM unnest(_authorized_keys) k;

  RETURN _authorized_keys;
END
$_$;


ALTER FUNCTION security_.control_query_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: control_update_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: security_; Owner: postgres
--

CREATE FUNCTION security_.control_update_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _policy_uuid uuid;
  _policy_function regprocedure;
  _keys text[];
  _unauthorized_data jsonb;
  _fields_list text;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  IF _data IS NULL OR _data = '{}'::jsonb THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;

  _unauthorized_data := internal_.jsonb_strip_values_(_data);

  LOOP
    SELECT uuid_, function_ INTO _policy_uuid, _policy_function
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition.uuid_
      AND after_uuid_ IS NOT DISTINCT FROM _policy_uuid
      AND operation_type_ = 'update';

    IF _policy_function IS NULL THEN
      EXIT;
    END IF;

    EXECUTE '
      SELECT ' || _policy_function::regproc || '($1, $2, $3);
    '
    INTO _keys
    USING _resource_definition, _resource, _data;

    _unauthorized_data := _unauthorized_data - COALESCE(_keys, '{}');

    IF _unauthorized_data = '{}'::jsonb THEN
      -- Result: authorized
      INSERT INTO security_.event_log_ (operation_type_, resource_definition_uuid_, resource_uuid_, data_)
      VALUES ('update', _resource_definition.uuid_, _resource.uuid_, _data);
      RETURN;
    END IF;
  END LOOP;

  -- Result: not authorized

  _unauthorized_data := internal_.convert_from_internal_format_(_unauthorized_data);

  SELECT string_agg(k, ', ') INTO _fields_list
  FROM jsonb_object_keys(_unauthorized_data) k;

  RAISE 'Unauthorized. Not allowed to set fields: %', _fields_list USING ERRCODE = '42501';
END
$_$;


ALTER FUNCTION security_.control_update_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: policy_assignment_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.policy_assignment_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    policy_name_ text NOT NULL,
    operation_uuid_ uuid NOT NULL,
    type_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.policy_assignment_ OWNER TO postgres;

--
-- Name: implement_policy_allow_(text, text, text); Type: FUNCTION; Schema: security_; Owner: postgres
--

CREATE FUNCTION security_.implement_policy_allow_(_operation_name text, _policy_name text, _policy_function_body text DEFAULT NULL::text) RETURNS security_.policy_assignment_
    LANGUAGE plpgsql
    AS $_X$
DECLARE
  _policy_assignment security_.policy_assignment_;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = _operation_name
      AND n.nspname = 'operation_'
  ) THEN
    RAISE 'Operation does not exist.' USING ERRCODE = '20000';
  END IF;

  IF _policy_function_body IS NOT NULL THEN
    EXECUTE format($__$

      CREATE FUNCTION policy_.%1$I(_arg anyelement DEFAULT NULL::text) RETURNS boolean
        LANGUAGE plpgsql SECURITY DEFINER
        AS $$ %2$s $$;

      ALTER FUNCTION policy_.%1$I(_arg anyelement) OWNER TO postgres;

      $__$,
      _policy_name, _policy_function_body);
  END IF;

  PERFORM format('policy_.%1$I', _policy_name)::regproc;

  INSERT INTO security_.policy_assignment_ (policy_name_, operation_uuid_, type_)
  SELECT _policy_name, o.uuid_, 'allow'
  FROM security_.operation_ o
  WHERE o.name_ = _operation_name
  ON CONFLICT (policy_name_, operation_uuid_) DO UPDATE
  SET
    type_ = 'allow';

  SELECT p.* INTO _policy_assignment
    FROM security_.policy_assignment_ p
    JOIN security_.operation_ o ON o.uuid_ = p.operation_uuid_
    WHERE p.policy_name_ = _policy_name
      AND o.name_ = _operation_name;

  RETURN _policy_assignment;
END
$_X$;


ALTER FUNCTION security_.implement_policy_allow_(_operation_name text, _policy_name text, _policy_function_body text) OWNER TO postgres;

--
-- Name: implement_policy_deny_(text, text, text); Type: FUNCTION; Schema: security_; Owner: postgres
--

CREATE FUNCTION security_.implement_policy_deny_(_operation_name text, _policy_name text, _policy_function_body text DEFAULT NULL::text) RETURNS security_.policy_assignment_
    LANGUAGE plpgsql
    AS $_X$
DECLARE
  _policy_assignment security_.policy_assignment_;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = _operation_name
      AND n.nspname = 'operation_'
  ) THEN
    RAISE 'Operation does not exist.' USING ERRCODE = '20000';
  END IF;

  IF _policy_function_body IS NOT NULL THEN
    EXECUTE format($__$

      CREATE FUNCTION policy_.%1$I(_arg anyelement DEFAULT NULL::text) RETURNS boolean
        LANGUAGE plpgsql SECURITY DEFINER
        AS $$ %2$s $$;

      ALTER FUNCTION policy_.%1$I(_arg anyelement) OWNER TO postgres;

      $__$,
      _policy_name, _policy_function_body, _policy_function_arg_name, _policy_function_arg_type, _policy_function_arg_default);
  END IF;

  PERFORM format('policy_.%1$I', _policy_name)::regproc;

  INSERT INTO security_.policy_assignment_ (policy_name_, operation_uuid_, type_)
  SELECT _policy_name, o.uuid_, 'deny'
  FROM security_.operation_ o
  WHERE o.name_ = _operation_name
  ON CONFLICT (policy_name_, operation_uuid_) DO UPDATE
  SET
    type_ = 'deny';

  SELECT p.* INTO _policy_assignment
    FROM security_.policy_assignment_ p
    JOIN security_.operation_ o ON o.uuid_ = p.operation_uuid_
    WHERE p.policy_name_ = _policy_name
      AND o.name_ = _operation_name;

  RETURN _policy_assignment;
END
$_X$;


ALTER FUNCTION security_.implement_policy_deny_(_operation_name text, _policy_name text, _policy_function_body text) OWNER TO postgres;

--
-- Name: policy_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.policy_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    resource_definition_uuid_ uuid NOT NULL,
    function_ regprocedure NOT NULL,
    operation_type_ public.operation_type_ NOT NULL,
    after_uuid_ uuid
);


ALTER TABLE security_.policy_ OWNER TO postgres;

--
-- Name: register_policy_(regclass, public.operation_type_, regproc, regproc); Type: FUNCTION; Schema: security_; Owner: postgres
--

CREATE FUNCTION security_.register_policy_(_table regclass, _operation_type public.operation_type_, _policy_function regproc, _after_policy_function regproc DEFAULT NULL::regproc) RETURNS security_.policy_
    LANGUAGE plpgsql
    AS $$
DECLARE
  _resource_definition_uuid uuid;
  _policy security_.policy_;
  _function regprocedure;
  _after_uuid uuid;
  _before_uuid uuid;
BEGIN
  SELECT CASE _operation_type
    WHEN 'query' THEN (_policy_function || '(security_.resource_definition_, application_.resource_)')::regprocedure
    WHEN 'create' THEN (_policy_function || '(security_.resource_definition_, jsonb)')::regprocedure
    WHEN 'update' THEN (_policy_function || '(security_.resource_definition_, application_.resource_, jsonb)')::regprocedure
    WHEN 'delete' THEN (_policy_function || '(security_.resource_definition_, application_.resource_)')::regprocedure
  END INTO _function;

  SELECT uuid_ INTO _resource_definition_uuid
  FROM security_.resource_definition_
  WHERE table_ = _table;

  IF _after_policy_function IS NOT NULL THEN
    SELECT uuid_ INTO _after_uuid
    FROM security_.policy_
    WHERE resource_definition_uuid_ = _resource_definition_uuid
      AND CASE _operation_type
      WHEN 'query' THEN (_policy_function || '(security_.resource_definition_, application_.resource_)')::regprocedure
      WHEN 'create' THEN (_policy_function || '(security_.resource_definition_, jsonb)')::regprocedure
      WHEN 'update' THEN (_policy_function || '(security_.resource_definition_, application_.resource_, jsonb)')::regprocedure
      WHEN 'delete' THEN (_policy_function || '(security_.resource_definition_, application_.resource_)')::regprocedure
    END = function_;

    IF _after_uuid IS NULL THEN
      RAISE 'Previous policy was not found.' USING ERRCODE = '20000';
    END IF;
  END IF;

  SELECT uuid_ INTO _before_uuid
  FROM security_.policy_
  WHERE after_uuid_ IS NOT DISTINCT FROM _after_uuid
    AND resource_definition_uuid_ = _resource_definition_uuid
    AND operation_type_ = _operation_type;

  INSERT INTO security_.policy_ (function_, after_uuid_, resource_definition_uuid_, operation_type_)
  VALUES (_function, _after_uuid, _resource_definition_uuid, _operation_type)
  RETURNING * INTO _policy;

  IF _before_uuid IS NOT NULL THEN
    UPDATE security_.policy_
    SET after_uuid_ = _policy.uuid_
    WHERE uuid_ = _before_uuid;
  END IF;

  RETURN _policy;
END
$$;


ALTER FUNCTION security_.register_policy_(_table regclass, _operation_type public.operation_type_, _policy_function regproc, _after_policy_function regproc) OWNER TO postgres;

--
-- Name: unregister_policy_(regclass, public.operation_type_, regproc); Type: FUNCTION; Schema: security_; Owner: postgres
--

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
    SET after_uuid_ = _policy.after_uuid_
    WHERE after_uuid_ = _policy.uuid_;
  END IF;

  RETURN _policy;
END
$$;


ALTER FUNCTION security_.unregister_policy_(_table regclass, _operation_type public.operation_type_, _policy_function regproc) OWNER TO postgres;

--
-- Name: agency_thank_you_page_setting_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.agency_thank_you_page_setting_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL,
    url_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.agency_thank_you_page_setting_ OWNER TO postgres;

--
-- Name: markdown_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.markdown_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    data_ text NOT NULL,
    agency_uuid_ uuid,
    access_ public.access_level_ DEFAULT 'owner'::public.access_level_ NOT NULL
);


ALTER TABLE application_.markdown_ OWNER TO postgres;

--
-- Name: role_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.role_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.role_ OWNER TO postgres;

--
-- Name: subject_assignment_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.subject_assignment_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    role_uuid_ uuid NOT NULL,
    subdomain_uuid_ uuid NOT NULL,
    subject_uuid_ uuid NOT NULL
);


ALTER TABLE security_.subject_assignment_ OWNER TO postgres;

--
-- Name: user_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.user_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    email_address_ text,
    password_hash_ text,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.user_ OWNER TO postgres;

--
-- Name: membership_; Type: VIEW; Schema: application_; Owner: postgres
--

CREATE VIEW application_.membership_ AS
 SELECT sa.uuid_,
    (r.name_)::public.access_level_ AS access_,
    u.uuid_ AS user_uuid_,
    sa.subdomain_uuid_
   FROM ((security_.subject_assignment_ sa
     JOIN security_.role_ r ON ((r.uuid_ = sa.role_uuid_)))
     JOIN security_.user_ u ON ((u.uuid_ = sa.subject_uuid_)));


ALTER TABLE application_.membership_ OWNER TO postgres;

--
-- Name: notification_definition_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.notification_definition_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    description_ text,
    stripe_event_ text,
    feed_template_ text,
    feed_notification_enabled_ boolean,
    feed_notification_default_ boolean,
    email_template_ text,
    email_notifications_enabled_ boolean,
    email_notifications_default_ boolean,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.notification_definition_ OWNER TO postgres;

--
-- Name: page_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.page_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL,
    page_definition_uuid_ uuid NOT NULL,
    access_ public.access_level_ DEFAULT 'agent'::public.access_level_ NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.page_ OWNER TO postgres;

--
-- Name: page_block_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.page_block_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    page_block_definition_uuid_ uuid NOT NULL,
    page_uuid_ uuid NOT NULL,
    data_ jsonb DEFAULT '{}'::jsonb NOT NULL,
    after_uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.page_block_ OWNER TO postgres;

--
-- Name: password_reset_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.password_reset_ (
    uuid_ uuid NOT NULL,
    user_uuid_ uuid NOT NULL,
    data_ jsonb DEFAULT '{}'::jsonb NOT NULL,
    started_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at_ timestamp with time zone DEFAULT (CURRENT_TIMESTAMP + '1 day'::interval) NOT NULL,
    status_ public.verification_status_ DEFAULT 'started'::public.verification_status_ NOT NULL,
    status_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    initiator_subject_uuid_ uuid DEFAULT internal_.current_subject_uuid_() NOT NULL,
    verification_code_ uuid DEFAULT gen_random_uuid() NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.password_reset_ OWNER TO postgres;

--
-- Name: password_reset_; Type: VIEW; Schema: application_; Owner: postgres
--

CREATE VIEW application_.password_reset_ AS
 SELECT p.uuid_,
    u.uuid_ AS user_uuid_,
    u.email_address_,
    p.data_,
    NULL::text AS password_,
        CASE p.status_
            WHEN 'verified'::public.verification_status_ THEN true
            ELSE false
        END AS verified_,
    p.verification_code_
   FROM (security_.password_reset_ p
     JOIN security_.user_ u ON ((u.uuid_ = p.user_uuid_)))
  WHERE ((p.status_ = 'verified'::public.verification_status_) OR ((CURRENT_TIMESTAMP >= p.started_at_) AND (CURRENT_TIMESTAMP <= p.expires_at_)));


ALTER TABLE application_.password_reset_ OWNER TO postgres;

--
-- Name: price_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.price_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    service_variant_uuid_ uuid NOT NULL,
    stripe_id_ext_ text NOT NULL,
    type_ text GENERATED ALWAYS AS (application_.price_type_(recurring_interval_)) STORED,
    unit_amount_ integer NOT NULL,
    currency_ text NOT NULL,
    recurring_interval_ text,
    recurring_interval_count_ integer,
    status_ text DEFAULT 'draft'::text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.price_ OWNER TO postgres;

--
-- Name: service_step_confirmation_by_agency_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.service_step_confirmation_by_agency_ (
    uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.service_step_confirmation_by_agency_ OWNER TO postgres;

--
-- Name: service_step_document_delivery_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.service_step_document_delivery_ (
    uuid_ uuid NOT NULL,
    max_revisions_ integer DEFAULT '-1'::integer NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.service_step_document_delivery_ OWNER TO postgres;

--
-- Name: service_step_document_submission_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.service_step_document_submission_ (
    uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.service_step_document_submission_ OWNER TO postgres;

--
-- Name: service_step_form_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.service_step_form_ (
    uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.service_step_form_ OWNER TO postgres;

--
-- Name: service_step_payment_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.service_step_payment_ (
    uuid_ uuid NOT NULL,
    amount_ bigint NOT NULL,
    currency_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.service_step_payment_ OWNER TO postgres;

--
-- Name: service_thank_you_page_setting_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.service_thank_you_page_setting_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    service_uuid_ uuid NOT NULL,
    url_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.service_thank_you_page_setting_ OWNER TO postgres;

--
-- Name: service_variant_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.service_variant_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    service_uuid_ uuid NOT NULL,
    name_ text NOT NULL,
    status_ text DEFAULT 'draft'::text NOT NULL,
    description_ text,
    duration_ text,
    image_logo_uuid_ uuid,
    image_hero_uuid_ uuid,
    default_price_uuid_ uuid,
    markdown_description_uuid_ uuid,
    stripe_id_ext_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.service_variant_ OWNER TO postgres;

--
-- Name: sign_up_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.sign_up_ (
    uuid_ uuid NOT NULL,
    user_uuid_ uuid,
    email_address_ text NOT NULL,
    name_ text NOT NULL,
    password_hash_ text NOT NULL,
    data_ jsonb DEFAULT '{}'::jsonb NOT NULL,
    started_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at_ timestamp with time zone DEFAULT (CURRENT_TIMESTAMP + '1 day'::interval) NOT NULL,
    status_ public.verification_status_ DEFAULT 'started'::public.verification_status_ NOT NULL,
    status_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    initiator_subject_uuid_ uuid DEFAULT internal_.current_subject_uuid_() NOT NULL,
    verification_code_ uuid DEFAULT gen_random_uuid() NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.sign_up_ OWNER TO postgres;

--
-- Name: sign_up_; Type: VIEW; Schema: application_; Owner: postgres
--

CREATE VIEW application_.sign_up_ AS
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


ALTER TABLE application_.sign_up_ OWNER TO postgres;

--
-- Name: user_notification_setting_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.user_notification_setting_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    user_uuid_ uuid NOT NULL,
    subdomain_uuid_ uuid NOT NULL,
    notification_definition_uuid_ uuid NOT NULL,
    feed_notification_ boolean,
    email_notification_ boolean,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.user_notification_setting_ OWNER TO postgres;

--
-- Name: agency_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.agency_ (
    uuid_ uuid,
    subdomain_uuid_ uuid,
    name_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.agency_ OWNER TO postgres;

--
-- Name: agency_thank_you_page_setting_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.agency_thank_you_page_setting_ (
    uuid_ uuid,
    agency_uuid_ uuid,
    url_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.agency_thank_you_page_setting_ OWNER TO postgres;

--
-- Name: client_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.client_ (
    uuid_ uuid,
    agency_uuid_ uuid,
    name_ text,
    email_address_ text,
    invite_uuid_ uuid,
    subject_uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.client_ OWNER TO postgres;

--
-- Name: notification_definition_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.notification_definition_ (
    uuid_ uuid,
    name_ text,
    description_ text,
    stripe_event_ text,
    feed_template_ text,
    feed_notification_enabled_ boolean,
    feed_notification_default_ boolean,
    email_template_ text,
    email_notifications_enabled_ boolean,
    email_notifications_default_ boolean,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.notification_definition_ OWNER TO postgres;

--
-- Name: page_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.page_ (
    uuid_ uuid,
    agency_uuid_ uuid,
    page_definition_uuid_ uuid,
    access_ public.access_level_,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.page_ OWNER TO postgres;

--
-- Name: page_block_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.page_block_ (
    uuid_ uuid,
    page_block_definition_uuid_ uuid,
    page_uuid_ uuid,
    data_ jsonb,
    after_uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.page_block_ OWNER TO postgres;

--
-- Name: price_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.price_ (
    uuid_ uuid,
    service_variant_uuid_ uuid,
    stripe_id_ext_ text,
    type_ text,
    unit_amount_ integer,
    currency_ text,
    recurring_interval_ text,
    recurring_interval_count_ integer,
    status_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.price_ OWNER TO postgres;

--
-- Name: service_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.service_ (
    uuid_ uuid,
    agency_uuid_ uuid,
    name_ text,
    status_ text,
    default_variant_uuid_ uuid,
    url_name_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.service_ OWNER TO postgres;

--
-- Name: service_step_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.service_step_ (
    uuid_ uuid,
    service_uuid_ uuid,
    previous_service_step_uuid_ uuid,
    name_ text,
    type_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.service_step_ OWNER TO postgres;

--
-- Name: service_step_confirmation_by_agency_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.service_step_confirmation_by_agency_ (
    uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.service_step_confirmation_by_agency_ OWNER TO postgres;

--
-- Name: service_step_document_delivery_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.service_step_document_delivery_ (
    uuid_ uuid,
    max_revisions_ integer,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.service_step_document_delivery_ OWNER TO postgres;

--
-- Name: service_step_document_submission_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.service_step_document_submission_ (
    uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.service_step_document_submission_ OWNER TO postgres;

--
-- Name: service_step_form_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.service_step_form_ (
    uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.service_step_form_ OWNER TO postgres;

--
-- Name: service_step_payment_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.service_step_payment_ (
    uuid_ uuid,
    amount_ bigint,
    currency_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.service_step_payment_ OWNER TO postgres;

--
-- Name: service_thank_you_page_setting_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.service_thank_you_page_setting_ (
    uuid_ uuid,
    service_uuid_ uuid,
    url_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.service_thank_you_page_setting_ OWNER TO postgres;

--
-- Name: service_variant_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.service_variant_ (
    uuid_ uuid,
    service_uuid_ uuid,
    name_ text,
    status_ text,
    description_ text,
    duration_ text,
    image_logo_uuid_ uuid,
    image_hero_uuid_ uuid,
    default_price_uuid_ uuid,
    markdown_description_uuid_ uuid,
    stripe_id_ext_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.service_variant_ OWNER TO postgres;

--
-- Name: stripe_account_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.stripe_account_ (
    uuid_ uuid,
    agency_uuid_ uuid,
    stripe_id_ext_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.stripe_account_ OWNER TO postgres;

--
-- Name: theme_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.theme_ (
    uuid_ uuid,
    name_ text,
    image_logo_uuid_ uuid,
    image_hero_uuid_ uuid,
    color_primary_ text,
    color_secondary_ text,
    color_accent_ text,
    color_background_ text,
    color_surface_ text,
    color_error_ text,
    color_success_ text,
    agency_uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.theme_ OWNER TO postgres;

--
-- Name: user_invite_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.user_invite_ (
    uuid_ uuid,
    agency_uuid_ uuid,
    inviter_uuid_ uuid,
    invitee_email_address_ text,
    role_uuid_ uuid,
    status_ text,
    status_at_ timestamp with time zone,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.user_invite_ OWNER TO postgres;

--
-- Name: user_notification_setting_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.user_notification_setting_ (
    uuid_ uuid,
    user_uuid_ uuid,
    subdomain_uuid_ uuid,
    notification_definition_uuid_ uuid,
    feed_notification_ boolean,
    email_notification_ boolean,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.user_notification_setting_ OWNER TO postgres;

--
-- Name: form_; Type: TABLE; Schema: internal_; Owner: postgres
--

CREATE TABLE internal_.form_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE internal_.form_ OWNER TO postgres;

--
-- Name: form_field_; Type: TABLE; Schema: internal_; Owner: postgres
--

CREATE TABLE internal_.form_field_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    type_ text NOT NULL,
    form_uuid_ uuid NOT NULL,
    default_ jsonb,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE internal_.form_field_ OWNER TO postgres;

--
-- Name: page_block_definition_; Type: TABLE; Schema: internal_; Owner: postgres
--

CREATE TABLE internal_.page_block_definition_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    page_definition_uuid_ uuid NOT NULL,
    form_uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE internal_.page_block_definition_ OWNER TO postgres;

--
-- Name: page_definition_; Type: TABLE; Schema: internal_; Owner: postgres
--

CREATE TABLE internal_.page_definition_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE internal_.page_definition_ OWNER TO postgres;

--
-- Name: form_; Type: TABLE; Schema: internal__audit_; Owner: postgres
--

CREATE TABLE internal__audit_.form_ (
    uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE internal__audit_.form_ OWNER TO postgres;

--
-- Name: form_field_; Type: TABLE; Schema: internal__audit_; Owner: postgres
--

CREATE TABLE internal__audit_.form_field_ (
    uuid_ uuid,
    name_ text,
    type_ text,
    form_uuid_ uuid,
    default_ jsonb,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE internal__audit_.form_field_ OWNER TO postgres;

--
-- Name: page_block_definition_; Type: TABLE; Schema: internal__audit_; Owner: postgres
--

CREATE TABLE internal__audit_.page_block_definition_ (
    uuid_ uuid,
    name_ text,
    page_definition_uuid_ uuid,
    form_uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE internal__audit_.page_block_definition_ OWNER TO postgres;

--
-- Name: page_definition_; Type: TABLE; Schema: internal__audit_; Owner: postgres
--

CREATE TABLE internal__audit_.page_definition_ (
    uuid_ uuid,
    name_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE internal__audit_.page_definition_ OWNER TO postgres;

--
-- Name: subject_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.subject_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    type_ text NOT NULL
);


ALTER TABLE security_.subject_ OWNER TO postgres;

--
-- Name: active_subject_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.active_subject_ AS
 SELECT s.uuid_,
    s.type_
   FROM security_.subject_ s
  WHERE (s.uuid_ = (current_setting('security_.token_.subject_uuid_'::text, true))::uuid);


ALTER TABLE security_.active_subject_ OWNER TO postgres;

--
-- Name: role_hierarchy_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.role_hierarchy_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    role_uuid_ uuid NOT NULL,
    subrole_uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.role_hierarchy_ OWNER TO postgres;

--
-- Name: subject_assignment_flat_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.subject_assignment_flat_ AS
 WITH RECURSIVE _role_hierarchy(subject_uuid_, role_uuid_, subrole_uuid_, subdomain_uuid_) AS (
         SELECT sa.subject_uuid_,
            sa.role_uuid_,
            rh.subrole_uuid_,
            sa.subdomain_uuid_
           FROM (security_.subject_assignment_ sa
             LEFT JOIN security_.role_hierarchy_ rh ON ((rh.role_uuid_ = sa.role_uuid_)))
        UNION
         SELECT rrh.subject_uuid_,
            rh.role_uuid_,
            rh.subrole_uuid_,
            rrh.subdomain_uuid_
           FROM (security_.role_hierarchy_ rh
             JOIN _role_hierarchy rrh ON ((rh.role_uuid_ = rrh.subrole_uuid_)))
          WHERE (rrh.subrole_uuid_ IS NOT NULL)
        )
 SELECT rh.role_uuid_,
    rh.subdomain_uuid_,
    rh.subject_uuid_
   FROM _role_hierarchy rh
UNION
 SELECT rh.subrole_uuid_ AS role_uuid_,
    rh.subdomain_uuid_,
    rh.subject_uuid_
   FROM _role_hierarchy rh;


ALTER TABLE security_.subject_assignment_flat_ OWNER TO postgres;

--
-- Name: active_role_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.active_role_ AS
 SELECT r.uuid_,
    r.name_,
    sa.subdomain_uuid_
   FROM ((security_.subject_assignment_flat_ sa
     JOIN security_.active_subject_ s ON ((s.uuid_ = sa.subject_uuid_)))
     JOIN security_.role_ r ON ((r.uuid_ = sa.role_uuid_)));


ALTER TABLE security_.active_role_ OWNER TO postgres;

--
-- Name: active_user_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.active_user_ AS
 SELECT user_.uuid_,
    user_.name_,
    user_.email_address_
   FROM security_.user_
  WHERE (user_.uuid_ = (current_setting('security_.token_.subject_uuid_'::text, true))::uuid);


ALTER TABLE security_.active_user_ OWNER TO postgres;

--
-- Name: event_log_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.event_log_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    operation_type_ public.operation_type_ NOT NULL,
    resource_definition_uuid_ uuid,
    resource_uuid_ uuid,
    data_ jsonb,
    session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL,
    event_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE security_.event_log_ OWNER TO postgres;

--
-- Name: operation_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.operation_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    log_events_ boolean DEFAULT true NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.operation_ OWNER TO postgres;

--
-- Name: secret_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.secret_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    value_ bytea NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.secret_ OWNER TO postgres;

--
-- Name: security_data_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.security_data_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    key_ text NOT NULL,
    data_ jsonb DEFAULT '{}'::jsonb NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.security_data_ OWNER TO postgres;

--
-- Name: subdomain_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.subdomain_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.subdomain_ OWNER TO postgres;

--
-- Name: email_address_verification_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.email_address_verification_ (
    uuid_ uuid,
    email_address_ text,
    started_at_ timestamp with time zone,
    status_ text,
    status_at_ timestamp with time zone,
    data_ jsonb,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.email_address_verification_ OWNER TO postgres;

--
-- Name: operation_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.operation_ (
    uuid_ uuid,
    name_ text,
    log_events_ boolean,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.operation_ OWNER TO postgres;

--
-- Name: password_reset_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.password_reset_ (
    uuid_ uuid,
    user_uuid_ uuid,
    data_ jsonb,
    started_at_ timestamp with time zone,
    expires_at_ timestamp with time zone,
    status_ public.verification_status_,
    status_at_ timestamp with time zone,
    initiator_subject_uuid_ uuid,
    verification_code_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.password_reset_ OWNER TO postgres;

--
-- Name: policy_assignment_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.policy_assignment_ (
    uuid_ uuid,
    policy_name_ text,
    operation_uuid_ uuid,
    type_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.policy_assignment_ OWNER TO postgres;

--
-- Name: role_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.role_ (
    uuid_ uuid,
    name_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.role_ OWNER TO postgres;

--
-- Name: role_hierarchy_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.role_hierarchy_ (
    uuid_ uuid,
    role_uuid_ uuid,
    subrole_uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.role_hierarchy_ OWNER TO postgres;

--
-- Name: secret_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.secret_ (
    uuid_ uuid,
    name_ text,
    value_ bytea,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.secret_ OWNER TO postgres;

--
-- Name: security_data_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.security_data_ (
    uuid_ uuid,
    key_ text,
    data_ jsonb,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.security_data_ OWNER TO postgres;

--
-- Name: sign_up_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.sign_up_ (
    uuid_ uuid,
    user_uuid_ uuid,
    email_address_ text,
    name_ text,
    password_hash_ text,
    data_ jsonb,
    started_at_ timestamp with time zone,
    expires_at_ timestamp with time zone,
    status_ public.verification_status_,
    status_at_ timestamp with time zone,
    initiator_subject_uuid_ uuid,
    verification_code_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.sign_up_ OWNER TO postgres;

--
-- Name: subdomain_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.subdomain_ (
    uuid_ uuid,
    name_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.subdomain_ OWNER TO postgres;

--
-- Name: user_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.user_ (
    uuid_ uuid,
    email_address_ text,
    password_hash_ text,
    name_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.user_ OWNER TO postgres;

--
-- Name: membership_ uuid_; Type: DEFAULT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.membership_ ALTER COLUMN uuid_ SET DEFAULT gen_random_uuid();


--
-- Name: password_reset_ uuid_; Type: DEFAULT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.password_reset_ ALTER COLUMN uuid_ SET DEFAULT gen_random_uuid();


--
-- Name: sign_up_ uuid_; Type: DEFAULT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.sign_up_ ALTER COLUMN uuid_ SET DEFAULT gen_random_uuid();


--
-- Data for Name: form_; Type: TABLE DATA; Schema: internal_; Owner: postgres
--

COPY internal_.form_ (uuid_, audit_at_, audit_session_uuid_) FROM stdin;
\.


--
-- Data for Name: form_field_; Type: TABLE DATA; Schema: internal_; Owner: postgres
--

COPY internal_.form_field_ (uuid_, name_, type_, form_uuid_, default_, audit_at_, audit_session_uuid_) FROM stdin;
\.


--
-- Data for Name: page_block_definition_; Type: TABLE DATA; Schema: internal_; Owner: postgres
--

COPY internal_.page_block_definition_ (uuid_, name_, page_definition_uuid_, form_uuid_, audit_at_, audit_session_uuid_) FROM stdin;
\.


--
-- Data for Name: page_definition_; Type: TABLE DATA; Schema: internal_; Owner: postgres
--

COPY internal_.page_definition_ (uuid_, name_, audit_at_, audit_session_uuid_) FROM stdin;
\.


--
-- Data for Name: form_; Type: TABLE DATA; Schema: internal__audit_; Owner: postgres
--

COPY internal__audit_.form_ (uuid_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
\.


--
-- Data for Name: form_field_; Type: TABLE DATA; Schema: internal__audit_; Owner: postgres
--

COPY internal__audit_.form_field_ (uuid_, name_, type_, form_uuid_, default_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
\.


--
-- Data for Name: page_block_definition_; Type: TABLE DATA; Schema: internal__audit_; Owner: postgres
--

COPY internal__audit_.page_block_definition_ (uuid_, name_, page_definition_uuid_, form_uuid_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
\.


--
-- Data for Name: page_definition_; Type: TABLE DATA; Schema: internal__audit_; Owner: postgres
--

COPY internal__audit_.page_definition_ (uuid_, name_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
\.


--
-- Data for Name: operation_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.operation_ (uuid_, name_, log_events_, audit_at_, audit_session_uuid_) FROM stdin;
12ba3162-4b08-46cf-bf69-f8db5f6c291d	log_out_user_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
a5acd829-bced-4d98-8c5c-8f29e14c8116	create_agency_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
c865b482-975b-49b3-845f-dfa39f46a7f1	delete_agency_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
45cf7669-6e10-4c99-bf14-af25985a7f0f	delete_service_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
fa4b4c5f-160f-413b-b77a-beee70108f0a	create_service_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
a1c956c8-b64e-41ba-af40-d3c16721b04e	log_in_user_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
93fe889a-e329-4701-9222-3caba3028f23	sign_up_user_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	start_email_address_verification_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
7f2f5147-db6c-43cf-b0f0-2d68d56cba74	query_active_subject_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
fb9268f3-c318-4034-b785-7cc67a755f14	query_subdomain_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
616938d8-f0b0-4ce5-82f6-ebf1d97668ff	query_service_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
44836e4b-ecd5-4184-a177-498b412ff251	query_user_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
6780b297-e2e5-48f5-b58d-a855b51a0fae	query_role_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
44286eaf-723f-4a0b-b2b4-dd18404f948a	query_agency_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
89071731-bd21-4505-aab9-fd699c5fd12f	invite_user_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
8e119375-3f63-4a07-8239-6a4250094e93	remove_user_from_agency_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
04fc5530-96ee-469b-9e6d-f228392b81e9	accept_user_invite_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
a7a73077-da99-4acd-af2a-1f2dba998889	query_agency_user_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
3f020478-e3a3-4674-932d-8b922c17b91b	query_shared_agency_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
3ae8d981-be1f-4843-bc41-df24bc904e5d	query_agency_by_subdomain_name_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
384605a6-0fb2-4d9c-aacc-3e5a33be8c36	create_stripe_account_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
d21b8f48-a57a-45b3-9341-926d735dffb6	edit_agency_theme_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
373f84a0-350e-41e9-b714-705d21a79135	query_theme_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
8a08d468-c946-47d7-bcc1-f45819625d63	edit_image_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
a1db5356-28de-40ad-8059-630894876852	query_image_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
fca05330-a0b0-4d0e-b2e9-ff5125a9895e	query_service_by_agency_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
9b80cc60-7109-4849-ac2f-fc4df653bd2f	create_service_step_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
08f449e7-8215-484a-a40a-b6bdb9b16b4d	query_service_step_by_service_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
1c41ed54-3140-4a9e-8f9e-81f02b185708	delete_service_step_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
48929e2e-93c6-47a1-be0d-5b41ca8f2728	query_service_step_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
d8c38111-8742-4ee1-8adb-eedffb10198b	decline_user_invite_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
27849d3f-541f-4689-aad6-999dc14e0ce7	query_user_invite_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
59b6fdfa-8d4e-4069-88af-49634fa92a23	query_user_invite_by_agency_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
774d34d3-cd48-45ca-8f70-2f54010f5b48	cancel_user_invite_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
dbdecab4-c25b-43f4-a20a-3ef80d6be7bc	query_user_invite_by_subject_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
ddcffba4-934c-46ce-bc8b-6ae23b19dce1	edit_service_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
2fbee7e1-2b10-444b-aa98-199f58032ff5	set_service_status_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
03f23339-f79a-4f0b-8a4f-bc9ef2e5d291	reset_password_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
906655f2-4bbb-441a-b10b-7231da7bccad	query_user_by_email_address_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
b20e4cff-c150-4e02-af03-798cc73382f3	query_client_by_agency_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
31a284d0-b6ea-4dd4-b013-da4647a54558	query_client_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
3cefd8f7-9cd8-40bf-afce-83eed2491ff8	create_client_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
2bd1d873-946f-4557-905c-99b73b1d54bf	delete_client_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
624fefb6-75d8-4ed8-8e9b-05dbed2dc24f	query_service_variant_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
176dee67-37d8-4fd7-aa1d-44d8f204b270	query_service_variant_by_service_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
fdcd4f76-f55e-4f73-a063-57fac33976e9	query_resource_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
a4337d7b-9595-40c3-89c0-77787a394b72	query_resource_definition_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
9506e0e9-ee4a-4442-968a-76d9de05d2b3	query_current_user_	f	2020-10-20 07:07:02.389935+00	00000000-0000-0000-0000-000000000000
ba39b019-2291-419e-baee-ed810d004ffc	query_resource_access_	f	2020-11-01 10:56:05.733824+00	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: password_reset_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.password_reset_ (uuid_, user_uuid_, data_, started_at_, expires_at_, status_, status_at_, initiator_subject_uuid_, verification_code_, audit_at_, audit_session_uuid_) FROM stdin;
\.


--
-- Data for Name: policy_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.policy_ (uuid_, resource_definition_uuid_, function_, operation_type_, after_uuid_) FROM stdin;
4834193b-9666-4dbe-89d7-980fd4bab17a	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	policy_.logged_in_user_can_create_subdomain_(security_.resource_definition_,jsonb)	create	\N
5285f600-fb00-4861-8485-7b198c5a90c6	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	policy_.owner_can_create_agency_(security_.resource_definition_,jsonb)	create	\N
1eea3d78-a0e3-48b1-86b0-b09249dab127	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	policy_.anyone_can_query_basic_agency_fields_(security_.resource_definition_,application_.resource_)	query	\N
e84918a7-9e8e-4522-b400-4d258d8e1346	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	policy_.owner_can_change_name_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
cdc2d6a0-b00e-4763-bad3-d2b43bf0c3c0	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
72066618-a466-4b71-965f-891edcb33c6f	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	policy_.owner_can_change_name_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
69d40b30-226f-4dbf-8e86-564022464cc7	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
7fe3d163-1f55-4916-9f1f-f345c01e7773	88bcb8b1-3826-4bcd-81af-ce4f683c5285	policy_.owner_can_create_theme_(security_.resource_definition_,jsonb)	create	\N
95c5b9d6-3df7-4ace-961a-b817262783e4	88bcb8b1-3826-4bcd-81af-ce4f683c5285	policy_.owner_can_change_theme_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
781a2064-6530-4452-83d6-04347be6c845	88bcb8b1-3826-4bcd-81af-ce4f683c5285	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
e96b9766-d1d1-427a-9144-258e77ad6047	2d77f11c-8271-4c07-a6b4-3e7ac2ae8378	policy_.owner_can_create_image_(security_.resource_definition_,jsonb)	create	\N
b8bb1737-fb4f-4d40-afba-b8d29a3ebb05	2d77f11c-8271-4c07-a6b4-3e7ac2ae8378	policy_.owner_can_change_image_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
fce05ef3-4cd5-4b5e-a011-55e20f683556	2d77f11c-8271-4c07-a6b4-3e7ac2ae8378	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
5eafba24-946e-42b5-b82f-b0ff99629965	f8c5e08d-cd10-466e-9233-ae0e2ddbe81a	policy_.user_can_query_themselves_(security_.resource_definition_,application_.resource_)	query	\N
8c6d2f03-850b-428f-8304-6b9e667c1689	f8c5e08d-cd10-466e-9233-ae0e2ddbe81a	policy_.user_can_change_name_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
a8598fdb-0010-4a1b-9ad9-cfafc3f9e573	f8c5e08d-cd10-466e-9233-ae0e2ddbe81a	policy_.user_can_delete_only_themselves_(security_.resource_definition_,application_.resource_)	delete	\N
cdeef182-edc7-4120-a301-c174a5e6a837	3b56d171-3e69-41ca-9a98-d1a3abc9170b	policy_.anyone_can_create_sign_up_(security_.resource_definition_,jsonb)	create	\N
cb4cdf3a-a99b-44df-8027-8352de2333b9	3b56d171-3e69-41ca-9a98-d1a3abc9170b	policy_.anyone_can_cancel_sign_up_(security_.resource_definition_,application_.resource_)	delete	\N
96be86e8-c8b4-430f-befa-1045f9ced98a	3b56d171-3e69-41ca-9a98-d1a3abc9170b	policy_.sign_up_can_be_queried_by_initiator_(security_.resource_definition_,application_.resource_)	query	\N
aab7c301-7434-489a-bb03-5c91edfba106	edc5f82c-c991-494c-90f0-cf6163902f40	policy_.password_reset_can_be_queried_by_initiator_(security_.resource_definition_,application_.resource_)	query	\N
128a36c5-97fb-45f6-9e31-d804058cef95	edc5f82c-c991-494c-90f0-cf6163902f40	policy_.anyone_can_create_password_reset_(security_.resource_definition_,jsonb)	create	\N
d1a5960c-3f37-4c3f-864b-8807bf5a13c6	edc5f82c-c991-494c-90f0-cf6163902f40	policy_.anyone_can_cancel_password_reset_(security_.resource_definition_,application_.resource_)	delete	\N
acba9324-3aff-4951-a46d-51cd7eaa2691	3b56d171-3e69-41ca-9a98-d1a3abc9170b	policy_.anyone_with_verification_code_can_verify_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
b2257097-cb6d-4edc-a2b3-997e185dc415	edc5f82c-c991-494c-90f0-cf6163902f40	policy_.anyone_with_verification_code_can_verify_password_reset_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
1946993a-7a51-40f2-9e89-91199bdbf9bb	edc5f82c-c991-494c-90f0-cf6163902f40	policy_.anyone_with_verification_code_can_verify_(security_.resource_definition_,application_.resource_,jsonb)	update	b2257097-cb6d-4edc-a2b3-997e185dc415
ffbdd939-d23b-4703-b0a3-78baa975133f	3c7e93d6-b141-423a-a7e9-e11a734b3474	policy_.owner_can_create_stripe_account_(security_.resource_definition_,jsonb)	create	\N
be2e2434-7bb8-4b17-87bc-5a7bd97fdd13	3c7e93d6-b141-423a-a7e9-e11a734b3474	policy_.owner_can_change_stripe_account_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
1526bb13-417f-481f-981c-913d5f93dd0e	3c7e93d6-b141-423a-a7e9-e11a734b3474	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
2e070b30-cde4-4173-9020-c9b3b6104a64	d50773b3-5779-4333-8bc3-6ef32d488d72	policy_.anyone_can_query_live_service_(security_.resource_definition_,application_.resource_)	query	\N
c688ebf8-ac72-4f0f-8c19-6bf57b4f4d2a	d50773b3-5779-4333-8bc3-6ef32d488d72	policy_.agent_can_query_service_(security_.resource_definition_,application_.resource_)	query	2e070b30-cde4-4173-9020-c9b3b6104a64
c7e51b91-eb2d-436c-a2eb-c1cbe6f163cd	d50773b3-5779-4333-8bc3-6ef32d488d72	policy_.owner_can_create_service_(security_.resource_definition_,jsonb)	create	\N
f68d7638-0e2e-4e57-9605-e4438c17524e	d50773b3-5779-4333-8bc3-6ef32d488d72	policy_.owner_can_change_service_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
9bf91e52-e6ad-4daa-bb2a-d22dc966d62e	d50773b3-5779-4333-8bc3-6ef32d488d72	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
95c81a39-4ede-4ebd-9485-502ba1ad9a68	7f589215-bdc7-4664-99c6-b7745349c352	policy_.anyone_can_query_live_service_variant_(security_.resource_definition_,application_.resource_)	query	\N
ab3fa4a3-413f-449b-bfb5-ed4981ba1de2	7f589215-bdc7-4664-99c6-b7745349c352	policy_.agent_can_query_service_variant_(security_.resource_definition_,application_.resource_)	query	95c81a39-4ede-4ebd-9485-502ba1ad9a68
0be43a88-13df-4bb2-8794-159800b90670	7f589215-bdc7-4664-99c6-b7745349c352	policy_.owner_can_create_service_variant_(security_.resource_definition_,jsonb)	create	\N
37978625-4f1f-4c1a-a9da-0571a3e91fd4	7f589215-bdc7-4664-99c6-b7745349c352	policy_.owner_can_change_service_variant_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
b2cab51a-ad53-4ee2-9113-1566989be9dc	7f589215-bdc7-4664-99c6-b7745349c352	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
4bea3784-2dd2-46dc-9548-c55b4613f4b4	3c7e93d6-b141-423a-a7e9-e11a734b3474	policy_.serviceaccount_can_query_stripe_account_for_agency_(security_.resource_definition_,application_.resource_)	query	\N
98bbbedc-73b8-469b-bc84-797378745075	3c7e93d6-b141-423a-a7e9-e11a734b3474	policy_.owner_can_query_stripe_account_(security_.resource_definition_,application_.resource_)	query	4bea3784-2dd2-46dc-9548-c55b4613f4b4
607ca062-c61b-461f-83bf-b2a5b56cd1d0	d8f70962-229d-49eb-a99e-7c35a55719d5	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
ae810fbb-9426-4580-96bc-f124a0d2ca9d	d8f70962-229d-49eb-a99e-7c35a55719d5	policy_.owner_can_query_markdown_(security_.resource_definition_,application_.resource_)	query	79cd2981-cf2c-4a6b-831c-873a8d140e2d
5c87a82e-d302-45dd-adb8-7afdcac18236	d8f70962-229d-49eb-a99e-7c35a55719d5	policy_.serviceaccount_can_create_markdown_without_agency_(security_.resource_definition_,jsonb)	create	\N
b20974c1-ea3c-4c62-86ba-7cbe533e4300	d8f70962-229d-49eb-a99e-7c35a55719d5	policy_.owner_can_create_markdown_(security_.resource_definition_,jsonb)	create	5c87a82e-d302-45dd-adb8-7afdcac18236
feb75892-7dff-459c-87f7-afec68d96c17	d8f70962-229d-49eb-a99e-7c35a55719d5	policy_.serviceaccount_can_change_markdown_without_agency_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
154a632f-7102-4d53-9c0c-91b3fac16d94	d8f70962-229d-49eb-a99e-7c35a55719d5	policy_.owner_can_change_markdown_(security_.resource_definition_,application_.resource_,jsonb)	update	feb75892-7dff-459c-87f7-afec68d96c17
5b4d9b4f-822b-4d54-bd4a-c1709c449349	d8f70962-229d-49eb-a99e-7c35a55719d5	policy_.can_query_markdown_based_on_access_level_(security_.resource_definition_,application_.resource_)	query	\N
79cd2981-cf2c-4a6b-831c-873a8d140e2d	d8f70962-229d-49eb-a99e-7c35a55719d5	policy_.serviceaccount_can_query_markdown_without_agency_(security_.resource_definition_,application_.resource_)	query	5b4d9b4f-822b-4d54-bd4a-c1709c449349
32268460-a5bf-4807-a3d0-9ef69c23b1d7	2d77f11c-8271-4c07-a6b4-3e7ac2ae8378	policy_.can_query_image_based_on_access_level_(security_.resource_definition_,application_.resource_)	query	\N
d29e82dd-1151-4951-bac5-38051474a9b1	2d77f11c-8271-4c07-a6b4-3e7ac2ae8378	policy_.logged_in_user_can_query_image_(security_.resource_definition_,application_.resource_)	query	32268460-a5bf-4807-a3d0-9ef69c23b1d7
67c85773-8203-463c-a73e-83de271f588b	b54431c5-bbc4-47b6-9810-0a627e49cfe5	policy_.anyone_can_query_own_membership_(security_.resource_definition_,application_.resource_)	query	\N
0c06c7e3-7cdf-4bb1-b956-6fe90ab46a6f	88bcb8b1-3826-4bcd-81af-ce4f683c5285	policy_.anyone_can_query_theme_(security_.resource_definition_,application_.resource_)	query	\N
21a0e344-7b24-4f76-b267-363419f490d3	88bcb8b1-3826-4bcd-81af-ce4f683c5285	policy_.logged_in_user_can_query_theme_(security_.resource_definition_,application_.resource_)	query	0c06c7e3-7cdf-4bb1-b956-6fe90ab46a6f
fd641c3d-4052-49d5-96a3-1f83dc5fe3a4	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	policy_.anyone_can_query_subdomain_(security_.resource_definition_,application_.resource_)	query	\N
3bd8acaf-e137-4d29-ac84-6c9ab020184e	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	policy_.logged_in_user_can_query_name_(security_.resource_definition_,application_.resource_)	query	fd641c3d-4052-49d5-96a3-1f83dc5fe3a4
badf0fcf-f502-4165-9353-197af5fde1ad	f3e5569e-c28d-40e6-b1ca-698fb48e6ba3	policy_.anyone_can_query_live_price_(security_.resource_definition_,application_.resource_)	query	\N
7a2b81c8-1be0-47dd-b290-8be36a35e4d9	f3e5569e-c28d-40e6-b1ca-698fb48e6ba3	policy_.agent_can_query_price_(security_.resource_definition_,application_.resource_)	query	badf0fcf-f502-4165-9353-197af5fde1ad
96a65b10-7da0-4a81-a52e-a7b8e67e0977	f3e5569e-c28d-40e6-b1ca-698fb48e6ba3	policy_.owner_can_create_price_(security_.resource_definition_,jsonb)	create	\N
4dfc7859-04a2-450d-ad13-28617f157549	f3e5569e-c28d-40e6-b1ca-698fb48e6ba3	policy_.owner_can_change_price_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
57510ccd-6144-477e-b572-392c8f4948c9	f3e5569e-c28d-40e6-b1ca-698fb48e6ba3	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
80bf1108-87d3-482e-ac0d-9173883a142f	f8e2c163-8ebf-45dc-90b8-b850e1590c7c	policy_.user_can_query_their_notification_setting_(security_.resource_definition_,application_.resource_)	query	\N
3efc0b81-3ef0-46c0-9e58-450eb69646e0	f8e2c163-8ebf-45dc-90b8-b850e1590c7c	policy_.user_can_create_their_notification_setting_(security_.resource_definition_,jsonb)	create	\N
bfe85df9-030c-4173-abd7-52d25725ddd3	f8e2c163-8ebf-45dc-90b8-b850e1590c7c	policy_.user_can_change_their_notification_setting_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
cecdad34-bfee-4485-a35d-05c8b8f077c3	94a1ec9c-d7a6-4327-8221-6f00c6c09ccf	policy_.anyone_can_query_notification_definition_(security_.resource_definition_,application_.resource_)	query	\N
2ea74b1b-e0d4-4546-808b-f6a1b4597d0c	6549cc83-4ce3-423d-88e1-263ac227608d	policy_.serviceaccount_can_query_agency_thank_you_page_setting_(security_.resource_definition_,application_.resource_)	query	\N
64e2d02e-7e13-45e0-8aa9-cd0edc508f86	6549cc83-4ce3-423d-88e1-263ac227608d	policy_.agent_can_query_agency_thank_you_page_setting_(security_.resource_definition_,application_.resource_)	query	2ea74b1b-e0d4-4546-808b-f6a1b4597d0c
9cb7ba87-bc38-4ec0-ab7c-27328bf7d684	34f873e1-b837-4f1f-94d7-7bacf9c43d8d	policy_.serviceaccount_can_query_service_thank_you_page_setting_(security_.resource_definition_,application_.resource_)	query	\N
1d508b64-b0f4-4418-bf95-0bec7cc64cda	34f873e1-b837-4f1f-94d7-7bacf9c43d8d	policy_.agent_can_query_service_thank_you_page_setting_(security_.resource_definition_,application_.resource_)	query	9cb7ba87-bc38-4ec0-ab7c-27328bf7d684
50b54bad-9e8d-4e04-b71c-4596176e9258	6549cc83-4ce3-423d-88e1-263ac227608d	policy_.owner_can_create_agency_thank_you_page_setting_(security_.resource_definition_,jsonb)	create	\N
57aaadab-1383-4163-9da9-575c8b7ef82a	34f873e1-b837-4f1f-94d7-7bacf9c43d8d	policy_.owner_can_create_service_thank_you_page_setting_(security_.resource_definition_,jsonb)	create	\N
76e27529-d910-46ed-8e25-35d34a228b3e	6549cc83-4ce3-423d-88e1-263ac227608d	policy_.owner_can_change_agency_thank_you_page_setting_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
1fbcbd75-06d6-4eaf-95c2-513ebc712570	34f873e1-b837-4f1f-94d7-7bacf9c43d8d	policy_.owner_can_change_service_thank_you_page_setting_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
3905b875-0597-47e8-9084-36731c9e1610	6549cc83-4ce3-423d-88e1-263ac227608d	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
83fb2b29-e69e-476f-93dc-c5c68c5a7814	34f873e1-b837-4f1f-94d7-7bacf9c43d8d	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
026a7a57-3ed8-4c1b-93b5-0a0880ce255c	8248bebc-96c3-4f72-83df-ad4c68184470	policy_.anyone_can_query_form_(security_.resource_definition_,application_.resource_)	query	\N
c32871f2-1540-438e-b375-a7671d40a81f	cbe96769-7f38-4220-82fb-c746c634bc99	policy_.anyone_can_query_page_definition_(security_.resource_definition_,application_.resource_)	query	\N
6536c5ca-7960-42b5-ac89-ef75a1663b15	e61bae44-071d-4f80-9f53-c639f9b48661	policy_.anyone_can_query_page_block_definition_(security_.resource_definition_,application_.resource_)	query	\N
cacf6b3b-c992-4f31-bcb4-43f3d157249d	c042e657-0005-42a1-b3c2-6ee25d62fb33	policy_.anyone_can_query_form_field_(security_.resource_definition_,application_.resource_)	query	\N
baafa157-d21b-4f43-a182-4b26dbe7f5d8	08b16cec-4d78-499a-a092-91fc2d360f86	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
60c14718-5559-47ae-ab3a-89bcef23c3fc	08b16cec-4d78-499a-a092-91fc2d360f86	policy_.can_query_page_based_on_access_level_(security_.resource_definition_,application_.resource_)	query	\N
0b410b7a-9a8e-4781-ac7e-83a18d6ba010	08b16cec-4d78-499a-a092-91fc2d360f86	policy_.owner_can_change_page_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
3cc8c0a6-f1c1-416e-876a-547a743dbf62	08b16cec-4d78-499a-a092-91fc2d360f86	policy_.owner_can_create_page_(security_.resource_definition_,jsonb)	create	\N
3c066f80-65b5-470b-987a-2de1ec7cd06d	bc2e81b9-be64-4068-ad32-3ed89151bbfa	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
15cc0e4e-c216-4410-b1ea-bd6a550353ca	bc2e81b9-be64-4068-ad32-3ed89151bbfa	policy_.can_query_page_block_based_on_page_access_level_(security_.resource_definition_,application_.resource_)	query	\N
2859ef7b-837f-4b6d-97ff-0e10c3d9acc1	bc2e81b9-be64-4068-ad32-3ed89151bbfa	policy_.owner_can_change_page_block_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
d0c11115-cef1-41c8-a9ca-5b57b0fa6dd3	bc2e81b9-be64-4068-ad32-3ed89151bbfa	policy_.owner_can_create_page_block_(security_.resource_definition_,jsonb)	create	\N
\.


--
-- Data for Name: policy_assignment_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.policy_assignment_ (uuid_, policy_name_, operation_uuid_, type_, audit_at_, audit_session_uuid_) FROM stdin;
fb6da025-643a-4806-a64b-4a0e5042ba98	owner_in_agency_	c865b482-975b-49b3-845f-dfa39f46a7f1	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
e8992bc3-0f79-4797-81aa-bddef2193d97	visitor_	f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
685c3913-3fff-4345-865c-d3e4026321ed	visitor_	a1c956c8-b64e-41ba-af40-d3c16721b04e	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
3aef50bd-85e6-4beb-8bd4-9a252052200d	visitor_	93fe889a-e329-4701-9222-3caba3028f23	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
f9e2b169-903d-4e9c-ae20-b397489875dd	logged_in_	12ba3162-4b08-46cf-bf69-f8db5f6c291d	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
914f28e8-076c-45cb-8042-f827bc6e59e2	logged_in_	a5acd829-bced-4d98-8c5c-8f29e14c8116	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
7488a3fd-0f68-4369-95c2-9293e3a4f80e	manager_in_agency_	fa4b4c5f-160f-413b-b77a-beee70108f0a	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
b987a658-ec1d-4761-ba88-1b271d0ce51f	visitor_	7f2f5147-db6c-43cf-b0f0-2d68d56cba74	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
04793c21-c83f-4b7b-805d-c100578cb652	logged_in_	7f2f5147-db6c-43cf-b0f0-2d68d56cba74	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
7f09a849-5162-4cbb-9fbc-f42529ef0088	logged_in_	44286eaf-723f-4a0b-b2b4-dd18404f948a	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
d6067404-d2ba-46a5-9b50-ff027c661aae	argument_is_not_null_	44286eaf-723f-4a0b-b2b4-dd18404f948a	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
2d1cde8a-54e7-4aa5-87ef-3f733cf3dde0	logged_in_	fb9268f3-c318-4034-b785-7cc67a755f14	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
12543ad5-113a-4b09-8174-774119fd999e	owner_in_agency_	89071731-bd21-4505-aab9-fd699c5fd12f	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
991b0ec1-11b6-492e-a872-5b8aede7e5c3	owner_in_agency_	8e119375-3f63-4a07-8239-6a4250094e93	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
fdcffd77-fcb5-4ff8-9bb3-6bd8d06cfbd5	users_can_remove_themselves_	8e119375-3f63-4a07-8239-6a4250094e93	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
1b902618-8a68-4c0d-b05e-6bda782c5f30	agent_in_agency_	a7a73077-da99-4acd-af2a-1f2dba998889	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
75294233-ed0a-4b6a-8903-f206daf0af67	logged_in_	3f020478-e3a3-4674-932d-8b922c17b91b	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
b096a480-e5f0-4c34-a4f5-8bc75c2fb71b	argument_is_not_null_	3ae8d981-be1f-4843-bc41-df24bc904e5d	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
571601fd-1c3c-4d04-b37d-da9a66447025	argument_is_not_null_	fb9268f3-c318-4034-b785-7cc67a755f14	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
ea149d92-8577-4d3d-aa59-64713833b8fb	agent_in_agency_	616938d8-f0b0-4ce5-82f6-ebf1d97668ff	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
4ec948d5-45ea-4cdb-8cf9-aab00b10dfdd	owner_in_agency_	384605a6-0fb2-4d9c-aacc-3e5a33be8c36	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
6d532fe7-ad14-4d6d-9861-c0813b407fbc	manager_in_agency_	d21b8f48-a57a-45b3-9341-926d735dffb6	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
2a0d6fa5-76c1-4440-9421-53f57185c5df	visitor_	373f84a0-350e-41e9-b714-705d21a79135	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
229bf29f-1dd3-45a2-b845-9c271771a4ab	logged_in_	373f84a0-350e-41e9-b714-705d21a79135	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
126aa154-9a2b-4e9e-9473-58b90d917a17	manager_in_agency_	8a08d468-c946-47d7-bcc1-f45819625d63	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
4ab56a45-937f-4aa3-bfab-6a3ec95e14d6	visitor_	a1db5356-28de-40ad-8059-630894876852	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
eb2c9034-5c48-414a-bf05-a5fd4c492053	logged_in_	a1db5356-28de-40ad-8059-630894876852	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
8030c009-6c74-4a8a-9762-82c8d414e6cd	manager_in_agency_	45cf7669-6e10-4c99-bf14-af25985a7f0f	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
120c7413-19c3-4bc7-969a-1d701e6e6aa1	agent_in_agency_	fca05330-a0b0-4d0e-b2e9-ff5125a9895e	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
45794325-c9e9-4f3c-a805-13d013205a8f	service_status_contains_only_live_	fca05330-a0b0-4d0e-b2e9-ff5125a9895e	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
05cacc42-807b-4f51-b9f5-927983b26950	manager_in_agency_	9b80cc60-7109-4849-ac2f-fc4df653bd2f	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
832c874c-3b8b-4d51-8704-7ee2ec8ff18c	service_status_is_live_	08f449e7-8215-484a-a40a-b6bdb9b16b4d	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
7275e0a3-249c-4e32-a26f-4a399d724207	agent_in_agency_	08f449e7-8215-484a-a40a-b6bdb9b16b4d	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
88f38e52-c66d-4f38-9f9e-518fae934d67	service_status_is_live_	616938d8-f0b0-4ce5-82f6-ebf1d97668ff	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
1f6eee50-721b-4716-8f08-42acdb0ce264	manager_in_agency_	1c41ed54-3140-4a9e-8f9e-81f02b185708	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
8f74e764-531d-4ee0-9501-799a93249f8e	service_status_is_live_	48929e2e-93c6-47a1-be0d-5b41ca8f2728	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
5ce796c9-2770-477e-ac8f-7b1c2d9b3af6	agent_in_agency_	48929e2e-93c6-47a1-be0d-5b41ca8f2728	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
24598e65-5bd4-4a68-9799-4235bddcacc9	agent_in_agency_	27849d3f-541f-4689-aad6-999dc14e0ce7	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
7845ed18-8f5f-438c-9dd1-5ded43bffe6e	invitee_of_user_invite_	27849d3f-541f-4689-aad6-999dc14e0ce7	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
630aa45a-3805-4e40-a5bd-eea62ca07939	invitee_of_user_invite_	04fc5530-96ee-469b-9e6d-f228392b81e9	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
b0d65997-6de7-4efe-98ef-180c9dbde830	invitee_of_user_invite_	d8c38111-8742-4ee1-8adb-eedffb10198b	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
74931d78-6bd6-48c4-a853-1c714b68211e	logged_in_	27849d3f-541f-4689-aad6-999dc14e0ce7	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
3b973850-7737-4aa6-a725-acc74a3c7124	agent_in_agency_	59b6fdfa-8d4e-4069-88af-49634fa92a23	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
abf4133d-e860-4328-ab54-7d440bd8470a	agent_in_agency_	774d34d3-cd48-45ca-8f70-2f54010f5b48	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
3a2d166a-ec77-4e20-a0b0-97113c4ac3f9	logged_in_	f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
d24730d5-8b66-4bf4-9fe8-4728817a03b2	subject_is_active_user_	dbdecab4-c25b-43f4-a20a-3ef80d6be7bc	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
7352ec5f-f88e-457b-b7b2-9825da15895a	logged_in_	93fe889a-e329-4701-9222-3caba3028f23	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
fc380d88-74e8-4863-b95f-e2bfdcf45235	logged_in_	a1c956c8-b64e-41ba-af40-d3c16721b04e	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
2e761c06-11f7-4cb0-914c-267df87a55d5	subject_is_active_user_	a7a73077-da99-4acd-af2a-1f2dba998889	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
ac7fd563-dbb7-44ad-ab12-ccb314704c31	manager_in_agency_	ddcffba4-934c-46ce-bc8b-6ae23b19dce1	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
c0d924cb-9105-4abf-a47e-0f6a29d2e193	manager_in_agency_	2fbee7e1-2b10-444b-aa98-199f58032ff5	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
60d3ee39-0f5a-40b9-941e-c606f015fb12	visitor_	03f23339-f79a-4f0b-8a4f-bc9ef2e5d291	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
a371e28f-33f4-411e-b94a-1ac6af64c865	logged_in_	03f23339-f79a-4f0b-8a4f-bc9ef2e5d291	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
7bacfdbd-84bb-4078-bca1-aee9f6790ef0	logged_in_	906655f2-4bbb-441a-b10b-7231da7bccad	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
73da9d07-021f-43bb-ace8-e72724dc35e7	agent_in_agency_	b20e4cff-c150-4e02-af03-798cc73382f3	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
cf31f59e-bb4a-4225-86f5-1339c339ea19	agent_in_agency_	31a284d0-b6ea-4dd4-b013-da4647a54558	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
faad1e60-244a-43d8-b2b2-fb92e60bdb89	manager_in_agency_	3cefd8f7-9cd8-40bf-afce-83eed2491ff8	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
20d6ec33-906e-4d7e-8dda-173f1ba1b4b4	manager_in_agency_	2bd1d873-946f-4557-905c-99b73b1d54bf	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
f7d66dad-12e8-49c3-aa7c-92fb9ebe0935	agent_in_agency_	624fefb6-75d8-4ed8-8e9b-05dbed2dc24f	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
8b98629f-ec03-4dc9-8f28-a88f1c15a065	agent_in_agency_	176dee67-37d8-4fd7-aa1d-44d8f204b270	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
3bb39814-e628-4169-841f-b8c23311167e	service_variant_status_contains_only_live_	176dee67-37d8-4fd7-aa1d-44d8f204b270	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
9c17e5e7-3043-4cc3-b2ca-5e635883b121	logged_in_	fdcd4f76-f55e-4f73-a063-57fac33976e9	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
df7169dc-3ef6-4e89-b749-9d96216f37f4	visitor_	fdcd4f76-f55e-4f73-a063-57fac33976e9	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
a8c86986-75c9-4f7a-b4ea-e18280bb56c6	logged_in_	a4337d7b-9595-40c3-89c0-77787a394b72	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
ce8318f6-3d8d-4e08-ac17-e1ff187b87a9	visitor_	a4337d7b-9595-40c3-89c0-77787a394b72	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
61729bd8-0be4-4bdc-a602-72fd08383f5f	logged_in_	9506e0e9-ee4a-4442-968a-76d9de05d2b3	allow	2020-10-20 07:07:02.389935+00	00000000-0000-0000-0000-000000000000
da286841-dd4c-4a92-a772-253bce497514	visitor_	9506e0e9-ee4a-4442-968a-76d9de05d2b3	allow	2020-10-20 07:07:02.389935+00	00000000-0000-0000-0000-000000000000
4682e137-bca9-4772-8b3e-dd5727add654	logged_in_	ba39b019-2291-419e-baee-ed810d004ffc	allow	2020-11-01 10:56:05.733824+00	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: resource_definition_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.resource_definition_ (uuid_, id_prefix_, name_, table_, owner_uuid_, search_) FROM stdin;
e79b9bed-9dcc-4e83-b2f8-09b134da1a03	sub	subdomain	security_.subdomain_	\N	{uuid_,name_}
957c84e9-e472-4ec3-9dc6-e1a828f6d07f	agcy	agency	application_.agency_	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	{uuid_,name_,subdomain_uuid_}
88bcb8b1-3826-4bcd-81af-ce4f683c5285	theme	theme	application_.theme_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_,agency_uuid_}
2d77f11c-8271-4c07-a6b4-3e7ac2ae8378	img	image	application_.image_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_}
f8c5e08d-cd10-466e-9233-ae0e2ddbe81a	user	user	security_.user_	\N	{uuid_,name_,email_address_}
3b56d171-3e69-41ca-9a98-d1a3abc9170b	su	sign up	application_.sign_up_	\N	{verification_code_}
edc5f82c-c991-494c-90f0-cf6163902f40	pwd	password reset	application_.password_reset_	f8c5e08d-cd10-466e-9233-ae0e2ddbe81a	{verification_code_}
3c7e93d6-b141-423a-a7e9-e11a734b3474	stripe	stripe account	application_.stripe_account_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,agency_uuid_}
7f589215-bdc7-4664-99c6-b7745349c352	svcvar	service variant	application_.service_variant_	d50773b3-5779-4333-8bc3-6ef32d488d72	{uuid_,service_uuid_}
d50773b3-5779-4333-8bc3-6ef32d488d72	svc	service	application_.service_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_,url_name_,agency_uuid_}
d8f70962-229d-49eb-a99e-7c35a55719d5	md	markdown	application_.markdown_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_,agency_uuid_}
b54431c5-bbc4-47b6-9810-0a627e49cfe5	member	membership	application_.membership_	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	{uuid_,user_uuid_,subdomain_uuid_,access_}
f3e5569e-c28d-40e6-b1ca-698fb48e6ba3	price	price	application_.price_	7f589215-bdc7-4664-99c6-b7745349c352	{uuid_,service_variant_uuid_}
94a1ec9c-d7a6-4327-8221-6f00c6c09ccf	notidef	notification definition	application_.notification_definition_	\N	{uuid_,name_,stripe_event_,feed_notification_enabled_,email_notifications_enabled_}
f8e2c163-8ebf-45dc-90b8-b850e1590c7c	set	user notification setting	application_.user_notification_setting_	f8c5e08d-cd10-466e-9233-ae0e2ddbe81a	{uuid_,user_uuid_,subdomain_uuid_,notification_definition_uuid_}
8248bebc-96c3-4f72-83df-ad4c68184470	form	form	internal_.form_	\N	{uuid_}
6549cc83-4ce3-423d-88e1-263ac227608d	set	agency thank you page setting	application_.agency_thank_you_page_setting_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,agency_uuid_,url_}
cbe96769-7f38-4220-82fb-c746c634bc99	pagedef	page definition	internal_.page_definition_	\N	{uuid_,name_}
e61bae44-071d-4f80-9f53-c639f9b48661	pblkdef	page block definition	internal_.page_block_definition_	cbe96769-7f38-4220-82fb-c746c634bc99	{uuid_,name_,page_definition_uuid_,form_uuid_}
34f873e1-b837-4f1f-94d7-7bacf9c43d8d	set	service thank you page setting	application_.service_thank_you_page_setting_	d50773b3-5779-4333-8bc3-6ef32d488d72	{uuid_,service_uuid_,url_}
c042e657-0005-42a1-b3c2-6ee25d62fb33	formfld	form field	internal_.form_field_	8248bebc-96c3-4f72-83df-ad4c68184470	{uuid_,name_,form_uuid_}
08b16cec-4d78-499a-a092-91fc2d360f86	pblk	page	application_.page_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,agency_uuid_,page_definition_uuid_}
bc2e81b9-be64-4068-ad32-3ed89151bbfa	pblk	page block	application_.page_block_	08b16cec-4d78-499a-a092-91fc2d360f86	{uuid_,page_block_definition_uuid_,page_uuid_}
\.


--
-- Data for Name: role_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.role_ (uuid_, name_, audit_at_, audit_session_uuid_) FROM stdin;
be9432a6-2c74-4030-b59e-d657662a4f92	owner	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
566af82a-e5cf-4aad-aada-4341edb3e088	agent	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
e2370fd9-0389-48e6-a9c0-1b1c0b078a75	manager	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
9a9b149f-f57f-482d-bb5e-2692e3fee48c	client	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: role_hierarchy_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.role_hierarchy_ (uuid_, role_uuid_, subrole_uuid_, audit_at_, audit_session_uuid_) FROM stdin;
64cef996-c748-4ea1-b2a2-0ffc0f4f16ec	be9432a6-2c74-4030-b59e-d657662a4f92	e2370fd9-0389-48e6-a9c0-1b1c0b078a75	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
040f5548-7b4e-420e-a852-4c4d3cc011c4	e2370fd9-0389-48e6-a9c0-1b1c0b078a75	566af82a-e5cf-4aad-aada-4341edb3e088	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: operation_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.operation_ (uuid_, name_, log_events_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
12ba3162-4b08-46cf-bf69-f8db5f6c291d	log_out_user_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
a5acd829-bced-4d98-8c5c-8f29e14c8116	create_agency_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
c865b482-975b-49b3-845f-dfa39f46a7f1	delete_agency_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
45cf7669-6e10-4c99-bf14-af25985a7f0f	delete_service_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
fa4b4c5f-160f-413b-b77a-beee70108f0a	create_service_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
a1c956c8-b64e-41ba-af40-d3c16721b04e	log_in_user_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
93fe889a-e329-4701-9222-3caba3028f23	sign_up_user_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	start_email_address_verification_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
7f2f5147-db6c-43cf-b0f0-2d68d56cba74	query_active_subject_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
fb9268f3-c318-4034-b785-7cc67a755f14	query_subdomain_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
616938d8-f0b0-4ce5-82f6-ebf1d97668ff	query_service_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
44836e4b-ecd5-4184-a177-498b412ff251	query_user_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
6780b297-e2e5-48f5-b58d-a855b51a0fae	query_role_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
44286eaf-723f-4a0b-b2b4-dd18404f948a	query_agency_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
89071731-bd21-4505-aab9-fd699c5fd12f	invite_user_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
8e119375-3f63-4a07-8239-6a4250094e93	remove_user_from_agency_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
04fc5530-96ee-469b-9e6d-f228392b81e9	accept_user_invite_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
a7a73077-da99-4acd-af2a-1f2dba998889	query_agency_user_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
3f020478-e3a3-4674-932d-8b922c17b91b	query_shared_agency_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
3ae8d981-be1f-4843-bc41-df24bc904e5d	query_agency_by_subdomain_name_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
384605a6-0fb2-4d9c-aacc-3e5a33be8c36	create_stripe_account_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
d21b8f48-a57a-45b3-9341-926d735dffb6	edit_agency_theme_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
373f84a0-350e-41e9-b714-705d21a79135	query_theme_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
8a08d468-c946-47d7-bcc1-f45819625d63	edit_image_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
a1db5356-28de-40ad-8059-630894876852	query_image_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
fca05330-a0b0-4d0e-b2e9-ff5125a9895e	query_service_by_agency_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
9b80cc60-7109-4849-ac2f-fc4df653bd2f	create_service_step_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
08f449e7-8215-484a-a40a-b6bdb9b16b4d	query_service_step_by_service_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
1c41ed54-3140-4a9e-8f9e-81f02b185708	delete_service_step_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
48929e2e-93c6-47a1-be0d-5b41ca8f2728	query_service_step_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
d8c38111-8742-4ee1-8adb-eedffb10198b	decline_user_invite_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
27849d3f-541f-4689-aad6-999dc14e0ce7	query_user_invite_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
59b6fdfa-8d4e-4069-88af-49634fa92a23	query_user_invite_by_agency_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
774d34d3-cd48-45ca-8f70-2f54010f5b48	cancel_user_invite_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
dbdecab4-c25b-43f4-a20a-3ef80d6be7bc	query_user_invite_by_subject_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
ddcffba4-934c-46ce-bc8b-6ae23b19dce1	edit_service_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
2fbee7e1-2b10-444b-aa98-199f58032ff5	set_service_status_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
03f23339-f79a-4f0b-8a4f-bc9ef2e5d291	reset_password_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
906655f2-4bbb-441a-b10b-7231da7bccad	query_user_by_email_address_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
b20e4cff-c150-4e02-af03-798cc73382f3	query_client_by_agency_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
31a284d0-b6ea-4dd4-b013-da4647a54558	query_client_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
3cefd8f7-9cd8-40bf-afce-83eed2491ff8	create_client_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
2bd1d873-946f-4557-905c-99b73b1d54bf	delete_client_	t	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
624fefb6-75d8-4ed8-8e9b-05dbed2dc24f	query_service_variant_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
176dee67-37d8-4fd7-aa1d-44d8f204b270	query_service_variant_by_service_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
fdcd4f76-f55e-4f73-a063-57fac33976e9	query_resource_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
a4337d7b-9595-40c3-89c0-77787a394b72	query_resource_definition_	f	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
9506e0e9-ee4a-4442-968a-76d9de05d2b3	query_current_user_	f	2020-10-20 07:07:02.389935+00	00000000-0000-0000-0000-000000000000	I
ba39b019-2291-419e-baee-ed810d004ffc	query_resource_access_	f	2020-11-01 10:56:05.733824+00	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: password_reset_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.password_reset_ (uuid_, user_uuid_, data_, started_at_, expires_at_, status_, status_at_, initiator_subject_uuid_, verification_code_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
\.


--
-- Data for Name: policy_assignment_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.policy_assignment_ (uuid_, policy_name_, operation_uuid_, type_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
fb6da025-643a-4806-a64b-4a0e5042ba98	owner_in_agency_	c865b482-975b-49b3-845f-dfa39f46a7f1	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
e8992bc3-0f79-4797-81aa-bddef2193d97	visitor_	f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
685c3913-3fff-4345-865c-d3e4026321ed	visitor_	a1c956c8-b64e-41ba-af40-d3c16721b04e	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
3aef50bd-85e6-4beb-8bd4-9a252052200d	visitor_	93fe889a-e329-4701-9222-3caba3028f23	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
f9e2b169-903d-4e9c-ae20-b397489875dd	logged_in_	12ba3162-4b08-46cf-bf69-f8db5f6c291d	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
914f28e8-076c-45cb-8042-f827bc6e59e2	logged_in_	a5acd829-bced-4d98-8c5c-8f29e14c8116	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
7488a3fd-0f68-4369-95c2-9293e3a4f80e	manager_in_agency_	fa4b4c5f-160f-413b-b77a-beee70108f0a	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
b987a658-ec1d-4761-ba88-1b271d0ce51f	visitor_	7f2f5147-db6c-43cf-b0f0-2d68d56cba74	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
04793c21-c83f-4b7b-805d-c100578cb652	logged_in_	7f2f5147-db6c-43cf-b0f0-2d68d56cba74	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
7f09a849-5162-4cbb-9fbc-f42529ef0088	logged_in_	44286eaf-723f-4a0b-b2b4-dd18404f948a	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
d6067404-d2ba-46a5-9b50-ff027c661aae	argument_is_not_null_	44286eaf-723f-4a0b-b2b4-dd18404f948a	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
2d1cde8a-54e7-4aa5-87ef-3f733cf3dde0	logged_in_	fb9268f3-c318-4034-b785-7cc67a755f14	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
12543ad5-113a-4b09-8174-774119fd999e	owner_in_agency_	89071731-bd21-4505-aab9-fd699c5fd12f	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
991b0ec1-11b6-492e-a872-5b8aede7e5c3	owner_in_agency_	8e119375-3f63-4a07-8239-6a4250094e93	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
fdcffd77-fcb5-4ff8-9bb3-6bd8d06cfbd5	users_can_remove_themselves_	8e119375-3f63-4a07-8239-6a4250094e93	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
1b902618-8a68-4c0d-b05e-6bda782c5f30	agent_in_agency_	a7a73077-da99-4acd-af2a-1f2dba998889	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
75294233-ed0a-4b6a-8903-f206daf0af67	logged_in_	3f020478-e3a3-4674-932d-8b922c17b91b	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
b096a480-e5f0-4c34-a4f5-8bc75c2fb71b	argument_is_not_null_	3ae8d981-be1f-4843-bc41-df24bc904e5d	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
571601fd-1c3c-4d04-b37d-da9a66447025	argument_is_not_null_	fb9268f3-c318-4034-b785-7cc67a755f14	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
ea149d92-8577-4d3d-aa59-64713833b8fb	agent_in_agency_	616938d8-f0b0-4ce5-82f6-ebf1d97668ff	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
4ec948d5-45ea-4cdb-8cf9-aab00b10dfdd	owner_in_agency_	384605a6-0fb2-4d9c-aacc-3e5a33be8c36	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
6d532fe7-ad14-4d6d-9861-c0813b407fbc	manager_in_agency_	d21b8f48-a57a-45b3-9341-926d735dffb6	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
2a0d6fa5-76c1-4440-9421-53f57185c5df	visitor_	373f84a0-350e-41e9-b714-705d21a79135	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
229bf29f-1dd3-45a2-b845-9c271771a4ab	logged_in_	373f84a0-350e-41e9-b714-705d21a79135	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
126aa154-9a2b-4e9e-9473-58b90d917a17	manager_in_agency_	8a08d468-c946-47d7-bcc1-f45819625d63	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
4ab56a45-937f-4aa3-bfab-6a3ec95e14d6	visitor_	a1db5356-28de-40ad-8059-630894876852	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
eb2c9034-5c48-414a-bf05-a5fd4c492053	logged_in_	a1db5356-28de-40ad-8059-630894876852	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
8030c009-6c74-4a8a-9762-82c8d414e6cd	manager_in_agency_	45cf7669-6e10-4c99-bf14-af25985a7f0f	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
120c7413-19c3-4bc7-969a-1d701e6e6aa1	agent_in_agency_	fca05330-a0b0-4d0e-b2e9-ff5125a9895e	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
45794325-c9e9-4f3c-a805-13d013205a8f	service_status_contains_only_live_	fca05330-a0b0-4d0e-b2e9-ff5125a9895e	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
05cacc42-807b-4f51-b9f5-927983b26950	manager_in_agency_	9b80cc60-7109-4849-ac2f-fc4df653bd2f	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
832c874c-3b8b-4d51-8704-7ee2ec8ff18c	service_status_is_live_	08f449e7-8215-484a-a40a-b6bdb9b16b4d	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
7275e0a3-249c-4e32-a26f-4a399d724207	agent_in_agency_	08f449e7-8215-484a-a40a-b6bdb9b16b4d	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
88f38e52-c66d-4f38-9f9e-518fae934d67	service_status_is_live_	616938d8-f0b0-4ce5-82f6-ebf1d97668ff	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
1f6eee50-721b-4716-8f08-42acdb0ce264	manager_in_agency_	1c41ed54-3140-4a9e-8f9e-81f02b185708	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
8f74e764-531d-4ee0-9501-799a93249f8e	service_status_is_live_	48929e2e-93c6-47a1-be0d-5b41ca8f2728	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
5ce796c9-2770-477e-ac8f-7b1c2d9b3af6	agent_in_agency_	48929e2e-93c6-47a1-be0d-5b41ca8f2728	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
24598e65-5bd4-4a68-9799-4235bddcacc9	agent_in_agency_	27849d3f-541f-4689-aad6-999dc14e0ce7	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
7845ed18-8f5f-438c-9dd1-5ded43bffe6e	invitee_of_user_invite_	27849d3f-541f-4689-aad6-999dc14e0ce7	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
630aa45a-3805-4e40-a5bd-eea62ca07939	invitee_of_user_invite_	04fc5530-96ee-469b-9e6d-f228392b81e9	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
b0d65997-6de7-4efe-98ef-180c9dbde830	invitee_of_user_invite_	d8c38111-8742-4ee1-8adb-eedffb10198b	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
74931d78-6bd6-48c4-a853-1c714b68211e	logged_in_	27849d3f-541f-4689-aad6-999dc14e0ce7	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
3b973850-7737-4aa6-a725-acc74a3c7124	agent_in_agency_	59b6fdfa-8d4e-4069-88af-49634fa92a23	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
abf4133d-e860-4328-ab54-7d440bd8470a	agent_in_agency_	774d34d3-cd48-45ca-8f70-2f54010f5b48	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
3a2d166a-ec77-4e20-a0b0-97113c4ac3f9	logged_in_	f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
d24730d5-8b66-4bf4-9fe8-4728817a03b2	subject_is_active_user_	dbdecab4-c25b-43f4-a20a-3ef80d6be7bc	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
7352ec5f-f88e-457b-b7b2-9825da15895a	logged_in_	93fe889a-e329-4701-9222-3caba3028f23	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
fc380d88-74e8-4863-b95f-e2bfdcf45235	logged_in_	a1c956c8-b64e-41ba-af40-d3c16721b04e	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
2e761c06-11f7-4cb0-914c-267df87a55d5	subject_is_active_user_	a7a73077-da99-4acd-af2a-1f2dba998889	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
ac7fd563-dbb7-44ad-ab12-ccb314704c31	manager_in_agency_	ddcffba4-934c-46ce-bc8b-6ae23b19dce1	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
c0d924cb-9105-4abf-a47e-0f6a29d2e193	manager_in_agency_	2fbee7e1-2b10-444b-aa98-199f58032ff5	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
60d3ee39-0f5a-40b9-941e-c606f015fb12	visitor_	03f23339-f79a-4f0b-8a4f-bc9ef2e5d291	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
a371e28f-33f4-411e-b94a-1ac6af64c865	logged_in_	03f23339-f79a-4f0b-8a4f-bc9ef2e5d291	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
7bacfdbd-84bb-4078-bca1-aee9f6790ef0	logged_in_	906655f2-4bbb-441a-b10b-7231da7bccad	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
73da9d07-021f-43bb-ace8-e72724dc35e7	agent_in_agency_	b20e4cff-c150-4e02-af03-798cc73382f3	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
cf31f59e-bb4a-4225-86f5-1339c339ea19	agent_in_agency_	31a284d0-b6ea-4dd4-b013-da4647a54558	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
faad1e60-244a-43d8-b2b2-fb92e60bdb89	manager_in_agency_	3cefd8f7-9cd8-40bf-afce-83eed2491ff8	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
20d6ec33-906e-4d7e-8dda-173f1ba1b4b4	manager_in_agency_	2bd1d873-946f-4557-905c-99b73b1d54bf	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
f7d66dad-12e8-49c3-aa7c-92fb9ebe0935	agent_in_agency_	624fefb6-75d8-4ed8-8e9b-05dbed2dc24f	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
8b98629f-ec03-4dc9-8f28-a88f1c15a065	agent_in_agency_	176dee67-37d8-4fd7-aa1d-44d8f204b270	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
3bb39814-e628-4169-841f-b8c23311167e	service_variant_status_contains_only_live_	176dee67-37d8-4fd7-aa1d-44d8f204b270	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
9c17e5e7-3043-4cc3-b2ca-5e635883b121	logged_in_	fdcd4f76-f55e-4f73-a063-57fac33976e9	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
df7169dc-3ef6-4e89-b749-9d96216f37f4	visitor_	fdcd4f76-f55e-4f73-a063-57fac33976e9	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
a8c86986-75c9-4f7a-b4ea-e18280bb56c6	logged_in_	a4337d7b-9595-40c3-89c0-77787a394b72	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
ce8318f6-3d8d-4e08-ac17-e1ff187b87a9	visitor_	a4337d7b-9595-40c3-89c0-77787a394b72	allow	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
61729bd8-0be4-4bdc-a602-72fd08383f5f	logged_in_	9506e0e9-ee4a-4442-968a-76d9de05d2b3	allow	2020-10-20 07:07:02.389935+00	00000000-0000-0000-0000-000000000000	I
da286841-dd4c-4a92-a772-253bce497514	visitor_	9506e0e9-ee4a-4442-968a-76d9de05d2b3	allow	2020-10-20 07:07:02.389935+00	00000000-0000-0000-0000-000000000000	I
4682e137-bca9-4772-8b3e-dd5727add654	logged_in_	ba39b019-2291-419e-baee-ed810d004ffc	allow	2020-11-01 10:56:05.733824+00	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: role_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.role_ (uuid_, name_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
be9432a6-2c74-4030-b59e-d657662a4f92	owner	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
566af82a-e5cf-4aad-aada-4341edb3e088	agent	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
e2370fd9-0389-48e6-a9c0-1b1c0b078a75	manager	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
9a9b149f-f57f-482d-bb5e-2692e3fee48c	client	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: role_hierarchy_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.role_hierarchy_ (uuid_, role_uuid_, subrole_uuid_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
64cef996-c748-4ea1-b2a2-0ffc0f4f16ec	be9432a6-2c74-4030-b59e-d657662a4f92	e2370fd9-0389-48e6-a9c0-1b1c0b078a75	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
040f5548-7b4e-420e-a852-4c4d3cc011c4	e2370fd9-0389-48e6-a9c0-1b1c0b078a75	566af82a-e5cf-4aad-aada-4341edb3e088	1970-01-01 00:00:00+00	00000000-0000-0000-0000-000000000000	I
\.


--
-- Name: agency_ agency__name__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.agency_
    ADD CONSTRAINT agency__name__key UNIQUE (name_);


--
-- Name: agency_ agency__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.agency_
    ADD CONSTRAINT agency__pkey PRIMARY KEY (uuid_);


--
-- Name: agency_ agency__subdomain_uuid__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.agency_
    ADD CONSTRAINT agency__subdomain_uuid__key UNIQUE (subdomain_uuid_);


--
-- Name: agency_thank_you_page_setting_ agency_thank_you_page_setting__agency_uuid__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.agency_thank_you_page_setting_
    ADD CONSTRAINT agency_thank_you_page_setting__agency_uuid__key UNIQUE (agency_uuid_);


--
-- Name: agency_thank_you_page_setting_ agency_thank_you_page_setting__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.agency_thank_you_page_setting_
    ADD CONSTRAINT agency_thank_you_page_setting__pkey PRIMARY KEY (uuid_);


--
-- Name: client_ client__agency_uuid__name__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.client_
    ADD CONSTRAINT client__agency_uuid__name__key UNIQUE (agency_uuid_, name_);


--
-- Name: client_ client__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.client_
    ADD CONSTRAINT client__pkey PRIMARY KEY (uuid_);


--
-- Name: image_ image__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.image_
    ADD CONSTRAINT image__pkey PRIMARY KEY (uuid_);


--
-- Name: markdown_ markdown__name__agency_uuid__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.markdown_
    ADD CONSTRAINT markdown__name__agency_uuid__key UNIQUE (name_, agency_uuid_);


--
-- Name: markdown_ markdown__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.markdown_
    ADD CONSTRAINT markdown__pkey PRIMARY KEY (uuid_);


--
-- Name: notification_definition_ notification_definition__name__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.notification_definition_
    ADD CONSTRAINT notification_definition__name__key UNIQUE (name_);


--
-- Name: notification_definition_ notification_definition__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.notification_definition_
    ADD CONSTRAINT notification_definition__pkey PRIMARY KEY (uuid_);


--
-- Name: page_ page__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_
    ADD CONSTRAINT page__pkey PRIMARY KEY (uuid_);


--
-- Name: page_block_ page_block__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_block_
    ADD CONSTRAINT page_block__pkey PRIMARY KEY (uuid_);


--
-- Name: price_ price__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.price_
    ADD CONSTRAINT price__pkey PRIMARY KEY (uuid_);


--
-- Name: price_ price__stripe_id_ext__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.price_
    ADD CONSTRAINT price__stripe_id_ext__key UNIQUE (stripe_id_ext_);


--
-- Name: resource_ resource__id__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.resource_
    ADD CONSTRAINT resource__id__key UNIQUE (id_);


--
-- Name: resource_ resource__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.resource_
    ADD CONSTRAINT resource__pkey PRIMARY KEY (uuid_);


--
-- Name: service_ service__agency_uuid__name__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_
    ADD CONSTRAINT service__agency_uuid__name__key UNIQUE (agency_uuid_, name_);


--
-- Name: service_ service__agency_uuid__url_name__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_
    ADD CONSTRAINT service__agency_uuid__url_name__key UNIQUE (agency_uuid_, url_name_);


--
-- Name: service_ service__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_
    ADD CONSTRAINT service__pkey PRIMARY KEY (uuid_);


--
-- Name: service_step_ service_step__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_
    ADD CONSTRAINT service_step__pkey PRIMARY KEY (uuid_);


--
-- Name: service_step_confirmation_by_agency_ service_step_confirmation_by_agency__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_confirmation_by_agency_
    ADD CONSTRAINT service_step_confirmation_by_agency__pkey PRIMARY KEY (uuid_);


--
-- Name: service_step_document_delivery_ service_step_document_delivery__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_document_delivery_
    ADD CONSTRAINT service_step_document_delivery__pkey PRIMARY KEY (uuid_);


--
-- Name: service_step_document_submission_ service_step_document_submission__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_document_submission_
    ADD CONSTRAINT service_step_document_submission__pkey PRIMARY KEY (uuid_);


--
-- Name: service_step_form_ service_step_form__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_form_
    ADD CONSTRAINT service_step_form__pkey PRIMARY KEY (uuid_);


--
-- Name: service_step_payment_ service_step_payment__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_payment_
    ADD CONSTRAINT service_step_payment__pkey PRIMARY KEY (uuid_);


--
-- Name: service_thank_you_page_setting_ service_thank_you_page_setting__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_thank_you_page_setting_
    ADD CONSTRAINT service_thank_you_page_setting__pkey PRIMARY KEY (uuid_);


--
-- Name: service_thank_you_page_setting_ service_thank_you_page_setting__service_uuid__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_thank_you_page_setting_
    ADD CONSTRAINT service_thank_you_page_setting__service_uuid__key UNIQUE (service_uuid_);


--
-- Name: service_variant_ service_variant__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_variant_
    ADD CONSTRAINT service_variant__pkey PRIMARY KEY (uuid_);


--
-- Name: service_variant_ service_variant__service_uuid__name__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_variant_
    ADD CONSTRAINT service_variant__service_uuid__name__key UNIQUE (service_uuid_, name_);


--
-- Name: service_variant_ service_variant__stripe_id_ext__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_variant_
    ADD CONSTRAINT service_variant__stripe_id_ext__key UNIQUE (stripe_id_ext_);


--
-- Name: stripe_account_ stripe_account__agency_uuid__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.stripe_account_
    ADD CONSTRAINT stripe_account__agency_uuid__key UNIQUE (agency_uuid_);


--
-- Name: stripe_account_ stripe_account__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.stripe_account_
    ADD CONSTRAINT stripe_account__pkey PRIMARY KEY (uuid_);


--
-- Name: stripe_account_ stripe_account__stripe_id_ext__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.stripe_account_
    ADD CONSTRAINT stripe_account__stripe_id_ext__key UNIQUE (stripe_id_ext_);


--
-- Name: theme_ theme__agency_uuid__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.theme_
    ADD CONSTRAINT theme__agency_uuid__key UNIQUE (agency_uuid_);


--
-- Name: theme_ theme__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.theme_
    ADD CONSTRAINT theme__pkey PRIMARY KEY (uuid_);


--
-- Name: user_invite_ user_invite__agency_uuid__invitee_email_address__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.user_invite_
    ADD CONSTRAINT user_invite__agency_uuid__invitee_email_address__key UNIQUE (agency_uuid_, invitee_email_address_);


--
-- Name: user_invite_ user_invite__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.user_invite_
    ADD CONSTRAINT user_invite__pkey PRIMARY KEY (uuid_);


--
-- Name: user_notification_setting_ user_notification_setting__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.user_notification_setting_
    ADD CONSTRAINT user_notification_setting__pkey PRIMARY KEY (uuid_);


--
-- Name: user_notification_setting_ user_notification_setting__user_uuid__subdomain_uuid__notif_key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.user_notification_setting_
    ADD CONSTRAINT user_notification_setting__user_uuid__subdomain_uuid__notif_key UNIQUE (user_uuid_, subdomain_uuid_, notification_definition_uuid_);


--
-- Name: form_ form__pkey; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.form_
    ADD CONSTRAINT form__pkey PRIMARY KEY (uuid_);


--
-- Name: form_field_ form_field__name__form_uuid__key; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.form_field_
    ADD CONSTRAINT form_field__name__form_uuid__key UNIQUE (name_, form_uuid_);


--
-- Name: form_field_ form_field__pkey; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.form_field_
    ADD CONSTRAINT form_field__pkey PRIMARY KEY (uuid_);


--
-- Name: page_block_definition_ page_block_definition__name__key; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.page_block_definition_
    ADD CONSTRAINT page_block_definition__name__key UNIQUE (name_);


--
-- Name: page_block_definition_ page_block_definition__pkey; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.page_block_definition_
    ADD CONSTRAINT page_block_definition__pkey PRIMARY KEY (uuid_);


--
-- Name: page_definition_ page_definition__name__key; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.page_definition_
    ADD CONSTRAINT page_definition__name__key UNIQUE (name_);


--
-- Name: page_definition_ page_definition__pkey; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.page_definition_
    ADD CONSTRAINT page_definition__pkey PRIMARY KEY (uuid_);


--
-- Name: email_address_verification_ email_address_verification__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.email_address_verification_
    ADD CONSTRAINT email_address_verification__pkey PRIMARY KEY (uuid_);


--
-- Name: event_ event__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.event_
    ADD CONSTRAINT event__pkey PRIMARY KEY (uuid_);


--
-- Name: event_log_ event_log__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.event_log_
    ADD CONSTRAINT event_log__pkey PRIMARY KEY (uuid_);


--
-- Name: operation_ operation__name__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.operation_
    ADD CONSTRAINT operation__name__key UNIQUE (name_);


--
-- Name: operation_ operation__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.operation_
    ADD CONSTRAINT operation__pkey PRIMARY KEY (uuid_);


--
-- Name: password_reset_ password_reset__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.password_reset_
    ADD CONSTRAINT password_reset__pkey PRIMARY KEY (uuid_);


--
-- Name: policy_ policy__after_uuid__resource_definition_uuid__operation_typ_key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.policy_
    ADD CONSTRAINT policy__after_uuid__resource_definition_uuid__operation_typ_key UNIQUE (after_uuid_, resource_definition_uuid_, operation_type_) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: policy_ policy__function__resource_definition_uuid__operation_type__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.policy_
    ADD CONSTRAINT policy__function__resource_definition_uuid__operation_type__key UNIQUE (function_, resource_definition_uuid_, operation_type_);


--
-- Name: policy_ policy__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.policy_
    ADD CONSTRAINT policy__pkey PRIMARY KEY (uuid_);


--
-- Name: policy_assignment_ policy_assignment__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.policy_assignment_
    ADD CONSTRAINT policy_assignment__pkey PRIMARY KEY (uuid_);


--
-- Name: policy_assignment_ policy_assignment__policy_name__operation_uuid__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.policy_assignment_
    ADD CONSTRAINT policy_assignment__policy_name__operation_uuid__key UNIQUE (policy_name_, operation_uuid_);


--
-- Name: resource_definition_ resource_definition__name__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.resource_definition_
    ADD CONSTRAINT resource_definition__name__key UNIQUE (name_);


--
-- Name: resource_definition_ resource_definition__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.resource_definition_
    ADD CONSTRAINT resource_definition__pkey PRIMARY KEY (uuid_);


--
-- Name: resource_definition_ resource_definition__table__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.resource_definition_
    ADD CONSTRAINT resource_definition__table__key UNIQUE (table_);


--
-- Name: role_ role__name__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.role_
    ADD CONSTRAINT role__name__key UNIQUE (name_);


--
-- Name: role_ role__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.role_
    ADD CONSTRAINT role__pkey PRIMARY KEY (uuid_);


--
-- Name: role_hierarchy_ role_hierarchy__role_uuid__subrole_uuid__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.role_hierarchy_
    ADD CONSTRAINT role_hierarchy__role_uuid__subrole_uuid__key UNIQUE (role_uuid_, subrole_uuid_);


--
-- Name: secret_ secret__name__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.secret_
    ADD CONSTRAINT secret__name__key UNIQUE (name_);


--
-- Name: secret_ secret__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.secret_
    ADD CONSTRAINT secret__pkey PRIMARY KEY (uuid_);


--
-- Name: security_data_ security_data__key__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.security_data_
    ADD CONSTRAINT security_data__key__key UNIQUE (key_);


--
-- Name: security_data_ security_data__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.security_data_
    ADD CONSTRAINT security_data__pkey PRIMARY KEY (uuid_);


--
-- Name: session_ session__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.session_
    ADD CONSTRAINT session__pkey PRIMARY KEY (uuid_);


--
-- Name: sign_up_ sign_up__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.sign_up_
    ADD CONSTRAINT sign_up__pkey PRIMARY KEY (uuid_);


--
-- Name: subdomain_ subdomain__name__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.subdomain_
    ADD CONSTRAINT subdomain__name__key UNIQUE (name_);


--
-- Name: subdomain_ subdomain__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.subdomain_
    ADD CONSTRAINT subdomain__pkey PRIMARY KEY (uuid_);


--
-- Name: subject_ subject__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.subject_
    ADD CONSTRAINT subject__pkey PRIMARY KEY (uuid_);


--
-- Name: subject_assignment_ subject_assignment__role_uuid__subdomain_uuid__subject_uuid_key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.subject_assignment_
    ADD CONSTRAINT subject_assignment__role_uuid__subdomain_uuid__subject_uuid_key UNIQUE (role_uuid_, subdomain_uuid_, subject_uuid_);


--
-- Name: token_ token__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.token_
    ADD CONSTRAINT token__pkey PRIMARY KEY (uuid_);


--
-- Name: user_ user__email_address__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.user_
    ADD CONSTRAINT user__email_address__key UNIQUE (email_address_);


--
-- Name: user_ user__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.user_
    ADD CONSTRAINT user__pkey PRIMARY KEY (uuid_);


--
-- Name: image__name__key; Type: INDEX; Schema: application_; Owner: postgres
--

CREATE UNIQUE INDEX image__name__key ON application_.image_ USING btree (name_) WHERE (agency_uuid_ IS NULL);


--
-- Name: markdown__name__key; Type: INDEX; Schema: application_; Owner: postgres
--

CREATE UNIQUE INDEX markdown__name__key ON application_.markdown_ USING btree (name_) WHERE (agency_uuid_ IS NULL);


--
-- Name: resource__search__idx; Type: INDEX; Schema: application_; Owner: postgres
--

CREATE INDEX resource__search__idx ON application_.resource_ USING gin (search_);


--
-- Name: email_address_verification__email_address__idx; Type: INDEX; Schema: security_; Owner: postgres
--

CREATE UNIQUE INDEX email_address_verification__email_address__idx ON security_.email_address_verification_ USING btree (email_address_) WHERE (status_ IS NULL);


--
-- Name: password_reset__user_uuid__idx; Type: INDEX; Schema: security_; Owner: postgres
--

CREATE UNIQUE INDEX password_reset__user_uuid__idx ON security_.password_reset_ USING btree (user_uuid_) WHERE (status_ = 'started'::public.verification_status_);


--
-- Name: sign_up__email_address__idx; Type: INDEX; Schema: security_; Owner: postgres
--

CREATE UNIQUE INDEX sign_up__email_address__idx ON security_.sign_up_ USING btree (email_address_) WHERE (status_ <> 'cancelled'::public.verification_status_);


--
-- Name: agency_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.agency_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: agency_thank_you_page_setting_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.agency_thank_you_page_setting_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: client_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.client_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: notification_definition_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.notification_definition_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: page_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.page_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: page_block_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.page_block_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: price_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.price_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: service_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: service_step_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_step_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: service_step_confirmation_by_agency_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_step_confirmation_by_agency_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: service_step_document_delivery_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_step_document_delivery_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: service_step_document_submission_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_step_document_submission_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: service_step_form_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_step_form_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: service_step_payment_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_step_payment_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: service_thank_you_page_setting_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_thank_you_page_setting_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: service_variant_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_variant_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: stripe_account_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.stripe_account_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: theme_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.theme_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: user_invite_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.user_invite_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: user_notification_setting_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.user_notification_setting_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: agency_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.agency_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: client_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.client_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: image_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.image_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.service_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.service_step_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_confirmation_by_agency_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.service_step_confirmation_by_agency_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_document_delivery_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.service_step_document_delivery_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_document_submission_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.service_step_document_submission_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_form_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.service_step_form_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_payment_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.service_step_payment_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_variant_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.service_variant_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: theme_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.theme_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: user_invite_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.user_invite_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: agency_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.agency_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: agency_thank_you_page_setting_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.agency_thank_you_page_setting_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: image_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.image_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: markdown_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.markdown_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: notification_definition_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.notification_definition_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: page_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.page_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: page_block_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.page_block_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: price_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.price_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: service_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.service_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: service_thank_you_page_setting_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.service_thank_you_page_setting_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: service_variant_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.service_variant_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: stripe_account_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.stripe_account_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: theme_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.theme_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: user_notification_setting_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.user_notification_setting_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: agency_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: agency_thank_you_page_setting_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.agency_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: client_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.client_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: notification_definition_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.notification_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: page_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.page_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: page_block_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.page_block_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: price_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.price_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_step_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_step_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_step_confirmation_by_agency_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_step_confirmation_by_agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_step_document_delivery_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_step_document_delivery_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_step_document_submission_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_step_document_submission_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_step_form_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_step_form_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_step_payment_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_step_payment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_thank_you_page_setting_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_variant_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_variant_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: stripe_account_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.stripe_account_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: theme_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.theme_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: user_invite_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.user_invite_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: user_notification_setting_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.user_notification_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: agency_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.agency_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: client_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.client_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: image_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.image_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.service_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.service_step_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_confirmation_by_agency_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.service_step_confirmation_by_agency_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_document_delivery_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.service_step_document_delivery_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_document_submission_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.service_step_document_submission_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_form_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.service_step_form_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_payment_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.service_step_payment_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_variant_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.service_variant_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: theme_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.theme_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: user_invite_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.user_invite_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: agency_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: agency_thank_you_page_setting_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.agency_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: image_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.image_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: markdown_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.markdown_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: notification_definition_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.notification_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: page_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.page_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: page_block_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.page_block_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: price_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.price_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: service_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.service_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: service_thank_you_page_setting_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.service_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: service_variant_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.service_variant_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: stripe_account_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.stripe_account_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: theme_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.theme_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: user_notification_setting_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.user_notification_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: agency_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: agency_thank_you_page_setting_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.agency_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: client_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.client_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: notification_definition_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.notification_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: page_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.page_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: page_block_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.page_block_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: price_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.price_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_step_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_step_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_step_confirmation_by_agency_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_step_confirmation_by_agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_step_document_delivery_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_step_document_delivery_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_step_document_submission_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_step_document_submission_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_step_form_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_step_form_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_step_payment_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_step_payment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_thank_you_page_setting_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: service_variant_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_variant_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: stripe_account_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.stripe_account_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: theme_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.theme_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: user_invite_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.user_invite_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: user_notification_setting_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.user_notification_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: agency_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.agency_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: client_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.client_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: image_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.image_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.service_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.service_step_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_confirmation_by_agency_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.service_step_confirmation_by_agency_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_document_delivery_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.service_step_document_delivery_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_document_submission_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.service_step_document_submission_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_form_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.service_step_form_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_step_payment_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.service_step_payment_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: service_variant_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.service_variant_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: theme_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.theme_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: user_invite_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.user_invite_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: agency_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: agency_thank_you_page_setting_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.agency_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: image_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.image_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: markdown_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.markdown_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: notification_definition_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.notification_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: page_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.page_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: page_block_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.page_block_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: price_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.price_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: service_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.service_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: service_thank_you_page_setting_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.service_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: service_variant_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.service_variant_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: stripe_account_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.stripe_account_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: theme_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.theme_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: user_notification_setting_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.user_notification_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: agency_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.agency_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: agency_thank_you_page_setting_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.agency_thank_you_page_setting_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: client_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.client_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: notification_definition_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.notification_definition_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: page_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.page_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: page_block_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.page_block_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: price_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.price_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: service_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: service_step_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_step_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: service_step_confirmation_by_agency_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_step_confirmation_by_agency_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: service_step_document_delivery_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_step_document_delivery_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: service_step_document_submission_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_step_document_submission_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: service_step_form_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_step_form_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: service_step_payment_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_step_payment_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: service_thank_you_page_setting_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_thank_you_page_setting_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: service_variant_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_variant_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: stripe_account_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.stripe_account_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: theme_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.theme_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: user_invite_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.user_invite_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: user_notification_setting_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.user_notification_setting_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: password_reset_ tr_instead_of_delete_try_cancel_password_reset; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_instead_of_delete_try_cancel_password_reset INSTEAD OF DELETE ON application_.password_reset_ FOR EACH ROW EXECUTE FUNCTION internal_.try_cancel_password_reset_();


--
-- Name: sign_up_ tr_instead_of_delete_try_cancel_sign_up_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_instead_of_delete_try_cancel_sign_up_ INSTEAD OF DELETE ON application_.sign_up_ FOR EACH ROW EXECUTE FUNCTION internal_.try_cancel_sign_up_();


--
-- Name: password_reset_ tr_instead_of_insert_try_start_password_reset; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_instead_of_insert_try_start_password_reset INSTEAD OF INSERT ON application_.password_reset_ FOR EACH ROW EXECUTE FUNCTION internal_.try_start_password_reset_();


--
-- Name: sign_up_ tr_instead_of_insert_try_start_sign_up_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_instead_of_insert_try_start_sign_up_ INSTEAD OF INSERT ON application_.sign_up_ FOR EACH ROW EXECUTE FUNCTION internal_.try_start_sign_up_();


--
-- Name: password_reset_ tr_instead_of_update_try_verify_password_reset; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_instead_of_update_try_verify_password_reset INSTEAD OF UPDATE ON application_.password_reset_ FOR EACH ROW EXECUTE FUNCTION internal_.try_verify_password_reset_();


--
-- Name: sign_up_ tr_instead_of_update_try_verify_sign_up_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_instead_of_update_try_verify_sign_up_ INSTEAD OF UPDATE ON application_.sign_up_ FOR EACH ROW EXECUTE FUNCTION internal_.try_verify_sign_up_();


--
-- Name: form_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON internal_.form_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: form_field_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON internal_.form_field_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: page_block_definition_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON internal_.page_block_definition_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: page_definition_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON internal_.page_definition_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: form_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON internal_.form_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: form_field_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON internal_.form_field_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: page_block_definition_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON internal_.page_block_definition_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: page_definition_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON internal_.page_definition_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: form_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON internal_.form_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: form_field_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON internal_.form_field_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: page_block_definition_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON internal_.page_block_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: page_definition_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON internal_.page_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: form_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON internal_.form_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: form_field_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON internal_.form_field_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: page_block_definition_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON internal_.page_block_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: page_definition_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON internal_.page_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: form_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON internal_.form_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: form_field_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON internal_.form_field_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: page_block_definition_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON internal_.page_block_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: page_definition_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON internal_.page_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: form_ tr_after_update_resource_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON internal_.form_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: form_field_ tr_after_update_resource_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON internal_.form_field_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: page_block_definition_ tr_after_update_resource_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON internal_.page_block_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: page_definition_ tr_after_update_resource_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON internal_.page_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: form_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON internal_.form_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: form_field_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON internal_.form_field_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: page_block_definition_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON internal_.page_block_definition_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: page_definition_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON internal_.page_definition_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: email_address_verification_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.email_address_verification_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: operation_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.operation_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: password_reset_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.password_reset_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: policy_assignment_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.policy_assignment_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: role_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.role_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: role_hierarchy_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.role_hierarchy_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: secret_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.secret_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: security_data_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.security_data_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: sign_up_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.sign_up_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: subdomain_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.subdomain_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: user_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.user_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: subdomain_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON security_.subdomain_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: subject_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON security_.subject_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: user_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON security_.user_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: subdomain_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON security_.subdomain_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: user_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON security_.user_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: subject_assignment_ tr_after_delete_resource_delete_membership; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_membership AFTER DELETE ON security_.subject_assignment_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_membership_();


--
-- Name: password_reset_ tr_after_delete_resource_delete_password_reset; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_password_reset AFTER DELETE ON security_.password_reset_ REFERENCING OLD TABLE AS _old_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_delete_password_reset_();


--
-- Name: sign_up_ tr_after_delete_resource_delete_sign_up_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_sign_up_ AFTER DELETE ON security_.sign_up_ REFERENCING OLD TABLE AS _old_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_delete_sign_up_();


--
-- Name: subdomain_ tr_after_insert_assign_subdomain_owner_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_assign_subdomain_owner_ AFTER INSERT ON security_.subdomain_ REFERENCING NEW TABLE AS _subdomain FOR EACH STATEMENT EXECUTE FUNCTION internal_.assign_subdomain_owner_();


--
-- Name: email_address_verification_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.email_address_verification_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: operation_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.operation_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: password_reset_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.password_reset_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: policy_assignment_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.policy_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: role_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.role_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: role_hierarchy_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.role_hierarchy_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: secret_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.secret_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: security_data_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.security_data_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: sign_up_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.sign_up_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: subdomain_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.subdomain_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: user_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.user_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: user_ tr_after_insert_insert_subject_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_insert_subject_ AFTER INSERT ON security_.user_ REFERENCING NEW TABLE AS _user FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_subject_for_user_();


--
-- Name: subdomain_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON security_.subdomain_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: subject_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON security_.subject_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: user_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON security_.user_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: subdomain_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON security_.subdomain_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: user_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON security_.user_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: subject_assignment_ tr_after_insert_resource_insert_membership; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_membership AFTER INSERT ON security_.subject_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_insert_membership_();


--
-- Name: password_reset_ tr_after_insert_resource_insert_password_reset; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_password_reset AFTER INSERT ON security_.password_reset_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_password_reset_();


--
-- Name: sign_up_ tr_after_insert_resource_insert_sign_up_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_sign_up_ AFTER INSERT ON security_.sign_up_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_sign_up_();


--
-- Name: email_address_verification_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.email_address_verification_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: operation_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.operation_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: password_reset_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.password_reset_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: policy_assignment_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.policy_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: role_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.role_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: role_hierarchy_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.role_hierarchy_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: secret_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.secret_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: security_data_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.security_data_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: sign_up_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.sign_up_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: subdomain_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.subdomain_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: user_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.user_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: subdomain_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON security_.subdomain_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: subject_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON security_.subject_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: user_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON security_.user_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: subdomain_ tr_after_update_resource_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON security_.subdomain_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: user_ tr_after_update_resource_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON security_.user_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: subject_assignment_ tr_after_update_resource_update_membership; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_membership AFTER UPDATE ON security_.subject_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_update_membership_();


--
-- Name: password_reset_ tr_after_update_resource_update_password_reset; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_password_reset AFTER UPDATE ON security_.password_reset_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_password_reset_();


--
-- Name: sign_up_ tr_after_update_resource_update_sign_up_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_sign_up_ AFTER UPDATE ON security_.sign_up_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_sign_up_();


--
-- Name: email_address_verification_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.email_address_verification_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: operation_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.operation_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: password_reset_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.password_reset_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: policy_assignment_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.policy_assignment_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: role_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.role_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: role_hierarchy_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.role_hierarchy_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: secret_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.secret_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: security_data_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.security_data_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: sign_up_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.sign_up_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: subdomain_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.subdomain_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: user_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.user_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: agency_ agency__subdomain_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.agency_
    ADD CONSTRAINT agency__subdomain_uuid__fkey FOREIGN KEY (subdomain_uuid_) REFERENCES security_.subdomain_(uuid_) ON DELETE CASCADE;


--
-- Name: agency_thank_you_page_setting_ agency_thank_you_page_setting__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.agency_thank_you_page_setting_
    ADD CONSTRAINT agency_thank_you_page_setting__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_);


--
-- Name: client_ client__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.client_
    ADD CONSTRAINT client__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_);


--
-- Name: client_ client__invite_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.client_
    ADD CONSTRAINT client__invite_uuid__fkey FOREIGN KEY (invite_uuid_) REFERENCES application_.user_invite_(uuid_);


--
-- Name: client_ client__subject_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.client_
    ADD CONSTRAINT client__subject_uuid__fkey FOREIGN KEY (subject_uuid_) REFERENCES security_.user_(uuid_);


--
-- Name: image_ image__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.image_
    ADD CONSTRAINT image__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;


--
-- Name: page_ page__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_
    ADD CONSTRAINT page__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_);


--
-- Name: page_ page__page_definition_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_
    ADD CONSTRAINT page__page_definition_uuid__fkey FOREIGN KEY (page_definition_uuid_) REFERENCES internal_.page_definition_(uuid_);


--
-- Name: page_block_ page_block__after_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_block_
    ADD CONSTRAINT page_block__after_uuid__fkey FOREIGN KEY (after_uuid_) REFERENCES application_.page_block_(uuid_);


--
-- Name: page_block_ page_block__page_block_definition_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_block_
    ADD CONSTRAINT page_block__page_block_definition_uuid__fkey FOREIGN KEY (page_block_definition_uuid_) REFERENCES internal_.page_block_definition_(uuid_);


--
-- Name: page_block_ page_block__page_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_block_
    ADD CONSTRAINT page_block__page_uuid__fkey FOREIGN KEY (page_uuid_) REFERENCES application_.page_(uuid_);


--
-- Name: price_ price__service_variant_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.price_
    ADD CONSTRAINT price__service_variant_uuid__fkey FOREIGN KEY (service_variant_uuid_) REFERENCES application_.service_variant_(uuid_) ON DELETE CASCADE;


--
-- Name: resource_ resource__definition_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.resource_
    ADD CONSTRAINT resource__definition_uuid__fkey FOREIGN KEY (definition_uuid_) REFERENCES security_.resource_definition_(uuid_);


--
-- Name: resource_ resource__owner_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.resource_
    ADD CONSTRAINT resource__owner_uuid__fkey FOREIGN KEY (owner_uuid_) REFERENCES application_.resource_(uuid_) ON DELETE CASCADE;


--
-- Name: service_ service__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_
    ADD CONSTRAINT service__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;


--
-- Name: service_ service__default_variant_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_
    ADD CONSTRAINT service__default_variant_uuid__fkey FOREIGN KEY (default_variant_uuid_) REFERENCES application_.service_variant_(uuid_) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: service_step_ service_step__previous_service_step_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_
    ADD CONSTRAINT service_step__previous_service_step_uuid__fkey FOREIGN KEY (previous_service_step_uuid_) REFERENCES application_.service_step_(uuid_);


--
-- Name: service_step_ service_step__service_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_
    ADD CONSTRAINT service_step__service_uuid__fkey FOREIGN KEY (service_uuid_) REFERENCES application_.service_(uuid_);


--
-- Name: service_step_confirmation_by_agency_ service_step_confirmation_by_agency__uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_confirmation_by_agency_
    ADD CONSTRAINT service_step_confirmation_by_agency__uuid__fkey FOREIGN KEY (uuid_) REFERENCES application_.service_step_(uuid_);


--
-- Name: service_step_document_delivery_ service_step_document_delivery__uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_document_delivery_
    ADD CONSTRAINT service_step_document_delivery__uuid__fkey FOREIGN KEY (uuid_) REFERENCES application_.service_step_(uuid_);


--
-- Name: service_step_document_submission_ service_step_document_submission__uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_document_submission_
    ADD CONSTRAINT service_step_document_submission__uuid__fkey FOREIGN KEY (uuid_) REFERENCES application_.service_step_(uuid_);


--
-- Name: service_step_form_ service_step_form__uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_form_
    ADD CONSTRAINT service_step_form__uuid__fkey FOREIGN KEY (uuid_) REFERENCES application_.service_step_(uuid_);


--
-- Name: service_step_payment_ service_step_payment__uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_step_payment_
    ADD CONSTRAINT service_step_payment__uuid__fkey FOREIGN KEY (uuid_) REFERENCES application_.service_step_(uuid_);


--
-- Name: service_thank_you_page_setting_ service_thank_you_page_setting__service_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_thank_you_page_setting_
    ADD CONSTRAINT service_thank_you_page_setting__service_uuid__fkey FOREIGN KEY (service_uuid_) REFERENCES application_.service_(uuid_);


--
-- Name: service_variant_ service_variant__default_price_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_variant_
    ADD CONSTRAINT service_variant__default_price_uuid__fkey FOREIGN KEY (default_price_uuid_) REFERENCES application_.price_(uuid_) ON DELETE SET NULL;


--
-- Name: service_variant_ service_variant__image_hero_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_variant_
    ADD CONSTRAINT service_variant__image_hero_uuid__fkey FOREIGN KEY (image_hero_uuid_) REFERENCES application_.image_(uuid_);


--
-- Name: service_variant_ service_variant__image_logo_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_variant_
    ADD CONSTRAINT service_variant__image_logo_uuid__fkey FOREIGN KEY (image_logo_uuid_) REFERENCES application_.image_(uuid_);


--
-- Name: service_variant_ service_variant__markdown_description_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_variant_
    ADD CONSTRAINT service_variant__markdown_description_uuid__fkey FOREIGN KEY (markdown_description_uuid_) REFERENCES application_.markdown_(uuid_);


--
-- Name: service_variant_ service_variant__service_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_variant_
    ADD CONSTRAINT service_variant__service_uuid__fkey FOREIGN KEY (service_uuid_) REFERENCES application_.service_(uuid_) ON DELETE CASCADE;


--
-- Name: stripe_account_ stripe_account__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.stripe_account_
    ADD CONSTRAINT stripe_account__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;


--
-- Name: theme_ theme__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.theme_
    ADD CONSTRAINT theme__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;


--
-- Name: theme_ theme__image_hero_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.theme_
    ADD CONSTRAINT theme__image_hero_uuid__fkey FOREIGN KEY (image_hero_uuid_) REFERENCES application_.image_(uuid_);


--
-- Name: theme_ theme__image_logo_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.theme_
    ADD CONSTRAINT theme__image_logo_uuid__fkey FOREIGN KEY (image_logo_uuid_) REFERENCES application_.image_(uuid_);


--
-- Name: user_invite_ user_invite__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.user_invite_
    ADD CONSTRAINT user_invite__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_);


--
-- Name: user_invite_ user_invite__inviter_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.user_invite_
    ADD CONSTRAINT user_invite__inviter_uuid__fkey FOREIGN KEY (inviter_uuid_) REFERENCES security_.subject_(uuid_);


--
-- Name: user_invite_ user_invite__role_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.user_invite_
    ADD CONSTRAINT user_invite__role_uuid__fkey FOREIGN KEY (role_uuid_) REFERENCES security_.role_(uuid_);


--
-- Name: user_notification_setting_ user_notification_setting__notification_definition_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.user_notification_setting_
    ADD CONSTRAINT user_notification_setting__notification_definition_uuid__fkey FOREIGN KEY (notification_definition_uuid_) REFERENCES application_.notification_definition_(uuid_);


--
-- Name: user_notification_setting_ user_notification_setting__subdomain_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.user_notification_setting_
    ADD CONSTRAINT user_notification_setting__subdomain_uuid__fkey FOREIGN KEY (subdomain_uuid_) REFERENCES security_.subdomain_(uuid_);


--
-- Name: user_notification_setting_ user_notification_setting__user_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.user_notification_setting_
    ADD CONSTRAINT user_notification_setting__user_uuid__fkey FOREIGN KEY (user_uuid_) REFERENCES security_.user_(uuid_);


--
-- Name: form_field_ form_field__form_uuid__fkey; Type: FK CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.form_field_
    ADD CONSTRAINT form_field__form_uuid__fkey FOREIGN KEY (form_uuid_) REFERENCES internal_.form_(uuid_);


--
-- Name: page_block_definition_ page_block_definition__form_uuid__fkey; Type: FK CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.page_block_definition_
    ADD CONSTRAINT page_block_definition__form_uuid__fkey FOREIGN KEY (form_uuid_) REFERENCES internal_.form_(uuid_);


--
-- Name: page_block_definition_ page_block_definition__page_definition_uuid__fkey; Type: FK CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.page_block_definition_
    ADD CONSTRAINT page_block_definition__page_definition_uuid__fkey FOREIGN KEY (page_definition_uuid_) REFERENCES internal_.page_definition_(uuid_);


--
-- Name: event_ event__operation_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.event_
    ADD CONSTRAINT event__operation_uuid__fkey FOREIGN KEY (operation_uuid_) REFERENCES security_.operation_(uuid_);


--
-- Name: event_ event__session_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.event_
    ADD CONSTRAINT event__session_uuid__fkey FOREIGN KEY (session_uuid_) REFERENCES security_.session_(uuid_);


--
-- Name: password_reset_ password_reset__initiator_subject_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.password_reset_
    ADD CONSTRAINT password_reset__initiator_subject_uuid__fkey FOREIGN KEY (initiator_subject_uuid_) REFERENCES security_.subject_(uuid_);


--
-- Name: password_reset_ password_reset__user_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.password_reset_
    ADD CONSTRAINT password_reset__user_uuid__fkey FOREIGN KEY (user_uuid_) REFERENCES security_.user_(uuid_);


--
-- Name: policy_ policy__after_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.policy_
    ADD CONSTRAINT policy__after_uuid__fkey FOREIGN KEY (after_uuid_) REFERENCES security_.policy_(uuid_) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: policy_ policy__resource_definition_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.policy_
    ADD CONSTRAINT policy__resource_definition_uuid__fkey FOREIGN KEY (resource_definition_uuid_) REFERENCES security_.resource_definition_(uuid_);


--
-- Name: policy_assignment_ policy_assignment__operation_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.policy_assignment_
    ADD CONSTRAINT policy_assignment__operation_uuid__fkey FOREIGN KEY (operation_uuid_) REFERENCES security_.operation_(uuid_);


--
-- Name: resource_definition_ resource_definition__owner_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.resource_definition_
    ADD CONSTRAINT resource_definition__owner_uuid__fkey FOREIGN KEY (owner_uuid_) REFERENCES security_.resource_definition_(uuid_);


--
-- Name: role_hierarchy_ role_hierarchy__role_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.role_hierarchy_
    ADD CONSTRAINT role_hierarchy__role_uuid__fkey FOREIGN KEY (role_uuid_) REFERENCES security_.role_(uuid_) ON DELETE CASCADE;


--
-- Name: role_hierarchy_ role_hierarchy__subrole_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.role_hierarchy_
    ADD CONSTRAINT role_hierarchy__subrole_uuid__fkey FOREIGN KEY (subrole_uuid_) REFERENCES security_.role_(uuid_) ON DELETE CASCADE;


--
-- Name: session_ session__token_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.session_
    ADD CONSTRAINT session__token_uuid__fkey FOREIGN KEY (token_uuid_) REFERENCES security_.token_(uuid_);


--
-- Name: sign_up_ sign_up__initiator_subject_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.sign_up_
    ADD CONSTRAINT sign_up__initiator_subject_uuid__fkey FOREIGN KEY (initiator_subject_uuid_) REFERENCES security_.subject_(uuid_);


--
-- Name: sign_up_ sign_up__user_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.sign_up_
    ADD CONSTRAINT sign_up__user_uuid__fkey FOREIGN KEY (user_uuid_) REFERENCES security_.user_(uuid_);


--
-- Name: subject_assignment_ subject_assignment__role_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.subject_assignment_
    ADD CONSTRAINT subject_assignment__role_uuid__fkey FOREIGN KEY (role_uuid_) REFERENCES security_.role_(uuid_) ON DELETE CASCADE;


--
-- Name: subject_assignment_ subject_assignment__subdomain_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.subject_assignment_
    ADD CONSTRAINT subject_assignment__subdomain_uuid__fkey FOREIGN KEY (subdomain_uuid_) REFERENCES security_.subdomain_(uuid_) ON DELETE CASCADE;


--
-- Name: subject_assignment_ subject_assignment__subject_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.subject_assignment_
    ADD CONSTRAINT subject_assignment__subject_uuid__fkey FOREIGN KEY (subject_uuid_) REFERENCES security_.subject_(uuid_) ON DELETE CASCADE;


--
-- Name: token_ token__subject_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.token_
    ADD CONSTRAINT token__subject_uuid__fkey FOREIGN KEY (subject_uuid_) REFERENCES security_.subject_(uuid_);


--
-- Name: user_ user__uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.user_
    ADD CONSTRAINT user__uuid__fkey FOREIGN KEY (uuid_) REFERENCES security_.subject_(uuid_) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: SCHEMA operation_; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA operation_ TO PUBLIC;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

