-- psql -U postgres -d duely -f duely-test.sql

\set ON_ERROR_STOP true
\i tests/00-test-internal.sql
\i tests/01-test-subdomain.sql
\i tests/02-test-theme.sql
\i tests/03-test-image.sql
\i tests/04-test-sign_up.sql
\i tests/05-test-password_reset.sql
\i tests/99-test.sql
