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

CREATE TABLE internal_.transaction_fee_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_subscription_uuid_ uuid NOT NULL REFERENCES internal_.agency_subscription_ (uuid_),
    numerator_ int NOT NULL DEFAULT 0,
    denominator_ int NOT NULL DEFAULT 10000,
    fixed_amout_ int NOT NULL DEFAULT 0,
    currency_ text NOT NULL,
    transaction_amount_upper_bound_ int,
    data_ jsonb NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE (agency_subscription_uuid_, transaction_amount_upper_bound_)
);
CALL internal_.setup_auditing_('internal_.transaction_fee_');
CALL internal_.setup_resource_('internal_.transaction_fee_', 'transaction fee', 'fee', '{uuid_, agency_subscription_uuid_, transaction_amount_upper_bound_}');

INSERT INTO internal_.transaction_fee_(agency_subscription_uuid_, numerator_, fixed_amout_, currency_, transaction_amount_upper_bound_)
SELECT s.uuid_, 100, 100, 'eur', 10000
FROM internal_.agency_subscription_ s
WHERE s.name_ = 'Basic plan';

INSERT INTO internal_.transaction_fee_(agency_subscription_uuid_, numerator_, fixed_amout_, currency_, transaction_amount_upper_bound_)
SELECT s.uuid_, 100, 0, 'eur', NULL
FROM internal_.agency_subscription_ s
WHERE s.name_ = 'Basic plan';

CREATE FUNCTION policy_.serviceaccount_can_query_transaction_fee_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_subscription_uuid_, numerator_, denominator_, fixed_amout_, currency_, transaction_amount_upper_bound_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('internal_.transaction_fee_', 'query', 'policy_.serviceaccount_can_query_transaction_fee_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
