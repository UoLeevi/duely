--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2
-- Dumped by pg_dump version 11.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA pgcrypto_;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


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
    DROP TRIGGER tr_after_insert_notify_json_ ON %1$I.%2$I;
    DROP TRIGGER tr_after_update_notify_json_ ON %1$I.%2$I;
    DROP TRIGGER tr_after_delete_notify_json_ ON %1$I.%2$I;
    $$,
    _table_schema, _table_name);
END
$_$;


ALTER PROCEDURE internal_.drop_notifications_(_table regclass) OWNER TO postgres;

--
-- Name: jwt_sign_hs256_(json, bytea); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.jwt_sign_hs256_(_payload json, _secret bytea) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
  WITH
    cte1 AS (
      SELECT 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' || internal_.base64url_encode_(_payload::text::bytea) base64url_header_and_payload_
    )
    SELECT cte1.base64url_header_and_payload_ || '.' || internal_.base64url_encode_(pgcrypto_.hmac(cte1.base64url_header_and_payload_::bytea, _secret, 'sha256')) FROM cte1;
$$;


ALTER FUNCTION internal_.jwt_sign_hs256_(_payload json, _secret bytea) OWNER TO postgres;

--
-- Name: jwt_verify_hs256_(text, bytea); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.jwt_verify_hs256_(_jwt text, _secret bytea) RETURNS json
    LANGUAGE sql IMMUTABLE
    AS $$
  WITH
    _base64 AS (
      SELECT split_part(_jwt, '.', 1) header_, split_part(_jwt, '.', 2) payload_, split_part(_jwt, '.', 3) signature_
    )
    SELECT 
      CASE WHEN _base64.signature_ = internal_.base64url_encode_(pgcrypto_.hmac((_base64.header_ || '.' || _base64.payload_)::bytea, _secret, 'sha256')) 
        THEN convert_from(internal_.base64url_decode_(_base64.payload_), 'UTF-8')::json
        ELSE NULL 
      END payload_
    FROM _base64;
$$;


ALTER FUNCTION internal_.jwt_verify_hs256_(_jwt text, _secret bytea) OWNER TO postgres;

--
-- Name: notify_json_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.notify_json_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM pg_notify(TG_TABLE_SCHEMA::text || '.' || TG_TABLE_NAME::text, json_build_object('op', LEFT(TG_OP, 1), 'uuid_', t.uuid_::text)::text)
  FROM _transition_table t;
  RETURN NULL;
END;
$$;


ALTER FUNCTION internal_.notify_json_() OWNER TO postgres;

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
    CREATE TRIGGER tr_after_insert_notify_json_
    AFTER INSERT ON %1$I.%2$I
    REFERENCING NEW TABLE AS _transition_table
    FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_json_();

    CREATE TRIGGER tr_after_update_notify_json_
    AFTER UPDATE ON %1$I.%2$I
    REFERENCING NEW TABLE AS _transition_table
    FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_json_();

    CREATE TRIGGER tr_after_delete_notify_json_
    AFTER DELETE ON %1$I.%2$I
    REFERENCING OLD TABLE AS _transition_table
    FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_json_();
    $$,
    _table_schema, _table_name);
END
$_$;


ALTER PROCEDURE internal_.setup_notifications_(_table regclass) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: user_invite_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.user_invite_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
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
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    begin_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_at_ timestamp with time zone,
    token_uuid_ uuid NOT NULL,
    tag_ text
);


ALTER TABLE security_.session_ OWNER TO postgres;

--
-- Name: begin_session_(text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.begin_session_(_jwt text, _tag text DEFAULT NULL::text) RETURNS security_.session_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _claims json;
  _token_uuid uuid;
  _subject_uuid uuid;
  _session security_.session_;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid <> '00000000-0000-0000-0000-000000000000'::uuid) THEN
    PERFORM operation_.end_session_();
  END IF;

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
  _uuid uuid := pgcrypto_.gen_random_uuid();
  _iat bigint := FLOOR(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP));
  _subject_uuid uuid;
  _secret bytea;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid <> '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'Active session already exists.' USING ERRCODE = '20000';
  END IF;

  INSERT INTO security_.subject_ (name_, type_)
  VALUES ('', 'visitor')
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
      json_build_object(
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
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
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
  SELECT _name agency_name_, _subdomain_name subdomain_name_ INTO _arg; 
  PERFORM security_.control_operation_('create_agency_', _arg);

  INSERT INTO security_.subdomain_ (name_)
  VALUES (_subdomain_name)
  RETURNING uuid_ INTO _subdomain_uuid;

  INSERT INTO application_.agency_ (subdomain_uuid_, name_)
  VALUES (_subdomain_uuid, _name)
  RETURNING * INTO _agency;

  INSERT INTO security_.subject_assignment_ (role_uuid_, subdomain_uuid_, subject_uuid_)
  SELECT r.uuid_, _subdomain_uuid, current_setting('security_.token_.subject_uuid_'::text, false)::uuid
  FROM security_.role_ r
  WHERE r.name_ = 'owner';

  RETURN _agency;
END
$$;


ALTER FUNCTION operation_.create_agency_(_name text, _subdomain_name text) OWNER TO postgres;

--
-- Name: service_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.service_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL,
    name_ text NOT NULL,
    status_ text DEFAULT 'draft'::text NOT NULL,
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
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
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
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    stripe_id_ text NOT NULL,
    agency_uuid_ uuid NOT NULL,
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
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    image_logo_uuid_ uuid,
    image_hero_uuid_ uuid,
    color_primary_ text NOT NULL,
    color_secondary_ text NOT NULL,
    color_accent_ text NOT NULL,
    color_background_ text NOT NULL,
    color_surface_ text NOT NULL,
    color_error_ text NOT NULL,
    color_success_ text NOT NULL,
    standard_ boolean DEFAULT false NOT NULL,
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
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    data_ text NOT NULL,
    color_ text NOT NULL,
    agency_uuid_ uuid,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
-- Name: end_session_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.end_session_() RETURNS security_.session_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _session security_.session_;
BEGIN
  IF (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid = '00000000-0000-0000-0000-000000000000'::uuid) THEN
    RAISE 'No active session.' USING ERRCODE = '20000';
  END IF;

  UPDATE security_.session_
  SET
    end_at_ = CURRENT_TIMESTAMP
  WHERE uuid_ = current_setting('security_.session_.uuid_', 'f')::uuid
  RETURNING * INTO _session;

  PERFORM set_config('security_.token_.subject_uuid_', '00000000-0000-0000-0000-000000000000', 'f');
  PERFORM set_config('security_.session_.uuid_', '00000000-0000-0000-0000-000000000000', 'f');

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
  _uuid uuid := pgcrypto_.gen_random_uuid();
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
      json_build_object(
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
  SELECT s.uuid_, s.name_, s.type_, u.email_address_
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
-- Name: query_agency_user_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_agency_user_(_agency_uuid uuid) RETURNS TABLE(uuid_ uuid, name_ text, email_address_ text, type_ text, role_names_ text[])
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('query_agency_user_', _arg);

  RETURN QUERY
  SELECT s.uuid_, s.name_, u.email_address_, s.type_, array_remove(array_agg(r.name_), NULL) role_names_
  FROM application_.agency_ a
  LEFT JOIN security_.subject_assignment_flat_ sa ON a.subdomain_uuid_ = sa.subdomain_uuid_
  LEFT JOIN security_.role_ r ON r.uuid_ = sa.role_uuid_
  LEFT JOIN security_.subject_ s ON s.uuid_ = sa.subject_uuid_
  LEFT JOIN security_.user_ u ON s.uuid_ = u.uuid_
  WHERE a.uuid_ = _agency_uuid
  GROUP BY s.uuid_, s.name_, u.email_address_, s.type_;

END
$$;


ALTER FUNCTION operation_.query_agency_user_(_agency_uuid uuid) OWNER TO postgres;

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

CREATE FUNCTION operation_.query_service_(_service_uuid uuid) RETURNS TABLE(uuid_ uuid, name_ text, agency_uuid_ uuid, status_ text)
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
  SELECT s.uuid_, s.name_, s.agency_uuid_, s.status_
  FROM application_.service_ s
  WHERE s.uuid_ = _service_uuid;

END
$$;


ALTER FUNCTION operation_.query_service_(_service_uuid uuid) OWNER TO postgres;

--
-- Name: query_service_by_agency_(uuid, text[]); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.query_service_by_agency_(_agency_uuid uuid, _status text[] DEFAULT NULL::text[]) RETURNS TABLE(uuid_ uuid, name_ text, agency_uuid_ uuid, status_ text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_, _status service_status_ INTO _arg; 
  PERFORM security_.control_operation_('query_service_by_agency_', _arg);

  RETURN QUERY
  SELECT s.uuid_, s.name_, s.agency_uuid_, s.status_
  FROM application_.service_ s
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
  JOIN security_.active_role_ ar ON a.subdomain_uuid_ = ar.subdomain_uuid_
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
  JOIN security_.user_ ON s.uuid_ = u.uuid_;

END
$$;


ALTER FUNCTION operation_.query_user_() OWNER TO postgres;

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
-- Name: user_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.user_ (
    uuid_ uuid NOT NULL,
    email_address_ text,
    password_hash_ text
);


ALTER TABLE security_.user_ OWNER TO postgres;

--
-- Name: sign_up_user_(text, text, text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.sign_up_user_(_email_address text, _verification_code text, _name text, _password text) RETURNS security_.user_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _verification_uuid uuid;
  _user security_.user_;
BEGIN
  PERFORM security_.control_operation_('sign_up_user_');

  UPDATE security_.email_address_verification_ SET
    status_ = 'verified',
    status_at_ = CURRENT_TIMESTAMP
  WHERE email_address_ = lower(_email_address)
    AND verification_code_ = _verification_code
    AND status_ IS NULL
  RETURNING uuid_ INTO _verification_uuid;

  IF _verification_uuid IS NULL THEN
    RAISE 'No matching email address verification code found: %', lower(_email_address) USING ERRCODE = '20000';
  END IF;

  WITH _subject AS (
    INSERT INTO security_.subject_ (name_, type_)
    VALUES (_name, 'user')
    RETURNING uuid_
  )
  INSERT INTO security_.user_ (uuid_, email_address_, password_hash_)
  SELECT s.uuid_, lower(_email_address), pgcrypto_.crypt(_password, pgcrypto_.gen_salt('md5'))
  FROM _subject s
  RETURNING * INTO _user;

  RETURN _user;
END
$$;


ALTER FUNCTION operation_.sign_up_user_(_email_address text, _verification_code text, _name text, _password text) OWNER TO postgres;

--
-- Name: email_address_verification_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.email_address_verification_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    email_address_ text NOT NULL,
    verification_code_ text NOT NULL,
    started_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status_ text,
    status_at_ timestamp with time zone,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.email_address_verification_ OWNER TO postgres;

--
-- Name: start_email_address_verification_(text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.start_email_address_verification_(_email_address text) RETURNS security_.email_address_verification_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _email_address_verification security_.email_address_verification_;
  _verification_code text := lpad(floor(random() * 1000000)::text, 6, '0');
BEGIN
  PERFORM security_.control_operation_('start_email_address_verification_');

  IF EXISTS (
    SELECT 1
    FROM security_.user_ u
    WHERE u.email_address_ = lower(_email_address)
  ) THEN
    RAISE 'Email address already verified: %', lower(_email_address) USING ERRCODE = '23505';
  END IF;

  INSERT INTO security_.email_address_verification_ (email_address_, verification_code_)
  VALUES (lower(_email_address), _verification_code)
  ON CONFLICT (email_address_) DO UPDATE
  SET
    verification_code_ = _verification_code,
    started_at_ = DEFAULT
  WHERE security_.email_address_verification_.email_address_ = lower(_email_address)
  RETURNING * INTO _email_address_verification;

  RETURN _email_address_verification;
END
$$;


ALTER FUNCTION operation_.start_email_address_verification_(_email_address text) OWNER TO postgres;

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
-- Name: event_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.event_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
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
-- Name: policy_assignment_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.policy_assignment_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
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
  PERFORM format('operation_.%1$I', _operation_name)::regproc;

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
  PERFORM format('operation_.%1$I', _operation_name)::regproc;

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
-- Name: image_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.image_ (
    uuid_ uuid,
    name_ text,
    data_ text,
    color_ text,
    agency_uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.image_ OWNER TO postgres;

--
-- Name: service_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.service_ (
    uuid_ uuid,
    agency_uuid_ uuid,
    name_ text,
    status_ text,
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
-- Name: stripe_account_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.stripe_account_ (
    uuid_ uuid,
    stripe_id_ text,
    agency_uuid_ uuid,
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
    standard_ boolean,
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
-- Name: subject_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.subject_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    type_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.subject_ OWNER TO postgres;

--
-- Name: active_subject_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.active_subject_ AS
 SELECT s.uuid_,
    s.name_,
    s.type_,
    u.email_address_
   FROM (security_.subject_ s
     LEFT JOIN security_.user_ u ON ((s.uuid_ = u.uuid_)))
  WHERE (s.uuid_ = (current_setting('security_.token_.subject_uuid_'::text, true))::uuid);


ALTER TABLE security_.active_subject_ OWNER TO postgres;

--
-- Name: role_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.role_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.role_ OWNER TO postgres;

--
-- Name: role_hierarchy_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.role_hierarchy_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    role_uuid_ uuid NOT NULL,
    subrole_uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.role_hierarchy_ OWNER TO postgres;

--
-- Name: subject_assignment_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.subject_assignment_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    role_uuid_ uuid NOT NULL,
    subdomain_uuid_ uuid NOT NULL,
    subject_uuid_ uuid NOT NULL
);


ALTER TABLE security_.subject_assignment_ OWNER TO postgres;

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
 SELECT s.uuid_,
    s.name_,
    u.email_address_
   FROM (security_.active_subject_ s
     JOIN security_.user_ u ON ((s.uuid_ = u.uuid_)));


ALTER TABLE security_.active_user_ OWNER TO postgres;

--
-- Name: operation_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.operation_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
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
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    value_ bytea NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_session_uuid_ uuid DEFAULT (COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.secret_ OWNER TO postgres;

--
-- Name: subdomain_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.subdomain_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
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
    verification_code_ text,
    started_at_ timestamp with time zone,
    status_ text,
    status_at_ timestamp with time zone,
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
-- Name: subject_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.subject_ (
    uuid_ uuid,
    name_ text,
    type_ text,
    audit_at_ timestamp with time zone,
    audit_session_uuid_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.subject_ OWNER TO postgres;

--
-- Data for Name: operation_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.operation_ (uuid_, name_, log_events_, audit_at_, audit_session_uuid_) FROM stdin;
12ba3162-4b08-46cf-bf69-f8db5f6c291d	log_out_user_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
a5acd829-bced-4d98-8c5c-8f29e14c8116	create_agency_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
c865b482-975b-49b3-845f-dfa39f46a7f1	delete_agency_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
45cf7669-6e10-4c99-bf14-af25985a7f0f	delete_service_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
fa4b4c5f-160f-413b-b77a-beee70108f0a	create_service_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
a1c956c8-b64e-41ba-af40-d3c16721b04e	log_in_user_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
93fe889a-e329-4701-9222-3caba3028f23	sign_up_user_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	start_email_address_verification_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
7f2f5147-db6c-43cf-b0f0-2d68d56cba74	query_active_subject_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
fb9268f3-c318-4034-b785-7cc67a755f14	query_subdomain_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
616938d8-f0b0-4ce5-82f6-ebf1d97668ff	query_service_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
44836e4b-ecd5-4184-a177-498b412ff251	query_user_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
6780b297-e2e5-48f5-b58d-a855b51a0fae	query_role_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
44286eaf-723f-4a0b-b2b4-dd18404f948a	query_agency_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
89071731-bd21-4505-aab9-fd699c5fd12f	invite_user_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
8e119375-3f63-4a07-8239-6a4250094e93	remove_user_from_agency_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
04fc5530-96ee-469b-9e6d-f228392b81e9	accept_user_invite_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
a7a73077-da99-4acd-af2a-1f2dba998889	query_agency_user_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
3f020478-e3a3-4674-932d-8b922c17b91b	query_shared_agency_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
3ae8d981-be1f-4843-bc41-df24bc904e5d	query_agency_by_subdomain_name_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
384605a6-0fb2-4d9c-aacc-3e5a33be8c36	create_stripe_account_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
d21b8f48-a57a-45b3-9341-926d735dffb6	edit_agency_theme_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
373f84a0-350e-41e9-b714-705d21a79135	query_theme_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
8a08d468-c946-47d7-bcc1-f45819625d63	edit_image_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
a1db5356-28de-40ad-8059-630894876852	query_image_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
fca05330-a0b0-4d0e-b2e9-ff5125a9895e	query_service_by_agency_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
9b80cc60-7109-4849-ac2f-fc4df653bd2f	create_service_step_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
08f449e7-8215-484a-a40a-b6bdb9b16b4d	query_service_step_by_service_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
1c41ed54-3140-4a9e-8f9e-81f02b185708	delete_service_step_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
48929e2e-93c6-47a1-be0d-5b41ca8f2728	query_service_step_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
d8c38111-8742-4ee1-8adb-eedffb10198b	decline_user_invite_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
27849d3f-541f-4689-aad6-999dc14e0ce7	query_user_invite_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
59b6fdfa-8d4e-4069-88af-49634fa92a23	query_user_invite_by_agency_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
774d34d3-cd48-45ca-8f70-2f54010f5b48	cancel_user_invite_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
dbdecab4-c25b-43f4-a20a-3ef80d6be7bc	query_user_invite_by_subject_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: policy_assignment_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.policy_assignment_ (uuid_, policy_name_, operation_uuid_, type_, audit_at_, audit_session_uuid_) FROM stdin;
fb6da025-643a-4806-a64b-4a0e5042ba98	owner_in_agency_	c865b482-975b-49b3-845f-dfa39f46a7f1	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
e8992bc3-0f79-4797-81aa-bddef2193d97	visitor_	f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
685c3913-3fff-4345-865c-d3e4026321ed	visitor_	a1c956c8-b64e-41ba-af40-d3c16721b04e	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
3aef50bd-85e6-4beb-8bd4-9a252052200d	visitor_	93fe889a-e329-4701-9222-3caba3028f23	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
f9e2b169-903d-4e9c-ae20-b397489875dd	logged_in_	12ba3162-4b08-46cf-bf69-f8db5f6c291d	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
914f28e8-076c-45cb-8042-f827bc6e59e2	logged_in_	a5acd829-bced-4d98-8c5c-8f29e14c8116	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
7488a3fd-0f68-4369-95c2-9293e3a4f80e	manager_in_agency_	fa4b4c5f-160f-413b-b77a-beee70108f0a	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
b987a658-ec1d-4761-ba88-1b271d0ce51f	visitor_	7f2f5147-db6c-43cf-b0f0-2d68d56cba74	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
04793c21-c83f-4b7b-805d-c100578cb652	logged_in_	7f2f5147-db6c-43cf-b0f0-2d68d56cba74	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
7f09a849-5162-4cbb-9fbc-f42529ef0088	logged_in_	44286eaf-723f-4a0b-b2b4-dd18404f948a	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
d6067404-d2ba-46a5-9b50-ff027c661aae	argument_is_not_null_	44286eaf-723f-4a0b-b2b4-dd18404f948a	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
2d1cde8a-54e7-4aa5-87ef-3f733cf3dde0	logged_in_	fb9268f3-c318-4034-b785-7cc67a755f14	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
12543ad5-113a-4b09-8174-774119fd999e	owner_in_agency_	89071731-bd21-4505-aab9-fd699c5fd12f	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
991b0ec1-11b6-492e-a872-5b8aede7e5c3	owner_in_agency_	8e119375-3f63-4a07-8239-6a4250094e93	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
fdcffd77-fcb5-4ff8-9bb3-6bd8d06cfbd5	users_can_remove_themselves_	8e119375-3f63-4a07-8239-6a4250094e93	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
1b902618-8a68-4c0d-b05e-6bda782c5f30	agent_in_agency_	a7a73077-da99-4acd-af2a-1f2dba998889	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
75294233-ed0a-4b6a-8903-f206daf0af67	logged_in_	3f020478-e3a3-4674-932d-8b922c17b91b	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
b096a480-e5f0-4c34-a4f5-8bc75c2fb71b	argument_is_not_null_	3ae8d981-be1f-4843-bc41-df24bc904e5d	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
571601fd-1c3c-4d04-b37d-da9a66447025	argument_is_not_null_	fb9268f3-c318-4034-b785-7cc67a755f14	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
ea149d92-8577-4d3d-aa59-64713833b8fb	agent_in_agency_	616938d8-f0b0-4ce5-82f6-ebf1d97668ff	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
4ec948d5-45ea-4cdb-8cf9-aab00b10dfdd	owner_in_agency_	384605a6-0fb2-4d9c-aacc-3e5a33be8c36	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
6d532fe7-ad14-4d6d-9861-c0813b407fbc	manager_in_agency_	d21b8f48-a57a-45b3-9341-926d735dffb6	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
2a0d6fa5-76c1-4440-9421-53f57185c5df	visitor_	373f84a0-350e-41e9-b714-705d21a79135	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
229bf29f-1dd3-45a2-b845-9c271771a4ab	logged_in_	373f84a0-350e-41e9-b714-705d21a79135	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
126aa154-9a2b-4e9e-9473-58b90d917a17	manager_in_agency_	8a08d468-c946-47d7-bcc1-f45819625d63	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
4ab56a45-937f-4aa3-bfab-6a3ec95e14d6	visitor_	a1db5356-28de-40ad-8059-630894876852	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
eb2c9034-5c48-414a-bf05-a5fd4c492053	logged_in_	a1db5356-28de-40ad-8059-630894876852	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
8030c009-6c74-4a8a-9762-82c8d414e6cd	manager_in_agency_	45cf7669-6e10-4c99-bf14-af25985a7f0f	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
120c7413-19c3-4bc7-969a-1d701e6e6aa1	agent_in_agency_	fca05330-a0b0-4d0e-b2e9-ff5125a9895e	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
45794325-c9e9-4f3c-a805-13d013205a8f	service_status_contains_only_live_	fca05330-a0b0-4d0e-b2e9-ff5125a9895e	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
05cacc42-807b-4f51-b9f5-927983b26950	manager_in_agency_	9b80cc60-7109-4849-ac2f-fc4df653bd2f	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
832c874c-3b8b-4d51-8704-7ee2ec8ff18c	service_status_is_live_	08f449e7-8215-484a-a40a-b6bdb9b16b4d	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
7275e0a3-249c-4e32-a26f-4a399d724207	agent_in_agency_	08f449e7-8215-484a-a40a-b6bdb9b16b4d	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
88f38e52-c66d-4f38-9f9e-518fae934d67	service_status_is_live_	616938d8-f0b0-4ce5-82f6-ebf1d97668ff	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
1f6eee50-721b-4716-8f08-42acdb0ce264	manager_in_agency_	1c41ed54-3140-4a9e-8f9e-81f02b185708	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
8f74e764-531d-4ee0-9501-799a93249f8e	service_status_is_live_	48929e2e-93c6-47a1-be0d-5b41ca8f2728	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
5ce796c9-2770-477e-ac8f-7b1c2d9b3af6	agent_in_agency_	48929e2e-93c6-47a1-be0d-5b41ca8f2728	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
24598e65-5bd4-4a68-9799-4235bddcacc9	agent_in_agency_	27849d3f-541f-4689-aad6-999dc14e0ce7	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
7845ed18-8f5f-438c-9dd1-5ded43bffe6e	invitee_of_user_invite_	27849d3f-541f-4689-aad6-999dc14e0ce7	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
630aa45a-3805-4e40-a5bd-eea62ca07939	invitee_of_user_invite_	04fc5530-96ee-469b-9e6d-f228392b81e9	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
b0d65997-6de7-4efe-98ef-180c9dbde830	invitee_of_user_invite_	d8c38111-8742-4ee1-8adb-eedffb10198b	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
74931d78-6bd6-48c4-a853-1c714b68211e	logged_in_	27849d3f-541f-4689-aad6-999dc14e0ce7	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
3b973850-7737-4aa6-a725-acc74a3c7124	agent_in_agency_	59b6fdfa-8d4e-4069-88af-49634fa92a23	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
abf4133d-e860-4328-ab54-7d440bd8470a	agent_in_agency_	774d34d3-cd48-45ca-8f70-2f54010f5b48	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
3a2d166a-ec77-4e20-a0b0-97113c4ac3f9	logged_in_	f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
d24730d5-8b66-4bf4-9fe8-4728817a03b2	subject_is_active_user_	dbdecab4-c25b-43f4-a20a-3ef80d6be7bc	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
7352ec5f-f88e-457b-b7b2-9825da15895a	logged_in_	93fe889a-e329-4701-9222-3caba3028f23	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
fc380d88-74e8-4863-b95f-e2bfdcf45235	logged_in_	a1c956c8-b64e-41ba-af40-d3c16721b04e	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: role_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.role_ (uuid_, name_, audit_at_, audit_session_uuid_) FROM stdin;
be9432a6-2c74-4030-b59e-d657662a4f92	owner	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
566af82a-e5cf-4aad-aada-4341edb3e088	agent	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
e2370fd9-0389-48e6-a9c0-1b1c0b078a75	manager	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
9a9b149f-f57f-482d-bb5e-2692e3fee48c	client	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: role_hierarchy_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.role_hierarchy_ (uuid_, role_uuid_, subrole_uuid_, audit_at_, audit_session_uuid_) FROM stdin;
64cef996-c748-4ea1-b2a2-0ffc0f4f16ec	be9432a6-2c74-4030-b59e-d657662a4f92	e2370fd9-0389-48e6-a9c0-1b1c0b078a75	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
040f5548-7b4e-420e-a852-4c4d3cc011c4	e2370fd9-0389-48e6-a9c0-1b1c0b078a75	566af82a-e5cf-4aad-aada-4341edb3e088	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: operation_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.operation_ (uuid_, name_, log_events_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
12ba3162-4b08-46cf-bf69-f8db5f6c291d	log_out_user_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
a5acd829-bced-4d98-8c5c-8f29e14c8116	create_agency_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
c865b482-975b-49b3-845f-dfa39f46a7f1	delete_agency_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
45cf7669-6e10-4c99-bf14-af25985a7f0f	delete_service_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
fa4b4c5f-160f-413b-b77a-beee70108f0a	create_service_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
a1c956c8-b64e-41ba-af40-d3c16721b04e	log_in_user_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
93fe889a-e329-4701-9222-3caba3028f23	sign_up_user_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	start_email_address_verification_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
7f2f5147-db6c-43cf-b0f0-2d68d56cba74	query_active_subject_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
fb9268f3-c318-4034-b785-7cc67a755f14	query_subdomain_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
616938d8-f0b0-4ce5-82f6-ebf1d97668ff	query_service_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
44836e4b-ecd5-4184-a177-498b412ff251	query_user_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
6780b297-e2e5-48f5-b58d-a855b51a0fae	query_role_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
44286eaf-723f-4a0b-b2b4-dd18404f948a	query_agency_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
89071731-bd21-4505-aab9-fd699c5fd12f	invite_user_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
8e119375-3f63-4a07-8239-6a4250094e93	remove_user_from_agency_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
04fc5530-96ee-469b-9e6d-f228392b81e9	accept_user_invite_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
a7a73077-da99-4acd-af2a-1f2dba998889	query_agency_user_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
3f020478-e3a3-4674-932d-8b922c17b91b	query_shared_agency_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
3ae8d981-be1f-4843-bc41-df24bc904e5d	query_agency_by_subdomain_name_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
384605a6-0fb2-4d9c-aacc-3e5a33be8c36	create_stripe_account_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
d21b8f48-a57a-45b3-9341-926d735dffb6	edit_agency_theme_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
373f84a0-350e-41e9-b714-705d21a79135	query_theme_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
8a08d468-c946-47d7-bcc1-f45819625d63	edit_image_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
a1db5356-28de-40ad-8059-630894876852	query_image_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
fca05330-a0b0-4d0e-b2e9-ff5125a9895e	query_service_by_agency_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
9b80cc60-7109-4849-ac2f-fc4df653bd2f	create_service_step_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
08f449e7-8215-484a-a40a-b6bdb9b16b4d	query_service_step_by_service_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
1c41ed54-3140-4a9e-8f9e-81f02b185708	delete_service_step_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
48929e2e-93c6-47a1-be0d-5b41ca8f2728	query_service_step_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
d8c38111-8742-4ee1-8adb-eedffb10198b	decline_user_invite_	t	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
27849d3f-541f-4689-aad6-999dc14e0ce7	query_user_invite_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
59b6fdfa-8d4e-4069-88af-49634fa92a23	query_user_invite_by_agency_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
774d34d3-cd48-45ca-8f70-2f54010f5b48	cancel_user_invite_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
dbdecab4-c25b-43f4-a20a-3ef80d6be7bc	query_user_invite_by_subject_	f	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: policy_assignment_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.policy_assignment_ (uuid_, policy_name_, operation_uuid_, type_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
fb6da025-643a-4806-a64b-4a0e5042ba98	owner_in_agency_	c865b482-975b-49b3-845f-dfa39f46a7f1	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
e8992bc3-0f79-4797-81aa-bddef2193d97	visitor_	f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
685c3913-3fff-4345-865c-d3e4026321ed	visitor_	a1c956c8-b64e-41ba-af40-d3c16721b04e	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
3aef50bd-85e6-4beb-8bd4-9a252052200d	visitor_	93fe889a-e329-4701-9222-3caba3028f23	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
f9e2b169-903d-4e9c-ae20-b397489875dd	logged_in_	12ba3162-4b08-46cf-bf69-f8db5f6c291d	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
914f28e8-076c-45cb-8042-f827bc6e59e2	logged_in_	a5acd829-bced-4d98-8c5c-8f29e14c8116	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
7488a3fd-0f68-4369-95c2-9293e3a4f80e	manager_in_agency_	fa4b4c5f-160f-413b-b77a-beee70108f0a	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
b987a658-ec1d-4761-ba88-1b271d0ce51f	visitor_	7f2f5147-db6c-43cf-b0f0-2d68d56cba74	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
04793c21-c83f-4b7b-805d-c100578cb652	logged_in_	7f2f5147-db6c-43cf-b0f0-2d68d56cba74	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
7f09a849-5162-4cbb-9fbc-f42529ef0088	logged_in_	44286eaf-723f-4a0b-b2b4-dd18404f948a	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
d6067404-d2ba-46a5-9b50-ff027c661aae	argument_is_not_null_	44286eaf-723f-4a0b-b2b4-dd18404f948a	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
2d1cde8a-54e7-4aa5-87ef-3f733cf3dde0	logged_in_	fb9268f3-c318-4034-b785-7cc67a755f14	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
12543ad5-113a-4b09-8174-774119fd999e	owner_in_agency_	89071731-bd21-4505-aab9-fd699c5fd12f	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
991b0ec1-11b6-492e-a872-5b8aede7e5c3	owner_in_agency_	8e119375-3f63-4a07-8239-6a4250094e93	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
fdcffd77-fcb5-4ff8-9bb3-6bd8d06cfbd5	users_can_remove_themselves_	8e119375-3f63-4a07-8239-6a4250094e93	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
1b902618-8a68-4c0d-b05e-6bda782c5f30	agent_in_agency_	a7a73077-da99-4acd-af2a-1f2dba998889	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
75294233-ed0a-4b6a-8903-f206daf0af67	logged_in_	3f020478-e3a3-4674-932d-8b922c17b91b	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
b096a480-e5f0-4c34-a4f5-8bc75c2fb71b	argument_is_not_null_	3ae8d981-be1f-4843-bc41-df24bc904e5d	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
571601fd-1c3c-4d04-b37d-da9a66447025	argument_is_not_null_	fb9268f3-c318-4034-b785-7cc67a755f14	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
ea149d92-8577-4d3d-aa59-64713833b8fb	agent_in_agency_	616938d8-f0b0-4ce5-82f6-ebf1d97668ff	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
4ec948d5-45ea-4cdb-8cf9-aab00b10dfdd	owner_in_agency_	384605a6-0fb2-4d9c-aacc-3e5a33be8c36	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
6d532fe7-ad14-4d6d-9861-c0813b407fbc	manager_in_agency_	d21b8f48-a57a-45b3-9341-926d735dffb6	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
2a0d6fa5-76c1-4440-9421-53f57185c5df	visitor_	373f84a0-350e-41e9-b714-705d21a79135	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
229bf29f-1dd3-45a2-b845-9c271771a4ab	logged_in_	373f84a0-350e-41e9-b714-705d21a79135	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
126aa154-9a2b-4e9e-9473-58b90d917a17	manager_in_agency_	8a08d468-c946-47d7-bcc1-f45819625d63	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
4ab56a45-937f-4aa3-bfab-6a3ec95e14d6	visitor_	a1db5356-28de-40ad-8059-630894876852	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
eb2c9034-5c48-414a-bf05-a5fd4c492053	logged_in_	a1db5356-28de-40ad-8059-630894876852	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
8030c009-6c74-4a8a-9762-82c8d414e6cd	manager_in_agency_	45cf7669-6e10-4c99-bf14-af25985a7f0f	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
120c7413-19c3-4bc7-969a-1d701e6e6aa1	agent_in_agency_	fca05330-a0b0-4d0e-b2e9-ff5125a9895e	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
45794325-c9e9-4f3c-a805-13d013205a8f	service_status_contains_only_live_	fca05330-a0b0-4d0e-b2e9-ff5125a9895e	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
05cacc42-807b-4f51-b9f5-927983b26950	manager_in_agency_	9b80cc60-7109-4849-ac2f-fc4df653bd2f	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
832c874c-3b8b-4d51-8704-7ee2ec8ff18c	service_status_is_live_	08f449e7-8215-484a-a40a-b6bdb9b16b4d	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
7275e0a3-249c-4e32-a26f-4a399d724207	agent_in_agency_	08f449e7-8215-484a-a40a-b6bdb9b16b4d	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
88f38e52-c66d-4f38-9f9e-518fae934d67	service_status_is_live_	616938d8-f0b0-4ce5-82f6-ebf1d97668ff	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
1f6eee50-721b-4716-8f08-42acdb0ce264	manager_in_agency_	1c41ed54-3140-4a9e-8f9e-81f02b185708	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
8f74e764-531d-4ee0-9501-799a93249f8e	service_status_is_live_	48929e2e-93c6-47a1-be0d-5b41ca8f2728	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
5ce796c9-2770-477e-ac8f-7b1c2d9b3af6	agent_in_agency_	48929e2e-93c6-47a1-be0d-5b41ca8f2728	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
24598e65-5bd4-4a68-9799-4235bddcacc9	agent_in_agency_	27849d3f-541f-4689-aad6-999dc14e0ce7	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
7845ed18-8f5f-438c-9dd1-5ded43bffe6e	invitee_of_user_invite_	27849d3f-541f-4689-aad6-999dc14e0ce7	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
630aa45a-3805-4e40-a5bd-eea62ca07939	invitee_of_user_invite_	04fc5530-96ee-469b-9e6d-f228392b81e9	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
b0d65997-6de7-4efe-98ef-180c9dbde830	invitee_of_user_invite_	d8c38111-8742-4ee1-8adb-eedffb10198b	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
74931d78-6bd6-48c4-a853-1c714b68211e	logged_in_	27849d3f-541f-4689-aad6-999dc14e0ce7	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
3b973850-7737-4aa6-a725-acc74a3c7124	agent_in_agency_	59b6fdfa-8d4e-4069-88af-49634fa92a23	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
abf4133d-e860-4328-ab54-7d440bd8470a	agent_in_agency_	774d34d3-cd48-45ca-8f70-2f54010f5b48	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
3a2d166a-ec77-4e20-a0b0-97113c4ac3f9	logged_in_	f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
d24730d5-8b66-4bf4-9fe8-4728817a03b2	subject_is_active_user_	dbdecab4-c25b-43f4-a20a-3ef80d6be7bc	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
7352ec5f-f88e-457b-b7b2-9825da15895a	logged_in_	93fe889a-e329-4701-9222-3caba3028f23	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
fc380d88-74e8-4863-b95f-e2bfdcf45235	logged_in_	a1c956c8-b64e-41ba-af40-d3c16721b04e	allow	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: role_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.role_ (uuid_, name_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
be9432a6-2c74-4030-b59e-d657662a4f92	owner	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
566af82a-e5cf-4aad-aada-4341edb3e088	agent	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
e2370fd9-0389-48e6-a9c0-1b1c0b078a75	manager	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
9a9b149f-f57f-482d-bb5e-2692e3fee48c	client	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: role_hierarchy_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.role_hierarchy_ (uuid_, role_uuid_, subrole_uuid_, audit_at_, audit_session_uuid_, audit_op_) FROM stdin;
64cef996-c748-4ea1-b2a2-0ffc0f4f16ec	be9432a6-2c74-4030-b59e-d657662a4f92	e2370fd9-0389-48e6-a9c0-1b1c0b078a75	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
040f5548-7b4e-420e-a852-4c4d3cc011c4	e2370fd9-0389-48e6-a9c0-1b1c0b078a75	566af82a-e5cf-4aad-aada-4341edb3e088	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
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
-- Name: image_ image__name__agency_uuid__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.image_
    ADD CONSTRAINT image__name__agency_uuid__key UNIQUE (name_, agency_uuid_);


--
-- Name: image_ image__pkey; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.image_
    ADD CONSTRAINT image__pkey PRIMARY KEY (uuid_);


--
-- Name: service_ service__agency_uuid__name__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_
    ADD CONSTRAINT service__agency_uuid__name__key UNIQUE (agency_uuid_, name_);


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
-- Name: stripe_account_ stripe_account__stripe_id__key; Type: CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.stripe_account_
    ADD CONSTRAINT stripe_account__stripe_id__key UNIQUE (stripe_id_);


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
-- Name: email_address_verification_ email_address_verification__email_address__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.email_address_verification_
    ADD CONSTRAINT email_address_verification__email_address__key UNIQUE (email_address_);


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
-- Name: session_ session__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.session_
    ADD CONSTRAINT session__pkey PRIMARY KEY (uuid_);


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
-- Name: service_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: stripe_account_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.stripe_account_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: agency_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.agency_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: theme_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.theme_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: image_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.image_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: service_step_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_step_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: service_step_payment_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_step_payment_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: service_step_form_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_step_form_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: service_step_confirmation_by_agency_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_step_confirmation_by_agency_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: service_step_document_submission_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_step_document_submission_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: service_step_document_delivery_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_step_document_delivery_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: user_invite_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.user_invite_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: agency_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.agency_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.service_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: user_invite_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.user_invite_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: image_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.image_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: theme_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.theme_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_document_delivery_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.service_step_document_delivery_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_document_submission_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.service_step_document_submission_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_confirmation_by_agency_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.service_step_confirmation_by_agency_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_form_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.service_step_form_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_payment_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.service_step_payment_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.service_step_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: stripe_account_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.stripe_account_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: agency_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: theme_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.theme_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: image_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.image_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_step_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_step_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_step_payment_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_step_payment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_step_form_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_step_form_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_step_confirmation_by_agency_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_step_confirmation_by_agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_step_document_submission_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_step_document_submission_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_step_document_delivery_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_step_document_delivery_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: user_invite_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.user_invite_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: agency_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.agency_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.service_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: user_invite_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.user_invite_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: image_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.image_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: theme_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.theme_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_document_delivery_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.service_step_document_delivery_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_document_submission_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.service_step_document_submission_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_confirmation_by_agency_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.service_step_confirmation_by_agency_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_form_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.service_step_form_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_payment_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.service_step_payment_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.service_step_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: stripe_account_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.stripe_account_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: agency_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: theme_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.theme_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: image_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.image_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_step_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_step_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_step_payment_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_step_payment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_step_form_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_step_form_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_step_confirmation_by_agency_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_step_confirmation_by_agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_step_document_submission_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_step_document_submission_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_step_document_delivery_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_step_document_delivery_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: user_invite_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.user_invite_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: agency_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.agency_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.service_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: user_invite_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.user_invite_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: image_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.image_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: theme_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.theme_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_document_delivery_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.service_step_document_delivery_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_document_submission_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.service_step_document_submission_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_confirmation_by_agency_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.service_step_confirmation_by_agency_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_form_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.service_step_form_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_payment_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.service_step_payment_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_step_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.service_step_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: stripe_account_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.stripe_account_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: agency_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.agency_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: theme_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.theme_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: image_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.image_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: service_step_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_step_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: service_step_payment_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_step_payment_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: service_step_form_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_step_form_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: service_step_confirmation_by_agency_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_step_confirmation_by_agency_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: service_step_document_submission_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_step_document_submission_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: service_step_document_delivery_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_step_document_delivery_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: user_invite_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.user_invite_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: operation_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.operation_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: role_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.role_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: role_hierarchy_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.role_hierarchy_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: secret_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.secret_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: subdomain_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.subdomain_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: subject_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.subject_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: policy_assignment_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.policy_assignment_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: email_address_verification_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.email_address_verification_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: subject_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON security_.subject_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: subdomain_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON security_.subdomain_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: user_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON security_.user_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: operation_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.operation_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: role_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.role_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: role_hierarchy_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.role_hierarchy_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: secret_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.secret_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subdomain_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.subdomain_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subject_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.subject_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: policy_assignment_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.policy_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: email_address_verification_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.email_address_verification_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subject_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON security_.subject_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: subdomain_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON security_.subdomain_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: user_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON security_.user_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: operation_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.operation_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: role_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.role_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: role_hierarchy_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.role_hierarchy_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: secret_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.secret_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subdomain_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.subdomain_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subject_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.subject_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: policy_assignment_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.policy_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: email_address_verification_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.email_address_verification_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subject_ tr_after_update_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON security_.subject_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: subdomain_ tr_after_update_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON security_.subdomain_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: user_ tr_after_update_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON security_.user_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: operation_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.operation_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: role_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.role_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: role_hierarchy_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.role_hierarchy_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: secret_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.secret_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: subdomain_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.subdomain_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: subject_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.subject_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: policy_assignment_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.policy_assignment_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: email_address_verification_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.email_address_verification_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: agency_ agency__subdomain_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.agency_
    ADD CONSTRAINT agency__subdomain_uuid__fkey FOREIGN KEY (subdomain_uuid_) REFERENCES security_.subdomain_(uuid_) ON DELETE CASCADE;


--
-- Name: image_ image__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.image_
    ADD CONSTRAINT image__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_);


--
-- Name: service_ service__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_
    ADD CONSTRAINT service__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;


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
-- Name: stripe_account_ stripe_account__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.stripe_account_
    ADD CONSTRAINT stripe_account__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_);


--
-- Name: theme_ theme__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.theme_
    ADD CONSTRAINT theme__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_);


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
-- Name: policy_assignment_ policy_assignment__operation_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.policy_assignment_
    ADD CONSTRAINT policy_assignment__operation_uuid__fkey FOREIGN KEY (operation_uuid_) REFERENCES security_.operation_(uuid_);


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
    ADD CONSTRAINT user__uuid__fkey FOREIGN KEY (uuid_) REFERENCES security_.subject_(uuid_) ON DELETE CASCADE;


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

