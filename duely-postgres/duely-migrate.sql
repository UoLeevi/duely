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

CREATE OR REPLACE FUNCTION internal_.resource_insert_from_(_table regclass) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
  EXECUTE '
    SELECT internal_.resource_insert_(d, to_jsonb(r))
    FROM ' || _table || ' r
    CROSS JOIN security_.resource_definition_ d
    WHERE d.table_ = $1;
  '
  USING _table;
END
$_$;


-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
