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
BEGIN
-- MIGRATION CODE START

INSERT INTO internal_.form_ (uuid_) VALUES (DEFAULT) RETURNING uuid_ INTO _form_uuid;

INSERT INTO internal_.credential_type_ (name_, form_uuid_) VALUES ('basic-email', _form_uuid);

INSERT INTO internal_.form_field_ (name_, type_, form_uuid_, default_, label_)
SELECT 'email_address', 'email', t.form_uuid_, NULL, 'Email address'
FROM internal_.credential_type_ t
WHERE t.form_uuid_ = _form_uuid;

INSERT INTO internal_.form_field_ (name_, type_, form_uuid_, default_, label_)
SELECT 'password', 'password', t.form_uuid_, NULL, 'Password'
FROM internal_.credential_type_ t
WHERE t.form_uuid_ = _form_uuid;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
