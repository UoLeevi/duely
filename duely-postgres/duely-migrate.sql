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

CALL internal_.drop_auditing_('internal_.form_field_');
ALTER TABLE internal_.form_field_ ADD COLUMN label_ text NOT NULL;
ALTER TABLE internal_.form_field_ ADD COLUMN after_uuid_ uuid REFERENCES internal_.form_field_ (uuid_);
CALL internal_.setup_auditing_('internal_.form_field_');

CREATE OR REPLACE FUNCTION policy_.anyone_can_query_form_field_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, name_, label_, type_, form_uuid_, after_uuid_, default_}'::text[];
$$;

ALTER TABLE ONLY internal_.form_field_
    ADD CONSTRAINT form_field__after_uuid__form_uuid__key UNIQUE (after_uuid_, form_uuid_) DEFERRABLE INITIALLY DEFERRED;

CREATE FUNCTION internal_.update_form_field_linked_list_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _before_uuid uuid;
BEGIN
  IF NEW.after_uuid_ IS NULL THEN
    SELECT uuid_ INTO _before_uuid
    FROM internal_.form_field_ f
    WHERE f.form_uuid_ = NEW.form_uuid_
      AND NOT EXISTS (
        SELECT 1
        FROM internal_.form_field_ f_after
        WHERE f_after.after_uuid_ = f.uuid_
      );

    NEW.after_uuid_ = _before_uuid;
  END IF;
  RETURN NEW;
END
$$;

CREATE TRIGGER tr_before_insert_or_update_update_form_field_linked_list_ BEFORE INSERT OR UPDATE ON internal_.form_field_
  FOR EACH ROW EXECUTE FUNCTION internal_.update_form_field_linked_list_();

ALTER TABLE ONLY application_.page_block_
    ADD CONSTRAINT page_block__after_uuid__page_uuid__key UNIQUE (after_uuid_, page_uuid_) DEFERRABLE INITIALLY DEFERRED;

CREATE FUNCTION internal_.update_page_block_linked_list_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _before_uuid uuid;
BEGIN
  IF NEW.after_uuid_ IS NULL THEN
    SELECT uuid_ INTO _before_uuid
    FROM application_.page_block_ b
    WHERE b.page_uuid_ = NEW.page_uuid_
      AND NOT EXISTS (
        SELECT 1
        FROM application_.page_block_ b_after
        WHERE b_after.after_uuid_ = f.uuid_
      );

    NEW.after_uuid_ = _before_uuid;
  END IF;
  RETURN NEW;
END
$$;

CREATE TRIGGER tr_before_insert_or_update_update_page_block_linked_list_ BEFORE INSERT OR UPDATE ON application_.page_block_
  FOR EACH ROW EXECUTE FUNCTION internal_.update_page_block_linked_list_();

INSERT INTO internal_.form_field_(name_, label_, type_, default_, form_uuid_)
SELECT 'headline1', 'Headline 1', 'text', '"{agency.name}"', f.uuid_
FROM internal_.page_block_definition_ b
JOIN internal_.form_ f ON f.uuid_ = b.form_uuid_
WHERE b.name_ = 'Hero with angled image';

INSERT INTO internal_.form_field_(name_, label_, type_, default_, form_uuid_)
SELECT 'headline2', 'Headline 2', 'text', '"Services"', f.uuid_
FROM internal_.page_block_definition_ b
JOIN internal_.form_ f ON f.uuid_ = b.form_uuid_
WHERE b.name_ = 'Hero with angled image';

INSERT INTO internal_.form_field_(name_, label_, type_, default_, form_uuid_)
SELECT 'paragraph', 'Paragraph', 'text', '"Services"', f.uuid_
FROM internal_.page_block_definition_ b
JOIN internal_.form_ f ON f.uuid_ = b.form_uuid_
WHERE b.name_ = 'Hero with angled image';

INSERT INTO internal_.form_field_(name_, label_, type_, form_uuid_)
SELECT 'imageSrc', 'Image URL', 'text', f.uuid_
FROM internal_.page_block_definition_ b
JOIN internal_.form_ f ON f.uuid_ = b.form_uuid_
WHERE b.name_ = 'Hero with angled image';

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
