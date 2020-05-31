-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'Running migration...'
\set QUIET true

DO 
LANGUAGE plpgsql
$_$
DECLARE

BEGIN
-- MIGRATION CODE START

CREATE OR REPLACE FUNCTION operation_.edit_service_(_service_uuid uuid, _name text, _description text, _duration text, _price integer, _currency text, _image_logo_uuid uuid, _image_hero_uuid uuid) RETURNS application_.service_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _service application_.service_;
  _arg RECORD;
BEGIN
  SELECT _service_uuid service_uuid_, s.agency_uuid_ INTO _arg
  FROM application_.service_ s
  WHERE s.uuid_ = _service_uuid; 
  PERFORM security_.control_operation_('edit_service_', _arg);

  UPDATE application_.service_
  SET
    name_ = _name,
    description_ = _description,
    duration_ = _duration,
    price_ = _price,
    currency_ = _currency,
    image_logo_uuid_ = _image_logo_uuid,
    image_hero_uuid_ = _image_hero_uuid
  WHERE uuid_ = _service_uuid
  RETURNING * INTO _service;

  RETURN _service;
END
$$;

CREATE FUNCTION operation_.set_service_status_(_service_uuid uuid, _status text) RETURNS application_.service_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _service application_.service_;
  _arg RECORD;
BEGIN
  SELECT _service_uuid service_uuid_, _status service_status_ INTO _arg;
  PERFORM security_.control_operation_('set_service_status_', _arg);

  IF _status NOT IN ('draft', 'live') THEN
    RAISE 'Invalid service status: %', _status USING ERRCODE = '20000';
  END IF;

  UPDATE application_.service_
  SET
    status_ = _status
  WHERE uuid_ = _service_uuid
  RETURNING * INTO _service;

  RETURN _service;
END
$$;

INSERT INTO security_.operation_ (name_, log_events_) VALUES ('set_service_status_', 't');

PERFORM security_.implement_policy_allow_('set_service_status_', 'manager_in_agency_');


-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
