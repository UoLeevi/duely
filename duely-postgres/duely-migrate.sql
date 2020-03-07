-- psql -U postgres -d duely -f duely-migrate.sql

\echo ''
\set ON_ERROR_STOP true

\echo 'Running migration...'
\set QUIET true

DO 
LANGUAGE plpgsql
$_$
DECLARE

BEGIN

  CREATE FUNCTION operation_.query_role_(_role_uuid uuid) RETURNS TABLE(uuid_ uuid, name_ text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  DECLARE
    _arg RECORD;
  BEGIN
    SELECT _role_uuid role_uuid_ INTO _arg;
    PERFORM security_.control_operation_('query_role_', _arg);

    RETURN QUERY
    SELECT uuid_, name_
    FROM security_.role_
    WHERE uuid_ = _role_uuid;

  END
  $$;

  PERFORM security_.implement_policy_allow_('query_user_invite_', 'logged_in_');

EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
