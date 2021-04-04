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

CREATE TABLE security_.resource_token_ (
    uuid_ uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_uuid_ uuid REFERENCES application_.resource_ (uuid_) ON DELETE CASCADE,
    token_ text NOT NULL,
    keys_ text[] NOT NULL,
    UNIQUE (resource_uuid_, token_)
);

DROP FUNCTION operation_.query_resource_(text,text);

CREATE OR REPLACE FUNCTION operation_.query_resource_(_resource_name text, _id_or_token_or_filter text) RETURNS SETOF jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  _id_or_token text;
  _filter jsonb;
  _single_result jsonb;
  _resource application_.resource_;
BEGIN
  IF _resource_name IS NULL OR _id_or_token_or_filter IS NULL THEN
    RETURN;
  END IF;

  IF starts_with(_id_or_token_or_filter, '{') THEN
    _filter := _id_or_token_or_filter::jsonb;

    IF _filter = '{}'::jsonb THEN
      RETURN;
    ELSEIF _filter - 'id' = '{}'::jsonb THEN
      _id_or_token := _filter->>'id';
    END IF;

  ELSE
    _id_or_token := _id_or_token_or_filter;
  END IF;

  IF _id_or_token IS NOT NULL THEN
    -- Lookup by resource token
    SELECT internal_.convert_from_internal_format_(
        internal_.dynamic_select_(d.table_, r.uuid_, t.keys_)
      ) INTO _single_result
    FROM application_.resource_ r
    JOIN security_.resource_token_ t ON r.uuid_ = t.resource_uuid_
    JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
    WHERE d.name_ = _resource_name
      AND t.token_ = _id_or_token;

    IF _single_result IS NULL THEN
      -- Lookup by id
      SELECT internal_.convert_from_internal_format_(
        internal_.dynamic_select_(d.table_, r.uuid_, keys_)
      ) INTO _single_result
      FROM application_.resource_ r
      JOIN security_.resource_definition_ d ON d.uuid_ = r.definition_uuid_
      CROSS JOIN security_.control_query_(d, r) keys_
      WHERE d.name_ = _resource_name
        AND r.id_ = _id_or_token;
    END IF;

    RETURN QUERY
      SELECT _single_result;

  ELSE
    -- Filter by fields
    RETURN QUERY
      SELECT operation_.query_resource_(_resource_name, _filter);
  END IF;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
