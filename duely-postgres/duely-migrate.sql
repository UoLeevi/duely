-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'MIGRATION STARTED'
\set QUIET true

DO 
LANGUAGE plpgsql
$_MIGRATION_$
DECLARE

BEGIN
-- MIGRATION CODE START

CALL internal_.drop_auditing_('application_.stripe_account_');
ALTER TABLE application_.stripe_account_ ADD COLUMN livemode_ boolean DEFAULT 'f';
ALTER TABLE ONLY application_.stripe_account_ ADD UNIQUE (agency_uuid_, livemode_);
ALTER TABLE ONLY application_.stripe_account_ DROP CONSTRAINT stripe_account__agency_uuid__key;
CALL internal_.setup_auditing_('application_.stripe_account_');
CALL internal_.setup_resource_('application_.stripe_account_', 'stripe account', 'stripe', '{uuid_, agency_uuid_, stripe_id_ext_, livemode_}', 'application_.agency_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
