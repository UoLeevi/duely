-- psql -v service_account_password="'$DUELY_SERVICE_ACCOUNT_PASSWORD'" -U postgres -d postgres -f duely-reset.sql

\echo 'DATABASE RESET STARTED'
\o /dev/null
\set QUIET true
\set ON_ERROR_STOP true

CREATE FUNCTION pg_temp.start_reset_(_service_account_password text) RETURNS void
    LANGUAGE plpgsql
    AS $_RESET_$
BEGIN

  IF _service_account_password IS NULL OR _service_account_password = '' THEN
    RAISE EXCEPTION 'Service account password was not provided';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_roles
    WHERE rolname = 'duely'
  ) THEN

    CREATE ROLE duely LOGIN PASSWORD 'duely';

  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_catalog.pg_database
    WHERE datname = 'duely'
  ) THEN

    REVOKE CONNECT ON DATABASE duely FROM duely;

    PERFORM pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE pid <> pg_backend_pid()
      AND datname = 'duely';

  END IF;

EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'DATABASE RESET FAILED';
  RAISE;

END;
$_RESET_$;

SELECT pg_temp.start_reset_(:service_account_password);

DROP DATABASE IF EXISTS duely;
CREATE DATABASE duely;

\c duely
\i duely-schema.sql
\i duely-prepare.sql
\c duely duely
\i duely-seed.sql
\echo 'DATABASE RESET COMPLETED'
