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

CREATE FUNCTION internal_.check_integration_data_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _before_uuid uuid;
BEGIN
  IF EXISTS (
      SELECT jsonb_object_keys(NEW.data_)
    EXCEPT
      SELECT ff.name_
      FROM internal_.integration_type_ t
      JOIN internal_.form_field_ ff ON ff.form_uuid_ = t.form_uuid_
      WHERE t.uuid_ = NEW.integration_type_uuid_
  ) THEN
    RAISE 'Data does not match required schema.' USING ERRCODE = 'DDATA';
  END IF;

  RETURN NEW;
END
$$;

CREATE TRIGGER tr_before_insert_or_update_check_integration_data_ 
BEFORE INSERT OR UPDATE ON application_.integration_
FOR EACH ROW EXECUTE FUNCTION internal_.check_integration_data_();

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
