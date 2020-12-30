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

CREATE SCHEMA internal__audit_;

CREATE TABLE internal_.form_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY
);
CALL internal_.setup_auditing_('internal_.form_');
CALL internal_.setup_resource_('internal_.form_', 'form', 'form', '{uuid_}');

CREATE FUNCTION policy_.anyone_can_query_form_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_}'::text[];
$$;
PERFORM security_.register_policy_('internal_.form_', 'query', 'policy_.anyone_can_query_form_');

CREATE TABLE internal_.page_definition_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ text NOT NULL UNIQUE
);
CALL internal_.setup_auditing_('internal_.page_definition_');
CALL internal_.setup_resource_('internal_.page_definition_', 'page definition', 'pagedef', '{uuid_, name_}');

CREATE FUNCTION policy_.anyone_can_query_page_definition_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, name_}'::text[];
$$;
PERFORM security_.register_policy_('internal_.page_definition_', 'query', 'policy_.anyone_can_query_page_definition_');

CREATE TABLE internal_.page_block_definition_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ text NOT NULL UNIQUE,
    page_definition_uuid_ uuid NOT NULL REFERENCES internal_.page_definition_ (uuid_),
    form_uuid_ uuid NOT NULL REFERENCES internal_.form_ (uuid_)
);
CALL internal_.setup_auditing_('internal_.page_block_definition_');
CALL internal_.setup_resource_('internal_.page_block_definition_', 'page block definition', 'pblkdef', '{uuid_, name_, page_definition_uuid_, form_uuid_}', 'internal_.page_definition_');

CREATE FUNCTION policy_.anyone_can_query_page_block_definition_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, name_, page_definition_uuid_, form_uuid_}'::text[];
$$;
PERFORM security_.register_policy_('internal_.page_block_definition_', 'query', 'policy_.anyone_can_query_page_block_definition_');

CREATE TABLE internal_.form_field_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ text NOT NULL,
    type_ text NOT NULL,
    form_uuid_ uuid NOT NULL REFERENCES internal_.form_ (uuid_),
    default_ jsonb,
    UNIQUE (name_, form_uuid_)
);
CALL internal_.setup_auditing_('internal_.form_field_');
CALL internal_.setup_resource_('internal_.form_field_', 'form field', 'formfld', '{uuid_, name_, form_uuid_}', 'internal_.form_');

CREATE FUNCTION policy_.anyone_can_query_form_field_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT '{uuid_, name_, type_, form_uuid_, default_}'::text[];
$$;
PERFORM security_.register_policy_('internal_.form_field_', 'query', 'policy_.anyone_can_query_form_field_');


CREATE TABLE application_.page_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_uuid_ uuid NOT NULL REFERENCES application_.agency_ (uuid_),
    page_definition_uuid_ uuid NOT NULL REFERENCES internal_.page_definition_ (uuid_),
    access_ access_level_ NOT NULL DEFAULT 'agent'
);
CALL internal_.setup_auditing_('application_.page_');
CALL internal_.setup_resource_('application_.page_', 'page', 'pblk', '{uuid_, agency_uuid_, page_definition_uuid_}', 'application_.agency_');

PERFORM security_.register_policy_('application_.page_', 'delete', 'policy_.only_owner_can_delete_');

CREATE FUNCTION policy_.can_query_page_based_on_access_level_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_access_(_resource_definition, _resource, access_)
    FROM application_.page_
    WHERE uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, access_, page_definition_uuid_, agency_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
PERFORM security_.register_policy_('application_.page_', 'query', 'policy_.can_query_page_based_on_access_level_');

CREATE OR REPLACE FUNCTION policy_.owner_can_change_page_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{access_, page_definition_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
PERFORM security_.register_policy_('application_.page_', 'update', 'policy_.owner_can_change_page_');

CREATE OR REPLACE FUNCTION policy_.owner_can_create_page_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{access_, page_definition_uuid_, agency_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
PERFORM security_.register_policy_('application_.page_', 'create', 'policy_.owner_can_create_page_');


CREATE TABLE application_.page_block_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    page_block_definition_uuid_ uuid NOT NULL REFERENCES internal_.page_block_definition_ (uuid_),
    page_uuid_ uuid NOT NULL REFERENCES application_.page_ (uuid_),
    data_ jsonb NOT NULL DEFAULT '{}'::jsonb,
    after_uuid_ uuid NOT NULL REFERENCES application_.page_block_ (uuid_)
);
CALL internal_.setup_auditing_('application_.page_block_');
CALL internal_.setup_resource_('application_.page_block_', 'page block', 'pblk', '{uuid_, page_block_definition_uuid_, page_uuid_}', 'application_.page_');

PERFORM security_.register_policy_('application_.page_block_', 'delete', 'policy_.only_owner_can_delete_');

CREATE FUNCTION policy_.can_query_page_block_based_on_page_access_level_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_access_(_resource_definition, _resource, access_)
    FROM application_.page_block_ b
    JOIN application_.page_ p ON p.uuid_ = b.page_uuid_
    WHERE b.uuid_ = _resource.uuid_
  ) THEN
    RETURN '{uuid_, page_block_definition_uuid_, page_uuid_, data_, after_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
PERFORM security_.register_policy_('application_.page_block_', 'query', 'policy_.can_query_page_block_based_on_page_access_level_');

CREATE OR REPLACE FUNCTION policy_.owner_can_change_page_block_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{data_, after_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
PERFORM security_.register_policy_('application_.page_block_', 'update', 'policy_.owner_can_change_page_block_');

CREATE OR REPLACE FUNCTION policy_.owner_can_create_page_block_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF (
    SELECT internal_.check_resource_role_(resource_definition_, resource_, 'owner')
    FROM internal_.query_owner_resource_(_resource_definition, _data)
  ) THEN
    RETURN '{page_block_definition_uuid_, page_uuid_, data_, after_uuid_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;
PERFORM security_.register_policy_('application_.page_block_', 'create', 'policy_.owner_can_create_page_block_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
