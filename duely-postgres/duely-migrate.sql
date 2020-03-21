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
-- MIGRATION CODE START

CREATE OR REPLACE FUNCTION operation_.query_shared_agency_(_subject_uuid uuid, _agency_uuid uuid DEFAULT NULL::uuid) RETURNS TABLE(uuid_ uuid, name_ text, subdomain_uuid_ uuid, theme_uuid_ uuid, role_names_ text[])
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
  _info RECORD;
BEGIN
  SELECT _subject_uuid subject_uuid_, _agency_uuid agency_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('query_shared_agency_', _arg);

  RETURN QUERY
  SELECT a.uuid_, a.name_, a.subdomain_uuid_, t.uuid_ theme_uuid_, array_remove(array_agg(r.name_), NULL) role_names_
  FROM security_.user_ u
  JOIN security_.subject_assignment_flat_ sa ON u.uuid_ = sa.subject_uuid_
  JOIN security_.role_ r ON r.uuid_ = sa.role_uuid_
  JOIN application_.agency_ a ON a.subdomain_uuid_ = sa.subdomain_uuid_
  JOIN security_.active_role_ ar ON a.subdomain_uuid_ = ar.subdomain_uuid_ AND r.uuid_ = ar.uuid_
  LEFT JOIN application_.theme_ t ON a.uuid_ = t.agency_uuid_
  CROSS JOIN security_.active_user_ au
  WHERE u.uuid_ = _subject_uuid
    AND (ar.name_ = 'agent' OR _subject_uuid = au.uuid_)
    AND (_agency_uuid IS NULL OR _agency_uuid IS NOT DISTINCT FROM a.uuid_)
  GROUP BY a.uuid_, a.name_, a.subdomain_uuid_, t.uuid_;

END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
