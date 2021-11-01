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

CALL internal_.drop_auditing_('application_.price_');

ALTER TABLE application_.price_ ADD COLUMN id_ text NULL;

UPDATE application_.price_
SET id_ = COALESCE(stripe_price_id_ext_live_, stripe_price_id_ext_test_);

ALTER TABLE application_.price_ ALTER COLUMN id_ SET NOT NULL;
ALTER TABLE application_.price_ ADD UNIQUE (id_);

UPDATE application_.resource_ r
SET id_ = p.id_
FROM application_.price_ p
CROSS JOIN security_.resource_definition_ d
WHERE p.uuid_ = r.uuid_
  AND d.uuid_ = r.definition_uuid_;

ALTER TABLE application_.price_
    ADD FOREIGN KEY (id_) REFERENCES application_.resource_(id_) DEFERRABLE INITIALLY DEFERRED;

CALL internal_.setup_auditing_('application_.price_');

CREATE OR REPLACE FUNCTION internal_.resource_insert_(_resource_definition security_.resource_definition_, _record jsonb) RETURNS application_.resource_ 
    LANGUAGE plpgsql
    AS $_$
DECLARE
  _resource application_.resource_;
  _owner_resource_definition security_.resource_definition_;
  _owner_resource_table_name name;
  _uuid uuid;
  _owner_uuid uuid;	
  _select_list text;
  _search jsonb DEFAULT '{}'::jsonb;
  _id_len int := 6;
BEGIN
  SELECT * INTO _owner_resource_definition
  FROM security_.resource_definition_
  WHERE uuid_ = _resource_definition.owner_uuid_;

  IF _owner_resource_definition.uuid_ IS NOT NULL THEN
    SELECT c.relname INTO _owner_resource_table_name
    FROM pg_catalog.pg_class AS c
    WHERE c.oid = _owner_resource_definition.table_;

    EXECUTE format('
      SELECT ($1->>%1$L)::uuid;
    ',
    _owner_resource_table_name || 'uuid_')
    INTO _owner_uuid
    USING _record;
  END IF;

  IF _resource_definition.search_ <> '{}'::text[] THEN
    SELECT string_agg(format('
      $1->%1$L %1$I
    ', k), ',') INTO _select_list
    FROM unnest(_resource_definition.search_) k;

    EXECUTE '
      WITH
        r AS (
          SELECT ' || _select_list || '
        )
      SELECT to_jsonb(r)
      FROM r;
    '
    INTO _search
    USING _record;
  END IF;

  IF _record ? 'id_' THEN
    INSERT INTO application_.resource_ (uuid_, search_, owner_uuid_, definition_uuid_, id_)
    SELECT (_record->>'uuid_')::uuid, _search, _owner_uuid, _resource_definition.uuid_, _record->>'id_'
    RETURNING * INTO _resource;
  ELSE
    LOOP
        BEGIN
            INSERT INTO application_.resource_ (uuid_, search_, owner_uuid_, definition_uuid_, id_)
            SELECT (_record->>'uuid_')::uuid, _search, _owner_uuid, _resource_definition.uuid_, _resource_definition.id_prefix_ || '_' || substring(replace(_record->>'uuid_', '-', '' ) FOR _id_len)
            RETURNING * INTO _resource;
            EXIT;
        EXCEPTION WHEN unique_violation THEN
            _id_len := _id_len + 2;
        END;
    END LOOP;
  END IF;

  RETURN _resource;
END
$_$;

CREATE OR REPLACE FUNCTION policy_.agent_can_query_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, id_, product_uuid_, stripe_price_id_ext_live_, stripe_price_id_ext_test_, type_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, recurring_iterations_, status_, active_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.anyone_can_query_live_price_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM application_.price_
    WHERE uuid_ = _resource.uuid_
      AND status_ = 'live'
      AND active_ = 't'
  ) THEN
    RETURN '{uuid_, id_, product_uuid_, stripe_price_id_ext_live_, stripe_price_id_ext_test_, type_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_, active_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

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
      RETURN '{stripe_price_id_ext_live_, stripe_price_id_ext_test_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_, active_}'::text[];
    ELSE
      RETURN '{unit_amount_, currency_, recurring_interval_, recurring_interval_count_, status_, active_}'::text[];
    END IF;
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION policy_.owner_can_create_price_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{product_uuid_, id_, stripe_price_id_ext_live_, stripe_price_id_ext_test_, unit_amount_, currency_, recurring_interval_, recurring_interval_count_, recurring_iterations_, status_, active_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION internal_.convert_to_internal_format_(_data jsonb) RETURNS jsonb
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  WITH
    _id_fields AS (
      SELECT k, LEFT(k, length(k) - 2) || 'uuid' f, r.uuid_
      FROM jsonb_object_keys(_data) k
      JOIN application_.resource_ r ON r.id_ = _data->>k
      WHERE k LIKE '%id'
    )
  SELECT jsonb_object_agg(COALESCE(i.f, d.key) || '_', COALESCE(to_jsonb(i.uuid_), d.value)) data_
  FROM jsonb_each(_data) d
  LEFT JOIN _id_fields i ON i.k = d.key;
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
