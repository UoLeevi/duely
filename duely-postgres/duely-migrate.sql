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

ALTER TABLE application_.page_block_ ALTER after_uuid_ DROP NOT NULL;

CREATE OR REPLACE FUNCTION internal_.update_page_block_linked_list_() RETURNS trigger
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
        WHERE b_after.after_uuid_ = b.uuid_
      );

    NEW.after_uuid_ = _before_uuid;
  END IF;
  RETURN NEW;
END
$$;

ALTER TABLE ONLY application_.page_
    ADD CONSTRAINT page__page_definition_uuid__agency_uuid__service_uuid__key UNIQUE (page_definition_uuid_, agency_uuid_, service_uuid_);

CALL internal_.drop_auditing_('internal_.page_definition_');
ALTER TABLE internal_.page_definition_ ADD COLUMN default_block_uuids_ uuid[] DEFAULT '{}'::uuid[];
CALL internal_.setup_auditing_('internal_.page_definition_');

CREATE OR REPLACE FUNCTION internal_.insert_page_default_blocks_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  WITH
    cte AS (
      SELECT p.uuid_ page_uuid_, unnest(d.default_block_uuids_) page_block_definition_uuid_
      FROM _new_table p
      JOIN internal_.page_definition_ d ON p.page_definition_uuid_ = d.uuid_
    )
  INSERT INTO application_.page_block_ (page_block_definition_uuid_, page_uuid_, data_)
  SELECT cte.page_block_definition_uuid_, cte.page_uuid_, jsonb_object_agg(f.name_, f.default_)
  FROM cte
  JOIN internal_.page_block_definition_ d ON d.uuid_ = cte.page_block_definition_uuid_
  JOIN internal_.form_field_ f ON f.form_uuid_ = d.form_uuid_
  GROUP BY cte.page_block_definition_uuid_, cte.page_uuid_;

  RETURN NULL;

END;
$$;

CREATE TRIGGER tr_after_insert_insert_page_default_blocks_ AFTER INSERT ON application_.page_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_page_default_blocks_();

WITH
  cte AS (
    SELECT p.uuid_, array_agg(b.uuid_) default_block_uuids_
    FROM internal_.page_definition_ p
    CROSS JOIN internal_.page_block_definition_ b
      WHERE p.name_ = 'Home'
      AND b.name_ = 'Hero with angled image'
    GROUP BY p.uuid_
  )
UPDATE internal_.page_definition_ p
SET default_block_uuids_ = cte.default_block_uuids_
FROM cte
WHERE p.uuid_ = cte.uuid_;

WITH
  cte AS (
    SELECT p.uuid_ page_uuid_, unnest(d.default_block_uuids_) page_block_definition_uuid_
    FROM application_.page_ p
    JOIN internal_.page_definition_ d ON p.page_definition_uuid_ = d.uuid_
  )
INSERT INTO application_.page_block_ (page_block_definition_uuid_, page_uuid_, data_)
SELECT cte.page_block_definition_uuid_, cte.page_uuid_, jsonb_object_agg(f.name_, f.default_)
FROM cte
JOIN internal_.page_block_definition_ d ON d.uuid_ = cte.page_block_definition_uuid_
JOIN internal_.form_field_ f ON f.form_uuid_ = d.form_uuid_
GROUP BY cte.page_block_definition_uuid_, cte.page_uuid_;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
