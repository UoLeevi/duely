import { Util } from '@duely/util';

// see: https://www.postgresql.org/docs/current/errcodes-appendix.html
// see: https://www.postgresql.org/docs/current/plpgsql-errors-and-messages.html
// see: https://github.com/brianc/node-postgres/issues/1697
// see: https://github.com/brianc/node-postgres/issues/2378
// see: https://stackoverflow.com/a/22600394
export function getDbErrorCode(err: Error) {
  if (!hasProperty(err, 'code')) return null;

  switch (err.code) {
    // Postgres standard errors
    case '23000':
      return 'integrity_constraint_violation';
    case '23001':
      return 'restrict_violation';
    case '23502':
      return 'not_null_violation';
    case '23503':
      return 'foreign_key_violation';
    case '23505':
      return 'unique_violation';
    case '23514':
      return 'check_violation';
    case '23P01':
      return 'exclusion_violation';

    // Custom errors used by duely
    case 'D0JWT': // Invalid JWT.
      return 'duely__invalid_jwt';
    case 'DEXSE': // Active session already exists.
      return 'duely__session_already_exists'
    case 'DCONF': // Invalid secret configuration.
      return 'duely__invalid_configuration';
    case 'DNOSE': // No active session.
      return 'duely__no_active_session';
    case 'DPASS': // Email address and password do not match.
      return 'duely__incorrect_password';
    case 'DUNAU': // Unauthorized.
      return 'duely__unauthorized';
    case 'DUPSE': // Upsert is not allowed for this resource.
      return 'duely__upsert_not_allowed'
    case 'DDATA': // Data does not match required schema.
      return 'duely__invalid_data'

    // Unhandled cases
    default:
      return 'unknown';
  }
}

export type DbErrorCode = ReturnType<typeof getDbErrorCode>;
