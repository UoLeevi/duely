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

UPDATE internal_.form_field_
SET required_ = 't'
WHERE name_ IN (
  'username',
  'password',
  'email_address'
);

UPDATE internal_.form_field_
SET
  hint_ = 'Domain name of the Teachable school',
  required_ = 't'
WHERE name_ IN (
  'school_domain'
);

UPDATE internal_.form_field_
SET 
  hint_ = 'ID of the Teachable product',
  required_ = 't'
WHERE name_ IN (
  'product_id'
);

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
