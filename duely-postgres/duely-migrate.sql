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

CREATE OR REPLACE FUNCTION internal_.query_resource_owner_uuid_(_id text, _owner_resource_name text DEFAULT 'subdomain') RETURNS uuid
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
DECLARE
  _uuid uuid;
  _owner_uuid uuid;
  _resource_name text;
BEGIN

  LOOP
    SELECT o.id_, r.uuid_, r.owner_uuid_, d.name_ INTO _id, _uuid, _owner_uuid, _resource_name
    FROM application_.resource_ r
    JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
    LEFT JOIN application_.resource_ o ON o.uuid_ = r.owner_uuid_
    WHERE r.id_ = _id;

    IF _resource_name = _owner_resource_name THEN
      RETURN _uuid;
    END IF;

    IF _id IS NULL THEN
      RETURN NULL;
    END IF;
  END LOOP;

  RETURN NULL;
END
$$;

CREATE OR REPLACE FUNCTION internal_.check_resource_role_(_resource_definition security_.resource_definition_, _resource application_.resource_, _role_name text) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
DECLARE
  _subdomain_uuid uuid;
BEGIN
  _subdomain_uuid := internal_.query_resource_owner_uuid_(_resource.id_);

  IF EXISTS (
    SELECT 1
    FROM security_.active_role_ r
    JOIN security_.subdomain_ d ON r.subdomain_uuid_ = d.uuid_
    WHERE d.uuid_ = _subdomain_uuid
      AND r.name_ = _role_name
  ) THEN
    RETURN 't';
  ELSE
    RETURN 'f';
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION operation_.query_resource_access_(_id text) RETURNS access_level_
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
SELECT name_::access_level_
FROM security_.subdomain_ d
JOIN security_.subject_assignment_ sa ON sa.subdomain_uuid_ = d.uuid_
WHERE d.uuid_ = internal_.query_resource_owner_uuid_(_id)
  AND sa.subject_uuid_ = internal_.current_subject_uuid_();
$$;

INSERT INTO security_.operation_(name_, log_events_) VALUES ('query_resource_access_', 'f');

PERFORM security_.implement_policy_allow_('query_resource_access_', 'logged_in_');



-- CREATE VIEW application_.membership_ AS
-- SELECT 
--   sa.uuid_,
--   r.name_::access_level_ access_,
--   u.uuid_ user_uuid_,
--   sa.subdomain_uuid_
-- FROM security_.subject_assignment_ sa
-- JOIN security_.role_ r ON r.uuid_ = sa.role_uuid_
-- JOIN security_.user_ u ON u.uuid_ = sa.subject_uuid_;

-- CALL internal_.setup_resource_('application_.membership_', 'membership', 'member', '{uuid_, user_uuid_, subdomain_uuid_, access_}', 'security_.subdomain_');

-- CREATE OR REPLACE FUNCTION policy_.anyone_can_query_own_membership_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF EXISTS (
--     SELECT 1
--     FROM security_.subject_assignment_ sa
--     WHERE uuid_ = _resource.uuid_
--       AND subject_uuid_ = internal_.current_subject_uuid_()
--   ) THEN
--     RETURN '{uuid_, access_, user_uuid_, subdomain_uuid_}'::text[];
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $$;


-- ALTER TABLE ONLY application_.membership_ ALTER COLUMN uuid_ SET DEFAULT gen_random_uuid();

-- CREATE FUNCTION internal_.resource_delete_membership_() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- DECLARE
--   _resource_definition security_.resource_definition_;
-- BEGIN

--   DELETE FROM application_.resource_ r
--   USING _old_table d
--   WHERE d.uuid_ = r.uuid_;

--   RETURN NULL;

-- END;
-- $$;

-- CREATE FUNCTION internal_.resource_insert_membership_() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- DECLARE
--   _resource_definition security_.resource_definition_;
-- BEGIN
--   SELECT * INTO _resource_definition
--   FROM security_.resource_definition_
--   WHERE name_ = 'membership';

--   PERFORM internal_.resource_insert_(_resource_definition, to_jsonb(r))
--   FROM (
--     SELECT 
--       sa.uuid_,
--       r.name_::access_level_ access_,
--       u.uuid_ user_uuid_,
--       sa.subdomain_uuid_
--     FROM _new_table sa
--     JOIN security_.role_ r ON r.uuid_ = sa.role_uuid_
--     JOIN security_.user_ u ON u.uuid_ = sa.subject_uuid_
--   ) r;

--   RETURN NULL;

-- END;
-- $$;

-- CREATE FUNCTION internal_.resource_update_membership_() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- DECLARE
--   _resource_definition security_.resource_definition_;
-- BEGIN
--   SELECT * INTO _resource_definition
--   FROM security_.resource_definition_
--   WHERE name_ = 'membership';

--   PERFORM internal_.resource_update_(_resource_definition, to_jsonb(r))
--   FROM (
--     SELECT 
--       sa.uuid_,
--       r.name_::access_level_ access_,
--       u.uuid_ user_uuid_,
--       sa.subdomain_uuid_
--     FROM _new_table sa
--     JOIN security_.role_ r ON r.uuid_ = sa.role_uuid_
--     JOIN security_.user_ u ON u.uuid_ = sa.subject_uuid_
--   ) r;

--   RETURN NULL;

-- END;
-- $$;


-- CREATE TRIGGER tr_after_delete_resource_delete_membership AFTER DELETE ON security_.subject_assignment_ REFERENCING OLD TABLE AS _old_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.resource_delete_membership_();
-- CREATE TRIGGER tr_after_insert_resource_insert_membership AFTER INSERT ON security_.subject_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.resource_insert_membership_();
-- CREATE TRIGGER tr_after_update_resource_update_membership AFTER UPDATE ON security_.subject_assignment_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE PROCEDURE internal_.resource_update_membership_();

-- PERFORM internal_.resource_insert_(d, to_jsonb(r))
-- FROM (
--   SELECT 
--     sa.uuid_,
--     r.name_::access_level_ access_,
--     u.uuid_ user_uuid_,
--     sa.subdomain_uuid_
--   FROM security_.subject_assignment_ sa
--   JOIN security_.role_ r ON r.uuid_ = sa.role_uuid_
--   JOIN security_.user_ u ON u.uuid_ = sa.subject_uuid_
-- ) r
-- CROSS JOIN security_.resource_definition_ d
-- WHERE d.name_ = 'membership';


-- CREATE OR REPLACE FUNCTION policy_.owner_can_create_markdown_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $_$
-- BEGIN
--   IF (
--     SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
--     FROM internal_.query_owner_resource_(_resource_definition, _data)
--   ) THEN
--     RETURN '{name_, data_, agency_uuid_, access_}'::text[];
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $_$;

-- CREATE OR REPLACE FUNCTION policy_.owner_can_change_markdown_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
--     RETURN '{name_, data_, access_}'::text[];
--   ELSE
--     RETURN '{}'::text[];
--   END IF;
-- END
-- $$;

-- CREATE OR REPLACE FUNCTION policy_.only_owner_can_delete_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS void
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF NOT internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
--     RAISE 'Unauthorized.' USING ERRCODE = '42501';
--   END IF;
-- END
-- $$;

-- PERFORM security_.register_policy_('application_.membership_', 'query', 'policy_.anyone_can_query_own_membership_');
-- PERFORM security_.register_policy_('application_.markdown_', 'query', 'policy_.can_query_markdown_based_on_access_level_');
-- PERFORM security_.register_policy_('application_.image_', 'query', 'policy_.can_query_image_based_on_access_level_');
-- PERFORM security_.register_policy_('application_.markdown_', 'create', 'policy_.serviceaccount_can_create_markdown_without_agency_');
-- PERFORM security_.register_policy_('application_.markdown_', 'update', 'policy_.serviceaccount_can_change_markdown_without_agency_');
-- PERFORM security_.register_policy_('application_.markdown_', 'delete', 'policy_.only_owner_can_delete_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
