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

DROP FUNCTION operation_.query_resource_(text,text);

CREATE OR REPLACE FUNCTION operation_.query_resource_(_resource_name text, _id_or_filter text) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _id text;
  _filter jsonb;
BEGIN
  IF _resource_name IS NULL OR _id_or_filter IS NULL THEN
    RETURN;
  END IF;

  IF starts_with(_id_or_filter, '{') THEN
    _filter := _id_or_filter::jsonb;

    IF _filter = '{}'::jsonb THEN
      RETURN;
    ELSEIF _filter - 'id' = '{}'::jsonb THEN
      _id := _filter->>'id';
    END IF;

  ELSE
    _id := _id_or_filter;
  END IF;

  IF _id IS NOT NULL THEN
      -- Lookup by id
    RETURN QUERY
      SELECT internal_.convert_from_internal_format_(
        internal_.dynamic_select_(d.table_, r.uuid_, keys_)
      ) query_resource_
      FROM application_.resource_ r
      JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
      CROSS JOIN security_.control_query_(d, r) keys_
      WHERE d.name_ = _resource_name
        AND r.id_ = _id;

  ELSE
    -- Filter by fields
    RETURN QUERY
      SELECT operation_.query_resource_(_resource_name, _filter);
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION operation_.query_resource_(_resource_name text, _id_or_filter text, _token text) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _id text;
  _filter jsonb;
BEGIN
  IF _resource_name IS NULL OR _id_or_filter IS NULL OR _token IS NULL THEN
    RETURN;
  END IF;

  IF starts_with(_id_or_filter, '{') THEN
    _filter := _id_or_filter::jsonb;

    IF _filter = '{}'::jsonb THEN
      RETURN;
    ELSEIF _filter - 'id' = '{}'::jsonb THEN
      _id := _filter->>'id';
    END IF;

  ELSE
    _id := _id_or_filter;
  END IF;

  IF _id IS NOT NULL THEN
    -- Lookup by id and resource token
    RETURN QUERY
      SELECT internal_.convert_from_internal_format_(
          internal_.dynamic_select_(d.table_, r.uuid_, t.keys_)
        ) query_resource_
      FROM application_.resource_ r
      JOIN security_.resource_token_ t ON r.uuid_ = t.resource_uuid_ AND r.uuid_ = t.resource_uuid_
      JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
      WHERE d.name_ = _resource_name
        AND t.token_ = _token
        AND r.id_ = _id;

  ELSE
    -- Filter by fields
    RETURN QUERY
      SELECT operation_.query_resource_(_resource_name, _filter, _token);
  END IF;
END
$$;

CREATE FUNCTION operation_.query_resource_(_resource_name text, _filter jsonb, _token text) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF _resource_name IS NULL OR _filter IS NULL THEN
    RETURN;
  END IF;

  _filter := internal_.convert_to_internal_format_(_filter);

  RETURN QUERY
    WITH
      all_ AS (
        SELECT internal_.dynamic_select_(d.table_, r.uuid_, t.keys_) data_
        FROM application_.resource_ r
        JOIN security_.resource_token_ t ON r.uuid_ = t.resource_uuid_ AND r.uuid_ = t.resource_uuid_
        JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
        WHERE d.name_ = _resource_name
          AND t.token_ = _token
          AND r.search_ @> _filter
      )
    SELECT internal_.convert_from_internal_format_(all_.data_) query_resource_
    FROM all_
    WHERE all_.data_ @> _filter
    ORDER BY (all_.data_->>'sort_key_')::real;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
