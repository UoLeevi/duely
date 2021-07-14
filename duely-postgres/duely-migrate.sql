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

UPDATE internal_.integration_type_ it
SET
  credential_type_uuid_ = ct.uuid_,
  config_form_uuid_ = _form_uuid,
  automatic_order_management_ = 't'
FROM internal_.credential_type_ ct
WHERE ct.name_ = 'basic-email'
  AND it.name_ = 'teachable/enroll';

UPDATE internal_.form_field_ ff
SET
  form_uuid_ = _form_uuid
FROM internal_.integration_type_ it
WHERE it.name_ = 'teachable/enroll'
  AND ff.name_ = 'school_domain';

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
