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

CALL internal_.drop_auditing_('internal_.page_definition_');
ALTER TABLE internal_.page_definition_ ADD COLUMN url_path_ text;
CALL internal_.setup_resource_('internal_.page_definition_', 'page definition', 'pagedef', '{uuid_, name_, url_path_}');

UPDATE internal_.page_definition_
SET url_path_ = '/'
WHERE name_ = 'Home';

UPDATE internal_.page_definition_
SET url_path_ = '/services/:service_url_name'
WHERE name_ = 'Service';

ALTER TABLE internal_.page_definition_ ALTER COLUMN url_path_ SET NOT NULL;
ALTER TABLE internal_.page_definition_ ADD UNIQUE (url_path_);
CALL internal_.setup_auditing_('internal_.page_definition_');


CALL internal_.drop_auditing_('application_.page_');
ALTER TABLE application_.page_ ADD COLUMN url_path_ text;
CALL internal_.setup_resource_('application_.page_', 'page', 'page', '{uuid_, agency_uuid_, service_uuid_ url_path_}', 'application_.agency_');

UPDATE application_.page_ p
SET url_path_ = '/'
FROM internal_.page_definition_ d
WHERE d.name_ = 'Home'
  AND d.uuid_ = p.page_definition_uuid_;

UPDATE application_.page_ p
SET url_path_ = '/services/' || s.url_name_
FROM application_.service_ s
CROSS JOIN internal_.page_definition_ d
WHERE d.name_ = 'Service'
  AND d.uuid_ = p.page_definition_uuid_
  AND p.service_uuid_ = s.uuid_;

ALTER TABLE application_.page_ ALTER COLUMN url_path_ SET NOT NULL;
ALTER TABLE ONLY application_.page_
    ADD CONSTRAINT page__url_path__agency_uuid__key UNIQUE (url_path_, agency_uuid_);
CALL internal_.setup_auditing_('application_.page_');

CREATE OR REPLACE FUNCTION policy_.can_query_page_based_on_access_level_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_access_(_resource_definition, _resource, access_)
    FROM application_.page_
    WHERE uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, access_, page_definition_uuid_, agency_uuid_, service_uuid_, url_path_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION internal_.insert_agency_home_page_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO application_.page_ (agency_uuid_, page_definition_uuid_, url_path_)
  SELECT a.uuid_, d.uuid_, '/'
  FROM _new_table a
  CROSS JOIN internal_.page_definition_ d
  WHERE d.name_ = 'Home';

  RETURN NULL;

END;
$$;

CREATE OR REPLACE FUNCTION internal_.insert_service_page_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO application_.page_ (agency_uuid_, service_uuid_, page_definition_uuid_, url_path_)
  SELECT s.agency_uuid_, s.uuid_, d.uuid_, '/services/' || s.url_name_
  FROM _new_table s
  CROSS JOIN internal_.page_definition_ d
  WHERE d.name_ = 'Service';

  RETURN NULL;

END;
$$;

CREATE OR REPLACE FUNCTION internal_.update_service_page_url_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE application_.page_ p
  SET url_path_ = '/services/' || s.url_name_
  FROM _new_table s
  CROSS JOIN internal_.page_definition_ d
  WHERE d.name_ = 'Service'
    AND d.uuid_ = p.page_definition_uuid_
    AND p.service_uuid_ = s.uuid_;

  RETURN NULL;

END;
$$;

CREATE TRIGGER tr_after_update_update_service_page_url_ AFTER UPDATE ON application_.service_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.update_service_page_url_();

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
