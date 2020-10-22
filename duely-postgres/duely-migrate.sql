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

CREATE TABLE security_.security_data_ (
    uuid_ uuid PRIMARY KEY DEFAULT pgcrypto_.gen_random_uuid(),
    key_ text NOT NULL UNIQUE,
    data_ jsonb NOT NULL DEFAULT '{}'::jsonb 
);

CALL internal_.setup_auditing_('security_.security_data_');

INSERT INTO security_.security_data_(key_, data_) VALUES ('email_address:serviceaccount@duely.app', '{ "is_service_account": true }');

-- UPDATE security_.resource_definition_ SET search_ = '{uuid_,name_,url_name_,agency_uuid_}' WHERE name_ = 'service';

-- CALL internal_.setup_resource_('application_.service_variant_', 'service variant', 'svcvar', '{uuid_, service_uuid_}', 'application_.service_');

CREATE OR REPLACE FUNCTION policy_.serviceaccount_can_query_stripe_account_for_agency_(_resource_definition security_.resource_definition_, _resource application_.resource_, _keys text[]) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.security_data_ s
    JOIN security_.user_ u ON s.key_ = 'email_address:' || u.email_address_
    WHERE u.uuid_ = internal_.current_subject_uuid_()
      AND (s.data_->>'is_service_account')::boolean
  ) THEN
    RETURN array_cat(_keys, '{uuid_, agency_uuid_, stripe_id_ext_}');
  ELSE
    RETURN _keys;
  END IF;
END
$$;

-- CREATE OR REPLACE FUNCTION policy_.owner_can_create_service_variant_(_resource_definition security_.resource_definition_, _data jsonb, _keys text[]) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $_$
-- BEGIN
--   IF (
--     SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
--     FROM internal_.query_owner_resource_(_resource_definition, _data)
--   ) THEN
--     RETURN array_cat(_keys, '{service_uuid_, name_, status_, description_, duration_, price_, currency_, image_logo_uuid_, image_hero_uuid_}');
--   ELSE
--     RETURN _keys;
--   END IF;
-- END
-- $_$;

-- CREATE OR REPLACE FUNCTION policy_.owner_can_change_service_variant_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb, _keys text[]) RETURNS text[]
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $$
-- BEGIN
--   IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
--     RETURN array_cat(_keys, '{name_, status_, description_, duration_, price_, currency_, image_logo_uuid_, image_hero_uuid_}');
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

ALTER TABLE ONLY security_.policy_
    DROP CONSTRAINT policy__after_uuid__fkey;

ALTER TABLE ONLY security_.policy_
    ADD CONSTRAINT policy__after_uuid__fkey FOREIGN KEY (after_uuid_) REFERENCES security_.policy_(uuid_) DEFERRABLE INITIALLY DEFERRED;


CREATE OR REPLACE FUNCTION security_.unregister_policy_(_table regclass, _operation_type public.operation_type_, _policy_function regproc) RETURNS security_.policy_
    LANGUAGE plpgsql
    AS $$
DECLARE
  _resource_definition_uuid uuid;
  _policy security_.policy_;
BEGIN
  SELECT uuid_ INTO _resource_definition_uuid
  FROM security_.resource_definition_
  WHERE table_ = _table;

  DELETE FROM security_.policy_
  WHERE resource_definition_uuid_ = _resource_definition_uuid
    AND operation_type_ = _operation_type
    AND function_::regproc = _policy_function
  RETURNING * INTO _policy;

  IF _policy.after_uuid_ IS NOT NULL THEN
    UPDATE security_.policy_
    SET after_uuid_ = _policy.after_uuid_
    WHERE after_uuid_ = _policy.uuid_;
  END IF;

  RETURN _policy;
END
$$;

-- PERFORM security_.register_policy_('security_.subdomain_', 'query', 'policy_.anyone_can_query_subdomain_');
PERFORM security_.register_policy_('application_.stripe_account_', 'query', 'policy_.serviceaccount_can_query_stripe_account_for_agency_');
PERFORM security_.unregister_policy_('application_.stripe_account_', 'query', 'policy_.anyone_can_query_stripe_account_for_agency_');
-- PERFORM security_.register_policy_('application_.service_variant_', 'create', 'policy_.owner_can_create_service_variant_');
-- PERFORM security_.register_policy_('application_.service_variant_', 'update', 'policy_.owner_can_change_service_variant_');
-- PERFORM security_.register_policy_('application_.service_variant_', 'delete', 'policy_.only_owner_can_delete_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
