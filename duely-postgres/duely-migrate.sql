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

INSERT INTO internal_.form_field_ (name_, type_, form_uuid_, default_, label_)
SELECT 'school_domain', 'text', i.form_uuid_, NULL, 'School domain name'
FROM internal_.integration_type_ i
WHERE i.name_ = 'teachable/enroll';

INSERT INTO internal_.form_field_ (name_, type_, form_uuid_, default_, label_)
SELECT 'product_id', 'text', i.form_uuid_, NULL, 'Product ID'
FROM internal_.integration_type_ i
WHERE i.name_ = 'teachable/enroll';

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
