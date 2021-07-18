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
  _config_form_uuid uuid;
BEGIN
-- MIGRATION CODE START

INSERT INTO internal_.form_ (uuid_) VALUES (DEFAULT) RETURNING uuid_ INTO _form_uuid;
INSERT INTO internal_.form_ (uuid_) VALUES (DEFAULT) RETURNING uuid_ INTO _config_form_uuid;

INSERT INTO internal_.form_field_ (name_, type_, form_uuid_, default_, label_)
SELECT 'convertkit_api_key', 'text', _config_form_uuid, NULL, 'ConvertKit API Key';

INSERT INTO internal_.form_field_ (name_, type_, form_uuid_, default_, label_)
SELECT 'convertkit_tag_id', 'text', _form_uuid, NULL, 'ConvertKit Tag ID';

INSERT INTO internal_.integration_type_ (form_uuid_, config_form_uuid_, name_) VALUES (_form_uuid, _config_form_uuid, 'convertkit/tag');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
