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

CREATE TABLE internal_.agency_price_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ text NOT NULL,
    stripe_id_ext_ text NOT NULL,
    livemode_ boolean NOT NULL,
    data_ jsonb NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE (name_, livemode_)
);
CALL internal_.setup_auditing_('internal_.agency_price_');
CALL internal_.setup_resource_('internal_.agency_price_', 'agency price', 'agcyprice', '{uuid_, name_, stripe_id_ext_, livemode_}');

INSERT INTO internal_.agency_price_(name_, livemode_, stripe_id_ext_, data_)
VALUES ('Free plan small payout fee', 'f', 'price_1I6diAJ63WXDoaGF7SJ5pRSH', '{"threshold": 30000}'::jsonb);

CREATE FUNCTION policy_.serviceaccount_can_query_agency_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, name_, stripe_id_ext_, livemode_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('internal_.agency_price_', 'query', 'policy_.serviceaccount_can_query_agency_price_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
