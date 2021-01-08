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

UPDATE internal_.agency_price_
SET name_ = 'Basic plan small payout fee'
WHERE name_ = 'Free plan small payout fee';

UPDATE internal_.agency_subscription_
SET name_ = 'Basic plan'
WHERE name_ = 'Free plan';

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
