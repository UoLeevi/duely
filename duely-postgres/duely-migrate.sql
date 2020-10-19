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

CREATE FUNCTION operation_.query_current_user_() RETURNS jsonb
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT operation_.query_resource_(r.id_)
  FROM application_.resource_ r
  WHERE r.uuid_ = internal_.current_subject_uuid_()
$$;

INSERT INTO security_.operation_(name_, log_events_) VALUES ('query_current_user_', 'f');

PERFORM security_.implement_policy_allow_('query_current_user_', 'logged_in_');
PERFORM security_.implement_policy_allow_('query_current_user_', 'visitor_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
