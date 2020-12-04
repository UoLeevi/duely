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

INSERT INTO application_.notification_definition_(name_, description_, stripe_event_, feed_notification_enabled_, feed_notification_default_, email_notifications_enabled_, email_notifications_default_)
VALUES (
    'Successful sale',
    'Occurs on a successful purchase or payment for subscription',
    'payment_intent.succeeded',
    't',
    't',
    't',
    't'
);

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
