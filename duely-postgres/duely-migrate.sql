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
BEGIN
-- MIGRATION CODE START

DROP FUNCTION operation_.query_resource_all_;

DELETE FROM security_.policy_assignment_ p
USING security_.operation_ o
WHERE p.operation_uuid_ = o.uuid_
  AND o.name_ = 'query_active_subject_';

DELETE FROM security_.operation_ WHERE name_ = 'query_active_subject_';
DROP FUNCTION operation_.query_active_subject_;

DELETE FROM security_.policy_assignment_ p
USING security_.operation_ o
WHERE p.operation_uuid_ = o.uuid_
  AND o.name_ = 'query_user_';

DELETE FROM security_.operation_ WHERE name_ = 'query_user_';
DROP FUNCTION operation_.query_user_;

DELETE FROM security_.policy_assignment_ p
USING security_.operation_ o
WHERE p.operation_uuid_ = o.uuid_
  AND o.name_ = 'query_role_';

DELETE FROM security_.operation_ WHERE name_ = 'query_role_';
DROP FUNCTION operation_.query_role_;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
