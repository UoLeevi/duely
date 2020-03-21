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

CALL internal_.drop_auditing_('application_.service_');

ALTER TABLE application_.service_ ADD COLUMN description_ text;
ALTER TABLE application_.service_ ADD COLUMN duration_ text;
ALTER TABLE application_.service_ ADD COLUMN price_ int;
ALTER TABLE application_.service_ ADD COLUMN currency_ text;
ALTER TABLE application_.service_ ADD COLUMN image_logo_uuid_ uuid REFERENCES application_.image_ (uuid_);
ALTER TABLE application_.service_ ADD COLUMN image_hero_uuid_ uuid REFERENCES application_.image_ (uuid_);

CALL internal_.setup_auditing_('application_.service_');

CREATE FUNCTION operation_.edit_service_(_service_uuid uuid, _name text, _description text, _duration text, _price int, _currency text, _image_logo_uuid uuid, _image_hero_uuid uuid) RETURNS application_.service_
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
  RETURNING * INTO _service;

  RETURN _service;
END
$$;

INSERT INTO security_.operation_ (name_, log_events_) VALUES ('edit_service_', 't');

PERFORM security_.implement_policy_allow_('edit_service_', 'manager_in_agency_');

DROP FUNCTION operation_.query_service_;

CREATE FUNCTION operation_.query_service_(_service_uuid uuid) RETURNS TABLE(uuid_ uuid, name_ text, agency_uuid_ uuid, status_ text, description_ text, duration_ text, price_ int, currency_ text, image_logo_uuid_ uuid, image_hero_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _service_uuid service_uuid_, s.agency_uuid_, s.status_ service_status_ INTO _arg
  FROM application_.service_ s
  WHERE s.uuid_ = _service_uuid;
  PERFORM security_.control_operation_('query_service_', _arg);

  RETURN QUERY
  SELECT s.uuid_, s.name_, s.agency_uuid_, s.status_, s.description_, s.duration_, s.price_, s.currency_, s.image_logo_uuid_, s.image_hero_uuid_
  FROM application_.service_ s
  WHERE s.uuid_ = _service_uuid;

END
$$;

DROP FUNCTION operation_.query_service_by_agency_;

CREATE FUNCTION operation_.query_service_by_agency_(_agency_uuid uuid, _status text[] DEFAULT NULL::text[]) RETURNS TABLE(uuid_ uuid, name_ text, agency_uuid_ uuid, status_ text, description_ text, duration_ text, price_ int, currency_ text, image_logo_uuid_ uuid, image_hero_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_, _status service_status_ INTO _arg; 
  PERFORM security_.control_operation_('query_service_by_agency_', _arg);

  RETURN QUERY
  SELECT s.uuid_, s.name_, s.agency_uuid_, s.status_, s.description_, s.duration_, s.price_, s.currency_, s.image_logo_uuid_, s.image_hero_uuid_
  FROM application_.service_ s
  WHERE s.agency_uuid_ = _agency_uuid
    AND (_status IS NULL 
     OR s.status_ = ANY (COALESCE(_status, '{}'::text[])));

END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
