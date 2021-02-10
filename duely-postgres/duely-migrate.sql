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

DROP TRIGGER tr_before_insert_or_update_update_form_field_linked_list_ ON internal_.form_field_;
DROP FUNCTION internal_.update_form_field_linked_list_;

CALL internal_.drop_auditing_('internal_.form_field_');
ALTER TABLE internal_.form_field_ DROP COLUMN after_uuid_;
ALTER TABLE internal_.form_field_ ADD COLUMN sort_key_ real;

WITH
  s AS (
    SELECT s.uuid_, ROW_NUMBER() OVER (PARTITION BY s.form_uuid_) sort_key_
    FROM internal_.form_field_ s
    ORDER BY s.uuid_
  )
UPDATE internal_.form_field_ f
SET sort_key_ = s.sort_key_
FROM s
WHERE s.uuid_ = f.uuid_;

ALTER TABLE internal_.form_field_ ADD UNIQUE (form_uuid_, sort_key_);

CREATE FUNCTION internal_.set_form_field_sort_key_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _sort_key real;
BEGIN
  IF NEW.sort_key_ IS NULL THEN
    SELECT MAX(s.sort_key_) + 1 INTO _sort_key
    FROM internal_.form_field_ s
    WHERE s.form_uuid_ = NEW.form_uuid_;

    NEW.sort_key_ = _sort_key;
  END IF;

  RETURN NEW;
END
$$;

CREATE TRIGGER tr_before_insert_set_sort_key_ BEFORE INSERT ON internal_.form_field_ FOR EACH ROW EXECUTE FUNCTION internal_.set_form_field_sort_key_();

CALL internal_.setup_auditing_('internal_.form_field_');

CREATE OR REPLACE FUNCTION policy_.anyone_can_query_form_field_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, name_, label_, type_, form_uuid_, sort_key_, default_}'::text[];
$$;

ALTER TABLE internal_.form_field_ ALTER COLUMN sort_key_ SET NOT NULL;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
