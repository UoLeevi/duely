-- psql -U postgres -d postgres -f duely-reset.sql

\echo 'DATABASE RESET STARTED'
\o /dev/null
\set QUIET true
\set ON_ERROR_STOP true

REVOKE CONNECT ON DATABASE duely FROM duely;

SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid <> pg_backend_pid()
  AND datname = 'duely';

DROP DATABASE duely;
CREATE DATABASE duely;

\c duely
\i duely-schema.sql
\i duely-prepare.sql
\echo 'DATABASE RESET COMPLETED'
