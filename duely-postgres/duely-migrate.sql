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

DROP FUNCTION operation_.query_resource_(_resource_name text, _filter jsonb, _desc boolean, _order_by text, _limit integer, _after_id text);
DROP FUNCTION operation_.query_resource_(_resource_name text, _filter jsonb, _token text, _desc boolean, _order_by text, _limit integer, _after_id text);

CREATE OR REPLACE FUNCTION operation_.query_resource_(_resource_name text, _filter jsonb, _desc boolean DEFAULT false, _order_by text DEFAULT NULL::text, _limit integer DEFAULT NULL::integer, _before_id text DEFAULT NULL::text, _after_id text DEFAULT NULL::text) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
DECLARE
  _desc_asc text;
  _lt_gt_after text;
  _lt_gt_before text;
  _order_by_sql text;
  _table regclass;
BEGIN
  IF _resource_name IS NULL OR _filter IS NULL THEN
    RETURN;
  END IF;

  _desc_asc := CASE WHEN _desc THEN 'DESC' ELSE 'ASC' END;
  _lt_gt_after := CASE WHEN _desc THEN '>' ELSE '<' END;
  _lt_gt_before := CASE WHEN _desc THEN '<' ELSE '>' END;

  SELECT table_ INTO _table
  FROM security_.resource_definition_
  WHERE name_ = _resource_name;

  IF _order_by IS NULL THEN
    IF EXISTS (
      SELECT 1
      FROM pg_attribute
      WHERE attrelid = _table
        AND NOT attisdropped
        AND attnum > 0
        AND attname = 'sort_key_'
    ) THEN
      _order_by := 'sort_key_';
    ELSE
      _order_by := 'uuid_';
    END IF;
  ELSE
    -- Convert to internal format
    _order_by := CASE 
      WHEN _order_by = 'id' THEN 'uuid_'
      WHEN right(_order_by, 3) = '_id' THEN overlay(_order_by placing 'uuid_' from char_length(_order_by) - 1 for 2)
      ELSE _order_by || '_'
    END;
  END IF;

  _order_by_sql := format('ORDER BY t.%1$I %2$s, r.id_', _order_by, _desc_asc);

  _filter := internal_.convert_to_internal_format_(_filter);

  RETURN QUERY EXECUTE format('
    WITH
      after_ AS (
        SELECT r.id_, t.%1$I
        FROM ' || _table || ' t
        JOIN application_.resource_ r ON r.uuid_ = t.uuid_
        JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
        WHERE $4 IS NOT NULL
          AND d.table_ = $1
          AND r.id_ = $4
      ),
      before_ AS (
        SELECT r.id_, t.%1$I
        FROM ' || _table || ' t
        JOIN application_.resource_ r ON r.uuid_ = t.uuid_
        JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
        WHERE $5 IS NOT NULL
          AND d.table_ = $1
          AND r.id_ = $5
      ),
      all_ AS (
        SELECT internal_.dynamic_select_(d.table_, r.uuid_, keys_) data_
        FROM ' || _table || ' t
        JOIN application_.resource_ r ON r.uuid_ = t.uuid_
        JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
        CROSS JOIN security_.control_query_(d, r) keys_
        LEFT JOIN after_ ON 1=1
        LEFT JOIN before_ ON 1=1
        WHERE d.table_ = $1
          AND r.search_ @> $2
          AND ($4 IS NULL OR t.%1$I %3$s after_.%1$I OR (t.%1$I %3$s= after_.%1$I AND r.id_ < after_.id_))
          AND ($5 IS NULL OR t.%1$I %2$s before_.%1$I OR (t.%1$I %2$s= before_.%1$I AND r.id_ > before_.id_))
        ' || _order_by_sql || '
        LIMIT $3
      )
    SELECT internal_.convert_from_internal_format_(all_.data_) query_resource_
    FROM all_
    WHERE all_.data_ @> $2
  ', _order_by, _lt_gt_before, _lt_gt_after)
  USING _table, _filter, _limit, _before_id, _after_id;
END
$_$;

CREATE OR REPLACE FUNCTION operation_.query_resource_(_resource_name text, _filter jsonb, _token text, _desc boolean DEFAULT false, _order_by text DEFAULT NULL::text, _limit integer DEFAULT NULL::integer, _before_id text DEFAULT NULL::text, _after_id text DEFAULT NULL::text) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
DECLARE
  _desc_asc text;
  _lt_gt_before text;
  _lt_gt_after text;
  _order_by_sql text;
  _table regclass;
BEGIN
  IF _resource_name IS NULL OR _filter IS NULL THEN
    RETURN;
  END IF;

  _desc_asc := CASE WHEN _desc THEN 'DESC' ELSE 'ASC' END;
  _lt_gt_before := CASE WHEN _desc THEN '<' ELSE '>' END;
  _lt_gt_after := CASE WHEN _desc THEN '>' ELSE '<' END;

  SELECT table_ INTO _table
  FROM security_.resource_definition_
  WHERE name_ = _resource_name;

  IF _order_by IS NULL THEN
    IF EXISTS (
      SELECT 1
      FROM pg_attribute
      WHERE attrelid = _table
        AND NOT attisdropped
        AND attnum > 0
        AND attname = 'sort_key_'
    ) THEN
      _order_by := 'sort_key_';
    ELSE
      _order_by := 'uuid_';
    END IF;
  ELSE
    -- Convert to internal format
    _order_by := CASE 
      WHEN _order_by = 'id' THEN 'uuid_'
      WHEN right(_order_by, 3) = '_id' THEN overlay(_order_by placing 'uuid_' from char_length(_order_by) - 1 for 2)
      ELSE _order_by || '_'
    END;
  END IF;

  _order_by_sql := format('ORDER BY t.%1$I %2$s, r.id_', _order_by, _desc_asc);

  _filter := internal_.convert_to_internal_format_(_filter);

  RETURN QUERY EXECUTE format('
    WITH
      after_ AS (
        SELECT r.id_, t.%1$I
        FROM ' || _table || ' t
        JOIN application_.resource_ r ON r.uuid_ = t.uuid_
        JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
        WHERE $4 IS NOT NULL
          AND d.table_ = $1
          AND r.id_ = $4
      ),
      before_ AS (
        SELECT r.id_, t.%1$I
        FROM ' || _table || ' t
        JOIN application_.resource_ r ON r.uuid_ = t.uuid_
        JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
        WHERE $5 IS NOT NULL
          AND d.table_ = $1
          AND r.id_ = $5
      ),
      all_ AS (
        SELECT internal_.dynamic_select_(d.table_, r.uuid_, x.keys_) data_
        FROM ' || _table || ' t
        JOIN application_.resource_ r ON r.uuid_ = t.uuid_
        JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
        JOIN security_.resource_token_ x ON r.uuid_ = x.resource_uuid_ AND r.uuid_ = x.resource_uuid_
        LEFT JOIN after_ ON 1=1
        LEFT JOIN before_ ON 1=1
        WHERE d.table_ = $1
          AND x.token_ = $6
          AND r.search_ @> $2
          AND ($4 IS NULL OR t.%1$I %3$s after_.%1$I OR (t.%1$I %3$s= after_.%1$I AND r.id_ < after_.id_))
          AND ($5 IS NULL OR t.%1$I %2$s before_.%1$I OR (t.%1$I %2$s= before_.%1$I AND r.id_ > before_.id_))
        ' || _order_by_sql || '
        LIMIT $3
      )
    SELECT internal_.convert_from_internal_format_(all_.data_) query_resource_
    FROM all_
    WHERE all_.data_ @> $2
  ', _order_by, _lt_gt_before, _lt_gt_after)
  USING _table, _filter, _limit, _before_id, _after_id, _token;
END
$_$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
