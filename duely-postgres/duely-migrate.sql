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

CALL internal_.drop_auditing_('internal_.form_field_');
ALTER TABLE internal_.form_field_ ADD COLUMN prefix_ text;
ALTER TABLE internal_.form_field_ ADD COLUMN suffix_ text;
CALL internal_.setup_auditing_('internal_.form_field_');

CREATE OR REPLACE FUNCTION policy_.anyone_can_query_form_field_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, name_, label_, type_, hint_, required_, form_uuid_, sort_key_, default_, prefix_, suffix_}'::text[];
$$;

UPDATE internal_.form_field_
SET
  prefix_ = 'https://'
WHERE name_ IN (
  'school_domain'
);

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
