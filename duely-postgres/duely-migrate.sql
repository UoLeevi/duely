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

CREATE OR REPLACE FUNCTION operation_.set_service_status_(_service_uuid uuid, _status text) RETURNS application_.service_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _service application_.service_;
  _arg RECORD;
BEGIN
  SELECT _service_uuid service_uuid_, _status service_status_, s.agency_uuid_ INTO _arg
  FROM application_.service_ s
  WHERE s.uuid_ = _service_uuid;
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

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
