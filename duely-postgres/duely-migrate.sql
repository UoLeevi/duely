-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'Running migration...'
\set QUIET true

DO 
LANGUAGE plpgsql
$_$
DECLARE

BEGIN
-- MIGRATION CODE START

ALTER TABLE security_.session_ ADD COLUMN nesting_ int NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION operation_.begin_session_(_jwt text, _tag text DEFAULT NULL::text) RETURNS security_.session_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _claims json;
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

CREATE OR REPLACE FUNCTION operation_.end_session_() RETURNS security_.session_
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

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
