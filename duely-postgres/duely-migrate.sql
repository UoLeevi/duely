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

CALL internal_.drop_auditing_('application_.page_');
ALTER TABLE application_.page_ ADD COLUMN service_uuid_ uuid REFERENCES application_.service_ (uuid_) ON DELETE CASCADE;
CALL internal_.setup_resource_('application_.page_', 'page', 'pblk', '{uuid_, agency_uuid_, service_uuid_, page_definition_uuid_}', 'application_.agency_');
CALL internal_.setup_auditing_('application_.page_');

ALTER TABLE ONLY application_.page_
    DROP CONSTRAINT page__agency_uuid__fkey;
ALTER TABLE ONLY application_.page_
    ADD CONSTRAINT page__agency_uuid__fkey FOREIGN KEY (agency_uuid_) REFERENCES application_.agency_(uuid_) ON DELETE CASCADE;

DELETE FROM security_.policy_ p
USING security_.resource_definition_ d
WHERE p.resource_definition_uuid_ = d.uuid_
  AND d.table_ = 'application_.page_'::regclass
  AND p.operation_type_ IN ('create', 'delete');

DROP FUNCTION policy_.owner_can_create_page_;

CREATE OR REPLACE FUNCTION internal_.insert_agency_home_page_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO application_.page_ (agency_uuid_, page_definition_uuid_)
  SELECT a.uuid_, d.uuid_
  FROM _new_table a
  CROSS JOIN internal_.page_definition_ d
  WHERE d.name_ = 'Home';

  RETURN NULL;

END;
$$;

CREATE TRIGGER tr_after_insert_insert_agency_home_page_ AFTER INSERT ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_agency_home_page_();


CREATE OR REPLACE FUNCTION internal_.insert_service_page_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO application_.page_ (agency_uuid_, service_uuid_, page_definition_uuid_)
  SELECT s.agency_uuid_, s.uuid_, d.uuid_
  FROM _new_table s
  CROSS JOIN internal_.page_definition_ d
  WHERE d.name_ = 'Service';

  RETURN NULL;

END;
$$;

CREATE TRIGGER tr_after_insert_insert_service_page_ AFTER INSERT ON application_.service_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_service_page_();

INSERT INTO internal_.page_definition_(name_)
VALUES ('Service');

INSERT INTO application_.page_ (agency_uuid_, page_definition_uuid_)
SELECT a.uuid_, d.uuid_
FROM application_.agency_ a
CROSS JOIN internal_.page_definition_ d
WHERE d.name_ = 'Home';

INSERT INTO application_.page_ (agency_uuid_, service_uuid_, page_definition_uuid_)
SELECT s.agency_uuid_, s.uuid_, d.uuid_
FROM application_.service_ s
CROSS JOIN internal_.page_definition_ d
WHERE d.name_ = 'Service';

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
