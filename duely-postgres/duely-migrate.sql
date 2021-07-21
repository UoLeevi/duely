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
  _config_form_uuid uuid;
BEGIN
-- MIGRATION CODE START

CALL internal_.drop_resource_('application_.agency_thank_you_page_setting_');
CALL internal_.drop_resource_('application_.product_thank_you_page_setting_');

DROP TABLE application_.agency_thank_you_page_setting_;
DROP TABLE application_.product_thank_you_page_setting_;

DROP FUNCTION policy_.agent_can_query_agency_thank_you_page_setting_;
DROP FUNCTION policy_.agent_can_query_product_thank_you_page_setting_;
DROP FUNCTION policy_.owner_can_change_agency_thank_you_page_setting_;
DROP FUNCTION policy_.owner_can_change_product_thank_you_page_setting_;
DROP FUNCTION policy_.owner_can_create_agency_thank_you_page_setting_;
DROP FUNCTION policy_.owner_can_create_product_thank_you_page_setting_;
DROP FUNCTION policy_.serviceaccount_can_query_agency_thank_you_page_setting_;
DROP FUNCTION policy_.serviceaccount_can_query_product_thank_you_page_setting_;

CREATE TABLE application_.agency_settings_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_uuid_ uuid NOT NULL UNIQUE REFERENCES application_.agency_(uuid_) ON DELETE CASCADE,
    checkout_success_url_ text,
    checkout_cancel_url_ text
);

CREATE FUNCTION internal_.insert_agency_settings_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO application_.agency_settings_ (agency_uuid_)
  SELECT a.uuid_
  FROM _new_table a;

  RETURN NULL;
END;
$$;

CREATE TRIGGER tr_after_insert_insert_agency_settings_ AFTER INSERT ON application_.agency_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_agency_settings_();

CREATE TABLE application_.product_settings_ (
    uuid_ uuid DEFAULT gen_random_uuid() NOT NULL,
    product_uuid_ uuid NOT NULL UNIQUE REFERENCES application_.product_(uuid_) ON DELETE CASCADE,
    checkout_success_url_ text,
    checkout_cancel_url_ text
);

CREATE FUNCTION internal_.insert_product_settings_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO application_.product_settings_ (product_uuid_)
  SELECT p.uuid_
  FROM _new_table p;

  RETURN NULL;
END;
$$;

CREATE TRIGGER tr_after_insert_insert_product_settings_ AFTER INSERT ON application_.product_ REFERENCING NEW TABLE AS _new_table FOR EACH STATEMENT EXECUTE FUNCTION internal_.insert_product_settings_();

CALL internal_.setup_resource_('application_.agency_settings_', 'agency settings', 'agcyset', '{uuid_,agency_uuid_}', 'application_.agency_');
CALL internal_.setup_resource_('application_.product_settings_', 'product settings', 'prodset', '{uuid_,product_uuid_}', 'application_.product_');

CREATE FUNCTION policy_.agent_can_query_agency_settings_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, agency_uuid_, checkout_success_url_, checkout_cancel_url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.product_settings_', 'query', 'policy_.agent_can_query_agency_settings_');

CREATE FUNCTION policy_.owner_can_change_agency_settings_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{checkout_success_url_, checkout_cancel_url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.product_settings_', 'update', 'policy_.owner_can_change_agency_settings_');

CREATE FUNCTION policy_.serviceaccount_can_query_agency_settings_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, agency_uuid_, checkout_success_url_, checkout_cancel_url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.product_settings_', 'query', 'policy_.serviceaccount_can_query_agency_settings_');

CREATE FUNCTION policy_.agent_can_query_product_settings_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'agent') THEN
    RETURN '{uuid_, product_uuid_, checkout_success_url_, checkout_cancel_url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.product_settings_', 'query', 'policy_.agent_can_query_product_settings_');

CREATE FUNCTION policy_.owner_can_change_product_settings_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_resource_role_(_resource_definition, _resource, 'owner') THEN
    RETURN '{checkout_success_url_, checkout_cancel_url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.product_settings_', 'update', 'policy_.owner_can_change_product_settings_');

CREATE FUNCTION policy_.serviceaccount_can_query_product_settings_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF internal_.check_current_user_is_serviceaccount_() THEN
    RETURN '{uuid_, product_uuid_, checkout_success_url_, checkout_cancel_url_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.product_settings_', 'query', 'policy_.serviceaccount_can_query_product_settings_');

INSERT INTO application_.agency_settings_ (agency_uuid_)
SELECT a.uuid_
FROM application_.agency_ a;

INSERT INTO application_.product_settings_ (product_uuid_)
SELECT a.uuid_
FROM application_.product_ a;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
