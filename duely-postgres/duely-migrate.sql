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

CREATE TABLE application_.credit_balance_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_token_uuid_ uuid NOT NULL REFERENCES security_.resource_token_ (uuid_),
    agency_uuid_ uuid REFERENCES application_.agency_ (uuid_),
    amount_ bigint NOT NULL CHECK (amount_ >= 0),
    data_ jsonb NOT NULL DEFAULT '{}'::jsonb
);
CALL internal_.setup_resource_('application_.credit_balance_', 'credit balance', 'credbal', '{uuid_, resource_token_uuid_, agency_uuid_}', 'application_.agency_');

CREATE FUNCTION policy_.owner_can_query_credit_balance_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, resource_token_uuid_, agency_uuid_, amount_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
PERFORM security_.register_policy_('application_.credit_balance_', 'query', 'policy_.owner_can_query_credit_balance_');


CREATE FUNCTION policy_.serviceaccount_can_query_credit_balance_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, resource_token_uuid_, agency_uuid_, amount_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
PERFORM security_.register_policy_('application_.credit_balance_', 'query', 'policy_.serviceaccount_can_query_credit_balance_');

CREATE TABLE application_.credit_balance_transaction_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    credit_balance_uuid_ uuid NOT NULL REFERENCES application_.credit_balance_ (uuid_),
    amount_ bigint NOT NULL,
    date_ timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_ jsonb NOT NULL DEFAULT '{}'::jsonb
);
CALL internal_.setup_resource_('application_.credit_balance_transaction_', 'credit balance transaction', 'credtr', '{uuid_, credit_balance_uuid_}', 'application_.credit_balance_');

CALL internal_.setup_auditing_('application_.credit_balance_transaction_');

CREATE FUNCTION policy_.owner_can_query_credit_balance_transaction_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, credit_balance_uuid_, amount_, date_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
PERFORM security_.register_policy_('application_.credit_balance_transaction_', 'query', 'policy_.owner_can_query_credit_balance_transaction_');


CREATE FUNCTION policy_.serviceaccount_can_query_credit_balance_transaction_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, credit_balance_uuid_, amount_, date_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
PERFORM security_.register_policy_('application_.credit_balance_transaction_', 'query', 'policy_.serviceaccount_can_query_credit_balance_transaction_');


CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_create_credit_balance_transaction_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{credit_balance_uuid_, amount_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.credit_balance_transaction_', 'create', 'policy_.serviceaccount_can_create_credit_balance_transaction_');

CREATE FUNCTION internal_.update_credit_balance_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

  UPDATE application_.credit_balance_
  SET
    amount_ = amount_ + NEW.amount_
  WHERE uuid_ = NEW.credit_balance_uuid_;

  RETURN NULL;

END;
$$;

CREATE TRIGGER tr_after_insert_update_credit_balance_ AFTER INSERT ON application_.credit_balance_transaction_ FOR EACH ROW EXECUTE FUNCTION internal_.update_credit_balance_();


CREATE FUNCTION operation_.try_charge_credit_balance_(_token text, _amount bigint, _data jsonb) RETURNS bigint
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource_token security_.resource_token_;
  _credit_balance application_.credit_balance_;
BEGIN
  SELECT * INTO _resource_token
  FROM security_.resource_token_
  WHERE token_ = _token;

  IF _resource_token.uuid_ IS NULL THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  SELECT * INTO _credit_balance
  FROM application_.credit_balance_
  WHERE resource_token_uuid_ = _resource_token.uuid_
  FOR UPDATE;

  IF _credit_balance.uuid_ IS NULL THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  IF _credit_balance.amount_ < _amount THEN
    RETURN (SELECT _credit_balance.amount_ - _amount);
  END IF;

  INSERT INTO application_.credit_balance_transaction_(credit_balance_uuid_, amount_, data_)
  SELECT _credit_balance.uuid_, -_amount, _data;

  RETURN (SELECT _credit_balance.amount_ - _amount);
END
$$;

CREATE FUNCTION policy_.serviceaccount_(_arg anyelement DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ 
BEGIN
  RETURN internal_.check_current_user_is_serviceaccount_();
END;
$$;

PERFORM security_.implement_policy_allow_('try_charge_credit_balance_', 'serviceaccount_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
