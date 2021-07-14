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

CREATE TABLE internal_.credential_type_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    form_uuid_ uuid NOT NULL REFERENCES internal_.form_ (uuid_),
    name_ text NOT NULL UNIQUE
);
CALL internal_.setup_resource_('internal_.credential_type_', 'credential type', 'credtype', '{uuid_, form_uuid_, name_}');

CREATE FUNCTION policy_.anyone_can_query_credential_type_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, subdomain_uuid_, name_, livemode_, default_pricing_currency_}'::text[];
$$;
PERFORM security_.register_policy_('internal_.credential_type_', 'query', 'policy_.anyone_can_query_credential_type_');

ALTER TABLE internal_.integration_type_ ADD COLUMN credential_type_uuid_ uuid REFERENCES internal_.credential_type_ (uuid_);

CREATE OR REPLACE FUNCTION policy_.anyone_can_query_integration_type_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, form_uuid_, config_form_uuid_, credential_type_uuid_, name_, automatic_order_management_}'::text[];
$$;

ALTER TABLE application_.credential_ ADD COLUMN credential_type_uuid_ uuid NOT NULL REFERENCES internal_.credential_type_ (uuid_);
ALTER TABLE application_.credential_ DROP COLUMN type_;
CALL internal_.setup_resource_('application_.credential_', 'credential', 'cred', '{uuid_, agency_uuid_, credential_type_uuid_, name_}', 'application_.agency_');

CREATE OR REPLACE FUNCTION policy_.owner_can_create_credential_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, credential_type_uuid_, name_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_credential_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, credential_type_uuid_, name_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_query_credential_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{uuid_, agency_uuid_, credential_type_uuid_, name_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION internal_.check_credential_data_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
      SELECT jsonb_object_keys(NEW.data_)
    EXCEPT
      SELECT ff.name_
      FROM internal_.credential_type_ t
      JOIN internal_.form_field_ ff ON ff.form_uuid_ = t.form_uuid_
      WHERE t.uuid_ = NEW.credential_type_uuid_
  ) THEN
    RAISE 'Data does not match required schema.' USING ERRCODE = 'DDATA';
  END IF;

  RETURN NEW;
END
$$;

CREATE TRIGGER tr_before_insert_or_update_check_credential_data_ BEFORE INSERT OR UPDATE ON application_.credential_ FOR EACH ROW EXECUTE FUNCTION internal_.check_credential_data_();

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
