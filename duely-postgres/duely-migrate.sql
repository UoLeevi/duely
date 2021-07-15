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

CALL internal_.drop_auditing_('application_.product_');
ALTER TABLE application_.product_ DROP COLUMN integration_uuid_;
CALL internal_.setup_auditing_('application_.product_');

ALTER TABLE application_.integration_ ADD COLUMN product_uuid_ uuid REFERENCES application_.product_ (uuid_);
CALL internal_.setup_auditing_('application_.integration_');

CALL internal_.setup_resource_('application_.integration_', 'integration', 'inte', '{agency_uuid_, integration_config_uuid_, integration_type_uuid_, product_uuid_}', 'application_.agency_');

CREATE OR REPLACE FUNCTION policy_.agent_can_query_product_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, agency_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, url_name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_change_product_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    IF EXISTS (
      SELECT 1
      FROM application_.product_
      WHERE uuid_ = _resource.uuid_
        AND stripe_prod_id_ext_live_ IS NULL
        AND stripe_prod_id_ext_test_ IS NULL
    ) THEN
      RETURN '{name_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, url_name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
    ELSE
      RETURN '{name_, url_name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
    END IF;
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_create_product_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, url_name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_product_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, url_name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_create_integration_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{agency_uuid_, integration_config_uuid_, integration_type_uuid_, credential_uuid_, product_uuid_, data_}'::text[];
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
    RETURN '{uuid_, agency_uuid_, integration_config_uuid_, integration_type_uuid_, credential_uuid_, product_uuid_, data_}'::text[];
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
    RETURN '{uuid_, agency_uuid_, integration_config_uuid_, integration_type_uuid_, credential_uuid_, product_uuid_, data_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE FUNCTION internal_.check_product_belongs_to_agency_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.product_uuid_ IS NOT NULL AND NEW.agency_uuid_ IS NOT NULL AND NOT EXISTS (
      SELECT 1
      FROM application_.product_
      WHERE agency_uuid_ = NEW.agency_uuid_
        AND product_uuid_ = NEW.product_uuid_
  ) THEN
    RAISE 'Product does not belong to specified agency' USING ERRCODE = 'DDATA';
  END IF;

  RETURN NEW;
END
$$;

CREATE TRIGGER tr_before_insert_or_update_check_product_belongs_to_agency_ BEFORE INSERT OR UPDATE ON application_.integration_ FOR EACH ROW EXECUTE FUNCTION internal_.check_product_belongs_to_agency_();
CREATE TRIGGER tr_before_insert_or_update_check_product_belongs_to_agency_ BEFORE INSERT OR UPDATE ON application_.page_ FOR EACH ROW EXECUTE FUNCTION internal_.check_product_belongs_to_agency_();

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
