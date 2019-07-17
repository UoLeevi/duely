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
    COALESCE(current_setting('security_.token_.subject_uuid_', 't'), '00000000-0000-0000-0000-000000000000')::uuid, 
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
  NEW.audit_by_ := COALESCE(current_setting('security_.token_.subject_uuid_', 't'), '00000000-0000-0000-0000-000000000000')::uuid;
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
    'ALTER TABLE %1$I.%2$I ADD COLUMN audit_by_ uuid NOT NULL NOT NULL DEFAULT COALESCE(current_setting(''security_.token_.subject_uuid_'', ''t''), ''00000000-0000-0000-0000-000000000000'')::uuid;'
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
    begin_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_at_ timestamp with time zone,
    token_uuid_ uuid NOT NULL,
    tag_ text
);


ALTER TABLE security_.session_ OWNER TO postgres;

--
-- Name: begin_session_(text, text); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.begin_session_(_jwt text, _tag text) RETURNS security_.session_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _claims json;
  _token_uuid uuid;
  _subject_uuid uuid;
  _session security_.session_;
BEGIN
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
-- Name: token_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.token_ (
    uuid_ uuid NOT NULL,
    subject_uuid_ uuid NOT NULL,
    issued_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    revoked_at_ timestamp with time zone,
    jwt_ text NOT NULL
);


ALTER TABLE security_.token_ OWNER TO postgres;

--
-- Name: begin_visit_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.begin_visit_() RETURNS security_.token_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _uuid uuid := pgcrypto_.gen_random_uuid();
  _iat bigint := FLOOR(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP));
  _subject_uuid uuid;
  _secret bytea;
  _token security_.token_;
BEGIN
  INSERT INTO security_.subject_ (name_, type_)
  VALUES ('', 'visitor')
  RETURNING uuid_ INTO _subject_uuid;

  SELECT x.value_ INTO _secret
  FROM security_.secret_ x
  WHERE x.name_ = 'jwt_hs256';

  IF _secret IS NULL THEN
    RAISE 'Invalid secret configuration.' USING ERRCODE = '55000';
  END IF;

  INSERT INTO security_.token_ (uuid_, subject_uuid_, jwt_)
  VALUES (_uuid, _user_uuid, internal_.jwt_sign_hs256_(
    json_build_object(
      'iss', 'duely.app',
      'sub', _subject_uuid,
      'jwi', _uuid,
      'iat', _iat
    ),
    _secret
  ))
  RETURNING * INTO _token;

  RETURN _token;
END
$$;


ALTER FUNCTION operation_.begin_visit_() OWNER TO postgres;

--
-- Name: agency_; Type: TABLE; Schema: application_; Owner: postgres
--

CREATE TABLE application_.agency_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    subdomain_uuid_ uuid NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE application_.service_ OWNER TO postgres;

--
-- Name: create_service_(text, uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.create_service_(_name text, _agency_uuid uuid) RETURNS application_.service_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _subdomain_name text;
  _service application_.service_;
BEGIN
  CALL security_.raise_if_no_active_session_();

  SELECT d.name_ INTO _subdomain_name
  FROM security_.subdomain_ d
  JOIN application_.agency_ a ON d.uuid_ = a.subdomain_uuid_
  WHERE a.uuid_ = _agency_uuid;

  CALL security_.raise_if_no_active_permission_(_subdomain_name, 'create_service_');

  INSERT INTO application_.service_ (agency_uuid_, name_)
  VALUES (_agency_uuid, _name)
  RETURNING * INTO _service;

  RETURN _service;
END
$$;


ALTER FUNCTION operation_.create_service_(_name text, _agency_uuid uuid) OWNER TO postgres;

--
-- Name: delete_agency_(uuid); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.delete_agency_(_agency_uuid uuid) RETURNS application_.agency_
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
  WHERE a.uuid_ = _agency_uuid;

  CALL security_.raise_if_no_active_permission_(_subdomain_name, 'delete_agency_');

  DELETE FROM application_.agency_
  WHERE name_ = _name
  RETURNING * INTO _agency;

  DELETE FROM security_.subdomain_
  WHERE name_ = _subdomain_name;

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
  _subdomain_name text;
  _service application_.service_;
BEGIN
  CALL security_.raise_if_no_active_session_();

  SELECT d.name_ INTO _subdomain_name
  FROM security_.subdomain_ d
  JOIN application_.agency_ a ON d.uuid_ = a.subdomain_uuid_
  JOIN application_.service_ s ON a.uuid_ = s.agency_uuid_;

  CALL security_.raise_if_no_active_permission_(_subdomain_name, 'delete_service_');

  DELETE FROM application_.service_
  WHERE name_ = _name
  RETURNING * INTO _service;

  RETURN _service;
END
$$;


ALTER FUNCTION operation_.delete_service_(_service_uuid uuid) OWNER TO postgres;

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

  PERFORM set_config('security_.token_.subject_uuid_', '00000000-0000-0000-0000-000000000000', 'f');
  PERFORM set_config('security_.session_.uuid_', '00000000-0000-0000-0000-000000000000', 'f');

  RETURN _session;
END
$$;


ALTER FUNCTION operation_.end_session_() OWNER TO postgres;

--
-- Name: end_visit_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.end_visit_() RETURNS security_.token_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _token security_.token_;
BEGIN
  UPDATE security_.token_ t
  SET
    revoked_at_ = CURRENT_TIMESTAMP
  FROM security_.session_ se
  JOIN security_.subject_ s ON s.uuid_ = se.subdomain_uuid_
  WHERE t.uuid_ = se.token_uuid_
  AND t.revoked_at_ IS NULL
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

CREATE FUNCTION operation_.log_in_user_(_email_address text, _password text) RETURNS security_.token_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _uuid uuid := pgcrypto_.gen_random_uuid();
  _iat bigint := FLOOR(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP));
  _user_uuid uuid;
  _token security_.token_;
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

  INSERT INTO security_.token_ (uuid_, subject_uuid_, jwt_)
  VALUES (_uuid, _user_uuid, internal_.jwt_sign_hs256_(
    json_build_object(
      'iss', 'duely.app',
      'sub', _user_uuid,
      'jwi', _uuid,
      'iat', _iat
    ),
    _secret
  ))
  RETURNING * INTO _token;

  RETURN _token;
END
$$;


ALTER FUNCTION operation_.log_in_user_(_email_address text, _password text) OWNER TO postgres;

--
-- Name: log_out_at_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.log_out_at_() RETURNS security_.token_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _token security_.token_;
BEGIN
  UPDATE security_.token_ t
  SET
    revoke_at_ = CURRENT_TIMESTAMP
  FROM security_.session_ se
  JOIN security_.subject_ s ON s.uuid_ = se.subdomain_uuid_
  WHERE t.uuid_ = se.token_uuid_
  AND t.revoke_at_ IS NULL
  AND s.type_ = 'user'
  AND se.uuid_ = current_setting('security_.session_.uuid_'::text, false)::uuid
  RETURNING * INTO _token;

  RETURN _token;
END
$$;


ALTER FUNCTION operation_.log_out_at_() OWNER TO postgres;

--
-- Name: log_out_user_(); Type: FUNCTION; Schema: operation_; Owner: postgres
--

CREATE FUNCTION operation_.log_out_user_() RETURNS security_.token_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _token security_.token_;
BEGIN
  UPDATE security_.token_ t
  SET
    revoked_at_ = CURRENT_TIMESTAMP
  FROM security_.session_ se
  JOIN security_.subject_ s ON s.uuid_ = se.subdomain_uuid_
  WHERE t.uuid_ = se.token_uuid_
  AND t.revoked_at_ IS NULL
  AND s.type_ = 'user'
  AND se.uuid_ = current_setting('security_.session_.uuid_'::text, false)::uuid
  RETURNING * INTO _token;

  RETURN _token;
END
$$;


ALTER FUNCTION operation_.log_out_user_() OWNER TO postgres;

--
-- Name: user_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.user_ (
    uuid_ uuid NOT NULL,
    email_address_ text,
    password_hash_ text,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
-- Name: operation_assignment_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.operation_assignment_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    operation_uuid_ uuid NOT NULL,
    permission_uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.operation_assignment_ OWNER TO postgres;

--
-- Name: assign_operation_(text, text); Type: FUNCTION; Schema: security_; Owner: postgres
--

CREATE FUNCTION security_.assign_operation_(_operation_name text, _permission_name text) RETURNS security_.operation_assignment_
    LANGUAGE plpgsql
    AS $$
DECLARE
  _operation_assignment security_.operation_assignment_;
BEGIN
  INSERT INTO security_.operation_ (name_)
  VALUES (_operation_name)
  ON CONFLICT DO NOTHING;

  INSERT INTO security_.permission_ (name_)
  VALUES (_permission_name)
  ON CONFLICT DO NOTHING;

  INSERT INTO security_.operation_assignment_ (operation_uuid_, permission_uuid_)
  SELECT o.uuid_, p.uuid_
  FROM security_.operation_ o, security_.permission_ p
  WHERE o.name_ = _operation_name
    AND p.name_ = _permission_name
  RETURNING * INTO _operation_assignment;

  RETURN _operation_assignment;
END
$$;


ALTER FUNCTION security_.assign_operation_(_operation_name text, _permission_name text) OWNER TO postgres;

--
-- Name: permission_assignment_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.permission_assignment_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    permission_uuid_ uuid NOT NULL,
    role_uuid_ uuid NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.permission_assignment_ OWNER TO postgres;

--
-- Name: assign_permission_(text, text); Type: FUNCTION; Schema: security_; Owner: postgres
--

CREATE FUNCTION security_.assign_permission_(_permission_name text, _role_name text) RETURNS security_.permission_assignment_
    LANGUAGE plpgsql
    AS $$
DECLARE
  _permission_assignment security_.permission_assignment_;
BEGIN
  INSERT INTO security_.permission_ (name_)
  VALUES (_permission_name)
  ON CONFLICT DO NOTHING;

  INSERT INTO security_.role_ (name_)
  VALUES (_role_name)
  ON CONFLICT DO NOTHING;

  INSERT INTO security_.permission_assignment_ (permission_uuid_, role_uuid_)
  SELECT p.uuid_, r.uuid_
  FROM security_.permission_ p, security_.role_ r
  WHERE p.name_ = _permission_name
    AND r.name_ = _role_name
  RETURNING * INTO _permission_assignment;

  RETURN _permission_assignment;
END
$$;


ALTER FUNCTION security_.assign_permission_(_permission_name text, _role_name text) OWNER TO postgres;

--
-- Name: raise_if_no_active_permission_(text, text); Type: PROCEDURE; Schema: security_; Owner: postgres
--

CREATE PROCEDURE security_.raise_if_no_active_permission_(_subdomain_name text, _operation_name text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NOT (
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
     SELECT count(ap.uuid_)
     FROM security_.active_permission_ ap
     JOIN security_.subdomain_ d ON d.uuid_ = ap.subdomain_uuid_
     JOIN _operation_assignment oa ON ap.uuid_ = oa.permission_uuid_
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
    type_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.subject_ OWNER TO postgres;

--
-- Name: active_subject_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.active_subject_ AS
 SELECT s.uuid_,
    s.name_,
    s.type_
   FROM security_.subject_ s
  WHERE (s.uuid_ = (current_setting('security_.token_.subject_uuid_'::text, true))::uuid);


ALTER TABLE security_.active_subject_ OWNER TO postgres;

--
-- Name: role_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.role_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.permission_ OWNER TO postgres;

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
-- Name: view_permission_; Type: VIEW; Schema: operation_; Owner: postgres
--

CREATE VIEW operation_.view_permission_ AS
 SELECT active_permission_.uuid_,
    active_permission_.name_,
    active_permission_.subdomain_uuid_
   FROM security_.active_permission_;


ALTER TABLE operation_.view_permission_ OWNER TO postgres;

--
-- Name: view_role_; Type: VIEW; Schema: operation_; Owner: postgres
--

CREATE VIEW operation_.view_role_ AS
 SELECT active_role_.uuid_,
    active_role_.name_,
    active_role_.subdomain_uuid_
   FROM security_.active_role_;


ALTER TABLE operation_.view_role_ OWNER TO postgres;

--
-- Name: active_user_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.active_user_ AS
 SELECT s.uuid_,
    s.name_
   FROM (security_.active_subject_ s
     JOIN security_.user_ u ON ((s.uuid_ = u.uuid_)));


ALTER TABLE security_.active_user_ OWNER TO postgres;

--
-- Name: view_user_; Type: VIEW; Schema: operation_; Owner: postgres
--

CREATE VIEW operation_.view_user_ AS
 SELECT active_user_.uuid_,
    active_user_.name_
   FROM security_.active_user_;


ALTER TABLE operation_.view_user_ OWNER TO postgres;

--
-- Name: authorized_operation_; Type: VIEW; Schema: security_; Owner: postgres
--

CREATE VIEW security_.authorized_operation_ AS
 SELECT NULL::uuid AS uuid_,
    NULL::text AS name_,
    NULL::uuid AS subdomain_uuid_;


ALTER TABLE security_.authorized_operation_ OWNER TO postgres;

--
-- Name: operation_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.operation_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    require_subject_type_ text,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
);


ALTER TABLE security_.secret_ OWNER TO postgres;

--
-- Name: subdomain_; Type: TABLE; Schema: security_; Owner: postgres
--

CREATE TABLE security_.subdomain_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() NOT NULL,
    name_ text NOT NULL,
    audit_at_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    audit_by_ uuid DEFAULT (COALESCE(current_setting('security_.token_.subject_uuid_'::text, true), '00000000-0000-0000-0000-000000000000'::text))::uuid NOT NULL
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
-- Name: operation_; Type: TABLE; Schema: security__audit_; Owner: postgres
--

CREATE TABLE security__audit_.operation_ (
    uuid_ uuid,
    name_ text,
    require_subject_type_ text,
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
    type_ text,
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
-- Data for Name: email_address_verification_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.email_address_verification_ (uuid_, email_address_, verification_code_, started_at_, audit_at_, audit_by_) FROM stdin;
\.


--
-- Data for Name: operation_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.operation_ (uuid_, name_, require_subject_type_, audit_at_, audit_by_) FROM stdin;
8614cf3d-3076-499f-bff9-77b0157fcf67	view_subdomain_	\N	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
a3fb73d8-9812-4860-8dc9-4b4117a90b26	view_agency_	\N	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
2810c88f-564b-43fd-9bb6-6a522860bdb5	view_service_	\N	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
12ba3162-4b08-46cf-bf69-f8db5f6c291d	log_out_user_	user	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
a1c956c8-b64e-41ba-af40-d3c16721b04e	log_in_user_	visitor	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
93fe889a-e329-4701-9222-3caba3028f23	sign_up_user_	visitor	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	start_email_address_verification_	visitor	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
1ddaf7a8-4cf5-4518-9bc4-78e18b27fc0d	begin_session_	none	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
a9dab653-7a23-4f10-b166-49f1e33fcb8b	end_session_	\N	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
a5acd829-bced-4d98-8c5c-8f29e14c8116	create_agency_	user	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
c865b482-975b-49b3-845f-dfa39f46a7f1	delete_agency_	user	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
45cf7669-6e10-4c99-bf14-af25985a7f0f	delete_service_	user	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
fa4b4c5f-160f-413b-b77a-beee70108f0a	create_service_	user	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
e427f688-9873-45bf-b255-0fc8aefb6b8c	begin_visit_	none	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
d950afbf-6d26-4aef-a1d2-26d07ef8623f	end_visit_	visitor	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: operation_assignment_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.operation_assignment_ (uuid_, operation_uuid_, permission_uuid_, audit_at_, audit_by_) FROM stdin;
98328d08-8bff-4946-a736-99c1ced69c6f	c865b482-975b-49b3-845f-dfa39f46a7f1	5a612763-ebb3-41be-9d5e-625fd7702dbd	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
1eb99f92-bfa6-45d1-be4d-9a878d749c63	fa4b4c5f-160f-413b-b77a-beee70108f0a	0927d2d7-cec2-42b2-b4bc-26f52ded6877	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
df9caca7-f0b4-450e-8b07-80fa7d581756	45cf7669-6e10-4c99-bf14-af25985a7f0f	0927d2d7-cec2-42b2-b4bc-26f52ded6877	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: permission_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.permission_ (uuid_, name_, audit_at_, audit_by_) FROM stdin;
5a612763-ebb3-41be-9d5e-625fd7702dbd	delete agency	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
0927d2d7-cec2-42b2-b4bc-26f52ded6877	manage services	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: permission_assignment_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.permission_assignment_ (uuid_, permission_uuid_, role_uuid_, audit_at_, audit_by_) FROM stdin;
059f6e90-00f0-4536-bac2-53b85c1e6306	5a612763-ebb3-41be-9d5e-625fd7702dbd	be9432a6-2c74-4030-b59e-d657662a4f92	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
9053fc8c-7178-4b52-890e-10161a63cbfb	0927d2d7-cec2-42b2-b4bc-26f52ded6877	e2370fd9-0389-48e6-a9c0-1b1c0b078a75	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: role_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.role_ (uuid_, name_, audit_at_, audit_by_) FROM stdin;
be9432a6-2c74-4030-b59e-d657662a4f92	owner	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
566af82a-e5cf-4aad-aada-4341edb3e088	agent	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
e2370fd9-0389-48e6-a9c0-1b1c0b078a75	manager	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: role_hierarchy_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.role_hierarchy_ (uuid_, role_uuid_, subrole_uuid_, audit_at_, audit_by_) FROM stdin;
64cef996-c748-4ea1-b2a2-0ffc0f4f16ec	be9432a6-2c74-4030-b59e-d657662a4f92	e2370fd9-0389-48e6-a9c0-1b1c0b078a75	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
040f5548-7b4e-420e-a852-4c4d3cc011c4	e2370fd9-0389-48e6-a9c0-1b1c0b078a75	566af82a-e5cf-4aad-aada-4341edb3e088	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000
\.


--
-- Data for Name: token_; Type: TABLE DATA; Schema: security_; Owner: postgres
--

COPY security_.token_ (uuid_, subject_uuid_, issued_at_, revoked_at_, jwt_) FROM stdin;
\.


--
-- Data for Name: email_address_verification_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.email_address_verification_ (uuid_, email_address_, verification_code_, started_at_, audit_at_, audit_by_, audit_op_) FROM stdin;
\.


--
-- Data for Name: operation_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.operation_ (uuid_, name_, require_subject_type_, audit_at_, audit_by_, audit_op_) FROM stdin;
c865b482-975b-49b3-845f-dfa39f46a7f1	delete_agency_	user	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
fa4b4c5f-160f-413b-b77a-beee70108f0a	create_service_	user	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
45cf7669-6e10-4c99-bf14-af25985a7f0f	delete_service_	user	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
8614cf3d-3076-499f-bff9-77b0157fcf67	view_subdomain_	\N	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
a3fb73d8-9812-4860-8dc9-4b4117a90b26	view_agency_	\N	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
2810c88f-564b-43fd-9bb6-6a522860bdb5	view_service_	\N	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
f7f9bcab-1bd2-48b8-982b-ee2f10d984d8	start_email_address_verification_	visitor	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
93fe889a-e329-4701-9222-3caba3028f23	sign_up_user_	visitor	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
a1c956c8-b64e-41ba-af40-d3c16721b04e	log_in_user_	visitor	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
12ba3162-4b08-46cf-bf69-f8db5f6c291d	log_out_user_	user	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
1ddaf7a8-4cf5-4518-9bc4-78e18b27fc0d	begin_session_	none	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
a9dab653-7a23-4f10-b166-49f1e33fcb8b	end_session_	\N	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
a5acd829-bced-4d98-8c5c-8f29e14c8116	create_agency_	user	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
e427f688-9873-45bf-b255-0fc8aefb6b8c	begin_visit_	none	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
d950afbf-6d26-4aef-a1d2-26d07ef8623f	end_visit_	visitor	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: operation_assignment_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.operation_assignment_ (uuid_, operation_uuid_, permission_uuid_, audit_at_, audit_by_, audit_op_) FROM stdin;
98328d08-8bff-4946-a736-99c1ced69c6f	c865b482-975b-49b3-845f-dfa39f46a7f1	5a612763-ebb3-41be-9d5e-625fd7702dbd	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
1eb99f92-bfa6-45d1-be4d-9a878d749c63	fa4b4c5f-160f-413b-b77a-beee70108f0a	0927d2d7-cec2-42b2-b4bc-26f52ded6877	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
df9caca7-f0b4-450e-8b07-80fa7d581756	45cf7669-6e10-4c99-bf14-af25985a7f0f	0927d2d7-cec2-42b2-b4bc-26f52ded6877	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: permission_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.permission_ (uuid_, name_, audit_at_, audit_by_, audit_op_) FROM stdin;
5a612763-ebb3-41be-9d5e-625fd7702dbd	delete agency	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
0927d2d7-cec2-42b2-b4bc-26f52ded6877	manage services	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: permission_assignment_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.permission_assignment_ (uuid_, permission_uuid_, role_uuid_, audit_at_, audit_by_, audit_op_) FROM stdin;
059f6e90-00f0-4536-bac2-53b85c1e6306	5a612763-ebb3-41be-9d5e-625fd7702dbd	be9432a6-2c74-4030-b59e-d657662a4f92	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
9053fc8c-7178-4b52-890e-10161a63cbfb	0927d2d7-cec2-42b2-b4bc-26f52ded6877	e2370fd9-0389-48e6-a9c0-1b1c0b078a75	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: role_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.role_ (uuid_, name_, audit_at_, audit_by_, audit_op_) FROM stdin;
be9432a6-2c74-4030-b59e-d657662a4f92	owner	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
566af82a-e5cf-4aad-aada-4341edb3e088	agent	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
e2370fd9-0389-48e6-a9c0-1b1c0b078a75	manager	1970-01-01 02:00:00+02	00000000-0000-0000-0000-000000000000	I
\.


--
-- Data for Name: role_hierarchy_; Type: TABLE DATA; Schema: security__audit_; Owner: postgres
--

COPY security__audit_.role_hierarchy_ (uuid_, role_uuid_, subrole_uuid_, audit_at_, audit_by_, audit_op_) FROM stdin;
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
-- Name: token_ token__jwt__key; Type: CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.token_
    ADD CONSTRAINT token__jwt__key UNIQUE (jwt_);


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
-- Name: subdomain_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.subdomain_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


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
-- Name: role_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.role_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: permission_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.permission_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


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
-- Name: operation_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.operation_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


--
-- Name: subject_ tr_after_delete_audit_delete_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_delete_audit_delete_ AFTER DELETE ON security_.subject_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_delete_();


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
-- Name: subdomain_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.subdomain_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


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
-- Name: role_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.role_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: permission_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.permission_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


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
-- Name: operation_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.operation_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subject_ tr_after_insert_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_insert_audit_insert_or_update_ AFTER INSERT ON security_.subject_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


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
-- Name: subdomain_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.subdomain_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


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
-- Name: role_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.role_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: permission_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.permission_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


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
-- Name: operation_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.operation_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


--
-- Name: subject_ tr_after_update_audit_insert_or_update_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_after_update_audit_insert_or_update_ AFTER UPDATE ON security_.subject_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.audit_insert_or_update_();


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
-- Name: subdomain_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.subdomain_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


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
-- Name: role_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.role_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: permission_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.permission_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


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
-- Name: operation_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.operation_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: subject_ tr_before_update_audit_stamp_; Type: TRIGGER; Schema: security_; Owner: postgres
--

CREATE TRIGGER tr_before_update_audit_stamp_ BEFORE UPDATE ON security_.subject_ FOR EACH ROW EXECUTE PROCEDURE internal_.audit_stamp_();


--
-- Name: agency_ agency__subdomain_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.agency_
    ADD CONSTRAINT agency__subdomain_uuid__fkey FOREIGN KEY (subdomain_uuid_) REFERENCES security_.subdomain_(uuid_) ON DELETE CASCADE;


--
-- Name: service_ service__agency_uuid__fkey; Type: FK CONSTRAINT; Schema: application_; Owner: postgres
--

ALTER TABLE ONLY application_.service_
    ADD CONSTRAINT service__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;


--
-- Name: operation_assignment_ operation_assignment__operation_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.operation_assignment_
    ADD CONSTRAINT operation_assignment__operation_uuid__fkey FOREIGN KEY (operation_uuid_) REFERENCES security_.operation_(uuid_) ON DELETE CASCADE;


--
-- Name: operation_assignment_ operation_assignment__permission_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.operation_assignment_
    ADD CONSTRAINT operation_assignment__permission_uuid__fkey FOREIGN KEY (permission_uuid_) REFERENCES security_.permission_(uuid_) ON DELETE CASCADE;


--
-- Name: permission_assignment_ permission_assignment__permission_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.permission_assignment_
    ADD CONSTRAINT permission_assignment__permission_uuid__fkey FOREIGN KEY (permission_uuid_) REFERENCES security_.permission_(uuid_) ON DELETE CASCADE;


--
-- Name: permission_assignment_ permission_assignment__role_uuid__fkey; Type: FK CONSTRAINT; Schema: security_; Owner: postgres
--

ALTER TABLE ONLY security_.permission_assignment_
    ADD CONSTRAINT permission_assignment__role_uuid__fkey FOREIGN KEY (role_uuid_) REFERENCES security_.role_(uuid_) ON DELETE CASCADE;


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

