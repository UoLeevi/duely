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

ALTER TABLE application_.order_ ADD COLUMN sort_key_ interval GENERATED ALWAYS AS (-(ordered_at_ - 'epoch')) STORED;
CALL internal_.setup_auditing_('application_.order_');

CREATE INDEX ON application_.order_ (sort_key_);

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
