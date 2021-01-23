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

CREATE OR REPLACE FUNCTION policy_.owner_can_change_price_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    IF EXISTS (
      SELECT 1
      FROM application_.price_
      WHERE uuid_ = _resource.uuid_
        AND stripe_price_id_ext_live_ IS NULL
        AND stripe_price_id_ext_test_ IS NULL
    ) THEN
      RETURN '{stripe_price_id_ext_live_, stripe_price_id_ext_test_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
    ELSE
      RETURN '{unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_}'::text[];
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
