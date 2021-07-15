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

CREATE OR REPLACE FUNCTION internal_.check_product_belongs_to_agency_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.product_uuid_ IS NOT NULL AND NEW.agency_uuid_ IS NOT NULL AND NOT EXISTS (
      SELECT 1
      FROM application_.product_
      WHERE agency_uuid_ = NEW.agency_uuid_
        AND uuid_ = NEW.product_uuid_
  ) THEN
    RAISE 'Product does not belong to specified agency' USING ERRCODE = 'DDATA';
  END IF;

  RETURN NEW;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
