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

CREATE OR REPLACE FUNCTION operation_.try_charge_credit_balance_(_token text, _amount bigint, _data jsonb) RETURNS bigint
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource_token_uuid uuid;
  _credit_balance application_.credit_balance_;
BEGIN
  IF _amount <= 0 THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  SELECT uuid_ INTO _resource_token_uuid
  FROM security_.resource_token_
  WHERE token_ = _token;

  IF _resource_token_uuid IS NULL THEN
    RETURN (SELECT -_amount);
  END IF;

  SELECT * INTO _credit_balance
  FROM application_.credit_balance_
  WHERE resource_token_uuid_ = _resource_token_uuid
  FOR UPDATE;

  IF _credit_balance.uuid_ IS NULL THEN
    RETURN (SELECT -_amount);
  END IF;

  IF _credit_balance.amount_ < _amount THEN
    RETURN (SELECT _credit_balance.amount_ - _amount);
  END IF;

  INSERT INTO application_.credit_balance_transaction_(credit_balance_uuid_, amount_, data_)
  SELECT _credit_balance.uuid_, -_amount, _data;

  RETURN (SELECT _credit_balance.amount_ - _amount);
END
$$;


CREATE OR REPLACE FUNCTION operation_.topup_credit_balance_(_token text, _amount bigint, _data jsonb, _agency_uuid uuid DEFAULT NULL) RETURNS bigint
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _resource_token_uuid uuid;
  _credit_balance application_.credit_balance_;
BEGIN
  IF _amount <= 0 THEN
    RAISE 'Unauthorized.' USING ERRCODE = 'DUNAU';
  END IF;

  SELECT uuid_ INTO _resource_token_uuid
  FROM security_.resource_token_
  WHERE token_ = _token;

  IF _resource_token_uuid IS NULL THEN
    INSERT INTO security_.resource_token_ (token_, keys_)
    SELECT _token, '{uuid_, resource_token_uuid_, agency_uuid_, amount_, data_}'::text[]
    RETURNING uuid_ INTO _resource_token_uuid;
  END IF;

  SELECT * INTO _credit_balance
  FROM application_.credit_balance_
  WHERE resource_token_uuid_ = _resource_token_uuid
  FOR UPDATE;

  IF _credit_balance.uuid_ IS NULL THEN
    INSERT INTO application_.credit_balance_ (resource_token_uuid_, agency_uuid_, amount_, data_)
    SELECT _resource_token_uuid, _agency_uuid, 0, _data
    RETURNING * INTO _credit_balance;

    UPDATE security_.resource_token_
    SET
      resource_uuid_ = _credit_balance.uuid_
    WHERE uuid_ = _resource_token_uuid;
  END IF;

  INSERT INTO application_.credit_balance_transaction_(credit_balance_uuid_, amount_, data_)
  SELECT _credit_balance.uuid_, _amount, _data;

  RETURN (SELECT _credit_balance.amount_ + _amount);
END
$$;

PERFORM security_.implement_policy_allow_('topup_credit_balance_', 'serviceaccount_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
