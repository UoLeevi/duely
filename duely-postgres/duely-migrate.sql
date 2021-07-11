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
BEGIN
-- MIGRATION CODE START

CREATE TABLE application_.integration_config_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_type_uuid_ uuid NOT NULL REFERENCES internal_.integration_type_ (uuid_),
    agency_uuid_ uuid NOT NULL REFERENCES application_.agency_ (uuid_),
    credential_uuid_ uuid REFERENCES application_.credential_ (uuid_),
    data_ jsonb NOT NULL,
    name_ text NOT NULL,
    UNIQUE (name_, agency_uuid_)
);
CALL internal_.setup_resource_('application_.integration_config_', 'integration config', 'inteconf', '{uuid_, integration_type_uuid_, agency_uuid_, name_}', 'application_.agency_');

CREATE FUNCTION policy_.owner_can_query_integration_config_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, integration_type_uuid_, agency_uuid_, credential_uuid_, name_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
PERFORM security_.register_policy_('application_.integration_config_', 'query', 'policy_.owner_can_query_integration_config_');


CREATE FUNCTION policy_.serviceaccount_can_query_integration_config_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, integration_type_uuid_, agency_uuid_, credential_uuid_, name_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
PERFORM security_.register_policy_('application_.integration_config_', 'query', 'policy_.serviceaccount_can_query_integration_config_');

PERFORM security_.register_policy_('application_.integration_config_', 'delete', 'policy_.only_owner_can_delete_');

CREATE OR REPLACE FUNCTION policy_.owner_can_change_integration_config_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{credential_uuid_, name_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.integration_config_', 'update', 'policy_.owner_can_change_integration_config_');


CREATE OR REPLACE FUNCTION policy_.owner_can_create_integration_config_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{integration_type_uuid_, agency_uuid_, credential_uuid_, name_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.integration_config_', 'create', 'policy_.owner_can_create_integration_config_');




CREATE OR REPLACE FUNCTION policy_.owner_can_query_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, agency_uuid_, integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;


CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

ALTER TABLE internal_.integration_type_ ADD COLUMN config_form_uuid_ uuid REFERENCES internal_.form_ (uuid_);
ALTER TABLE internal_.integration_type_ ADD COLUMN automatic_order_management_ bool NOT NULL DEFAULT 'f';
ALTER TABLE application_.integration_ ADD COLUMN integration_config_uuid_ uuid REFERENCES application_.integration_config_ (uuid_);

CREATE OR REPLACE FUNCTION internal_.check_integration_config_data_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
      SELECT jsonb_object_keys(NEW.data_)
    EXCEPT
      SELECT ff.name_
      FROM internal_.integration_type_ t
      JOIN internal_.form_field_ ff ON ff.form_uuid_ = t.config_form_uuid_
      WHERE t.uuid_ = NEW.integration_type_uuid_
  ) THEN
    RAISE 'Data does not match required schema.' USING ERRCODE = 'DDATA';
  END IF;

  RETURN NEW;
END
$$;

CREATE TRIGGER tr_before_insert_or_update_check_integration_config_data_ BEFORE INSERT OR UPDATE ON application_.integration_config_ FOR EACH ROW EXECUTE FUNCTION internal_.check_integration_config_data_();


CREATE OR REPLACE FUNCTION policy_.anyone_can_query_integration_type_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, form_uuid_, config_form_uuid_, name_, automatic_order_management_}'::text[];
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_create_integration_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, integration_config_uuid_, integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_query_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, agency_uuid_, integration_config_uuid_, integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_integration_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, integration_config_uuid_, integration_type_uuid_, credential_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
