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

DROP FUNCTION operation_.query_agency_user_;

CREATE FUNCTION operation_.query_agency_user_(_agency_uuid uuid, _subject_uuid uuid DEFAULT NULL::uuid) RETURNS TABLE(uuid_ uuid, name_ text, email_address_ text, type_ text, role_names_ text[])
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _arg RECORD;
BEGIN
  SELECT _agency_uuid agency_uuid_, _subject_uuid subject_uuid_ INTO _arg; 
  PERFORM security_.control_operation_('query_agency_user_', _arg);

  RETURN QUERY
  SELECT s.uuid_, s.name_, u.email_address_, s.type_, array_remove(array_agg(r.name_), NULL) role_names_
  FROM application_.agency_ a
  LEFT JOIN security_.subject_assignment_flat_ sa ON a.subdomain_uuid_ = sa.subdomain_uuid_
  LEFT JOIN security_.role_ r ON r.uuid_ = sa.role_uuid_
  LEFT JOIN security_.subject_ s ON s.uuid_ = sa.subject_uuid_
  LEFT JOIN security_.user_ u ON s.uuid_ = u.uuid_
  WHERE a.uuid_ = _agency_uuid
    AND (_subject_uuid IS NULL OR _subject_uuid IS NOT DISTINCT FROM s.uuid_)
  GROUP BY s.uuid_, s.name_, u.email_address_, s.type_;

END
$$;

PERFORM security_.implement_policy_allow_('query_agency_user_', 'subject_is_active_user_');

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_$;

\echo 'MIGRATION COMPLETED'
