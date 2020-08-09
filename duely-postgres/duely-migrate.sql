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

ALTER TABLE application_.client_ ALTER COLUMN invite_uuid_ DROP NOT NULL;
ALTER TABLE application_.client_ ALTER COLUMN subject_uuid_ DROP NOT NULL;

CREATE FUNCTION operation_.query_client_(_client_uuid uuid) RETURNS TABLE(uuid_ uuid, agency_uuid_ uuid, name_ text, email_address_ text, invite_uuid_ uuid, subject_uuid_ uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT c.agency_uuid_, _client_uuid client_uuid_ INTO _arg
  FROM application_.client_ c
  WHERE c.uuid_ = _client_uuid;
  PERFORM security_.control_operation_('query_client_', _arg);

  RETURN QUERY
  SELECT c.uuid_, c.agency_uuid_, c.name_, c.email_address_, c.invite_uuid_, c.subject_uuid_
  FROM application_.client_ c
  WHERE c.uuid_ = _client_uuid;

END
$$;

CREATE FUNCTION operation_.create_client_(_agency_uuid uuid, _name text, _email_address text DEFAULT NULL::text) RETURNS application_.client_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _client application_.client_;
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_, _name client_name_ INTO _arg; 
  PERFORM security_.control_operation_('create_client_', _arg);

  INSERT INTO application_.client_ (agency_uuid_, name_, email_address_)
  VALUES (_agency_uuid, _name, _email_address)
  RETURNING * INTO _client;

  RETURN _client;
END
$$;

CREATE FUNCTION operation_.delete_client_(_client_uuid uuid) RETURNS application_.client_
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _client application_.client_;
  _arg RECORD;
BEGIN
  SELECT _client_uuid client_uuid_, c.agency_uuid_ INTO _arg
  FROM application_.client_ c
  WHERE c.uuid_ = _client_uuid; 
  PERFORM security_.control_operation_('delete_client_', _arg);

  DELETE FROM application_.client_
  WHERE uuid_ = _client_uuid
  RETURNING * INTO _client;

  RETURN _client;
END
$$;

INSERT INTO security_.operation_(name_, log_events_) VALUES ('query_client_by_agency_', 'f');
INSERT INTO security_.operation_(name_, log_events_) VALUES ('query_client_', 'f');
INSERT INTO security_.operation_(name_, log_events_) VALUES ('create_client_', 't');
INSERT INTO security_.operation_(name_, log_events_) VALUES ('delete_client_', 't');

PERFORM security_.implement_policy_allow_('query_client_by_agency_', 'agent_in_agency_');
PERFORM security_.implement_policy_allow_('query_client_', 'agent_in_agency_');
PERFORM security_.implement_policy_allow_('create_client_', 'manager_in_agency_');
PERFORM security_.implement_policy_allow_('delete_client_', 'manager_in_agency_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
