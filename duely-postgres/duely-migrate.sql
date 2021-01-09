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

CREATE OR REPLACE PROCEDURE internal_.drop_resource_(_table regclass)
    LANGUAGE plpgsql
    AS $$
DECLARE
  _table_name name;
  _table_schema name;
BEGIN
  DELETE FROM security_.resource_definition_
  WHERE table_ = _table;

  EXECUTE '
    DROP TRIGGER tr_after_insert_resource_insert_ ON ' || _table || ';
    DROP TRIGGER tr_after_update_resource_update_ ON ' || _table || ';
    DROP TRIGGER tr_after_delete_resource_delete_ ON ' || _table || ';
  ';
END
$$;

DELETE FROM security_.policy_
WHERE function_ = 'policy_.serviceaccount_can_query_transaction_fee_(security_.resource_definition_,application_.resource_)'::regprocedure;

DROP FUNCTION policy_.serviceaccount_can_query_transaction_fee_;

CALL internal_.drop_auditing_('internal_.transaction_fee_');

DELETE FROM application_.resource_ r
USING security_.resource_definition_ d
WHERE r.definition_uuid_ = d.uuid_
  AND d.table_ = 'internal_.transaction_fee_'::regclass;

CALL internal_.drop_resource_('internal_.transaction_fee_');
DROP TABLE internal_.transaction_fee_;

DELETE FROM security_.policy_
WHERE function_ = 'policy_.serviceaccount_can_query_agency_price_(security_.resource_definition_,application_.resource_)'::regprocedure;

DROP FUNCTION policy_.serviceaccount_can_query_agency_price_;

CALL internal_.drop_auditing_('internal_.agency_price_');

DELETE FROM application_.resource_ r
USING security_.resource_definition_ d
WHERE r.definition_uuid_ = d.uuid_
  AND d.table_ = 'internal_.agency_price_'::regclass;

CALL internal_.drop_resource_('internal_.agency_price_');
DROP TABLE internal_.agency_price_;

DELETE FROM security_.policy_
WHERE function_ = 'policy_.serviceaccount_can_query_agency_subscription_(security_.resource_definition_,application_.resource_)'::regprocedure;

DROP FUNCTION policy_.serviceaccount_can_query_agency_subscription_;

CALL internal_.drop_auditing_('internal_.agency_subscription_');

DELETE FROM application_.resource_ r
USING security_.resource_definition_ d
WHERE r.definition_uuid_ = d.uuid_
  AND d.table_ = 'internal_.agency_subscription_'::regclass;

CALL internal_.drop_resource_('internal_.agency_subscription_');
DROP TABLE internal_.agency_subscription_;


CREATE TABLE internal_.subscription_plan_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ text NOT NULL UNIQUE,
    stripe_prod_id_ext_live_ text NULL,
    stripe_prod_id_ext_test_ text NULL,
    data_ jsonb NOT NULL DEFAULT '{}'::jsonb
);
CALL internal_.setup_auditing_('internal_.subscription_plan_');
CALL internal_.setup_resource_('internal_.subscription_plan_', 'subscription plan', 'subplan', '{uuid_, name_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_}');

INSERT INTO internal_.subscription_plan_(name_)
VALUES ('Basic plan');

CREATE FUNCTION policy_.serviceaccount_can_query_subscription_plan_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, name_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE FUNCTION policy_.anyone_can_query_subscription_plan_basic_fields_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, name_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('internal_.subscription_plan_', 'query', 'policy_.serviceaccount_can_query_subscription_plan_');
PERFORM security_.register_policy_('internal_.subscription_plan_', 'query', 'policy_.anyone_can_query_subscription_plan_basic_fields_');


CALL internal_.drop_auditing_('application_.agency_');
ALTER TABLE application_.agency_ ADD COLUMN subscription_plan_uuid_ uuid REFERENCES internal_.subscription_plan_ (uuid_);

UPDATE application_.agency_ a
SET subscription_plan_uuid_ = p.uuid_
FROM internal_.subscription_plan_ p
WHERE p.name_ = 'Basic plan';

ALTER TABLE application_.agency_ ALTER COLUMN subscription_plan_uuid_ SET NOT NULL;

CALL internal_.setup_auditing_('application_.agency_');

CREATE FUNCTION internal_.set_subscription_plan_to_basic_plan_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _subscription_plan_uuid uuid;
BEGIN
  SELECT uuid_ INTO _subscription_plan_uuid
  FROM internal_.subscription_plan_
  WHERE name_ = 'Basic plan';

  NEW.subscription_plan_uuid_ := _subscription_plan_uuid;
  RETURN NEW;
END
$$;

CREATE TRIGGER tr_before_insert_set_subscription_plan_to_basic_plan_ BEFORE INSERT ON application_.agency_ FOR EACH ROW EXECUTE FUNCTION internal_.set_subscription_plan_to_basic_plan_();

CREATE FUNCTION policy_.serviceaccount_can_query_agency_subscription_plan_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, subscription_plan_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE FUNCTION policy_.agent_can_query_agency_subscription_plan_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, subscription_plan_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.agency_', 'query', 'policy_.serviceaccount_can_query_agency_subscription_plan_');
PERFORM security_.register_policy_('application_.agency_', 'query', 'policy_.agent_can_query_agency_subscription_plan_');


CREATE TABLE internal_.transaction_fee_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_plan_uuid_ uuid NOT NULL REFERENCES internal_.subscription_plan_ (uuid_) ON DELETE CASCADE,
    numerator_ int NOT NULL DEFAULT 0,
    denominator_ int NOT NULL DEFAULT 10000,
    fixed_amout_ int NOT NULL DEFAULT 0,
    currency_ text NOT NULL,
    transaction_amount_upper_bound_ int,
    data_ jsonb NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE (subscription_plan_uuid_, transaction_amount_upper_bound_)
);
CALL internal_.setup_auditing_('internal_.transaction_fee_');
CALL internal_.setup_resource_('internal_.transaction_fee_', 'transaction fee', 'txnfee', '{uuid_, subscription_plan_uuid_, transaction_amount_upper_bound_}', 'internal_.subscription_plan_');

INSERT INTO internal_.transaction_fee_(subscription_plan_uuid_, numerator_, fixed_amout_, currency_, transaction_amount_upper_bound_)
SELECT s.uuid_, 100, 100, 'eur', 10000
FROM internal_.subscription_plan_ s
WHERE s.name_ = 'Basic plan';

INSERT INTO internal_.transaction_fee_(subscription_plan_uuid_, numerator_, fixed_amout_, currency_, transaction_amount_upper_bound_)
SELECT s.uuid_, 100, 0, 'eur', NULL
FROM internal_.subscription_plan_ s
WHERE s.name_ = 'Basic plan';

CREATE FUNCTION policy_.serviceaccount_can_query_transaction_fee_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, subscription_plan_uuid_, numerator_, denominator_, fixed_amout_, currency_, transaction_amount_upper_bound_, data_}'::text[];
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
