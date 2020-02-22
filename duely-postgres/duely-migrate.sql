-- psql -U postgres -d postgres -f duely-test.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'Running migration...'
\set QUIET true

DO 
LANGUAGE plpgsql
$$
DECLARE

BEGIN

-- migration code here

EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$$;

\echo 'MIGRATION COMPLETED'
