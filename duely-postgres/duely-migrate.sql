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

CREATE TABLE application_.notification_definition_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ text NOT NULL UNIQUE,
    description_ text,
    stripe_event_ text,
    feed_template_ text,
    feed_notification_enabled_ boolean,
    feed_notification_default_ boolean,
    email_template_ text,
    email_notifications_enabled_ boolean,
    email_notifications_default_ boolean
);
CALL internal_.setup_auditing_('application_.notification_definition_');
CALL internal_.setup_resource_('application_.notification_definition_', 'notification definition', 'notidef', '{uuid_, name_, stripe_event_, feed_notification_enabled_, email_notifications_enabled_}');

CREATE TABLE application_.user_notification_setting_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_uuid_ uuid NOT NULL REFERENCES security_.user_ (uuid_),
    subdomain_uuid_ uuid NOT NULL REFERENCES security_.subdomain_ (uuid_),
    notification_definition_uuid_ uuid NOT NULL REFERENCES application_.notification_definition_ (uuid_),
    feed_notification_ boolean,
    email_notification_ boolean,
    UNIQUE (user_uuid_, subdomain_uuid_, notification_definition_uuid_)
);
CALL internal_.setup_auditing_('application_.user_notification_setting_');
CALL internal_.setup_resource_('application_.user_notification_setting_', 'user notification setting', 'unotiset', '{uuid_, user_uuid_, subdomain_uuid_, notification_definition_uuid_}', 'security_.user_');

CREATE FUNCTION policy_.user_can_query_their_notification_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    WHERE s.type_ = 'user'
      AND s.uuid_ = query_resource_owner_uuid_(_resource.id_, 'user')
  ) THEN
    RETURN '{uuid_, user_uuid_, subdomain_uuid_, notification_definition_uuid_, feed_notification_, email_notification_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE FUNCTION policy_.user_can_create_their_notification_setting_(_resource_definition security_.resource_definition_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    WHERE s.type_ = 'user'
      AND s.uuid_ = (_data->>'user_uuid_')::uuid
  ) THEN
    RETURN '{user_uuid_, subdomain_uuid_, notification_definition_uuid_, feed_notification_, email_notification_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

CREATE FUNCTION policy_.user_can_change_their_notification_setting_(_resource_definition security_.resource_definition_, _resource application_.resource_, _data jsonb) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM security_.active_subject_ s
    WHERE s.type_ = 'user'
      AND s.uuid_ = query_resource_owner_uuid_(_resource.id_, 'user')
  ) THEN
    RETURN '{feed_notification_, email_notification_}'::text[];
  ELSE
    RETURN '{}'::text[];
  END IF;
END
$$;

PERFORM security_.register_policy_('application_.user_notification_setting_', 'query', 'policy_.user_can_query_their_notification_setting_');
PERFORM security_.register_policy_('application_.user_notification_setting_', 'create', 'policy_.user_can_create_their_notification_setting_');
PERFORM security_.register_policy_('application_.user_notification_setting_', 'update', 'policy_.user_can_change_their_notification_setting_');

CREATE FUNCTION policy_.anyone_can_query_notification_definition_(_resource_definition security_.resource_definition_, _resource application_.resource_) RETURNS text[]
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN '{uuid_, name_, description_, stripe_event_, feed_template_, feed_notification_enabled_, feed_notification_default_, email_template_, email_notifications_enabled_, email_notifications_default_}'::text[];
END
$$;

PERFORM security_.register_policy_('application_.notification_definition_', 'query', 'policy_.anyone_can_query_notification_definition_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
