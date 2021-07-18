-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'MIGRATION STARTED'
\set QUIET true

DO 
LANGUAGE plpgsql
$_MIGRATION_$
DECLARE
  _form_uuid uuid;
  _config_form_uuid uuid;
BEGIN
-- MIGRATION CODE START

CREATE FUNCTION internal_.insert_resource_token_for_sign_up_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO security_.resource_token_ (resource_uuid_, token_, keys_)
  SELECT _sign_up.uuid_, _sign_up.verification_code_, '{uuid_, user_uuid_, data_, verification_code_}'::text[]
  FROM _sign_up;

  RETURN NULL;
END
$$;

CREATE TRIGGER tr_after_insert_insert_resource_token_for_sign_up_ AFTER INSERT ON security_.sign_up_ REFERENCING NEW TABLE AS _sign_up FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_resource_token_for_sign_up_();


CREATE FUNCTION internal_.insert_resource_token_for_password_reset_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO security_.resource_token_ (resource_uuid_, token_, keys_)
  SELECT _password_reset.uuid_, _password_reset.verification_code_, '{uuid_, user_uuid_, data_, verification_code_}'::text[]
  FROM _password_reset;

  RETURN NULL;
END
$$;

CREATE TRIGGER tr_after_insert_insert_resource_token_for_password_reset_ AFTER INSERT ON security_.password_reset_ REFERENCING NEW TABLE AS _password_reset FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_resource_token_for_password_reset_();


-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
