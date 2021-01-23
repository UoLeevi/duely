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

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
