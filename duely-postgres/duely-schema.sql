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
        AND attname NOT IN ('audit_at_', 'audit_by_')
    )
  SELECT INTO _columns
    string_agg(quote_ident(cte1.attname), ', ')
  FROM cte1;
  EXECUTE format(
    'INSERT INTO %1$I.%2$I(%3$s, audit_at_, audit_by_, audit_op_) SELECT %3$s, %4$L, %5$L, %6$L FROM _old_table o', 
    TG_TABLE_SCHEMA || '_audit_', 
    TG_TABLE_NAME, 
    _columns, 
    CURRENT_TIMESTAMP, 
    COALESCE(current_setting('security_.login_.user_uuid_', 't'), '00000000-0000-0000-0000-000000000000')::uuid, 
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
  NEW.audit_by_ := COALESCE(current_setting('security_.login_.user_uuid_', 't'), '00000000-0000-0000-0000-000000000000')::uuid;
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
-- Name: drop_auditing_(name, name); Type: PROCEDURE; Schema: internal_; Owner: postgres
--

CREATE PROCEDURE internal_.drop_auditing_(_table_schema name, _table_name name)
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _audit_schema name := _table_schema || '_audit_';
BEGIN
  EXECUTE format(
    'DROP TRIGGER tr_after_delete_audit_delete_ ON %1$I.%2$I;'
    'DROP TRIGGER tr_after_update_audit_insert_or_update_ ON %1$I.%2$I;'
    'DROP TRIGGER tr_after_insert_audit_insert_or_update_ ON %1$I.%2$I;'
    'DROP TRIGGER tr_before_update_audit_stamp_ ON %1$I.%2$I;'
    'DROP TABLE %3$I.%2$I;'
    'ALTER TABLE %1$I.%2$I DROP COLUMN audit_by_;'
    'ALTER TABLE %1$I.%2$I DROP COLUMN audit_at_;',
    _table_schema, _table_name, _audit_schema);
END
$_$;


ALTER PROCEDURE internal_.drop_auditing_(_table_schema name, _table_name name) OWNER TO postgres;

--
-- Name: drop_notifications_(name, name); Type: PROCEDURE; Schema: internal_; Owner: postgres
--

CREATE PROCEDURE internal_.drop_notifications_(_table_schema name, _table_name name)
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _audit_schema name := _table_schema || '_audit_';
BEGIN
  EXECUTE format(
    'DROP TRIGGER tr_after_insert_notify_json_ ON %1$I.%2$I;'
    'DROP TRIGGER tr_after_update_notify_json_ ON %1$I.%2$I;'
    'DROP TRIGGER tr_after_delete_notify_json_ ON %1$I.%2$I;',
    _table_schema, _table_name);
END
$_$;


ALTER PROCEDURE internal_.drop_notifications_(_table_schema name, _table_name name) OWNER TO postgres;

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

CREATE FUNCTION internal_.jwt_verify_hs256_(_jwt text, _secret bytea) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $$
  WITH
    cte1 AS (
      SELECT split_part(_jwt, '.', 3) signature_
    )
    SELECT cte1.signature_ = base64url_encode_(hmac(substring(_jwt for octet_length(_jwt) - octet_length(cte1.signature_) - 1)::bytea, _secret, 'sha256')) FROM cte1;
$$;


ALTER FUNCTION internal_.jwt_verify_hs256_(_jwt text, _secret bytea) OWNER TO postgres;

--
-- Name: notify_json_(); Type: FUNCTION; Schema: internal_; Owner: postgres
--

CREATE FUNCTION internal_.notify_json_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM pg_notify(TG_TABLE_SCHEMA::text || '.' || TG_TABLE_NAME::text, json_build_object('op', LEFT(TG_OP, 1), 'row', to_json(t.*))::text)
  FROM _transition_table t;
  RETURN NULL;
END;
$$;


ALTER FUNCTION internal_.notify_json_() OWNER TO postgres;

--
-- Name: setup_auditing_(name, name); Type: PROCEDURE; Schema: internal_; Owner: postgres
--

CREATE PROCEDURE internal_.setup_auditing_(_table_schema name, _table_name name)
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _audit_schema name := _table_schema || '_audit_';
BEGIN
  EXECUTE format(
    'ALTER TABLE %1$I.%2$I ADD COLUMN audit_at_ timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP;'
    'ALTER TABLE %1$I.%2$I ADD COLUMN audit_by_ uuid NOT NULL NOT NULL DEFAULT COALESCE(current_setting(''security_.login_.user_uuid_'', ''t''), ''00000000-0000-0000-0000-000000000000'')::uuid;'
    'CREATE TABLE %3$I.%2$I AS TABLE %1$I.%2$I;'
    'ALTER TABLE %3$I.%2$I ADD COLUMN audit_op_ char(1) NOT NULL DEFAULT ''I'';'
    'CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON %1$I.%2$I FOR EACH ROW EXECUTE FUNCTION internal_.audit_stamp_();'
    'CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON %1$I.%2$I REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();'
    'CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON %1$I.%2$I REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_insert_or_update_();'
    'CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON %1$I.%2$I REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.audit_delete_();',
    _table_schema, _table_name, _audit_schema);
END
$_$;


ALTER PROCEDURE internal_.setup_auditing_(_table_schema name, _table_name name) OWNER TO postgres;

--
-- Name: setup_notifications_(name, name); Type: PROCEDURE; Schema: internal_; Owner: postgres
--

CREATE PROCEDURE internal_.setup_notifications_(_table_schema name, _table_name name)
    LANGUAGE plpgsql
    AS $_$
BEGIN
  EXECUTE format(
    'CREATE TRIGGER tr_after_insert_notify_json_ '
    'AFTER INSERT ON %1$I.%2$I '
    'REFERENCING NEW TABLE AS _transition_table '
    'FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_json_();'

    'CREATE TRIGGER tr_after_update_notify_json_ '
    'AFTER UPDATE ON %1$I.%2$I '
    'REFERENCING NEW TABLE AS _transition_table '
    'FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_json_();'

    'CREATE TRIGGER tr_after_delete_notify_json_ '
    'AFTER DELETE ON %1$I.%2$I '
    'REFERENCING OLD TABLE AS _transition_table '
    'FOR EACH STATEMENT EXECUTE FUNCTION internal_.notify_json_();',
    _table_schema, _table_name);
END
$_$;


ALTER PROCEDURE internal_.setup_notifications_(_table_schema name, _table_name name) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: session_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.session_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    login_uuid_ uuid NOT NULL,
    begin_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_at_ timestamp with time zone
);


ALTER TABLE security_.session_ OWNER TO postgres;

--
-- Name: begin_session_(text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.begin_session_(_jwt text) RETURNS security_.session_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _login_uuid uuid;
  _user_uuid uuid;
  _session security_.session_;
BEGIN
  SELECT l.uuid_, l.user_uuid_ INTO _login_uuid, _user_uuid
  FROM security_.login_ l
  WHERE l.jwt_ = _jwt
    AND l.log_out_at_ IS NULL;

  IF _login_uuid IS NULL THEN
    RAISE 'Invalid JWT.' USING ERRCODE = '20000';
  END IF;

  INSERT INTO security_.session_ (login_uuid_)
  VALUES (_login_uuid)
  RETURNING * INTO _session;

  PERFORM set_config('security_.login_.user_uuid_', _user_uuid::text, 'f');
  PERFORM set_config('security_.session_.uuid_', _session.uuid_::text, 'f');

  RETURN _session;
END
$$;


ALTER FUNCTION operation_.begin_session_(_jwt text) OWNER TO postgres;

--
-- Name: agency_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.agency_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    subdomain_uuid_ uuid NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
BEGIN
  CALL security_.raise_if_no_active_session_();

  INSERT INTO security_.subdomain_ (name_)
  VALUES (_subdomain_name)
  RETURNING uuid_ INTO _subdomain_uuid;

  INSERT INTO application_.agency_ (subdomain_uuid_, name_)
  VALUES (_subdomain_uuid, _name)
  RETURNING * INTO _agency;

  INSERT INTO security_.subject_assignment_ (role_uuid_, subdomain_uuid_, subject_uuid_)
  SELECT r.uuid_, _subdomain_uuid, current_setting('security_.login_.user_uuid_'::text, false)::uuid
  FROM security_.role_ r
  WHERE r.name_ = 'owner';

  RETURN _agency;
END
$$;


ALTER FUNCTION operation_.create_agency_(_name text, _subdomain_name text) OWNER TO postgres;

--
-- Name: delete_agency_(text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.delete_agency_(_name text) RETURNS application_.agency_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _subdomain_name text;
  _agency application_.agency_;
BEGIN
  CALL security_.raise_if_no_active_session_();

  SELECT d.name_ INTO _subdomain_name
  FROM security_.subdomain_ d
  JOIN application_.agency_ a ON d.uuid_ = a.subdomain_uuid_
  WHERE a.name_ = _name;

  CALL security_.raise_if_no_active_permission_(_subdomain_name, 'delete_agency_');

  DELETE FROM application_.agency_
  WHERE name_ = _name
  RETURNING * INTO _agency;

  DELETE FROM security_.subdomain_
  WHERE name_ = _subdomain_name;

  RETURN _agency;
END
$$;


ALTER FUNCTION operation_.delete_agency_(_name text) OWNER TO postgres;

--
-- Name: end_session_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.end_session_() RETURNS security_.session_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _session security_.session_;
BEGIN
  UPDATE security_.session_
  SET
    end_at_ = CURRENT_TIMESTAMP
  WHERE uuid_ = current_setting('security_.session_.uuid_', 'f')::uuid
  RETURNING * INTO _session;

  PERFORM set_config('security_.login_.user_uuid_', '00000000-0000-0000-0000-000000000000', 'f');
  PERFORM set_config('security_.session_.uuid_', '00000000-0000-0000-0000-000000000000', 'f');

  RETURN _session;
END
$$;


ALTER FUNCTION operation_.end_session_() OWNER TO postgres;

--
-- Name: login_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.login_ (
    uuid_ uuid NOT NULL,
    user_uuid_ uuid NOT NULL,
    log_in_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    log_out_at_ timestamp with time zone,
    jwt_ text NOT NULL
);


ALTER TABLE security_.login_ OWNER TO postgres;

--
-- Name: log_in_user_(text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.log_in_user_(_email_address text, _password text) RETURNS security_.login_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _uuid uuid := pgcrypto_.gen_random_uuid();
  _iat bigint := FLOOR(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP));
  _user_uuid uuid;
  _login security_.login_;
  _secret bytea;
BEGIN
  SELECT u.uuid_ INTO _user_uuid
  FROM security_.user_ u
  WHERE u.email_address_ = _email_address
    AND u.password_hash_ = pgcrypto_.crypt(_password, u.password_hash_);

  IF _user_uuid IS NULL THEN
    RAISE 'Email address and password do not match.' USING ERRCODE = '20000';
  END IF;

  SELECT x.value_ INTO _secret
  FROM security_.secret_ x
  WHERE x.name_ = 'jwt_hs256';

  IF _secret IS NULL THEN
    RAISE 'Invalid secret configuration.' USING ERRCODE = '55000';
  END IF;

  INSERT INTO security_.login_ (uuid_, user_uuid_, jwt_)
  VALUES (_uuid, _user_uuid, internal_.jwt_sign_hs256_(
    json_build_object(
      'iss', 'duely.app',
      'sub', _user_uuid,
      'jwi', _uuid,
      'iat', _iat
    ),
    _secret
  ))
  RETURNING * INTO _login;

  RETURN _login;
END
$$;


ALTER FUNCTION operation_.log_in_user_(_email_address text, _password text) OWNER TO postgres;

--
-- Name: log_out_user_(text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.log_out_user_(_jwt text) RETURNS security_.login_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _login security_.login_;
BEGIN
  UPDATE security_.login_
  SET
    log_out_at_ = CURRENT_TIMESTAMP
  WHERE jwt_ = _jwt
  AND log_out_at_ IS NULL
  RETURNING * INTO _login;

  IF _login IS NULL THEN
    RAISE 'Invalid JWT.' USING ERRCODE = '20000';
  END IF;

  RETURN _login;
END
$$;


ALTER FUNCTION operation_.log_out_user_(_jwt text) OWNER TO postgres;

--
-- Name: user_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.user_ (
    uuid_ uuid NOT NULL,
    email_address_ text,
    password_hash_ text,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.user_ OWNER TO postgres;

--
-- Name: sign_up_user_(text, text, text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.sign_up_user_(_email_address text, _verification_code text, _name text, _password text) RETURNS security_.user_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _email_address_verification_matches integer;
  _user security_.user_;
BEGIN
  DELETE FROM security_.email_address_verification_
  WHERE started_at_ < (CURRENT_TIMESTAMP - '1 day'::interval);

  DELETE FROM security_.email_address_verification_
    WHERE email_address_ = lower(_email_address)
      AND verification_code_ = _verification_code;

  GET DIAGNOSTICS _email_address_verification_matches = ROW_COUNT;

  IF _email_address_verification_matches = 0 THEN
    RAISE 'No matching email address verification code found: %', lower(_email_address) USING ERRCODE = '20000';
  END IF;

  WITH _subject AS (
    INSERT INTO security_.subject_ (name_)
    VALUES (_name)
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
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
-- Name: raise_if_no_active_permission_(text, text); Type: PROCEDURE; Schema: security_; Owner: postgres
--

CREATE PROCEDURE security_.raise_if_no_active_permission_(_subdomain_name text, _operation_name text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF (
    WITH 
      _operation_assignment AS (
        SELECT oa.permission_uuid_
        FROM security_.operation_ o
        JOIN security_.operation_assignment_ oa ON o.uuid_ = oa.operation_uuid_
        WHERE o.name_ = _operation_name
      )
    SELECT (
      SELECT count(oa.permission_uuid_)
      FROM _operation_assignment oa
    ) = (
     SELECT count(ap.permission_uuid_)
     FROM security_.active_permission_ ap
     JOIN security_.subdomain_ d ON d.uuid_ = ap.subdomain_uuid_
     JOIN _operation_assignment oa ON oa.permission_uuid_ = ap.permission_uuid_
     WHERE d.name_ = _subdomain_name
    )
  ) THEN
    RAISE 'Unauthorized.' USING ERRCODE = '42501';
  END IF;
END
$$;


ALTER PROCEDURE security_.raise_if_no_active_permission_(_subdomain_name text, _operation_name text) OWNER TO postgres;

--
-- Name: raise_if_no_active_session_(); Type: PROCEDURE; Schema: security_; Owner: postgres
--

CREATE PROCEDURE security_.raise_if_no_active_session_()
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM security_.session_ se
    WHERE se.uuid_ = COALESCE(current_setting('security_.session_.uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text)::uuid
      AND se.end_at_ IS NULL
  ) THEN
    RAISE 'No active session. Application user is requred to log in and begin a session.' USING ERRCODE = '42501';
  END IF;
END
$$;


ALTER PROCEDURE security_.raise_if_no_active_session_() OWNER TO postgres;

--
-- Name: service_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.service_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    agency_uuid_ uuid NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.service_ OWNER TO postgres;

--
-- Name: agency_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.agency_ (
    uuid_ uuid,
    subdomain_uuid_ uuid,
    name_ text,
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.agency_ OWNER TO postgres;

--
-- Name: service_; Type: TABLE; Schema: application__audit_; Owner: postgres
--

CREATE TABLE application__audit_.service_ (
    uuid_ uuid,
    agency_uuid_ uuid,
    name_ text,
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE application__audit_.service_ OWNER TO postgres;

--
-- Name: subject_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.subject_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.subject_ OWNER TO postgres;

--
-- Name: active_user_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.active_user_ AS
 SELECT s.uuid_,
    s.name_
   FROM security_.subject_ s
  WHERE (s.uuid_ = (current_setting('security_.login_.user_uuid_'::text, true))::uuid);


ALTER TABLE security_.active_user_ OWNER TO postgres;

--
-- Name: group_assignment_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.group_assignment_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    group_uuid_ uuid NOT NULL,
    subject_uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.group_assignment_ OWNER TO postgres;

--
-- Name: active_group_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.active_group_ AS
 WITH RECURSIVE _group_assignment(group_uuid_, subject_uuid_) AS (
         SELECT ga_1.group_uuid_,
            ga_1.subject_uuid_
           FROM (security_.group_assignment_ ga_1
             JOIN security_.active_user_ au ON ((au.uuid_ = ga_1.subject_uuid_)))
        UNION
         SELECT ga_1.group_uuid_,
            ga_1.subject_uuid_
           FROM (security_.group_assignment_ ga_1
             JOIN _group_assignment ON ((ga_1.subject_uuid_ = _group_assignment.group_uuid_)))
        )
 SELECT s.uuid_,
    s.name_
   FROM (security_.subject_ s
     JOIN _group_assignment ga ON ((s.uuid_ = ga.group_uuid_)));


ALTER TABLE security_.active_group_ OWNER TO postgres;

--
-- Name: active_subject_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.active_subject_ AS
 SELECT u.uuid_,
    u.name_
   FROM security_.active_user_ u
UNION
 SELECT g.uuid_,
    g.name_
   FROM security_.active_group_ g;


ALTER TABLE security_.active_subject_ OWNER TO postgres;

--
-- Name: role_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.role_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.role_hierarchy_ OWNER TO postgres;

--
-- Name: subject_assignment_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.subject_assignment_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    role_uuid_ uuid NOT NULL,
    subdomain_uuid_ uuid NOT NULL,
    subject_uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.subject_assignment_ OWNER TO postgres;

--
-- Name: active_role_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.active_role_ AS
 WITH RECURSIVE _subject_assignment(role_uuid_, subdomain_uuid_) AS (
         SELECT DISTINCT sa.role_uuid_,
            sa.subdomain_uuid_
           FROM (security_.subject_assignment_ sa
             JOIN security_.active_subject_ s ON ((s.uuid_ = sa.subject_uuid_)))
        ), _role_hierarchy(role_uuid_, subrole_uuid_, subdomain_uuid_) AS (
         SELECT rh.role_uuid_,
            rh.subrole_uuid_,
            sa.subdomain_uuid_
           FROM (security_.role_hierarchy_ rh
             JOIN _subject_assignment sa ON ((rh.role_uuid_ = sa.role_uuid_)))
        UNION
         SELECT rh.role_uuid_,
            rh.subrole_uuid_,
            _role_hierarchy.subdomain_uuid_
           FROM (security_.role_hierarchy_ rh
             JOIN _role_hierarchy ON ((rh.role_uuid_ = _role_hierarchy.subrole_uuid_)))
        ), _role(uuid_, subdomain_uuid_) AS (
         SELECT rh.role_uuid_ AS uuid_,
            rh.subdomain_uuid_
           FROM _role_hierarchy rh
        UNION
         SELECT rh.subrole_uuid_ AS uuid_,
            rh.subdomain_uuid_
           FROM _role_hierarchy rh
        )
 SELECT r.uuid_,
    r.name_,
    _role.subdomain_uuid_
   FROM (security_.role_ r
     JOIN _role ON ((r.uuid_ = _role.uuid_)));


ALTER TABLE security_.active_role_ OWNER TO postgres;

--
-- Name: permission_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.permission_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.permission_ OWNER TO postgres;

--
-- Name: permission_assignment_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.permission_assignment_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    permission_uuid_ uuid NOT NULL,
    role_uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.permission_assignment_ OWNER TO postgres;

--
-- Name: active_permission_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.active_permission_ AS
 SELECT p.uuid_,
    p.name_,
    ar.subdomain_uuid_
   FROM ((security_.permission_ p
     JOIN security_.permission_assignment_ pa ON ((p.uuid_ = pa.permission_uuid_)))
     JOIN security_.active_role_ ar ON ((ar.uuid_ = pa.role_uuid_)));


ALTER TABLE security_.active_permission_ OWNER TO postgres;

--
-- Name: group_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.group_ (
    uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.group_ OWNER TO postgres;

--
-- Name: operation_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.operation_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.operation_ OWNER TO postgres;

--
-- Name: operation_assignment_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.operation_assignment_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    operation_uuid_ uuid NOT NULL,
    permission_uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.operation_assignment_ OWNER TO postgres;

--
-- Name: secret_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.secret_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    value_ bytea NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.secret_ OWNER TO postgres;

--
-- Name: subdomain_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.subdomain_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.login_.user_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.email_address_verification_ OWNER TO postgres;

--
-- Name: group_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.group_ (
    uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.group_ OWNER TO postgres;

--
-- Name: group_assignment_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.group_assignment_ (
    uuid_ uuid,
    group_uuid_ uuid,
    subject_uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.group_assignment_ OWNER TO postgres;

--
-- Name: operation_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.operation_ (
    uuid_ uuid,
    name_ text,
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.operation_ OWNER TO postgres;

--
-- Name: operation_assignment_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.operation_assignment_ (
    uuid_ uuid,
    operation_uuid_ uuid,
    permission_uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.operation_assignment_ OWNER TO postgres;

--
-- Name: permission_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.permission_ (
    uuid_ uuid,
    name_ text,
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.permission_ OWNER TO postgres;

--
-- Name: permission_assignment_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.permission_assignment_ (
    uuid_ uuid,
    permission_uuid_ uuid,
    role_uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.permission_assignment_ OWNER TO postgres;

--
-- Name: role_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.role_ (
    uuid_ uuid,
    name_ text,
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
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
    audit_by_ uuid,
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
    audit_by_ uuid,
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
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.subdomain_ OWNER TO postgres;

--
-- Name: subject_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.subject_ (
    uuid_ uuid,
    name_ text,
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.subject_ OWNER TO postgres;

--
-- Name: subject_assignment_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.subject_assignment_ (
    uuid_ uuid,
    role_uuid_ uuid,
    subdomain_uuid_ uuid,
    subject_uuid_ uuid,
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.subject_assignment_ OWNER TO postgres;

--
-- Name: user_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.user_ (
    uuid_ uuid,
    email_address_ text,
    password_hash_ text,
    audit_at_ timestamp with time zone,
    audit_by_ uuid,
    audit_op_ character(1) DEFAULT 'I'::bpchar NOT NULL
);


ALTER TABLE security__audit_.user_ OWNER TO postgres;

--
-- Data for Name: agency_; Type: TABLE DATA; Schema: application_; Owner: postgres
--

COPY application_.agency_ (uuid_, subdomain_uuid_, name_, audit_at_, audit_by_) FROM stdin;
\.


--
-- Data for Name: service_; Type: TABLE DATA; Schema: application_; Owner: postgres
--

COPY application_.service_ (uuid_, agency_uuid_, name_, audit_at_, audit_by_) FROM stdin;
\.


--
-- Data for Name: agency_; Type: TABLE DATA; Schema: application__audit_; Owner: postgres
--

COPY application__audit_.agency_ (uuid_, subdomain_uuid_, name_, audit_at_, audit_by_, audit_op_) FROM stdin;
\.


--
-- Data for Name: service_; Type: TABLE DATA; Schema: application__audit_; Owner: postgres
--

COPY application__audit_.service_ (uuid_, agency_uuid_, name_, audit_at_, audit_by_, audit_op_) FROM stdin;
\.


--
-- Data for Name: operation_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.operation_ (uuid_, name_, audit_at_, audit_by_) FROM stdin;
c865b482-975b-49b3-845f-dfa39f46a7f1	delete_agency_	2019-07-16 05:36:29.597649+03	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: operation_assignment_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.operation_assignment_ (uuid_, operation_uuid_, permission_uuid_, audit_at_, audit_by_) FROM stdin;
98328d08-8bff-4946-a736-99c1ced69c6f	c865b482-975b-49b3-845f-dfa39f46a7f1	5a612763-ebb3-41be-9d5e-625fd7702dbd	2019-07-16 05:42:15.516451+03	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: permission_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.permission_ (uuid_, name_, audit_at_, audit_by_) FROM stdin;
5a612763-ebb3-41be-9d5e-625fd7702dbd	delete agency	2019-07-16 05:39:24.834295+03	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: permission_assignment_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.permission_assignment_ (uuid_, permission_uuid_, role_uuid_, audit_at_, audit_by_) FROM stdin;
059f6e90-00f0-4536-bac2-53b85c1e6306	5a612763-ebb3-41be-9d5e-625fd7702dbd	be9432a6-2c74-4030-b59e-d657662a4f92	2019-07-16 05:45:10.921758+03	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: role_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.role_ (uuid_, name_, audit_at_, audit_by_) FROM stdin;
be9432a6-2c74-4030-b59e-d657662a4f92	owner	2019-07-16 04:41:54.479641+03	00000000-0000-0000-0000-000000000000
566af82a-e5cf-4aad-aada-4341edb3e088	agent	2019-07-16 08:33:21.845779+03	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: role_hierarchy_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.role_hierarchy_ (uuid_, role_uuid_, subrole_uuid_, audit_at_, audit_by_) FROM stdin;
66eb47ab-1dee-49ab-9b2d-e6fdcb2c26f5	be9432a6-2c74-4030-b59e-d657662a4f92	566af82a-e5cf-4aad-aada-4341edb3e088	2019-07-16 08:54:18.10028+03	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: subdomain_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.subdomain_ (uuid_, name_, audit_at_, audit_by_) FROM stdin;
\.


--
-- Data for Name: operation_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.operation_ (uuid_, name_, audit_at_, audit_by_, audit_op_) FROM stdin;
c865b482-975b-49b3-845f-dfa39f46a7f1	delete_agency_	2019-07-16 05:36:29.597649+03	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: operation_assignment_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.operation_assignment_ (uuid_, operation_uuid_, permission_uuid_, audit_at_, audit_by_, audit_op_) FROM stdin;
98328d08-8bff-4946-a736-99c1ced69c6f	c865b482-975b-49b3-845f-dfa39f46a7f1	5a612763-ebb3-41be-9d5e-625fd7702dbd	2019-07-16 05:42:15.516451+03	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: permission_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.permission_ (uuid_, name_, audit_at_, audit_by_, audit_op_) FROM stdin;
5a612763-ebb3-41be-9d5e-625fd7702dbd	delete agency	2019-07-16 05:39:24.834295+03	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: permission_assignment_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.permission_assignment_ (uuid_, permission_uuid_, role_uuid_, audit_at_, audit_by_, audit_op_) FROM stdin;
059f6e90-00f0-4536-bac2-53b85c1e6306	5a612763-ebb3-41be-9d5e-625fd7702dbd	be9432a6-2c74-4030-b59e-d657662a4f92	2019-07-16 05:45:10.921758+03	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: role_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.role_ (uuid_, name_, audit_at_, audit_by_, audit_op_) FROM stdin;
be9432a6-2c74-4030-b59e-d657662a4f92	owner	2019-07-16 04:41:54.479641+03	00000000-0000-0000-0000-000000000000	I
566af82a-e5cf-4aad-aada-4341edb3e088	agent	2019-07-16 08:33:21.845779+03	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: role_hierarchy_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.role_hierarchy_ (uuid_, role_uuid_, subrole_uuid_, audit_at_, audit_by_, audit_op_) FROM stdin;
66eb47ab-1dee-49ab-9b2d-e6fdcb2c26f5	be9432a6-2c74-4030-b59e-d657662a4f92	566af82a-e5cf-4aad-aada-4341edb3e088	2019-07-16 08:54:18.10028+03	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: subdomain_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.subdomain_ (uuid_, name_, audit_at_, audit_by_, audit_op_) FROM stdin;
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
-- Name: group_ group__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.group_
    ADD CONSTRAINT group__pkey PRIMARY KEY (uuid_);


--
-- Name: group_assignment_ group_assignment__group_uuid__subject_uuid__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.group_assignment_
    ADD CONSTRAINT group_assignment__group_uuid__subject_uuid__key UNIQUE (group_uuid_, subject_uuid_);


--
-- Name: group_assignment_ group_assignment__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.group_assignment_
    ADD CONSTRAINT group_assignment__pkey PRIMARY KEY (uuid_);


--
-- Name: login_ login__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.login_
    ADD CONSTRAINT login__pkey PRIMARY KEY (uuid_);


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
-- Name: operation_assignment_ operation_assignment__operation_uuid__permission_uuid__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.operation_assignment_
    ADD CONSTRAINT operation_assignment__operation_uuid__permission_uuid__key UNIQUE (operation_uuid_, permission_uuid_);


--
-- Name: permission_ permission__name__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.permission_
    ADD CONSTRAINT permission__name__key UNIQUE (name_);


--
-- Name: permission_ permission__pkey; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.permission_
    ADD CONSTRAINT permission__pkey PRIMARY KEY (uuid_);


--
-- Name: permission_assignment_ permission_assignment__permission_uuid__role_uuid__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.permission_assignment_
    ADD CONSTRAINT permission_assignment__permission_uuid__role_uuid__key UNIQUE (permission_uuid_, role_uuid_);


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
-- Name: agency_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.agency_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: service_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON application_.service_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: agency_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.agency_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON application_.service_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: agency_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON application_.service_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: agency_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.agency_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON application_.service_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: agency_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: service_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON application_.service_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: agency_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.agency_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: service_ tr_after_update_notify_json_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON application_.service_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: agency_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.agency_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: service_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: application_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON application_.service_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: subject_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.subject_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: subdomain_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.subdomain_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: group_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.group_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: user_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.user_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: email_address_verification_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.email_address_verification_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: secret_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.secret_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: group_assignment_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.group_assignment_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: role_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.role_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: permission_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.permission_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: operation_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.operation_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: subject_assignment_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.subject_assignment_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: permission_assignment_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.permission_assignment_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: operation_assignment_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.operation_assignment_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: role_hierarchy_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.role_hierarchy_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: subject_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON security_.subject_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: subdomain_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON security_.subdomain_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: group_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON security_.group_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: user_ tr_after_delete_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_notify_json_ AFTER DELETE ON security_.user_ REFERENCING OLD TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: subject_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.subject_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subdomain_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.subdomain_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: group_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.group_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: user_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.user_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: email_address_verification_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.email_address_verification_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: secret_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.secret_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: group_assignment_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.group_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: role_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.role_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: permission_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.permission_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: operation_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.operation_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subject_assignment_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.subject_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: permission_assignment_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.permission_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: operation_assignment_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.operation_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: role_hierarchy_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.role_hierarchy_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subject_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON security_.subject_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: subdomain_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON security_.subdomain_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: group_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON security_.group_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: user_ tr_after_insert_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_notify_json_ AFTER INSERT ON security_.user_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: subject_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.subject_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subdomain_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.subdomain_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: group_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.group_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: user_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.user_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: email_address_verification_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.email_address_verification_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: secret_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.secret_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: group_assignment_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.group_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: role_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.role_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: permission_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.permission_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: operation_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.operation_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subject_assignment_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.subject_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: permission_assignment_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.permission_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: operation_assignment_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.operation_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: role_hierarchy_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.role_hierarchy_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subject_ tr_after_update_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON security_.subject_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: subdomain_ tr_after_update_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON security_.subdomain_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: group_ tr_after_update_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON security_.group_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: user_ tr_after_update_notify_json_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_notify_json_ AFTER UPDATE ON security_.user_ REFERENCING NEW TABLE AS _transition_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.notify_json_();


--
-- Name: subject_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.subject_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: subdomain_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.subdomain_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: group_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.group_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: user_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.user_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: email_address_verification_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.email_address_verification_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: secret_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.secret_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: group_assignment_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.group_assignment_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: role_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.role_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: permission_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.permission_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: operation_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.operation_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: subject_assignment_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.subject_assignment_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: permission_assignment_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.permission_assignment_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: operation_assignment_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.operation_assignment_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: role_hierarchy_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.role_hierarchy_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: agency_ agency__subdomain_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.agency_
    ADD CONSTRAINT agency__subdomain_uuid__fkey FOREIGN KEY (subdomain_uuid_) REFERENCES security_.subdomain_(uuid_);


--
-- Name: service_ service__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_
    ADD CONSTRAINT service__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_);


--
-- Name: group_ group__uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.group_
    ADD CONSTRAINT group__uuid__fkey FOREIGN KEY (uuid_) REFERENCES security_.subject_(uuid_);


--
-- Name: group_assignment_ group_assignment__group_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.group_assignment_
    ADD CONSTRAINT group_assignment__group_uuid__fkey FOREIGN KEY (group_uuid_) REFERENCES security_.group_(uuid_);


--
-- Name: group_assignment_ group_assignment__subject_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.group_assignment_
    ADD CONSTRAINT group_assignment__subject_uuid__fkey FOREIGN KEY (subject_uuid_) REFERENCES security_.subject_(uuid_);


--
-- Name: login_ login__user_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.login_
    ADD CONSTRAINT login__user_uuid__fkey FOREIGN KEY (user_uuid_) REFERENCES security_.user_(uuid_);


--
-- Name: operation_assignment_ operation_assignment__operation_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.operation_assignment_
    ADD CONSTRAINT operation_assignment__operation_uuid__fkey FOREIGN KEY (operation_uuid_) REFERENCES security_.operation_(uuid_);


--
-- Name: operation_assignment_ operation_assignment__permission_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.operation_assignment_
    ADD CONSTRAINT operation_assignment__permission_uuid__fkey FOREIGN KEY (permission_uuid_) REFERENCES security_.permission_(uuid_);


--
-- Name: permission_assignment_ permission_assignment__permission_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.permission_assignment_
    ADD CONSTRAINT permission_assignment__permission_uuid__fkey FOREIGN KEY (permission_uuid_) REFERENCES security_.permission_(uuid_);


--
-- Name: permission_assignment_ permission_assignment__role_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.permission_assignment_
    ADD CONSTRAINT permission_assignment__role_uuid__fkey FOREIGN KEY (role_uuid_) REFERENCES security_.role_(uuid_);


--
-- Name: role_hierarchy_ role_hierarchy__role_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.role_hierarchy_
    ADD CONSTRAINT role_hierarchy__role_uuid__fkey FOREIGN KEY (role_uuid_) REFERENCES security_.role_(uuid_);


--
-- Name: role_hierarchy_ role_hierarchy__subrole_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.role_hierarchy_
    ADD CONSTRAINT role_hierarchy__subrole_uuid__fkey FOREIGN KEY (subrole_uuid_) REFERENCES security_.role_(uuid_);


--
-- Name: session_ session__login_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.session_
    ADD CONSTRAINT session__login_uuid__fkey FOREIGN KEY (login_uuid_) REFERENCES security_.login_(uuid_);


--
-- Name: subject_assignment_ subject_assignment__role_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.subject_assignment_
    ADD CONSTRAINT subject_assignment__role_uuid__fkey FOREIGN KEY (role_uuid_) REFERENCES security_.role_(uuid_);


--
-- Name: subject_assignment_ subject_assignment__subdomain_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.subject_assignment_
    ADD CONSTRAINT subject_assignment__subdomain_uuid__fkey FOREIGN KEY (subdomain_uuid_) REFERENCES security_.subdomain_(uuid_) ON DELETE CASCADE;


--
-- Name: subject_assignment_ subject_assignment__subject_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.subject_assignment_
    ADD CONSTRAINT subject_assignment__subject_uuid__fkey FOREIGN KEY (subject_uuid_) REFERENCES security_.subject_(uuid_);


--
-- Name: user_ user__uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.user_
    ADD CONSTRAINT user__uuid__fkey FOREIGN KEY (uuid_) REFERENCES security_.subject_(uuid_);


--
-- Name: SCHEMA operation_; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA operation_ TO PUBLIC;


--
-- PostgreSQL database dump complete
--

