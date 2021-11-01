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
  _config_form_uuid uuid;
BEGIN
-- MIGRATION CODE START

CALL internal_.drop_auditing_('application_.product_');

ALTER TABLE application_.product_ ADD COLUMN id_ text NULL;

UPDATE application_.product_
SET id_ = COALESCE(stripe_prod_id_ext_live_, stripe_prod_id_ext_test_);

ALTER TABLE application_.product_ ALTER COLUMN id_ SET NOT NULL;
ALTER TABLE application_.product_ ADD UNIQUE (id_);

UPDATE application_.resource_ r
SET id_ = p.id_
FROM application_.product_ p
CROSS JOIN security_.resource_definition_ d
WHERE p.uuid_ = r.uuid_
  AND d.uuid_ = r.definition_uuid_;

ALTER TABLE application_.product_
    ADD FOREIGN KEY (id_) REFERENCES application_.resource_(id_) DEFERRABLE INITIALLY DEFERRED;

CALL internal_.setup_auditing_('application_.product_');

CREATE OR REPLACE FUNCTION policy_.agent_can_query_product_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, id_, agency_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, url_name_, status_, active_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.anyone_can_query_live_product_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM application_.product_
    WHERE uuid_ = _resource.uuid_
      AND status_ = 'live'
      AND active_ = 't'
  ) THEN
    RETURN '{uuid_, id_, agency_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, url_name_, status_, active_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
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
      RETURN '{name_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, url_name_, status_, active_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
    ELSE
      RETURN '{name_, url_name_, status_, active_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
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
    RETURN '{agency_uuid_, id_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, url_name_, status_, active_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
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
    RETURN '{uuid_, id_, agency_uuid_, stripe_prod_id_ext_live_, stripe_prod_id_ext_test_, name_, url_name_, status_, description_, duration_, default_price_uuid_, markdown_description_uuid_, image_logo_uuid_, image_hero_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;



-- CREATE OR REPLACE FUNCTION policy_.agent_can_query_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
--     RETURN '{uuid_, id_, product_uuid_, stripe_price_id_ext_live_, stripe_price_id_ext_test_, type_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, recurring_iterations_, status_, active_}'::text[];
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $$;

-- CREATE OR REPLACE FUNCTION policy_.anyone_can_query_live_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF EXISTS (
--     SELECT 1
--     FROM application_.price_
--     WHERE uuid_ = _resource.uuid_
--       AND status_ = 'live'
--       AND active_ = 't'
--   ) THEN
--     RETURN '{uuid_, id_, product_uuid_, stripe_price_id_ext_live_, stripe_price_id_ext_test_, type_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_, active_}'::text[];
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $$;

-- CREATE OR REPLACE FUNCTION policy_.owner_can_change_price_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
--     IF EXISTS (
--       SELECT 1
--       FROM application_.price_
--       WHERE uuid_ = _resource.uuid_
--         AND stripe_price_id_ext_live_ IS NULL
--         AND stripe_price_id_ext_test_ IS NULL
--     ) THEN
--       RETURN '{stripe_price_id_ext_live_, stripe_price_id_ext_test_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_, active_}'::text[];
--     ELSE
--       RETURN '{unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_, active_}'::text[];
--     END IF;
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $$;

-- CREATE OR REPLACE FUNCTION policy_.owner_can_create_price_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF (
--     SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
--     FROM internal_.query_owner_resource_(_resource_definition, _data)
--   ) THEN
--     RETURN '{product_uuid_, id_, stripe_price_id_ext_live_, stripe_price_id_ext_test_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, recurring_iterations_, status_, active_}'::text[];
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
