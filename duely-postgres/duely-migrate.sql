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

CREATE OR REPLACE FUNCTION operation_.query_resource_all_(_resource_name text, _containing jsonb) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF _containing = '{}'::jsonb THEN
    RETURN;
  END IF;

  IF _containing - 'id' = '{}'::jsonb THEN
    RETURN QUERY
      SELECT operation_.query_resource_(_containing->>'id');
  END IF;

  _containing := internal_.convert_to_internal_format_(_containing);

  RETURN QUERY
    WITH
      all_ AS (
        SELECT internal_.dynamic_select_(d.table_, r.uuid_, keys_) data_
        FROM application_.resource_ r
        JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
        CROSS JOIN security_.control_query_(d, r) keys_
        WHERE d.name_ = _resource_name
          AND r.search_ @> _containing
      )
    SELECT internal_.convert_from_internal_format_(all_.data_) query_resource_all_
    FROM all_
    WHERE all_.data_ @> _containing
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
