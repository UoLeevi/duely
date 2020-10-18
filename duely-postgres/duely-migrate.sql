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

DROP INDEX security_.sign_up__email_address__idx;
CREATE UNIQUE INDEX sign_up__email_address__idx ON security_.sign_up_ USING btree (email_address_) WHERE status_ != 'cancelled';

CREATE OR REPLACE FUNCTION internal_.try_start_sign_up_() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE security_.sign_up_
  SET
    status_ = 'cancelled'
  WHERE email_address_ = NEW.email_address_
    AND status_ = 'started';

  INSERT INTO security_.sign_up_(uuid_, email_address_, name_, data_, password_hash_)
  SELECT NEW.uuid_, NEW.email_address_, NEW.name_, COALESCE(NEW.data_, '{}'::jsonb), pgcrypto_.crypt(NEW.password_, pgcrypto_.gen_salt('md5'));

  RETURN NEW;
END
$$;

-- MIGRATION CODE END
EXCEPTION WHEN OTHERS THEN

  RAISE NOTICE 'MIGRATION FAILED';
  RAISE;

END;
$_MIGRATION_$;

\echo 'MIGRATION COMPLETED'
