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

CREATE FUNCTION internal_.insert_form_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _form_uuid uuid;
BEGIN
  INSERT INTO internal_.form_ DEFAULT VALUES RETURNING uuid_ INTO _form_uuid;

  NEW.form_uuid_ := _form_uuid;
  RETURN NEW;
END
$$;

CREATE TRIGGER tr_before_insert_insert_form_ BEFORE INSERT ON internal_.page_block_definition_
  FOR EACH ROW EXECUTE FUNCTION internal_.insert_form_();

INSERT INTO internal_.page_definition_(name_) VALUES ('Home');

INSERT INTO internal_.page_block_definition_(name_, page_definition_uuid_)
SELECT 'Hero with angled image', d.uuid_
FROM internal_.page_definition_ d
WHERE name_ = 'Home';

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
