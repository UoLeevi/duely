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

CREATE OR REPLACE FUNCTION internal_.convert_from_internal_format_(_data jsonb) RETURNS jsonb
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  WITH
    _uuid_fields AS (
      SELECT k, LEFT(k, length(k) - 5) || 'id_' f, r.id_
      FROM jsonb_object_keys(_data) k
      LEFT JOIN application_.resource_ r ON r.uuid_ = (_data->>k)::uuid
      WHERE k LIKE '%uuid\_'
    )
  SELECT jsonb_object_agg(rtrim(COALESCE(i.f, d.key), '_'), COALESCE(to_jsonb(i.id_), d.value)) data_
  FROM jsonb_each(_data) d
  LEFT JOIN _uuid_fields i ON i.k = d.key;
$$;


CREATE OR REPLACE FUNCTION internal_.convert_to_internal_format_(_data jsonb) RETURNS jsonb
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  WITH
    _id_fields AS (
      SELECT k, LEFT(k, length(k) - 2) || 'uuid' f, r.uuid_
      FROM jsonb_object_keys(_data) k
      LEFT JOIN application_.resource_ r ON r.id_ = _data->>k
      WHERE k LIKE '%id'
    )
  SELECT jsonb_object_agg(COALESCE(i.f, d.key) || '_', COALESCE(to_jsonb(i.uuid_), d.value)) data_
  FROM jsonb_each(_data) d
  LEFT JOIN _id_fields i ON i.k = d.key;
$$;

-- CREATE OR REPLACE FUNCTION operation_.create_resource_(_resource_name text, _data jsonb) RETURNS jsonb
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- DECLARE
--   _resource_definition security_.resource_definition_;
--   _column_list text;
--   _select_list text;
--   _uuid uuid;
--   _id text;
--   _owned_resources_data jsonb;
-- BEGIN
--   SELECT * INTO _resource_definition
--   FROM security_.resource_definition_ WHERE name_ = _resource_name;

--   _data := jsonb_strip_nulls(_data);

--   SELECT owner_, owned_ INTO _data, _owned_resources_data
--   FROM internal_.extract_referenced_resources_jsonb_(_resource_definition.uuid_, _data);

--   _data := internal_.convert_to_internal_format_(_data);

--   PERFORM security_.control_create_(_resource_definition, _data);

--   _uuid := internal_.dynamic_insert_(_resource_definition.table_, _data);

--   SELECT id_ INTO _id FROM application_.resource_ WHERE uuid_ = _uuid;

--   _data := operation_.query_resource_(_id);

--   SELECT jsonb_object_agg(r.key, internal_.create_or_update_owned_resource_(_resource_definition.table_, _id, r.key, r.value)) INTO _owned_resources_data
--   FROM jsonb_each(_owned_resources_data) r;

--   RETURN _data || COALESCE(_owned_resources_data, '{}'::jsonb);
-- END
-- $$;

-- CALL internal_.drop_auditing_('application_.markdown_');
-- CALL internal_.drop_auditing_('application_.image_');

-- CREATE FUNCTION internal_.check_current_user_is_serviceaccount_() RETURNS boolean
--     LANGUAGE plpgsql STABLE SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF EXISTS (
--     SELECT 1
--     FROM security_.security_data_ s
--     JOIN security_.user_ u ON s.key_ = 'email_address:' || u.email_address_
--     WHERE u.uuid_ = internal_.current_subject_uuid_()
--       AND (s.data_->>'is_service_account')::boolean
--   ) THEN
--     RETURN 't';
--   ELSE
--     RETURN 'f';
--   END IF;
-- END
-- $$;

-- CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_stripe_account_for_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF internal_.check_current_user_is_serviceaccount_() THEN
--     RETURN array_cat(_keys, '{uuid_, agency_uuid_, stripe_id_ext_}');
--   ELSE
--     RETURN _keys;
--   END IF;
-- END
-- $$;

-- CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_markdown_without_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF _resource.owner_uuid_ IS NULL AND internal_.check_current_user_is_serviceaccount_() THEN
--     RETURN array_cat(_keys, '{uuid_, name_, data_, agency_uuid_}');
--   ELSE
--     RETURN _keys;
--   END IF;
-- END
-- $$;

-- CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_create_markdown_without_agency_(_resource_definition security_.resource_definition_, _data jsonb, _keys text[]) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $_$
-- BEGIN
--   IF (
--     SELECT (_data ? 'agency_uuid_') = false AND internal_.check_current_user_is_serviceaccount_()
--     FROM internal_.query_owner_resource_(_resource_definition, _data)
--   ) THEN
--     RETURN array_cat(_keys, '{name_, data_, agency_uuid_}');
--   ELSE
--     RETURN _keys;
--   END IF;
-- END
-- $_$;

-- CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_change_markdown_without_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF _resource.owner_uuid_ IS NULL AND internal_.check_current_user_is_serviceaccount_() THEN
--     RETURN array_cat(_keys, '{name_, data_}');
--   ELSE
--     RETURN _keys;
--   END IF;
-- END
-- $$;

-- CALL internal_.setup_resource_('application_.markdown_', 'markdown', 'md', '{uuid_, name_, agency_uuid_}', 'application_.agency_');

-- CREATE OR REPLACE FUNCTION policy_.owner_can_query_markdown_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
--     RETURN array_cat(_keys, '{uuid_, name_, data_, agency_uuid_}');
--   ELSE
--     RETURN _keys;
--   END IF;
-- END
-- $$;

-- CREATE OR REPLACE FUNCTION policy_.owner_can_create_markdown_(_resource_definition security_.resource_definition_, _data jsonb, _keys text[]) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $_$
-- BEGIN
--   IF (
--     SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
--     FROM internal_.query_owner_resource_(_resource_definition, _data)
--   ) THEN
--     RETURN array_cat(_keys, '{name_, data_, agency_uuid_}');
--   ELSE
--     RETURN _keys;
--   END IF;
-- END
-- $_$;

-- CREATE OR REPLACE FUNCTION policy_.owner_can_change_markdown_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
--     RETURN array_cat(_keys, '{name_, data_}');
--   ELSE
--     RETURN _keys;
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

-- PERFORM security_.register_policy_('application_.markdown_', 'query', 'policy_.anyone_can_query_subdomain_');
-- PERFORM security_.register_policy_('application_.markdown_', 'query', 'policy_.serviceaccount_can_query_markdown_without_agency_');
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
