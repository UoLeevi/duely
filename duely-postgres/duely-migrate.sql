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
BEGIN
-- MIGRATION CODE START

CREATE OR REPLACE FUNCTION internal_.set_form_field_sort_key_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _sort_key real;
BEGIN
  SELECT MAX(s.sort_key_) + 1 INTO _sort_key
  FROM internal_.form_field_ s
  WHERE s.form_uuid_ = NEW.form_uuid_;

  NEW.sort_key_ = COALESCE(_sort_key, 0);

  RETURN NEW;
END
$$;

DROP TRIGGER tr_before_insert_set_sort_key_ ON internal_.form_field_;

CREATE TRIGGER tr_before_insert_set_sort_key_ BEFORE INSERT ON internal_.form_field_ FOR EACH ROW WHEN (NEW.sort_key_ IS NULL) EXECUTE FUNCTION internal_.set_form_field_sort_key_();


INSERT INTO internal_.form_ (uuid_) VALUES (DEFAULT) RETURNING uuid_ INTO _form_uuid;

INSERT INTO internal_.integration_type_ (form_uuid_, name_) VALUES (_form_uuid, 'teachable/enroll');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
