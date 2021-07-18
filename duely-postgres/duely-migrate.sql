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

CREATE TYPE public.publishing_status_ AS ENUM (
    'draft',
    'live'
);

CALL internal_.drop_auditing_('application_.price_');
ALTER TABLE application_.price_ ALTER COLUMN status_ DROP DEFAULT;
ALTER TABLE application_.price_ ALTER COLUMN status_ TYPE publishing_status_ USING status_::publishing_status_;
ALTER TABLE application_.price_ ALTER COLUMN status_ SET DEFAULT 'draft'::publishing_status_;
CALL internal_.setup_auditing_('application_.price_');

CALL internal_.drop_auditing_('application_.product_');
ALTER TABLE application_.product_ ALTER COLUMN status_ DROP DEFAULT;
ALTER TABLE application_.product_ ALTER COLUMN status_ TYPE publishing_status_ USING status_::publishing_status_;
ALTER TABLE application_.product_ ALTER COLUMN status_ SET DEFAULT 'draft'::publishing_status_;
CALL internal_.setup_auditing_('application_.product_');

-- CALL internal_.drop_auditing_('internal_.integration_type_');
ALTER TABLE internal_.integration_type_ ADD COLUMN title_ text;
ALTER TABLE internal_.integration_type_ ADD COLUMN status_ publishing_status_ DEFAULT 'draft' NOT NULL;

CALL internal_.setup_resource_('internal_.integration_type_', 'integration type', 'intetype', '{uuid_, config_form_uuid_, form_uuid_, name_, title_, status_}');

UPDATE internal_.integration_type_ 
SET 
  title_ = 'Teachable',
  status_ = 'live'
WHERE name_ = 'teachable/enroll';

UPDATE internal_.integration_type_ 
SET 
  title_ = 'ConvertKit',
  status_ = 'live'
WHERE name_ = 'convertkit/tag';

ALTER TABLE internal_.integration_type_ ALTER COLUMN title_ SET NOT NULL;

CALL internal_.setup_auditing_('internal_.integration_type_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
