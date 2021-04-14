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
-- Name: processing_state_; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.processing_state_ AS ENUM (
    'pending',
    'processing',
    'processed',
    'failed'
);


ALTER TYPE public.processing_state_ OWNER TO postgres;

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
    search_ text[] DEFAULT '{uuid_,name_}'::text[] NOT NULL,
    upsert_keys_ text[],
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL,
    CONSTRAINT resource_definition__check CHECK (((upsert_keys_ IS NULL) OR ((upsert_keys_ <> '{}'::text[]) AND (search_ @> upsert_keys_))))
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
    DROP TRIGGER tr_after_update_resource_update_ ON ' || _table || ';
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
-- Name: insert_agency_home_page_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.insert_agency_home_page_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO application_.page_ (agency_uuid_, page_definition_uuid_, url_path_)
  SELECT a.uuid_, d.uuid_, '/'
  FROM _new_table a
  CROSS JOIN internal_.page_definition_ d
  WHERE d.name_ = 'Home';

  RETURN NULL;

END;
$$;


ALTER FUNCTION internal_.insert_agency_home_page_() OWNER TO postgres;

--
-- Name: insert_form_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.insert_form_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _form_uuid uuid;
BEGIN
  INSERT INTO internal_.form_ DEFAULT VALUES RETURNING uuid_ INTO _form_uuid;

  NEW.form_uuid_ := _form_uuid;
  RETURN NEW;
END
$$;


ALTER FUNCTION internal_.insert_form_() OWNER TO postgres;

--
-- Name: insert_page_default_blocks_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.insert_page_default_blocks_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  WITH
    cte AS (
      SELECT p.uuid_ page_uuid_, unnest(d.default_block_uuids_) page_block_definition_uuid_
      FROM _new_table p
      JOIN internal_.page_definition_ d ON p.page_definition_uuid_ = d.uuid_
    )
  INSERT INTO application_.page_block_ (page_block_definition_uuid_, page_uuid_, data_)
  SELECT cte.page_block_definition_uuid_, cte.page_uuid_, jsonb_object_agg(f.name_, f.default_)
  FROM cte
  JOIN internal_.page_block_definition_ d ON d.uuid_ = cte.page_block_definition_uuid_
  JOIN internal_.form_field_ f ON f.form_uuid_ = d.form_uuid_
  GROUP BY cte.page_block_definition_uuid_, cte.page_uuid_;

  RETURN NULL;

END;
$$;


ALTER FUNCTION internal_.insert_page_default_blocks_() OWNER TO postgres;

--
-- Name: insert_product_page_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.insert_product_page_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO application_.page_ (agency_uuid_, product_uuid_, page_definition_uuid_, url_path_)
  SELECT s.agency_uuid_, s.uuid_, d.uuid_, '/products/' || s.url_name_
  FROM _new_table s
  CROSS JOIN internal_.page_definition_ d
  WHERE d.name_ = 'Product';

  RETURN NULL;

END;
$$;


ALTER FUNCTION internal_.insert_product_page_() OWNER TO postgres;

--
-- Name: insert_resource_token_for_order_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.insert_resource_token_for_order_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO security_.resource_token_ (resource_uuid_, token_, keys_)
  SELECT _order.uuid_, _order.stripe_checkout_session_id_ext_, '{uuid_, customer_uuid_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, processed_at_}'::text[]
  FROM _order;

  INSERT INTO security_.resource_token_ (resource_uuid_, token_, keys_)
  SELECT _order.customer_uuid_, _order.stripe_checkout_session_id_ext_, '{uuid_, name_, email_address_}'::text[]
  FROM _order;

  RETURN NULL;
END
$$;


ALTER FUNCTION internal_.insert_resource_token_for_order_() OWNER TO postgres;

--
-- Name: insert_resource_token_for_order_item_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.insert_resource_token_for_order_item_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO security_.resource_token_ (resource_uuid_, token_, keys_)
  SELECT _order_item.uuid_, o.stripe_checkout_session_id_ext_, '{uuid_, order_uuid_, price_uuid_, stripe_line_item_id_ext_, state_, error_, processed_at_}'::text[]
  FROM _order_item
  JOIN application_.order_ o ON o.uuid_ = _order_item.order_uuid_;

  RETURN NULL;
END
$$;


ALTER FUNCTION internal_.insert_resource_token_for_order_item_() OWNER TO postgres;

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

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN
    SELECT c.relname INTO _owner_resource_table_name
    FROM pg_catalog.pg_class AS c
    WHERE c.oid = _owner_resource_definition.table_;

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
-- Name: resource_insert_from_(regclass); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.resource_insert_from_(_table regclass) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
  EXECUTE '
    SELECT internal_.resource_insert_(d, to_jsonb(r))
    FROM ' || _table || ' r
    CROSS JOIN security_.resource_definition_ d
    WHERE d.table_ = $1;
  '
  USING _table;
END
$_$;


ALTER FUNCTION internal_.resource_insert_from_(_table regclass) OWNER TO postgres;

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

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN

    SELECT c.relname INTO _owner_resource_table_name
    FROM pg_catalog.pg_class AS c
    WHERE c.oid = _owner_resource_definition.table_;

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
-- Name: set_form_field_sort_key_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.set_form_field_sort_key_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _sort_key real;
BEGIN
  IF NEW.sort_key_ IS NULL THEN
    SELECT MAX(s.sort_key_) + 1 INTO _sort_key
    FROM internal_.form_field_ s
    WHERE s.form_uuid_ = NEW.form_uuid_;

    NEW.sort_key_ = _sort_key;
  END IF;

  RETURN NEW;
END
$$;


ALTER FUNCTION internal_.set_form_field_sort_key_() OWNER TO postgres;

--
-- Name: set_subscription_plan_to_basic_plan_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.set_subscription_plan_to_basic_plan_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _subscription_plan_uuid uuid;
BEGIN
  SELECT uuid_ INTO _subscription_plan_uuid
  FROM internal_.subscription_plan_
  WHERE name_ = 'Basic plan';

  NEW.subscription_plan_uuid_ := _subscription_plan_uuid;
  RETURN NEW;
END
$$;


ALTER FUNCTION internal_.set_subscription_plan_to_basic_plan_() OWNER TO postgres;

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
-- Name: update_page_block_linked_list_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.update_page_block_linked_list_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _before_uuid uuid;
BEGIN
  IF NEW.after_uuid_ IS NULL THEN
    SELECT uuid_ INTO _before_uuid
    FROM application_.page_block_ b
    WHERE b.page_uuid_ = NEW.page_uuid_
      AND NOT EXISTS (
        SELECT 1
        FROM application_.page_block_ b_after
        WHERE b_after.after_uuid_ = b.uuid_
      );

    NEW.after_uuid_ = _before_uuid;
  END IF;
  RETURN NEW;
END
$$;


ALTER FUNCTION internal_.update_page_block_linked_list_() OWNER TO postgres;

--
-- Name: update_product_page_url_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.update_product_page_url_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE application_.page_ p
  SET url_path_ = '/products/' || s.url_name_
  FROM _new_table s
  CROSS JOIN internal_.page_definition_ d
  WHERE d.name_ = 'Product'
    AND d.uuid_ = p.page_definition_uuid_
    AND p.product_uuid_ = s.uuid_;

  RETURN NULL;

END;
$$;


ALTER FUNCTION internal_.update_product_page_url_() OWNER TO postgres;

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
      RAISE 'Invalid JWT.' USING ERRCODE = 'D0JWT';
    END IF;

    SELECT t.uuid_, t.subject_uuid_ INTO _token_uuid, _subject_uuid
    FROM security_.token_ t
    WHERE t.uuid_ = (_claims->>'jti')::uuid
      AND t.revoked_at_ IS NULL;

    IF _token_uuid IS NULL THEN
      RAISE 'Invalid JWT.' USING ERRCODE = 'D0JWT';
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
    RAISE 'Active session already exists.' USING ERRCODE = 'DEXSE';
  END IF;

  INSERT INTO security_.subject_ (type_)
  VALUES ('visitor')
  RETURNING uuid_ INTO _subject_uuid;

  SELECT x.value_ INTO _secret
  FROM security_.secret_ x
  WHERE x.name_ = 'jwt_hs256';

  IF _secret IS NULL THEN
    RAISE 'Invalid secret configuration.' USING ERRCODE = 'DCONF';
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
-- Name: create_resource_(text, jsonb); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.create_resource_(_resource_name text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
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
-- Name: delete_resource_(text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.delete_resource_(_resource_name text, _id text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
  _data jsonb;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = _resource_name;

  IF _resource_definition.uuid_ IS NULL THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  SELECT * INTO _resource
  FROM application_.resource_
  WHERE _resource_definition.uuid_ = definition_uuid_
    AND id_ = _id;

  IF _resource.uuid_ IS NULL THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  PERFORM security_.control_delete_(_resource_definition, _resource);

  _data := operation_.query_resource_(_resource_name, _id);

  PERFORM internal_.dynamic_delete_(_resource_definition.table_, _resource.uuid_);

  RETURN _data;
END
$$;


ALTER FUNCTION operation_.delete_resource_(_resource_name text, _id text) OWNER TO postgres;

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
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
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
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
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
    RAISE 'Email address and password do not match.' USING ERRCODE = 'DPASS';
  END IF;

  SELECT x.value_ INTO _secret
  FROM security_.secret_ x
  WHERE x.name_ = 'jwt_hs256';

  IF _secret IS NULL THEN
    RAISE 'Invalid secret configuration.' USING ERRCODE = 'DCONF';
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
-- Name: query_resource_(text, jsonb); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_resource_(_resource_name text, _filter jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF _resource_name IS NULL OR _filter IS NULL THEN
    RETURN;
  END IF;

  _filter := internal_.convert_to_internal_format_(_filter);

  RETURN QUERY
    WITH
    all_ AS (
        SELECT internal_.dynamic_select_(d.table_, r.uuid_, keys_) data_
        FROM application_.resource_ r
        JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
        CROSS JOIN security_.control_query_(d, r) keys_
        WHERE d.name_ = _resource_name
        AND r.search_ @> _filter
    )
    SELECT internal_.convert_from_internal_format_(all_.data_) query_resource_
    FROM all_
    WHERE all_.data_ @> _filter
    ORDER BY (all_.data_->>'sort_key_')::real;
END
$$;


ALTER FUNCTION operation_.query_resource_(_resource_name text, _filter jsonb) OWNER TO postgres;

--
-- Name: query_resource_(text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_resource_(_resource_name text, _id_or_filter text) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _id text;
  _filter jsonb;
BEGIN
  IF _resource_name IS NULL OR _id_or_filter IS NULL THEN
    RETURN;
  END IF;

  IF starts_with(_id_or_filter, '{') THEN
    _filter := _id_or_filter::jsonb;

    IF _filter = '{}'::jsonb THEN
      RETURN;
    ELSEIF _filter - 'id' = '{}'::jsonb THEN
      _id := _filter->>'id';
    END IF;

  ELSE
    _id := _id_or_filter;
  END IF;

  IF _id IS NOT NULL THEN
      -- Lookup by id
    RETURN QUERY
      SELECT internal_.convert_from_internal_format_(
        internal_.dynamic_select_(d.table_, r.uuid_, keys_)
      ) query_resource_
      FROM application_.resource_ r
      JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
      CROSS JOIN security_.control_query_(d, r) keys_
      WHERE d.name_ = _resource_name
        AND r.id_ = _id;

  ELSE
    -- Filter by fields
    RETURN QUERY
      SELECT operation_.query_resource_(_resource_name, _filter);
  END IF;
END
$$;


ALTER FUNCTION operation_.query_resource_(_resource_name text, _id_or_filter text) OWNER TO postgres;

--
-- Name: query_resource_(text, jsonb, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_resource_(_resource_name text, _filter jsonb, _token text) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF _resource_name IS NULL OR _filter IS NULL THEN
    RETURN;
  END IF;

  _filter := internal_.convert_to_internal_format_(_filter);

  RETURN QUERY
    WITH
      all_ AS (
        SELECT internal_.dynamic_select_(d.table_, r.uuid_, t.keys_) data_
        FROM application_.resource_ r
        JOIN security_.resource_token_ t ON r.uuid_ = t.resource_uuid_ AND r.uuid_ = t.resource_uuid_
        JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
        WHERE d.name_ = _resource_name
          AND t.token_ = _token
          AND r.search_ @> _filter
      )
    SELECT internal_.convert_from_internal_format_(all_.data_) query_resource_
    FROM all_
    WHERE all_.data_ @> _filter
    ORDER BY (all_.data_->>'sort_key_')::real;
END
$$;


ALTER FUNCTION operation_.query_resource_(_resource_name text, _filter jsonb, _token text) OWNER TO postgres;

--
-- Name: query_resource_(text, text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_resource_(_resource_name text, _id_or_filter text, _token text) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _id text;
  _filter jsonb;
BEGIN
  IF _resource_name IS NULL OR _id_or_filter IS NULL OR _token IS NULL THEN
    RETURN;
  END IF;

  IF starts_with(_id_or_filter, '{') THEN
    _filter := _id_or_filter::jsonb;

    IF _filter = '{}'::jsonb THEN
      RETURN;
    ELSEIF _filter - 'id' = '{}'::jsonb THEN
      _id := _filter->>'id';
    END IF;

  ELSE
    _id := _id_or_filter;
  END IF;

  IF _id IS NOT NULL THEN
    -- Lookup by id and resource token
    RETURN QUERY
      SELECT internal_.convert_from_internal_format_(
          internal_.dynamic_select_(d.table_, r.uuid_, t.keys_)
        ) query_resource_
      FROM application_.resource_ r
      JOIN security_.resource_token_ t ON r.uuid_ = t.resource_uuid_ AND r.uuid_ = t.resource_uuid_
      JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
      WHERE d.name_ = _resource_name
        AND t.token_ = _token
        AND r.id_ = _id;

  ELSE
    -- Filter by fields
    RETURN QUERY
      SELECT operation_.query_resource_(_resource_name, _filter, _token);
  END IF;
END
$$;


ALTER FUNCTION operation_.query_resource_(_resource_name text, _id_or_filter text, _token text) OWNER TO postgres;

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
    WHERE all_.data_ @> _containing
    ORDER BY (all_.data_->>'sort_key_')::real;
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
-- Name: update_resource_(text, jsonb); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.update_resource_(_id text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
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
-- Name: update_resource_(text, text, jsonb); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.update_resource_(_resource_name text, _id text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource application_.resource_;
  _resource_definition security_.resource_definition_;
  _owned_resources_data jsonb;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_
  WHERE name_ = _resource_name;

  IF _resource_definition.uuid_ IS NULL THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  SELECT * INTO _resource
  FROM application_.resource_
  WHERE _resource_definition.uuid_ = definition_uuid_
    AND id_ = _id;

  IF _resource.uuid_ IS NULL THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  SELECT owner_, owned_ INTO _data, _owned_resources_data
  FROM internal_.extract_referenced_resources_jsonb_(_resource_definition.uuid_, _data);

  _data := internal_.convert_to_internal_format_(_data);

  PERFORM security_.control_update_(_resource_definition, _resource, _data);
  PERFORM internal_.dynamic_update_(_resource_definition.table_, _resource.uuid_, _data);

  _data := operation_.query_resource_(_resource_name, _id);

  SELECT jsonb_object_agg(r.key, internal_.create_or_update_owned_resource_(_resource_definition.table_, _id, r.key, r.value)) INTO _owned_resources_data
  FROM jsonb_each(_owned_resources_data) r;

  RETURN _data || COALESCE(_owned_resources_data, '{}'::jsonb);
END
$$;


ALTER FUNCTION operation_.update_resource_(_resource_name text, _id text, _data jsonb) OWNER TO postgres;

--
-- Name: upsert_resource_(text, jsonb); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.upsert_resource_(_resource_name text, _data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource_definition security_.resource_definition_;
  _resource application_.resource_;
  _uuid uuid;
  _id text;
  _owned_resources_data jsonb;
BEGIN
  SELECT * INTO _resource_definition
  FROM security_.resource_definition_ WHERE name_ = _resource_name;

  IF _resource_definition.upsert_keys_ IS NULL THEN
    RAISE 'Upsert is not supported for this resource.' USING ERRCODE = 'DUPSE';
  END IF;

  _data := jsonb_strip_nulls(_data);

  SELECT owner_, owned_ INTO _data, _owned_resources_data
  FROM internal_.extract_referenced_resources_jsonb_(_resource_definition.uuid_, _data);

  _data := internal_.convert_to_internal_format_(_data);

  WITH
    _keys as (
      SELECT jsonb_object_agg(k, _data->k) data_
      FROM unnest(_resource_definition.upsert_keys_) k
    )
  SELECT r INTO _resource
  FROM application_.resource_ r
  WHERE r.definition_uuid_ = _resource_definition.uuid_
    AND r.search_ @> _keys.data_;

  IF _resource.uuid_ IS NULL THEN
    PERFORM security_.control_create_(_resource_definition, _data);

    _uuid := internal_.dynamic_insert_(_resource_definition.table_, _data);

    SELECT id_ INTO _id FROM application_.resource_ WHERE uuid_ = _uuid;
  ELSE
    _data = _data - _resource_definition.upsert_keys_;

    PERFORM security_.control_update_(_resource_definition, _resource, _data);
    PERFORM internal_.dynamic_update_(_resource_definition.table_, _resource.uuid_, _data);
  END IF;

  _data := operation_.query_resource_(_id);

  SELECT jsonb_object_agg(r.key, internal_.create_or_update_owned_resource_(_resource_definition.table_, _id, r.key, r.value)) INTO _owned_resources_data
  FROM jsonb_each(_owned_resources_data) r;

  RETURN _data || COALESCE(_owned_resources_data, '{}'::jsonb);
END
$$;


ALTER FUNCTION operation_.upsert_resource_(_resource_name text, _data jsonb) OWNER TO postgres;

--
-- Name: agent_can_query_agency_subscription_plan_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.agent_can_query_agency_subscription_plan_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, subscription_plan_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.agent_can_query_agency_subscription_plan_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

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
-- Name: agent_can_query_customer_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.agent_can_query_customer_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, name_, email_address_, default_stripe_id_ext_, stripe_account_uuid_, user_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.agent_can_query_customer_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: agent_can_query_order_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.agent_can_query_order_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, customer_uuid_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.agent_can_query_order_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: agent_can_query_price_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.agent_can_query_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, product_uuid_, stripe_price_id_ext_live_, stripe_price_id_ext_test_, type_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.agent_can_query_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: agent_can_query_product_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.agent_can_query_product_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, agency_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, url_name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_, integration_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.agent_can_query_product_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: agent_can_query_product_thank_you_page_setting_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.agent_can_query_product_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, product_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.agent_can_query_product_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

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
  SELECT '{uuid_, subdomain_uuid_, name_, livemode_, default_pricing_currency_}'::text[];
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
  SELECT '{uuid_, name_, label_, type_, form_uuid_, sort_key_, default_}'::text[];
$$;


ALTER FUNCTION policy_.anyone_can_query_form_field_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_integration_type_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_integration_type_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, form_uuid_, name_}'::text[];
$$;


ALTER FUNCTION policy_.anyone_can_query_integration_type_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

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
    RETURN '{uuid_, product_uuid_, stripe_price_id_ext_live_, stripe_price_id_ext_test_, type_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.anyone_can_query_live_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_live_product_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_live_product_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT status_ = 'live'
    FROM application_.product_
    WHERE uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, agency_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, url_name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.anyone_can_query_live_product_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

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
  SELECT '{uuid_, name_, url_path_}'::text[];
$$;


ALTER FUNCTION policy_.anyone_can_query_page_definition_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: anyone_can_query_stripe_account_for_agency_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_stripe_account_for_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, agency_uuid_, stripe_id_ext_, livemode_}'::text[];
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
-- Name: anyone_can_query_subscription_plan_basic_fields_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.anyone_can_query_subscription_plan_basic_fields_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN '{uuid_, name_}'::text[];
END
$$;


ALTER FUNCTION policy_.anyone_can_query_subscription_plan_basic_fields_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

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
    RETURN '{uuid_, access_, page_definition_uuid_, agency_uuid_, product_uuid_, url_path_}'::text[];
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
-- Name: delete_forbidden_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.delete_forbidden_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
END
$$;


ALTER FUNCTION policy_.delete_forbidden_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

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
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;
END
$$;


ALTER FUNCTION policy_.only_owner_can_delete_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: owner_can_change_agency_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{default_pricing_currency_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

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
-- Name: owner_can_change_credential_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_credential_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_credential_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_customer_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_customer_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{name_, email_address_, default_stripe_id_ext_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_customer_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

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
-- Name: owner_can_change_integration_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

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
-- Name: owner_can_change_order_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_order_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{state_, error_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_order_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

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
    IF EXISTS (
      SELECT 1
      FROM application_.price_
      WHERE uuid_ = _resource.uuid_
        AND stripe_price_id_ext_live_ IS NULL
        AND stripe_price_id_ext_test_ IS NULL
    ) THEN
      RETURN '{stripe_price_id_ext_live_, stripe_price_id_ext_test_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
    ELSE
      RETURN '{unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
    END IF;
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_price_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_product_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_product_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    IF EXISTS (
      SELECT 1
      FROM application_.product_
      WHERE uuid_ = _resource.uuid_
        AND stripe_prod_id_ext_live_ IS NULL
        AND stripe_prod_id_ext_test_ IS NULL
    ) THEN
      RETURN '{name_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, url_name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_, integration_uuid_}'::text[];
    ELSE
      RETURN '{name_, url_name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_, integration_uuid_}'::text[];
    END IF;
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_change_product_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_change_product_thank_you_page_setting_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_change_product_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
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


ALTER FUNCTION policy_.owner_can_change_product_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

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
    RETURN '{uuid_, subdomain_uuid_, name_, livemode_, default_pricing_currency_}'::text[];
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
-- Name: owner_can_create_credential_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_credential_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, type_, name_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_credential_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_customer_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_customer_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{name_, email_address_, default_stripe_id_ext_, stripe_account_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_customer_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

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
-- Name: owner_can_create_integration_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_integration_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_integration_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

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
-- Name: owner_can_create_order_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_order_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{customer_uuid_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_order_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

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
    RETURN '{product_uuid_, stripe_price_id_ext_live_, stripe_price_id_ext_test_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_price_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_product_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_product_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, url_name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_, integration_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_product_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: owner_can_create_product_thank_you_page_setting_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_create_product_thank_you_page_setting_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{product_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_create_product_thank_you_page_setting_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

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
    RETURN '{agency_uuid_, stripe_id_ext_, livemode_}'::text[];
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
-- Name: owner_can_query_credential_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_query_credential_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, agency_uuid_, type_, name_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_query_credential_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: owner_can_query_integration_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_query_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, agency_uuid_, integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_query_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

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
-- Name: owner_can_query_order_item_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_query_order_item_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, order_uuid_, price_uuid_, stripe_line_item_id_ext_, state_, error_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.owner_can_query_order_item_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: owner_can_query_stripe_account_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.owner_can_query_stripe_account_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, agency_uuid_, stripe_id_ext_, livemode_}'::text[];
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
-- Name: product_status_contains_only_live_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.product_status_contains_only_live_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$   
BEGIN
  RETURN (
    SELECT _arg.product_status_ IS NOT NULL AND 'live' = ALL (_arg.product_status_) AND 'live' = ANY (_arg.product_status_)
  );
END
 $$;


ALTER FUNCTION policy_.product_status_contains_only_live_(_arg anyelement) OWNER TO postgres;

--
-- Name: product_status_is_live_(anyelement); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.product_status_is_live_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$  
BEGIN
  RETURN (
    SELECT _arg.product_status_ IS NOT DISTINCT FROM 'live'
  );
END
 $$;


ALTER FUNCTION policy_.product_status_is_live_(_arg anyelement) OWNER TO postgres;

--
-- Name: serviceaccount_can_change_customer_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_change_customer_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{name_, email_address_, default_stripe_id_ext_, user_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_change_customer_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

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
-- Name: serviceaccount_can_change_order_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_change_order_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{state_, error_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_change_order_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: serviceaccount_can_change_order_item_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_change_order_item_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{state_, error_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_change_order_item_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: serviceaccount_can_change_webhook_event_(security_.resource_definition_, application_.resource_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_change_webhook_event_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{state_, error_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_change_webhook_event_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) OWNER TO postgres;

--
-- Name: serviceaccount_can_create_customer_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_create_customer_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{name_, email_address_, default_stripe_id_ext_, stripe_account_uuid_, user_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_create_customer_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

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
-- Name: serviceaccount_can_create_order_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_create_order_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{customer_uuid_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_create_order_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: serviceaccount_can_create_order_item_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_create_order_item_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{order_uuid_, price_uuid_, stripe_line_item_id_ext_, state_, error_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_create_order_item_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: serviceaccount_can_create_webhook_event_(security_.resource_definition_, jsonb); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_create_webhook_event_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{id_ext_, source_, livemode_, data_, state_, error_, agency_uuid_, event_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_create_webhook_event_(_resource_definition security_.resource_definition_, _data jsonb) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_agency_subscription_plan_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_agency_subscription_plan_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, subscription_plan_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_agency_subscription_plan_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

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
-- Name: serviceaccount_can_query_credential_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_credential_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, type_, name_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_credential_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_customer_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_customer_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, name_, email_address_, default_stripe_id_ext_, stripe_account_uuid_, user_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_customer_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_integration_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

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
-- Name: serviceaccount_can_query_order_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_order_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, customer_uuid_, stripe_account_uuid_, stripe_checkout_session_id_ext_, state_, error_, ordered_at_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_order_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_order_item_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_order_item_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, order_uuid_, price_uuid_, stripe_line_item_id_ext_, state_, error_, processed_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_order_item_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_product_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_product_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, url_name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_, integration_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_product_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_product_thank_you_page_setting_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_product_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, product_uuid_, url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_product_thank_you_page_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_stripe_account_for_agency_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_stripe_account_for_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, stripe_id_ext_, livemode_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_stripe_account_for_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_subscription_plan_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_subscription_plan_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, name_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_subscription_plan_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_transaction_fee_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_transaction_fee_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, subscription_plan_uuid_, numerator_, denominator_, fixed_amount_, currency_, transaction_amount_upper_bound_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_transaction_fee_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

--
-- Name: serviceaccount_can_query_webhook_event_(security_.resource_definition_, application_.resource_); Type: FUNCTION; Schema: policy_; Owner: postgres
--

CREATE FUNCTION policy_.serviceaccount_can_query_webhook_event_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, id_ext_, source_, livemode_, data_, state_, error_, agency_uuid_, event_at_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


ALTER FUNCTION policy_.serviceaccount_can_query_webhook_event_(_resource_definition security_.resource_definition_, _resource application_.resource_) OWNER TO postgres;

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
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
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
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
  END IF;

  IF _data IS NULL OR _data = '{}'::jsonb THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
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

  RAISE 'Unauthorized. Not allowed to set fields: %', _fields_list USING ERRCODE = 'DUNAU';
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
    RAISE 'Unauthorized. No access policies defined.' USING ERRCODE = 'DUNAU';
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
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
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
      RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
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
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
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
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
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
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
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
    RAISE 'No active session.' USING ERRCODE = 'DNOSE';
  END IF;

  IF _data IS NULL OR _data = '{}'::jsonb THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
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

  RAISE 'Unauthorized. Not allowed to set fields: %', _fields_list USING ERRCODE = 'DUNAU';
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
-- Name: agency_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.agency_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    subdomain_uuid_ uuid NOT NULL,
    name_ text NOT NULL,
    subscription_plan_uuid_ uuid NOT NULL,
    livemode_ boolean NOT NULL,
    default_pricing_currency_ text,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.agency_ OWNER TO postgres;

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
-- Name: credential_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.credential_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    agency_uuid_ uuid,
    name_ text NOT NULL,
    type_ text NOT NULL,
    data_ jsonb NOT NULL
);


ALTER TABLE application_.credential_ OWNER TO postgres;

--
-- Name: customer_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.customer_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text,
    email_address_ text NOT NULL,
    default_stripe_id_ext_ text NOT NULL,
    stripe_account_uuid_ uuid NOT NULL,
    user_uuid_ uuid,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.customer_ OWNER TO postgres;

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
-- Name: integration_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.integration_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL,
    credential_uuid_ uuid,
    data_ jsonb NOT NULL,
    integration_type_uuid_ uuid NOT NULL
);


ALTER TABLE application_.integration_ OWNER TO postgres;

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
-- Name: order_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.order_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_uuid_ uuid,
    stripe_account_uuid_ uuid NOT NULL,
    stripe_checkout_session_id_ext_ text,
    state_ public.processing_state_ NOT NULL,
    error_ text,
    ordered_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    processed_at_ timestamp with time zone
);


ALTER TABLE application_.order_ OWNER TO postgres;

--
-- Name: order_item_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.order_item_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    order_uuid_ uuid NOT NULL,
    price_uuid_ uuid NOT NULL,
    stripe_line_item_id_ext_ text,
    state_ public.processing_state_ NOT NULL,
    error_ text,
    processed_at_ timestamp with time zone
);


ALTER TABLE application_.order_item_ OWNER TO postgres;

--
-- Name: page_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.page_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL,
    page_definition_uuid_ uuid NOT NULL,
    access_ public.access_level_ DEFAULT 'agent'::public.access_level_ NOT NULL,
    product_uuid_ uuid,
    url_path_ text NOT NULL,
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
    after_uuid_ uuid,
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
    product_uuid_ uuid NOT NULL,
    type_ text GENERATED ALWAYS AS (application_.price_type_(recurring_interval_)) STORED,
    unit_amount_ integer NOT NULL,
    currency_ text NOT NULL,
    recurring_interval_ text,
    recurring_interval_count_ integer,
    status_ text DEFAULT 'draft'::text NOT NULL,
    stripe_price_id_ext_live_ text,
    stripe_price_id_ext_test_ text,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.price_ OWNER TO postgres;

--
-- Name: product_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.product_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL,
    name_ text NOT NULL,
    url_name_ text NOT NULL,
    status_ text DEFAULT 'draft'::text NOT NULL,
    description_ text,
    duration_ text,
    image_logo_uuid_ uuid,
    image_hero_uuid_ uuid,
    default_price_uuid_ uuid,
    markdown_description_uuid_ uuid,
    stripe_prod_id_ext_live_ text,
    stripe_prod_id_ext_test_ text,
    integration_uuid_ uuid,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.product_ OWNER TO postgres;

--
-- Name: product_thank_you_page_setting_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.product_thank_you_page_setting_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    product_uuid_ uuid NOT NULL,
    url_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.product_thank_you_page_setting_ OWNER TO postgres;

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
-- Name: stripe_account_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.stripe_account_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL,
    stripe_id_ext_ text NOT NULL,
    livemode_ boolean DEFAULT false,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.stripe_account_ OWNER TO postgres;

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
-- Name: webhook_event_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.webhook_event_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    id_ext_ text NOT NULL,
    source_ text NOT NULL,
    data_ jsonb NOT NULL,
    state_ public.processing_state_ NOT NULL,
    error_ text,
    agency_uuid_ uuid,
    event_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    livemode_ boolean NOT NULL,
    processed_at_ timestamp with time zone
);


ALTER TABLE application_.webhook_event_ OWNER TO postgres;

--
-- Name: agency_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.agency_ (
    uuid_ uuid,
    subdomain_uuid_ uuid,
    name_ text,
    subscription_plan_uuid_ uuid,
    livemode_ boolean,
    default_pricing_currency_ text,
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
-- Name: customer_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.customer_ (
    uuid_ uuid,
    name_ text,
    email_address_ text,
    default_stripe_id_ext_ text,
    stripe_account_uuid_ uuid,
    user_uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.customer_ OWNER TO postgres;

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
    product_uuid_ uuid,
    url_path_ text,
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
    product_uuid_ uuid,
    type_ text,
    unit_amount_ integer,
    currency_ text,
    recurring_interval_ text,
    recurring_interval_count_ integer,
    status_ text,
    stripe_price_id_ext_live_ text,
    stripe_price_id_ext_test_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.price_ OWNER TO postgres;

--
-- Name: product_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.product_ (
    uuid_ uuid,
    agency_uuid_ uuid,
    name_ text,
    url_name_ text,
    status_ text,
    description_ text,
    duration_ text,
    image_logo_uuid_ uuid,
    image_hero_uuid_ uuid,
    default_price_uuid_ uuid,
    markdown_description_uuid_ uuid,
    stripe_prod_id_ext_live_ text,
    stripe_prod_id_ext_test_ text,
    integration_uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.product_ OWNER TO postgres;

--
-- Name: product_thank_you_page_setting_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.product_thank_you_page_setting_ (
    uuid_ uuid,
    product_uuid_ uuid,
    url_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.product_thank_you_page_setting_ OWNER TO postgres;

--
-- Name: stripe_account_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.stripe_account_ (
    uuid_ uuid,
    agency_uuid_ uuid,
    stripe_id_ext_ text,
    livemode_ boolean,
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
    label_ text NOT NULL,
    sort_key_ real NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE internal_.form_field_ OWNER TO postgres;

--
-- Name: integration_type_; Type: TABLE; Schema: internal_; Owner: postgres
--

CREATE TABLE internal_.integration_type_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    form_uuid_ uuid,
    name_ text
);


ALTER TABLE internal_.integration_type_ OWNER TO postgres;

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
    default_block_uuids_ uuid[] DEFAULT '{}'::uuid[],
    url_path_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE internal_.page_definition_ OWNER TO postgres;

--
-- Name: subscription_plan_; Type: TABLE; Schema: internal_; Owner: postgres
--

CREATE TABLE internal_.subscription_plan_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    stripe_prod_id_ext_live_ text,
    stripe_prod_id_ext_test_ text,
    data_ jsonb DEFAULT '{}'::jsonb NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE internal_.subscription_plan_ OWNER TO postgres;

--
-- Name: transaction_fee_; Type: TABLE; Schema: internal_; Owner: postgres
--

CREATE TABLE internal_.transaction_fee_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    subscription_plan_uuid_ uuid NOT NULL,
    numerator_ integer DEFAULT 0 NOT NULL,
    denominator_ integer DEFAULT 10000 NOT NULL,
    fixed_amount_ integer DEFAULT 0 NOT NULL,
    currency_ text NOT NULL,
    transaction_amount_upper_bound_ integer,
    data_ jsonb DEFAULT '{}'::jsonb NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE internal_.transaction_fee_ OWNER TO postgres;

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
    label_ text,
    sort_key_ real,
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
    default_block_uuids_ uuid[],
    url_path_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE internal__audit_.page_definition_ OWNER TO postgres;

--
-- Name: subscription_plan_; Type: TABLE; Schema: internal__audit_; Owner: postgres
--

CREATE TABLE internal__audit_.subscription_plan_ (
    uuid_ uuid,
    name_ text,
    stripe_prod_id_ext_live_ text,
    stripe_prod_id_ext_test_ text,
    data_ jsonb,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE internal__audit_.subscription_plan_ OWNER TO postgres;

--
-- Name: transaction_fee_; Type: TABLE; Schema: internal__audit_; Owner: postgres
--

CREATE TABLE internal__audit_.transaction_fee_ (
    uuid_ uuid,
    subscription_plan_uuid_ uuid,
    numerator_ integer,
    denominator_ integer,
    fixed_amount_ integer,
    currency_ text,
    transaction_amount_upper_bound_ integer,
    data_ jsonb,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE internal__audit_.transaction_fee_ OWNER TO postgres;

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
-- Name: resource_token_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.resource_token_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    resource_uuid_ uuid,
    token_ text NOT NULL,
    keys_ text[] NOT NULL
);


ALTER TABLE security_.resource_token_ OWNER TO postgres;

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
-- Name: resource_definition_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.resource_definition_ (
    uuid_ uuid,
    id_prefix_ text,
    name_ text,
    table_ regclass,
    owner_uuid_ uuid,
    search_ text[],
    upsert_keys_ text[],
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.resource_definition_ OWNER TO postgres;

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
63bb3010-4ed1-40bb-a029-e4501e3b0bd7	2020-12-30 19:23:52.750455+00	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: form_field_; Type: TABLE DATA; Schema: internal_; Owner: postgres
--

COPY internal_.form_field_ (uuid_, name_, type_, form_uuid_, default_, label_, sort_key_, audit_at_, audit_session_uuid_) FROM stdin;
087ecce8-4fcf-4471-ae4c-ab4d8660a114	headline1	text	63bb3010-4ed1-40bb-a029-e4501e3b0bd7	"{agency.name}"	Headline 1	1	2021-02-10 16:54:06.308282+00	00000000-0000-0000-0000-000000000000
0f3fa468-e427-4477-a409-8a695fbabe34	paragraph	textarea	63bb3010-4ed1-40bb-a029-e4501e3b0bd7	"Services"	Paragraph	4	2021-02-10 16:54:06.308282+00	00000000-0000-0000-0000-000000000000
3ea3f1de-0144-4819-9ce4-c9c04c12e6dc	headline2	text	63bb3010-4ed1-40bb-a029-e4501e3b0bd7	"Services"	Headline 2	2	2021-02-10 16:54:06.308282+00	00000000-0000-0000-0000-000000000000
b78b6a5b-9034-4fef-acb1-b9cd6982a0da	imageSrc	text	63bb3010-4ed1-40bb-a029-e4501e3b0bd7	\N	Image URL	3	2021-02-10 16:54:06.308282+00	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: integration_type_; Type: TABLE DATA; Schema: internal_; Owner: postgres
--

COPY internal_.integration_type_ (uuid_, form_uuid_, name_) FROM stdin;
\.


--
-- Data for Name: page_block_definition_; Type: TABLE DATA; Schema: internal_; Owner: postgres
--

COPY internal_.page_block_definition_ (uuid_, name_, page_definition_uuid_, form_uuid_, audit_at_, audit_session_uuid_) FROM stdin;
3b91df48-2d20-4161-8528-4f47fb54208d	Hero with angled image	ab02480a-efd0-4aac-b54c-b800b08f0c02	63bb3010-4ed1-40bb-a029-e4501e3b0bd7	2020-12-30 19:23:52.750455+00	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: page_definition_; Type: TABLE DATA; Schema: internal_; Owner: postgres
--

COPY internal_.page_definition_ (uuid_, name_, default_block_uuids_, url_path_, audit_at_, audit_session_uuid_) FROM stdin;
ab02480a-efd0-4aac-b54c-b800b08f0c02	Home	{3b91df48-2d20-4161-8528-4f47fb54208d}	/	2021-01-01 10:57:09.10212+00	00000000-0000-0000-0000-000000000000
e5448fd9-d6e3-4ff5-af25-752d973134d8	Product	{}	/products/:product_url_name	2021-01-01 10:57:09.10212+00	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: subscription_plan_; Type: TABLE DATA; Schema: internal_; Owner: postgres
--

COPY internal_.subscription_plan_ (uuid_, name_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, data_, audit_at_, audit_session_uuid_) FROM stdin;
d1f741a6-1c1f-49c2-a87d-3cbbf18d5a2f	Basic plan	\N	\N	{}	2021-01-09 09:00:57.943771+00	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: transaction_fee_; Type: TABLE DATA; Schema: internal_; Owner: postgres
--

COPY internal_.transaction_fee_ (uuid_, subscription_plan_uuid_, numerator_, denominator_, fixed_amount_, currency_, transaction_amount_upper_bound_, data_, audit_at_, audit_session_uuid_) FROM stdin;
76a44284-0f69-4fca-bf3d-f3c79252efbd	d1f741a6-1c1f-49c2-a87d-3cbbf18d5a2f	100	10000	100	eur	10000	{}	2021-01-09 09:00:57.943771+00	00000000-0000-0000-0000-000000000000
623002cf-076b-447d-b393-d296bf3459dc	d1f741a6-1c1f-49c2-a87d-3cbbf18d5a2f	100	10000	0	eur	\N	{}	2021-01-09 09:00:57.943771+00	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: form_; Type: TABLE DATA; Schema: internal__audit_; Owner: postgres
--

COPY internal__audit_.form_ (uuid_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
63bb3010-4ed1-40bb-a029-e4501e3b0bd7	2020-12-30 19:23:52.750455+00	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: form_field_; Type: TABLE DATA; Schema: internal__audit_; Owner: postgres
--

COPY internal__audit_.form_field_ (uuid_, name_, type_, form_uuid_, default_, label_, sort_key_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
087ecce8-4fcf-4471-ae4c-ab4d8660a114	headline1	text	63bb3010-4ed1-40bb-a029-e4501e3b0bd7	"{agency.name}"	Headline 1	1	2021-02-10 16:54:06.308282+00	00000000-0000-0000-0000-000000000000	I
0f3fa468-e427-4477-a409-8a695fbabe34	paragraph	textarea	63bb3010-4ed1-40bb-a029-e4501e3b0bd7	"Services"	Paragraph	4	2021-02-10 16:54:06.308282+00	00000000-0000-0000-0000-000000000000	I
3ea3f1de-0144-4819-9ce4-c9c04c12e6dc	headline2	text	63bb3010-4ed1-40bb-a029-e4501e3b0bd7	"Services"	Headline 2	2	2021-02-10 16:54:06.308282+00	00000000-0000-0000-0000-000000000000	I
b78b6a5b-9034-4fef-acb1-b9cd6982a0da	imageSrc	text	63bb3010-4ed1-40bb-a029-e4501e3b0bd7	\N	Image URL	3	2021-02-10 16:54:06.308282+00	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: page_block_definition_; Type: TABLE DATA; Schema: internal__audit_; Owner: postgres
--

COPY internal__audit_.page_block_definition_ (uuid_, name_, page_definition_uuid_, form_uuid_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
3b91df48-2d20-4161-8528-4f47fb54208d	Hero with angled image	ab02480a-efd0-4aac-b54c-b800b08f0c02	63bb3010-4ed1-40bb-a029-e4501e3b0bd7	2020-12-30 19:23:52.750455+00	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: page_definition_; Type: TABLE DATA; Schema: internal__audit_; Owner: postgres
--

COPY internal__audit_.page_definition_ (uuid_, name_, default_block_uuids_, url_path_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
ab02480a-efd0-4aac-b54c-b800b08f0c02	Home	{3b91df48-2d20-4161-8528-4f47fb54208d}	/	2021-01-01 10:57:09.10212+00	00000000-0000-0000-0000-000000000000	I
e5448fd9-d6e3-4ff5-af25-752d973134d8	Product	{}	/products/:product_url_name	2021-01-01 10:57:09.10212+00	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: subscription_plan_; Type: TABLE DATA; Schema: internal__audit_; Owner: postgres
--

COPY internal__audit_.subscription_plan_ (uuid_, name_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, data_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
d1f741a6-1c1f-49c2-a87d-3cbbf18d5a2f	Basic plan	\N	\N	{}	2021-01-09 09:00:57.943771+00	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: transaction_fee_; Type: TABLE DATA; Schema: internal__audit_; Owner: postgres
--

COPY internal__audit_.transaction_fee_ (uuid_, subscription_plan_uuid_, numerator_, denominator_, fixed_amount_, currency_, transaction_amount_upper_bound_, data_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
76a44284-0f69-4fca-bf3d-f3c79252efbd	d1f741a6-1c1f-49c2-a87d-3cbbf18d5a2f	100	10000	100	eur	10000	{}	2021-01-09 09:00:57.943771+00	00000000-0000-0000-0000-000000000000	I
623002cf-076b-447d-b393-d296bf3459dc	d1f741a6-1c1f-49c2-a87d-3cbbf18d5a2f	100	10000	0	eur	\N	{}	2021-01-09 09:00:57.943771+00	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: operation_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.operation_ (uuid_, name_, log_events_, audit_at_, audit_session_uuid_) FROM stdin;
12ba3162-4b08-46cf-bf69-f8db5f6c291d	log_out_user_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
a1c956c8-b64e-41ba-af40-d3c16721b04e	log_in_user_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
7f2f5147-db6c-43cf-b0f0-2d68d56cba74	query_active_subject_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
44836e4b-ecd5-4184-a177-498b412ff251	query_user_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
6780b297-e2e5-48f5-b58d-a855b51a0fae	query_role_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
fdcd4f76-f55e-4f73-a063-57fac33976e9	query_resource_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
a4337d7b-9595-40c3-89c0-77787a394b72	query_resource_definition_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
9506e0e9-ee4a-4442-968a-76d9de05d2b3	query_current_user_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
ba39b019-2291-419e-baee-ed810d004ffc	query_resource_access_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
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
e84918a7-9e8e-4522-b400-4d258d8e1346	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	policy_.owner_can_change_name_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
cdc2d6a0-b00e-4763-bad3-d2b43bf0c3c0	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
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
ab3fa4a3-413f-449b-bfb5-ed4981ba1de2	7f589215-bdc7-4664-99c6-b7745349c352	policy_.agent_can_query_product_(security_.resource_definition_,application_.resource_)	query	95c81a39-4ede-4ebd-9485-502ba1ad9a68
0be43a88-13df-4bb2-8794-159800b90670	7f589215-bdc7-4664-99c6-b7745349c352	policy_.owner_can_create_product_(security_.resource_definition_,jsonb)	create	\N
37978625-4f1f-4c1a-a9da-0571a3e91fd4	7f589215-bdc7-4664-99c6-b7745349c352	policy_.owner_can_change_product_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
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
9cb7ba87-bc38-4ec0-ab7c-27328bf7d684	34f873e1-b837-4f1f-94d7-7bacf9c43d8d	policy_.serviceaccount_can_query_product_thank_you_page_setting_(security_.resource_definition_,application_.resource_)	query	\N
1d508b64-b0f4-4418-bf95-0bec7cc64cda	34f873e1-b837-4f1f-94d7-7bacf9c43d8d	policy_.agent_can_query_product_thank_you_page_setting_(security_.resource_definition_,application_.resource_)	query	9cb7ba87-bc38-4ec0-ab7c-27328bf7d684
50b54bad-9e8d-4e04-b71c-4596176e9258	6549cc83-4ce3-423d-88e1-263ac227608d	policy_.owner_can_create_agency_thank_you_page_setting_(security_.resource_definition_,jsonb)	create	\N
57aaadab-1383-4163-9da9-575c8b7ef82a	34f873e1-b837-4f1f-94d7-7bacf9c43d8d	policy_.owner_can_create_product_thank_you_page_setting_(security_.resource_definition_,jsonb)	create	\N
76e27529-d910-46ed-8e25-35d34a228b3e	6549cc83-4ce3-423d-88e1-263ac227608d	policy_.owner_can_change_agency_thank_you_page_setting_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
1fbcbd75-06d6-4eaf-95c2-513ebc712570	34f873e1-b837-4f1f-94d7-7bacf9c43d8d	policy_.owner_can_change_product_thank_you_page_setting_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
3905b875-0597-47e8-9084-36731c9e1610	6549cc83-4ce3-423d-88e1-263ac227608d	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
83fb2b29-e69e-476f-93dc-c5c68c5a7814	34f873e1-b837-4f1f-94d7-7bacf9c43d8d	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
026a7a57-3ed8-4c1b-93b5-0a0880ce255c	8248bebc-96c3-4f72-83df-ad4c68184470	policy_.anyone_can_query_form_(security_.resource_definition_,application_.resource_)	query	\N
c32871f2-1540-438e-b375-a7671d40a81f	cbe96769-7f38-4220-82fb-c746c634bc99	policy_.anyone_can_query_page_definition_(security_.resource_definition_,application_.resource_)	query	\N
6536c5ca-7960-42b5-ac89-ef75a1663b15	e61bae44-071d-4f80-9f53-c639f9b48661	policy_.anyone_can_query_page_block_definition_(security_.resource_definition_,application_.resource_)	query	\N
cacf6b3b-c992-4f31-bcb4-43f3d157249d	c042e657-0005-42a1-b3c2-6ee25d62fb33	policy_.anyone_can_query_form_field_(security_.resource_definition_,application_.resource_)	query	\N
60c14718-5559-47ae-ab3a-89bcef23c3fc	08b16cec-4d78-499a-a092-91fc2d360f86	policy_.can_query_page_based_on_access_level_(security_.resource_definition_,application_.resource_)	query	\N
0b410b7a-9a8e-4781-ac7e-83a18d6ba010	08b16cec-4d78-499a-a092-91fc2d360f86	policy_.owner_can_change_page_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
3c066f80-65b5-470b-987a-2de1ec7cd06d	bc2e81b9-be64-4068-ad32-3ed89151bbfa	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
15cc0e4e-c216-4410-b1ea-bd6a550353ca	bc2e81b9-be64-4068-ad32-3ed89151bbfa	policy_.can_query_page_block_based_on_page_access_level_(security_.resource_definition_,application_.resource_)	query	\N
2859ef7b-837f-4b6d-97ff-0e10c3d9acc1	bc2e81b9-be64-4068-ad32-3ed89151bbfa	policy_.owner_can_change_page_block_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
d0c11115-cef1-41c8-a9ca-5b57b0fa6dd3	bc2e81b9-be64-4068-ad32-3ed89151bbfa	policy_.owner_can_create_page_block_(security_.resource_definition_,jsonb)	create	\N
e4afc5be-e025-4485-9591-094891ede563	35bee174-fde7-4ae2-9cb2-4469b3eb8de5	policy_.anyone_can_query_subscription_plan_basic_fields_(security_.resource_definition_,application_.resource_)	query	\N
2ed2bb80-6df7-477c-bb03-5c61b696d8bc	35bee174-fde7-4ae2-9cb2-4469b3eb8de5	policy_.serviceaccount_can_query_subscription_plan_(security_.resource_definition_,application_.resource_)	query	e4afc5be-e025-4485-9591-094891ede563
1eea3d78-a0e3-48b1-86b0-b09249dab127	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	policy_.anyone_can_query_basic_agency_fields_(security_.resource_definition_,application_.resource_)	query	1b6b5685-c684-46a8-9e3a-bbe277cbde31
10d53e80-8f00-4af3-9bf3-c23cb47958c5	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	policy_.agent_can_query_agency_subscription_plan_(security_.resource_definition_,application_.resource_)	query	\N
1b6b5685-c684-46a8-9e3a-bbe277cbde31	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	policy_.serviceaccount_can_query_agency_subscription_plan_(security_.resource_definition_,application_.resource_)	query	10d53e80-8f00-4af3-9bf3-c23cb47958c5
4b67f569-b5a9-4377-b5c3-a623de78ed2b	76b04264-d560-48af-b49b-4440e96d3fc3	policy_.serviceaccount_can_query_transaction_fee_(security_.resource_definition_,application_.resource_)	query	\N
fd0f32d1-1c12-483c-9563-1141abcf042d	3d67b094-a2d5-475e-ac1b-6a98d3e49c5e	policy_.owner_can_create_customer_(security_.resource_definition_,jsonb)	create	\N
cd333795-a077-4e13-a0ab-4d79253c937c	3d67b094-a2d5-475e-ac1b-6a98d3e49c5e	policy_.serviceaccount_can_create_customer_(security_.resource_definition_,jsonb)	create	fd0f32d1-1c12-483c-9563-1141abcf042d
f1a07913-fd07-45e9-b5ce-7fc49bd82280	3d67b094-a2d5-475e-ac1b-6a98d3e49c5e	policy_.agent_can_query_customer_(security_.resource_definition_,application_.resource_)	query	\N
80345f82-f4f2-4580-bf4b-8653661bc391	3d67b094-a2d5-475e-ac1b-6a98d3e49c5e	policy_.serviceaccount_can_query_customer_(security_.resource_definition_,application_.resource_)	query	f1a07913-fd07-45e9-b5ce-7fc49bd82280
3dd797d2-e9f0-428e-a205-72c1115819cd	3d67b094-a2d5-475e-ac1b-6a98d3e49c5e	policy_.owner_can_change_customer_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
6d262149-75c1-460d-aa1f-37742c1eb59d	3d67b094-a2d5-475e-ac1b-6a98d3e49c5e	policy_.serviceaccount_can_change_customer_(security_.resource_definition_,application_.resource_,jsonb)	update	3dd797d2-e9f0-428e-a205-72c1115819cd
6cb5b5bd-e93f-425c-b3f3-fa8623d95cd7	3d67b094-a2d5-475e-ac1b-6a98d3e49c5e	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
e0877c45-1207-44cc-ba7a-3c1cc9dde4a7	58c5bb7f-ddc0-4d71-a5ff-7f22b2d1c925	policy_.serviceaccount_can_query_webhook_event_(security_.resource_definition_,application_.resource_)	query	\N
77aa3647-a327-452d-9703-77268b1c8826	58c5bb7f-ddc0-4d71-a5ff-7f22b2d1c925	policy_.serviceaccount_can_create_webhook_event_(security_.resource_definition_,jsonb)	create	\N
cee806e5-9134-4ebe-bae6-fd232c61200b	58c5bb7f-ddc0-4d71-a5ff-7f22b2d1c925	policy_.serviceaccount_can_change_webhook_event_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
63b8e82d-58c3-464b-8fdc-fc8f213ba352	58c5bb7f-ddc0-4d71-a5ff-7f22b2d1c925	policy_.delete_forbidden_(security_.resource_definition_,application_.resource_)	delete	\N
6cdcc14c-c341-4da4-917f-3ff050c3183b	20c1d214-27e8-4805-b645-2e5a00f32486	policy_.agent_can_query_order_(security_.resource_definition_,application_.resource_)	query	\N
f03f8ac4-170e-4d35-a00c-f93d407bd605	20c1d214-27e8-4805-b645-2e5a00f32486	policy_.serviceaccount_can_query_order_(security_.resource_definition_,application_.resource_)	query	6cdcc14c-c341-4da4-917f-3ff050c3183b
09810f00-aee9-4e1f-a38b-20d55db0fd9d	20c1d214-27e8-4805-b645-2e5a00f32486	policy_.owner_can_create_order_(security_.resource_definition_,jsonb)	create	\N
f091ac1c-d855-4948-a1f7-c666346fae0c	20c1d214-27e8-4805-b645-2e5a00f32486	policy_.serviceaccount_can_create_order_(security_.resource_definition_,jsonb)	create	09810f00-aee9-4e1f-a38b-20d55db0fd9d
6b5534b5-5bca-460e-9c51-a37b4a8b1f45	20c1d214-27e8-4805-b645-2e5a00f32486	policy_.owner_can_change_order_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
cc9d3837-7b8c-4940-b62e-b378ac6605c7	20c1d214-27e8-4805-b645-2e5a00f32486	policy_.serviceaccount_can_change_order_(security_.resource_definition_,application_.resource_,jsonb)	update	6b5534b5-5bca-460e-9c51-a37b4a8b1f45
6374e460-0c1f-4519-8c47-1441d41c67ed	20c1d214-27e8-4805-b645-2e5a00f32486	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
d05aed6b-6cb5-4642-803d-7747dc9e5e5f	38d32095-8cfa-4e0e-92f8-079fb73002eb	policy_.owner_can_create_credential_(security_.resource_definition_,jsonb)	create	\N
1a14571b-c7ca-4ce3-bb13-220d41caf44c	38d32095-8cfa-4e0e-92f8-079fb73002eb	policy_.owner_can_change_credential_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
ffcc1f8e-5131-4264-bfd6-2339208f0302	38d32095-8cfa-4e0e-92f8-079fb73002eb	policy_.owner_can_query_credential_(security_.resource_definition_,application_.resource_)	query	\N
627b3fdd-725e-400e-81f6-278ece7898c5	38d32095-8cfa-4e0e-92f8-079fb73002eb	policy_.serviceaccount_can_query_credential_(security_.resource_definition_,application_.resource_)	query	ffcc1f8e-5131-4264-bfd6-2339208f0302
34e4e9e2-7d20-433e-93a7-a431452e7156	38d32095-8cfa-4e0e-92f8-079fb73002eb	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
d1acaebc-ceab-4120-a4bd-58132426171a	d3def2c7-9265-4a3c-8473-0a0f071c4193	policy_.owner_can_create_integration_(security_.resource_definition_,jsonb)	create	\N
2cf2bcf5-c619-4e4a-bdbf-777eb08b9a92	d3def2c7-9265-4a3c-8473-0a0f071c4193	policy_.owner_can_change_integration_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
2db0ef77-7432-42f5-8def-e3491bd3d26d	d3def2c7-9265-4a3c-8473-0a0f071c4193	policy_.owner_can_query_integration_(security_.resource_definition_,application_.resource_)	query	\N
c3a5aaf2-d9a0-481b-98ec-ce34c2c65cd3	d3def2c7-9265-4a3c-8473-0a0f071c4193	policy_.serviceaccount_can_query_integration_(security_.resource_definition_,application_.resource_)	query	2db0ef77-7432-42f5-8def-e3491bd3d26d
09e2dde5-d0ef-4c9d-9154-1b89b10c9bf5	d3def2c7-9265-4a3c-8473-0a0f071c4193	policy_.only_owner_can_delete_(security_.resource_definition_,application_.resource_)	delete	\N
cecd71c9-7e74-46ad-8fba-6aa5ac8ec3ca	7f589215-bdc7-4664-99c6-b7745349c352	policy_.serviceaccount_can_query_product_(security_.resource_definition_,application_.resource_)	query	\N
72066618-a466-4b71-965f-891edcb33c6f	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	policy_.owner_can_change_name_(security_.resource_definition_,application_.resource_,jsonb)	update	6f79da26-c71b-4560-91d0-cbd05150e062
95c81a39-4ede-4ebd-9485-502ba1ad9a68	7f589215-bdc7-4664-99c6-b7745349c352	policy_.anyone_can_query_live_product_(security_.resource_definition_,application_.resource_)	query	cecd71c9-7e74-46ad-8fba-6aa5ac8ec3ca
be8e7191-40dc-4a22-aced-d3d4416991f6	677e43b0-6a66-4f84-b857-938f462fdf90	policy_.serviceaccount_can_create_order_item_(security_.resource_definition_,jsonb)	create	\N
b509686c-6e80-4454-bb68-3ddaf855590d	677e43b0-6a66-4f84-b857-938f462fdf90	policy_.serviceaccount_can_change_order_item_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
1b999022-6a49-4fb2-bf34-3f507a0e5ddb	677e43b0-6a66-4f84-b857-938f462fdf90	policy_.owner_can_query_order_item_(security_.resource_definition_,application_.resource_)	query	\N
142ccd96-d14a-413e-abbc-d08f9c1d9ffb	677e43b0-6a66-4f84-b857-938f462fdf90	policy_.serviceaccount_can_query_order_item_(security_.resource_definition_,application_.resource_)	query	1b999022-6a49-4fb2-bf34-3f507a0e5ddb
92343770-3065-48f4-8de9-b48ce1a9257e	30e49b72-e52a-467d-8300-8b5051f32d9a	policy_.anyone_can_query_integration_type_(security_.resource_definition_,application_.resource_)	query	\N
c9f182bb-10ac-40a0-b8dc-107ed4f88d1d	30e49b72-e52a-467d-8300-8b5051f32d9a	policy_.delete_forbidden_(security_.resource_definition_,application_.resource_)	delete	\N
6f79da26-c71b-4560-91d0-cbd05150e062	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	policy_.owner_can_change_agency_(security_.resource_definition_,application_.resource_,jsonb)	update	\N
\.


--
-- Data for Name: policy_assignment_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.policy_assignment_ (uuid_, policy_name_, operation_uuid_, type_, audit_at_, audit_session_uuid_) FROM stdin;
685c3913-3fff-4345-865c-d3e4026321ed	visitor_	a1c956c8-b64e-41ba-af40-d3c16721b04e	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
f9e2b169-903d-4e9c-ae20-b397489875dd	logged_in_	12ba3162-4b08-46cf-bf69-f8db5f6c291d	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
b987a658-ec1d-4761-ba88-1b271d0ce51f	visitor_	7f2f5147-db6c-43cf-b0f0-2d68d56cba74	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
04793c21-c83f-4b7b-805d-c100578cb652	logged_in_	7f2f5147-db6c-43cf-b0f0-2d68d56cba74	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
fc380d88-74e8-4863-b95f-e2bfdcf45235	logged_in_	a1c956c8-b64e-41ba-af40-d3c16721b04e	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
9c17e5e7-3043-4cc3-b2ca-5e635883b121	logged_in_	fdcd4f76-f55e-4f73-a063-57fac33976e9	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
df7169dc-3ef6-4e89-b749-9d96216f37f4	visitor_	fdcd4f76-f55e-4f73-a063-57fac33976e9	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
a8c86986-75c9-4f7a-b4ea-e18280bb56c6	logged_in_	a4337d7b-9595-40c3-89c0-77787a394b72	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
ce8318f6-3d8d-4e08-ac17-e1ff187b87a9	visitor_	a4337d7b-9595-40c3-89c0-77787a394b72	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
61729bd8-0be4-4bdc-a602-72fd08383f5f	logged_in_	9506e0e9-ee4a-4442-968a-76d9de05d2b3	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
da286841-dd4c-4a92-a772-253bce497514	visitor_	9506e0e9-ee4a-4442-968a-76d9de05d2b3	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
4682e137-bca9-4772-8b3e-dd5727add654	logged_in_	ba39b019-2291-419e-baee-ed810d004ffc	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: resource_definition_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.resource_definition_ (uuid_, id_prefix_, name_, table_, owner_uuid_, search_, upsert_keys_, audit_at_, audit_session_uuid_) FROM stdin;
e79b9bed-9dcc-4e83-b2f8-09b134da1a03	sub	subdomain	security_.subdomain_	\N	{uuid_,name_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
957c84e9-e472-4ec3-9dc6-e1a828f6d07f	agcy	agency	application_.agency_	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	{uuid_,name_,subdomain_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
88bcb8b1-3826-4bcd-81af-ce4f683c5285	theme	theme	application_.theme_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_,agency_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
2d77f11c-8271-4c07-a6b4-3e7ac2ae8378	img	image	application_.image_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
f8c5e08d-cd10-466e-9233-ae0e2ddbe81a	user	user	security_.user_	\N	{uuid_,name_,email_address_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
3b56d171-3e69-41ca-9a98-d1a3abc9170b	su	sign up	application_.sign_up_	\N	{verification_code_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
edc5f82c-c991-494c-90f0-cf6163902f40	pwd	password reset	application_.password_reset_	f8c5e08d-cd10-466e-9233-ae0e2ddbe81a	{verification_code_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
7f589215-bdc7-4664-99c6-b7745349c352	prod	product	application_.product_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_,url_name_,agency_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
d8f70962-229d-49eb-a99e-7c35a55719d5	md	markdown	application_.markdown_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_,agency_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
b54431c5-bbc4-47b6-9810-0a627e49cfe5	member	membership	application_.membership_	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	{uuid_,user_uuid_,subdomain_uuid_,access_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
94a1ec9c-d7a6-4327-8221-6f00c6c09ccf	notidef	notification definition	application_.notification_definition_	\N	{uuid_,name_,stripe_event_,feed_notification_enabled_,email_notifications_enabled_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
f8e2c163-8ebf-45dc-90b8-b850e1590c7c	set	user notification setting	application_.user_notification_setting_	f8c5e08d-cd10-466e-9233-ae0e2ddbe81a	{uuid_,user_uuid_,subdomain_uuid_,notification_definition_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
8248bebc-96c3-4f72-83df-ad4c68184470	form	form	internal_.form_	\N	{uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
6549cc83-4ce3-423d-88e1-263ac227608d	set	agency thank you page setting	application_.agency_thank_you_page_setting_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,agency_uuid_,url_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
e61bae44-071d-4f80-9f53-c639f9b48661	pblkdef	page block definition	internal_.page_block_definition_	cbe96769-7f38-4220-82fb-c746c634bc99	{uuid_,name_,page_definition_uuid_,form_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
34f873e1-b837-4f1f-94d7-7bacf9c43d8d	set	product thank you page setting	application_.product_thank_you_page_setting_	7f589215-bdc7-4664-99c6-b7745349c352	{uuid_,product_uuid_,url_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
c042e657-0005-42a1-b3c2-6ee25d62fb33	formfld	form field	internal_.form_field_	8248bebc-96c3-4f72-83df-ad4c68184470	{uuid_,name_,form_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
bc2e81b9-be64-4068-ad32-3ed89151bbfa	pblk	page block	application_.page_block_	08b16cec-4d78-499a-a092-91fc2d360f86	{uuid_,page_block_definition_uuid_,page_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
76b04264-d560-48af-b49b-4440e96d3fc3	txnfee	transaction fee	internal_.transaction_fee_	35bee174-fde7-4ae2-9cb2-4469b3eb8de5	{uuid_,subscription_plan_uuid_,transaction_amount_upper_bound_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
cbe96769-7f38-4220-82fb-c746c634bc99	pagedef	page definition	internal_.page_definition_	\N	{uuid_,name_,url_path_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
08b16cec-4d78-499a-a092-91fc2d360f86	page	page	application_.page_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,agency_uuid_,product_uuid_,url_path_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
3c7e93d6-b141-423a-a7e9-e11a734b3474	stripe	stripe account	application_.stripe_account_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,agency_uuid_,stripe_id_ext_,livemode_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
35bee174-fde7-4ae2-9cb2-4469b3eb8de5	subplan	subscription plan	internal_.subscription_plan_	\N	{uuid_,name_,stripe_prod_id_ext_live_,stripe_prod_id_ext_test_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
3d67b094-a2d5-475e-ac1b-6a98d3e49c5e	cus	customer	application_.customer_	3c7e93d6-b141-423a-a7e9-e11a734b3474	{uuid_,name_,email_address_,default_stripe_id_ext_,stripe_account_uuid_,user_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
58c5bb7f-ddc0-4d71-a5ff-7f22b2d1c925	whevt	webhook event	application_.webhook_event_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,id_ext_,source_,livemode_,agency_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000
f3e5569e-c28d-40e6-b1ca-698fb48e6ba3	price	price	application_.price_	7f589215-bdc7-4664-99c6-b7745349c352	{product_uuid_,stripe_price_id_ext_live_,stripe_price_id_ext_test_}	\N	2021-02-17 14:48:13.97898+00	00000000-0000-0000-0000-000000000000
20c1d214-27e8-4805-b645-2e5a00f32486	ord	order	application_.order_	3c7e93d6-b141-423a-a7e9-e11a734b3474	{uuid_,customer_uuid_,stripe_account_uuid_,stripe_checkout_session_id_ext_}	\N	2021-02-20 18:02:47.892503+00	00000000-0000-0000-0000-000000000000
38d32095-8cfa-4e0e-92f8-079fb73002eb	cred	credential	application_.credential_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,agency_uuid_,type_,name_}	\N	2021-03-04 14:04:59.110539+00	00000000-0000-0000-0000-000000000000
d3def2c7-9265-4a3c-8473-0a0f071c4193	inte	integration	application_.integration_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_,agency_uuid_}	\N	2021-03-05 15:24:22.112531+00	00000000-0000-0000-0000-000000000000
677e43b0-6a66-4f84-b857-938f462fdf90	orditm	order item	application_.order_item_	20c1d214-27e8-4805-b645-2e5a00f32486	{uuid_,order_uuid_,stripe_line_item_id_ext_}	\N	2021-03-07 08:06:08.312786+00	00000000-0000-0000-0000-000000000000
30e49b72-e52a-467d-8300-8b5051f32d9a	intetype	integration type	internal_.integration_type_	\N	{uuid_,form_uuid_,name_}	\N	2021-03-31 14:03:52.464206+00	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: resource_token_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.resource_token_ (uuid_, resource_uuid_, token_, keys_) FROM stdin;
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
12ba3162-4b08-46cf-bf69-f8db5f6c291d	log_out_user_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
a1c956c8-b64e-41ba-af40-d3c16721b04e	log_in_user_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
7f2f5147-db6c-43cf-b0f0-2d68d56cba74	query_active_subject_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
44836e4b-ecd5-4184-a177-498b412ff251	query_user_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
6780b297-e2e5-48f5-b58d-a855b51a0fae	query_role_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
fdcd4f76-f55e-4f73-a063-57fac33976e9	query_resource_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
a4337d7b-9595-40c3-89c0-77787a394b72	query_resource_definition_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
9506e0e9-ee4a-4442-968a-76d9de05d2b3	query_current_user_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
ba39b019-2291-419e-baee-ed810d004ffc	query_resource_access_	f	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
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
685c3913-3fff-4345-865c-d3e4026321ed	visitor_	a1c956c8-b64e-41ba-af40-d3c16721b04e	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
f9e2b169-903d-4e9c-ae20-b397489875dd	logged_in_	12ba3162-4b08-46cf-bf69-f8db5f6c291d	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
b987a658-ec1d-4761-ba88-1b271d0ce51f	visitor_	7f2f5147-db6c-43cf-b0f0-2d68d56cba74	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
04793c21-c83f-4b7b-805d-c100578cb652	logged_in_	7f2f5147-db6c-43cf-b0f0-2d68d56cba74	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
fc380d88-74e8-4863-b95f-e2bfdcf45235	logged_in_	a1c956c8-b64e-41ba-af40-d3c16721b04e	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
9c17e5e7-3043-4cc3-b2ca-5e635883b121	logged_in_	fdcd4f76-f55e-4f73-a063-57fac33976e9	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
df7169dc-3ef6-4e89-b749-9d96216f37f4	visitor_	fdcd4f76-f55e-4f73-a063-57fac33976e9	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
a8c86986-75c9-4f7a-b4ea-e18280bb56c6	logged_in_	a4337d7b-9595-40c3-89c0-77787a394b72	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
ce8318f6-3d8d-4e08-ac17-e1ff187b87a9	visitor_	a4337d7b-9595-40c3-89c0-77787a394b72	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
61729bd8-0be4-4bdc-a602-72fd08383f5f	logged_in_	9506e0e9-ee4a-4442-968a-76d9de05d2b3	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
da286841-dd4c-4a92-a772-253bce497514	visitor_	9506e0e9-ee4a-4442-968a-76d9de05d2b3	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
4682e137-bca9-4772-8b3e-dd5727add654	logged_in_	ba39b019-2291-419e-baee-ed810d004ffc	allow	2021-01-09 11:43:57.609576+00	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: resource_definition_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.resource_definition_ (uuid_, id_prefix_, name_, table_, owner_uuid_, search_, upsert_keys_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
e79b9bed-9dcc-4e83-b2f8-09b134da1a03	sub	subdomain	security_.subdomain_	\N	{uuid_,name_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
957c84e9-e472-4ec3-9dc6-e1a828f6d07f	agcy	agency	application_.agency_	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	{uuid_,name_,subdomain_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
88bcb8b1-3826-4bcd-81af-ce4f683c5285	theme	theme	application_.theme_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_,agency_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
2d77f11c-8271-4c07-a6b4-3e7ac2ae8378	img	image	application_.image_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
f8c5e08d-cd10-466e-9233-ae0e2ddbe81a	user	user	security_.user_	\N	{uuid_,name_,email_address_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
3b56d171-3e69-41ca-9a98-d1a3abc9170b	su	sign up	application_.sign_up_	\N	{verification_code_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
edc5f82c-c991-494c-90f0-cf6163902f40	pwd	password reset	application_.password_reset_	f8c5e08d-cd10-466e-9233-ae0e2ddbe81a	{verification_code_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
7f589215-bdc7-4664-99c6-b7745349c352	prod	product	application_.product_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_,url_name_,agency_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
d8f70962-229d-49eb-a99e-7c35a55719d5	md	markdown	application_.markdown_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_,agency_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
b54431c5-bbc4-47b6-9810-0a627e49cfe5	member	membership	application_.membership_	e79b9bed-9dcc-4e83-b2f8-09b134da1a03	{uuid_,user_uuid_,subdomain_uuid_,access_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
f3e5569e-c28d-40e6-b1ca-698fb48e6ba3	price	price	application_.price_	7f589215-bdc7-4664-99c6-b7745349c352	{uuid_,product_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
94a1ec9c-d7a6-4327-8221-6f00c6c09ccf	notidef	notification definition	application_.notification_definition_	\N	{uuid_,name_,stripe_event_,feed_notification_enabled_,email_notifications_enabled_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
f8e2c163-8ebf-45dc-90b8-b850e1590c7c	set	user notification setting	application_.user_notification_setting_	f8c5e08d-cd10-466e-9233-ae0e2ddbe81a	{uuid_,user_uuid_,subdomain_uuid_,notification_definition_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
8248bebc-96c3-4f72-83df-ad4c68184470	form	form	internal_.form_	\N	{uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
6549cc83-4ce3-423d-88e1-263ac227608d	set	agency thank you page setting	application_.agency_thank_you_page_setting_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,agency_uuid_,url_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
e61bae44-071d-4f80-9f53-c639f9b48661	pblkdef	page block definition	internal_.page_block_definition_	cbe96769-7f38-4220-82fb-c746c634bc99	{uuid_,name_,page_definition_uuid_,form_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
34f873e1-b837-4f1f-94d7-7bacf9c43d8d	set	product thank you page setting	application_.product_thank_you_page_setting_	7f589215-bdc7-4664-99c6-b7745349c352	{uuid_,product_uuid_,url_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
c042e657-0005-42a1-b3c2-6ee25d62fb33	formfld	form field	internal_.form_field_	8248bebc-96c3-4f72-83df-ad4c68184470	{uuid_,name_,form_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
bc2e81b9-be64-4068-ad32-3ed89151bbfa	pblk	page block	application_.page_block_	08b16cec-4d78-499a-a092-91fc2d360f86	{uuid_,page_block_definition_uuid_,page_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
76b04264-d560-48af-b49b-4440e96d3fc3	txnfee	transaction fee	internal_.transaction_fee_	35bee174-fde7-4ae2-9cb2-4469b3eb8de5	{uuid_,subscription_plan_uuid_,transaction_amount_upper_bound_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
cbe96769-7f38-4220-82fb-c746c634bc99	pagedef	page definition	internal_.page_definition_	\N	{uuid_,name_,url_path_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
08b16cec-4d78-499a-a092-91fc2d360f86	page	page	application_.page_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,agency_uuid_,product_uuid_,url_path_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
3c7e93d6-b141-423a-a7e9-e11a734b3474	stripe	stripe account	application_.stripe_account_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,agency_uuid_,stripe_id_ext_,livemode_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
35bee174-fde7-4ae2-9cb2-4469b3eb8de5	subplan	subscription plan	internal_.subscription_plan_	\N	{uuid_,name_,stripe_prod_id_ext_live_,stripe_prod_id_ext_test_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
3d67b094-a2d5-475e-ac1b-6a98d3e49c5e	cus	customer	application_.customer_	3c7e93d6-b141-423a-a7e9-e11a734b3474	{uuid_,name_,email_address_,default_stripe_id_ext_,stripe_account_uuid_,user_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
58c5bb7f-ddc0-4d71-a5ff-7f22b2d1c925	whevt	webhook event	application_.webhook_event_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,id_ext_,source_,livemode_,agency_uuid_}	\N	2021-02-06 09:56:51.587869+00	00000000-0000-0000-0000-000000000000	I
f3e5569e-c28d-40e6-b1ca-698fb48e6ba3	price	price	application_.price_	7f589215-bdc7-4664-99c6-b7745349c352	{product_uuid_,stripe_price_id_ext_live_,stripe_price_id_ext_test_}	\N	2021-02-17 14:48:13.97898+00	00000000-0000-0000-0000-000000000000	U
20c1d214-27e8-4805-b645-2e5a00f32486	ord	order	application_.order_	3c7e93d6-b141-423a-a7e9-e11a734b3474	{uuid_,customer_uuid_,stripe_account_uuid_,stripe_checkout_session_id_ext_}	\N	2021-02-20 18:02:47.892503+00	00000000-0000-0000-0000-000000000000	I
38d32095-8cfa-4e0e-92f8-079fb73002eb	cred	credential	application_.credential_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,agency_uuid_,type_,key_}	\N	2021-03-02 15:13:00.997849+00	00000000-0000-0000-0000-000000000000	I
38d32095-8cfa-4e0e-92f8-079fb73002eb	cred	credential	application_.credential_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,agency_uuid_,type_,name_}	\N	2021-03-04 14:04:59.110539+00	00000000-0000-0000-0000-000000000000	U
d3def2c7-9265-4a3c-8473-0a0f071c4193	inte	integration	application_.integration_	957c84e9-e472-4ec3-9dc6-e1a828f6d07f	{uuid_,name_,agency_uuid_}	\N	2021-03-05 15:24:22.112531+00	00000000-0000-0000-0000-000000000000	I
677e43b0-6a66-4f84-b857-938f462fdf90	orditm	order item	application_.order_item_	20c1d214-27e8-4805-b645-2e5a00f32486	{uuid_,order_uuid_,stripe_line_item_id_ext_}	\N	2021-03-07 08:06:08.312786+00	00000000-0000-0000-0000-000000000000	I
30e49b72-e52a-467d-8300-8b5051f32d9a	intetype	integration type	internal_.integration_type_	\N	{uuid_,form_uuid_,name_}	\N	2021-03-31 14:03:52.464206+00	00000000-0000-0000-0000-000000000000	I
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
-- Name: credential_ credential__agency_uuid__name__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.credential_
    ADD CONSTRAINT credential__agency_uuid__name__key UNIQUE (agency_uuid_, name_);


--
-- Name: credential_ credential__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.credential_
    ADD CONSTRAINT credential__pkey PRIMARY KEY (uuid_);


--
-- Name: customer_ customer__default_stripe_id_ext__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.customer_
    ADD CONSTRAINT customer__default_stripe_id_ext__key UNIQUE (default_stripe_id_ext_);


--
-- Name: customer_ customer__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.customer_
    ADD CONSTRAINT customer__pkey PRIMARY KEY (uuid_);


--
-- Name: customer_ customer__stripe_account_uuid__email_address__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.customer_
    ADD CONSTRAINT customer__stripe_account_uuid__email_address__key UNIQUE (stripe_account_uuid_, email_address_);


--
-- Name: image_ image__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.image_
    ADD CONSTRAINT image__pkey PRIMARY KEY (uuid_);


--
-- Name: integration_ integration__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.integration_
    ADD CONSTRAINT integration__pkey PRIMARY KEY (uuid_);


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
-- Name: order_ order__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.order_
    ADD CONSTRAINT order__pkey PRIMARY KEY (uuid_);


--
-- Name: order_item_ order_item__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.order_item_
    ADD CONSTRAINT order_item__pkey PRIMARY KEY (uuid_);


--
-- Name: order_item_ order_item__stripe_line_item_id_ext__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.order_item_
    ADD CONSTRAINT order_item__stripe_line_item_id_ext__key UNIQUE (stripe_line_item_id_ext_);


--
-- Name: page_ page__page_definition_uuid__agency_uuid__product_uuid__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_
    ADD CONSTRAINT page__page_definition_uuid__agency_uuid__product_uuid__key UNIQUE (page_definition_uuid_, agency_uuid_, product_uuid_);


--
-- Name: page_ page__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_
    ADD CONSTRAINT page__pkey PRIMARY KEY (uuid_);


--
-- Name: page_ page__url_path__agency_uuid__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_
    ADD CONSTRAINT page__url_path__agency_uuid__key UNIQUE (url_path_, agency_uuid_);


--
-- Name: page_block_ page_block__after_uuid__page_uuid__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_block_
    ADD CONSTRAINT page_block__after_uuid__page_uuid__key UNIQUE (after_uuid_, page_uuid_) DEFERRABLE INITIALLY DEFERRED;


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
-- Name: product_ product__agency_uuid__name__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.product_
    ADD CONSTRAINT product__agency_uuid__name__key UNIQUE (agency_uuid_, name_);


--
-- Name: product_ product__agency_uuid__url_name__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.product_
    ADD CONSTRAINT product__agency_uuid__url_name__key UNIQUE (agency_uuid_, url_name_);


--
-- Name: product_ product__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.product_
    ADD CONSTRAINT product__pkey PRIMARY KEY (uuid_);


--
-- Name: product_thank_you_page_setting_ product_thank_you_page_setting__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.product_thank_you_page_setting_
    ADD CONSTRAINT product_thank_you_page_setting__pkey PRIMARY KEY (uuid_);


--
-- Name: product_thank_you_page_setting_ product_thank_you_page_setting__product_uuid__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.product_thank_you_page_setting_
    ADD CONSTRAINT product_thank_you_page_setting__product_uuid__key UNIQUE (product_uuid_);


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
-- Name: stripe_account_ stripe_account__agency_uuid__livemode__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.stripe_account_
    ADD CONSTRAINT stripe_account__agency_uuid__livemode__key UNIQUE (agency_uuid_, livemode_);


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
-- Name: webhook_event_ webhook_event__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.webhook_event_
    ADD CONSTRAINT webhook_event__pkey PRIMARY KEY (uuid_);


--
-- Name: webhook_event_ webhook_event__source__id_ext__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.webhook_event_
    ADD CONSTRAINT webhook_event__source__id_ext__key UNIQUE (source_, id_ext_);


--
-- Name: form_ form__pkey; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.form_
    ADD CONSTRAINT form__pkey PRIMARY KEY (uuid_);


--
-- Name: form_field_ form_field__form_uuid__sort_key__key; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.form_field_
    ADD CONSTRAINT form_field__form_uuid__sort_key__key UNIQUE (form_uuid_, sort_key_);


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
-- Name: integration_type_ integration_type__name__key; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.integration_type_
    ADD CONSTRAINT integration_type__name__key UNIQUE (name_);


--
-- Name: integration_type_ integration_type__pkey; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.integration_type_
    ADD CONSTRAINT integration_type__pkey PRIMARY KEY (uuid_);


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
-- Name: page_definition_ page_definition__url_path__key; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.page_definition_
    ADD CONSTRAINT page_definition__url_path__key UNIQUE (url_path_);


--
-- Name: subscription_plan_ subscription_plan__name__key; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.subscription_plan_
    ADD CONSTRAINT subscription_plan__name__key UNIQUE (name_);


--
-- Name: subscription_plan_ subscription_plan__pkey; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.subscription_plan_
    ADD CONSTRAINT subscription_plan__pkey PRIMARY KEY (uuid_);


--
-- Name: transaction_fee_ transaction_fee__pkey; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.transaction_fee_
    ADD CONSTRAINT transaction_fee__pkey PRIMARY KEY (uuid_);


--
-- Name: transaction_fee_ transaction_fee__subscription_plan_uuid__transaction_amount_key; Type: CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.transaction_fee_
    ADD CONSTRAINT transaction_fee__subscription_plan_uuid__transaction_amount_key UNIQUE (subscription_plan_uuid_, transaction_amount_upper_bound_);


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
-- Name: resource_token_ resource_token__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.resource_token_
    ADD CONSTRAINT resource_token__pkey PRIMARY KEY (uuid_);


--
-- Name: resource_token_ resource_token__resource_uuid__token__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.resource_token_
    ADD CONSTRAINT resource_token__resource_uuid__token__key UNIQUE (resource_uuid_, token_);


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
-- Name: customer_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.customer_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


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
-- Name: product_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.product_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: product_thank_you_page_setting_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.product_thank_you_page_setting_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


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
-- Name: image_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.image_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: product_ tr_after_delete_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_jsonb_ AFTER DELETE ON application_.product_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


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
-- Name: credential_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.credential_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: customer_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.customer_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: image_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.image_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: integration_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.integration_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: markdown_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.markdown_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: notification_definition_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.notification_definition_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: order_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.order_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: order_item_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.order_item_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


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
-- Name: product_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.product_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: product_thank_you_page_setting_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.product_thank_you_page_setting_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


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
-- Name: webhook_event_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON application_.webhook_event_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: agency_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: agency_thank_you_page_setting_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.agency_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: customer_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.customer_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


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
-- Name: product_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.product_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: product_thank_you_page_setting_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.product_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


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
-- Name: agency_ tr_after_insert_insert_agency_home_page_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_insert_agency_home_page_ AFTER INSERT ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_agency_home_page_();


--
-- Name: page_ tr_after_insert_insert_page_default_blocks_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_insert_page_default_blocks_ AFTER INSERT ON application_.page_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_page_default_blocks_();


--
-- Name: product_ tr_after_insert_insert_product_page_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_insert_product_page_ AFTER INSERT ON application_.product_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_product_page_();


--
-- Name: order_ tr_after_insert_insert_resource_token_for_order_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_insert_resource_token_for_order_ AFTER INSERT ON application_.order_ REFERENCING NEW TABLE AS _order FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_resource_token_for_order_();


--
-- Name: order_item_ tr_after_insert_insert_resource_token_for_order_item_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_insert_resource_token_for_order_item_ AFTER INSERT ON application_.order_item_ REFERENCING NEW TABLE AS _order_item FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_resource_token_for_order_item_();


--
-- Name: agency_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.agency_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: image_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.image_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: product_ tr_after_insert_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_jsonb_ AFTER INSERT ON application_.product_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


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
-- Name: credential_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.credential_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: customer_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.customer_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: image_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.image_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: integration_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.integration_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: markdown_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.markdown_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: notification_definition_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.notification_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: order_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.order_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: order_item_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.order_item_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


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
-- Name: product_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.product_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: product_thank_you_page_setting_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.product_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


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
-- Name: webhook_event_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON application_.webhook_event_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: agency_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: agency_thank_you_page_setting_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.agency_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: customer_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.customer_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


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
-- Name: product_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.product_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: product_thank_you_page_setting_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.product_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


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
-- Name: image_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.image_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


--
-- Name: product_ tr_after_update_notify_jsonb_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_jsonb_ AFTER UPDATE ON application_.product_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_jsonb_();


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
-- Name: credential_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.credential_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: customer_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.customer_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: image_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.image_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: integration_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.integration_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: markdown_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.markdown_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: notification_definition_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.notification_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: order_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.order_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: order_item_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.order_item_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


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
-- Name: product_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.product_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: product_thank_you_page_setting_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.product_thank_you_page_setting_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


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
-- Name: webhook_event_ tr_after_update_resource_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON application_.webhook_event_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: product_ tr_after_update_update_product_page_url_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_update_product_page_url_ AFTER UPDATE ON application_.product_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.update_product_page_url_();


--
-- Name: page_block_ tr_before_insert_or_update_update_page_block_linked_list_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_insert_or_update_update_page_block_linked_list_ BEFORE INSERT OR UPDATE ON application_.page_block_ FOR EACH ROW EXECUTE FUNCTION internal_.update_page_block_linked_list_();


--
-- Name: agency_ tr_before_insert_set_subscription_plan_to_basic_plan_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_insert_set_subscription_plan_to_basic_plan_ BEFORE INSERT ON application_.agency_ FOR EACH ROW EXECUTE FUNCTION internal_.set_subscription_plan_to_basic_plan_();


--
-- Name: agency_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.agency_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: agency_thank_you_page_setting_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.agency_thank_you_page_setting_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: customer_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.customer_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


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
-- Name: product_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.product_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: product_thank_you_page_setting_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.product_thank_you_page_setting_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


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
-- Name: subscription_plan_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON internal_.subscription_plan_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: transaction_fee_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON internal_.transaction_fee_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


--
-- Name: form_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON internal_.form_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: form_field_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON internal_.form_field_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: integration_type_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON internal_.integration_type_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: page_block_definition_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON internal_.page_block_definition_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: page_definition_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON internal_.page_definition_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: subscription_plan_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON internal_.subscription_plan_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


--
-- Name: transaction_fee_ tr_after_delete_resource_delete_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_resource_delete_ AFTER DELETE ON internal_.transaction_fee_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.resource_delete_();


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
-- Name: subscription_plan_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON internal_.subscription_plan_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: transaction_fee_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON internal_.transaction_fee_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: form_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON internal_.form_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: form_field_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON internal_.form_field_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: integration_type_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON internal_.integration_type_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: page_block_definition_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON internal_.page_block_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: page_definition_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON internal_.page_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: subscription_plan_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON internal_.subscription_plan_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


--
-- Name: transaction_fee_ tr_after_insert_resource_insert_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_resource_insert_ AFTER INSERT ON internal_.transaction_fee_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_insert_();


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
-- Name: subscription_plan_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON internal_.subscription_plan_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: transaction_fee_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON internal_.transaction_fee_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


--
-- Name: form_ tr_after_update_resource_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON internal_.form_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: form_field_ tr_after_update_resource_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON internal_.form_field_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: integration_type_ tr_after_update_resource_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON internal_.integration_type_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: page_block_definition_ tr_after_update_resource_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON internal_.page_block_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: page_definition_ tr_after_update_resource_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON internal_.page_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: subscription_plan_ tr_after_update_resource_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON internal_.subscription_plan_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: transaction_fee_ tr_after_update_resource_update_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_after_update_resource_update_ AFTER UPDATE ON internal_.transaction_fee_ REFERENCING NEW TABLE AS _new_table FOR EACH ROW EXECUTE FUNCTION internal_.resource_update_();


--
-- Name: page_block_definition_ tr_before_insert_insert_form_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_before_insert_insert_form_ BEFORE INSERT ON internal_.page_block_definition_ FOR EACH ROW EXECUTE FUNCTION internal_.insert_form_();


--
-- Name: form_field_ tr_before_insert_set_sort_key_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_before_insert_set_sort_key_ BEFORE INSERT ON internal_.form_field_ FOR EACH ROW EXECUTE FUNCTION internal_.set_form_field_sort_key_();


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
-- Name: subscription_plan_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON internal_.subscription_plan_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


--
-- Name: transaction_fee_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: internal_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON internal_.transaction_fee_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


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
-- Name: resource_definition_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.resource_definition_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();


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
-- Name: resource_definition_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.resource_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


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
-- Name: resource_definition_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.resource_definition_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();


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
-- Name: resource_definition_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.resource_definition_ FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();


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
-- Name: agency_ agency__subscription_plan_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.agency_
    ADD CONSTRAINT agency__subscription_plan_uuid__fkey FOREIGN KEY (subscription_plan_uuid_) REFERENCES internal_.subscription_plan_(uuid_);


--
-- Name: agency_thank_you_page_setting_ agency_thank_you_page_setting__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.agency_thank_you_page_setting_
    ADD CONSTRAINT agency_thank_you_page_setting__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_);


--
-- Name: credential_ credential__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.credential_
    ADD CONSTRAINT credential__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;


--
-- Name: customer_ customer__stripe_account_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.customer_
    ADD CONSTRAINT customer__stripe_account_uuid__fkey FOREIGN KEY (stripe_account_uuid_) REFERENCES application_.stripe_account_(uuid_) ON DELETE CASCADE;


--
-- Name: customer_ customer__user_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.customer_
    ADD CONSTRAINT customer__user_uuid__fkey FOREIGN KEY (user_uuid_) REFERENCES security_.user_(uuid_) ON DELETE SET NULL;


--
-- Name: image_ image__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.image_
    ADD CONSTRAINT image__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;


--
-- Name: integration_ integration__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.integration_
    ADD CONSTRAINT integration__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;


--
-- Name: integration_ integration__credential_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.integration_
    ADD CONSTRAINT integration__credential_uuid__fkey FOREIGN KEY (credential_uuid_) REFERENCES application_.credential_(uuid_) ON DELETE CASCADE;


--
-- Name: integration_ integration__integration_type_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.integration_
    ADD CONSTRAINT integration__integration_type_uuid__fkey FOREIGN KEY (integration_type_uuid_) REFERENCES internal_.integration_type_(uuid_);


--
-- Name: order_ order__customer_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.order_
    ADD CONSTRAINT order__customer_uuid__fkey FOREIGN KEY (customer_uuid_) REFERENCES application_.customer_(uuid_) ON DELETE CASCADE;


--
-- Name: order_ order__stripe_account_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.order_
    ADD CONSTRAINT order__stripe_account_uuid__fkey FOREIGN KEY (stripe_account_uuid_) REFERENCES application_.stripe_account_(uuid_) ON DELETE CASCADE;


--
-- Name: order_item_ order_item__order_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.order_item_
    ADD CONSTRAINT order_item__order_uuid__fkey FOREIGN KEY (order_uuid_) REFERENCES application_.order_(uuid_) ON DELETE CASCADE;


--
-- Name: order_item_ order_item__price_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.order_item_
    ADD CONSTRAINT order_item__price_uuid__fkey FOREIGN KEY (price_uuid_) REFERENCES application_.price_(uuid_);


--
-- Name: page_ page__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_
    ADD CONSTRAINT page__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;


--
-- Name: page_ page__page_definition_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_
    ADD CONSTRAINT page__page_definition_uuid__fkey FOREIGN KEY (page_definition_uuid_) REFERENCES internal_.page_definition_(uuid_);


--
-- Name: page_ page__product_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.page_
    ADD CONSTRAINT page__product_uuid__fkey FOREIGN KEY (product_uuid_) REFERENCES application_.product_(uuid_) ON DELETE CASCADE;


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
    ADD CONSTRAINT page_block__page_uuid__fkey FOREIGN KEY (page_uuid_) REFERENCES application_.page_(uuid_) ON DELETE CASCADE;


--
-- Name: price_ price__product_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.price_
    ADD CONSTRAINT price__product_uuid__fkey FOREIGN KEY (product_uuid_) REFERENCES application_.product_(uuid_) ON DELETE CASCADE;


--
-- Name: product_ product__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.product_
    ADD CONSTRAINT product__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;


--
-- Name: product_ product__default_price_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.product_
    ADD CONSTRAINT product__default_price_uuid__fkey FOREIGN KEY (default_price_uuid_) REFERENCES application_.price_(uuid_) ON DELETE SET NULL;


--
-- Name: product_ product__image_hero_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.product_
    ADD CONSTRAINT product__image_hero_uuid__fkey FOREIGN KEY (image_hero_uuid_) REFERENCES application_.image_(uuid_);


--
-- Name: product_ product__image_logo_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.product_
    ADD CONSTRAINT product__image_logo_uuid__fkey FOREIGN KEY (image_logo_uuid_) REFERENCES application_.image_(uuid_);


--
-- Name: product_ product__integration_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.product_
    ADD CONSTRAINT product__integration_uuid__fkey FOREIGN KEY (integration_uuid_) REFERENCES application_.integration_(uuid_);


--
-- Name: product_ product__markdown_description_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.product_
    ADD CONSTRAINT product__markdown_description_uuid__fkey FOREIGN KEY (markdown_description_uuid_) REFERENCES application_.markdown_(uuid_);


--
-- Name: product_thank_you_page_setting_ product_thank_you_page_setting__product_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.product_thank_you_page_setting_
    ADD CONSTRAINT product_thank_you_page_setting__product_uuid__fkey FOREIGN KEY (product_uuid_) REFERENCES application_.product_(uuid_);


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
-- Name: webhook_event_ webhook_event__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.webhook_event_
    ADD CONSTRAINT webhook_event__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;


--
-- Name: form_field_ form_field__form_uuid__fkey; Type: FK CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.form_field_
    ADD CONSTRAINT form_field__form_uuid__fkey FOREIGN KEY (form_uuid_) REFERENCES internal_.form_(uuid_);


--
-- Name: integration_type_ integration_type__form_uuid__fkey; Type: FK CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.integration_type_
    ADD CONSTRAINT integration_type__form_uuid__fkey FOREIGN KEY (form_uuid_) REFERENCES internal_.form_(uuid_) ON DELETE CASCADE;


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
-- Name: transaction_fee_ transaction_fee__subscription_plan_uuid__fkey; Type: FK CONSTRAINT; Schema: internal_; Owner: postgres
--

ALTER TABLE ONLY internal_.transaction_fee_
    ADD CONSTRAINT transaction_fee__subscription_plan_uuid__fkey FOREIGN KEY (subscription_plan_uuid_) REFERENCES internal_.subscription_plan_(uuid_) ON DELETE CASCADE;


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
    ADD CONSTRAINT policy__resource_definition_uuid__fkey FOREIGN KEY (resource_definition_uuid_) REFERENCES security_.resource_definition_(uuid_) ON DELETE CASCADE;


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
-- Name: resource_token_ resource_token__resource_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.resource_token_
    ADD CONSTRAINT resource_token__resource_uuid__fkey FOREIGN KEY (resource_uuid_) REFERENCES application_.resource_(uuid_) ON DELETE CASCADE;


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

