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

CALL internal_.drop_notifications_('application_.service_');
CALL internal_.drop_auditing_('application_.service_');

ALTER TABLE ONLY application_.client_
    ADD CONSTRAINT client__pkey PRIMARY KEY (uuid_);

ALTER TABLE application_.service_ DROP COLUMN price_;
ALTER TABLE application_.service_ DROP COLUMN description_;
ALTER TABLE application_.service_ DROP COLUMN duration_;
ALTER TABLE application_.service_ DROP COLUMN currency_;
ALTER TABLE application_.service_ DROP COLUMN image_logo_uuid_;
ALTER TABLE application_.service_ DROP COLUMN image_hero_uuid_;

CREATE TABLE application_.service_variant_ (
    uuid_ uuid DEFAULT pgcrypto_.gen_random_uuid() PRIMARY KEY,
    service_uuid_ uuid NOT NULL REFERENCES application_.service_ (uuid_),
    name_ text NOT NULL,
    status_ text DEFAULT 'draft'::text NOT NULL,
    description_ text,
    duration_ text,
    price_ integer,
    currency_ text,
    image_logo_uuid_ uuid REFERENCES application_.image_(uuid_),
    image_hero_uuid_ uuid REFERENCES application_.image_(uuid_),
    UNIQUE (service_uuid_, name_)
);

ALTER TABLE application_.service_ ADD COLUMN default_variant_uuid_ uuid REFERENCES application_.service_variant_ (uuid_);


CALL internal_.setup_notifications_('application_.service_');
CALL internal_.setup_auditing_('application_.service_');
CALL internal_.setup_notifications_('application_.service_variant_');
CALL internal_.setup_auditing_('application_.service_variant_');


CREATE FUNCTION operation_.query_service_variant_(_service_variant_uuid uuid) RETURNS TABLE(uuid_ uuid, name_ text, service_uuid_ uuid, status_ text, description_ text, duration_ text, price_ integer, currency_ text, image_logo_uuid_ uuid, image_hero_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _service_variant_uuid service_variant_uuid_, s.service_uuid_, s.agency_uuid_, s.status_ service_status_, v.status_ service_variant_status_ INTO _arg
  FROM application_.service_variant_ v
  JOIN application_.service_ s ON s.uuid_ = v.service_uuid_
  WHERE v.uuid_ = _service_variant_uuid;
  PERFORM security_.control_operation_('query_service_variant_', _arg);

  RETURN QUERY
  SELECT v.uuid_, v.name_, v.service_uuid_, v.status_, v.description_, v.duration_, v.price_, v.currency_, v.image_logo_uuid_, v.image_hero_uuid_
  FROM application_.service_variant_ v
  WHERE v.uuid_ = _service_variant_uuid;

END
$$;

CREATE FUNCTION operation_.query_service_variant_by_service_(_service_uuid uuid, _status text[] DEFAULT NULL::text[]) RETURNS TABLE(uuid_ uuid, name_ text, service_uuid_ uuid, status_ text, description_ text, duration_ text, price_ integer, currency_ text, image_logo_uuid_ uuid, image_hero_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT s.uuid_ service_uuid_, s.agency_uuid_, s.status_ service_status_, _status service_variant_status_ INTO _arg
  FROM  application_.service_ s
  WHERE s.uuid_ = _service_uuid;
  PERFORM security_.control_operation_('query_service_variant_by_service_', _arg);

  RETURN QUERY
  SELECT v.uuid_, v.name_, v.service_uuid_, v.status_, v.description_, v.duration_, v.price_, v.currency_, v.image_logo_uuid_, v.image_hero_uuid_
  FROM application_.service_variant_ v
  WHERE v.service_uuid_ = _service_uuid
    AND (_status IS NULL 
     OR v.status_ = ANY (COALESCE(_status, '{}'::text[])));

END
$$;

DROP FUNCTION operation_.query_service_by_agency_;

CREATE FUNCTION operation_.query_service_by_agency_(_agency_uuid uuid, _status text[] DEFAULT NULL::text[]) RETURNS TABLE(uuid_ uuid, name_ text, agency_uuid_ uuid, status_ text, default_variant_uuid_ uuid, default_variant_name_ text, description_ text, duration_ text, price_ integer, currency_ text, image_logo_uuid_ uuid, image_hero_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_, _status service_status_ INTO _arg; 
  PERFORM security_.control_operation_('query_service_by_agency_', _arg);

  RETURN QUERY
  SELECT s.uuid_, s.name_, s.agency_uuid_, s.status_, s.default_variant_uuid_, v.name_ default_variant_uuid_, v.description_, v.duration_, v.price_, v.currency_, v.image_logo_uuid_, v.image_hero_uuid_
  FROM application_.service_ s
  LEFT JOIN application_.service_variant_ v ON s.default_variant_uuid_ = v.uuid_
  WHERE s.agency_uuid_ = _agency_uuid
    AND (_status IS NULL 
     OR s.status_ = ANY (COALESCE(_status, '{}'::text[])));

END
$$;

DROP FUNCTION operation_.query_service_;

CREATE FUNCTION operation_.query_service_(_service_uuid uuid) RETURNS TABLE(uuid_ uuid, name_ text, agency_uuid_ uuid, status_ text, default_variant_uuid_ uuid, default_variant_name_ text, description_ text, duration_ text, price_ integer, currency_ text, image_logo_uuid_ uuid, image_hero_uuid_ uuid)
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
  SELECT s.uuid_, s.name_, s.agency_uuid_, s.status_, s.default_variant_uuid_, v.name_ default_variant_uuid_, v.description_, v.duration_, v.price_, v.currency_, v.image_logo_uuid_, v.image_hero_uuid_
  FROM application_.service_ s
  LEFT JOIN application_.service_variant_ v ON s.default_variant_uuid_ = v.uuid_
  WHERE s.uuid_ = _service_uuid;

END
$$;

INSERT INTO security_.operation_(name_, log_events_) VALUES ('query_service_variant_', 'f');
INSERT INTO security_.operation_(name_, log_events_) VALUES ('query_service_variant_by_service_', 'f');

PERFORM security_.implement_policy_allow_('query_service_variant_', 'agent_in_agency_');
PERFORM security_.implement_policy_allow_('query_service_variant_by_service_', 'agent_in_agency_');
PERFORM security_.implement_policy_allow_('query_service_variant_by_service_', 'service_variant_status_contains_only_live_',$$  
BEGIN
  RETURN (
    SELECT _arg.service_variant_status_ IS NOT NULL AND 'live' = ALL (_arg.service_variant_status_) AND 'live' = ANY (_arg.service_variant_status_)
  );
END
$$);

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
