-- psql -v service_account_password="'$DUELY_SERVICE_ACCOUNT_PASSWORD'" -U postgres -d postgres -f duely-reset.sql

\echo 'DATABASE RESET STARTED'
\o /dev/null
\set QUIET true
\set ON_ERROR_STOP true

DO 
LANGUAGE plpgsql
$_RESET_$
BEGIN

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

END;
$_RESET_$;

DROP DATABASE IF EXISTS duely;
CREATE DATABASE duely;

\c duely
\i duely-schema.sql
\i duely-prepare.sql
\c duely duely
\i duely-seed.sql
\echo 'DATABASE RESET COMPLETED'
