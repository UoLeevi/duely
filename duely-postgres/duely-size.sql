-- psql -U postgres -d duely -f duely-size.sql

SELECT
  schema_name,
  relname,
  pg_size_pretty(table_size) AS size,
  table_size
FROM (
  SELECT
    pg_catalog.pg_namespace.nspname schema_name,
    relname,
    pg_relation_size(pg_catalog.pg_class.oid) table_size
  FROM pg_catalog.pg_class
    JOIN pg_catalog.pg_namespace ON relnamespace = pg_catalog.pg_namespace.oid
) t
WHERE schema_name NOT LIKE 'pg_%'
ORDER BY table_size DESC;
