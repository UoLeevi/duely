import { pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function editService(obj, { serviceUuid, name, description, duration, price, currency, imageLogoUuid, imageHeroUuid }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  // validate currency arguments
  currency = currency != null ? currency.toLowerCase() : currency;

  if (currency != null && !/[a-z]{3}/.test(currency))
    return {
      success: false,
      message: `Argument 'currency' has invalid format. Three digit currency code expected.`,
      type: 'EditServiceResult'
    };

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);

    // update service on the database
    const res = await client.query('SELECT * FROM operation_.edit_service_($1::uuid, $2::text, $3::text, $4::text, $5::int, $6::text, $7::uuid, $8::uuid)', [serviceUuid, name, description, duration, price, currency, imageLogoUuid, imageHeroUuid]);
    const service = res.rows[0];

    // success
    return {
      success: true,
      service,
      type: 'EditServiceResult'
    };

  } catch (error) {
    return {
      // error
      success: false,
      message: error.message,
      type: 'EditServiceResult'
    };
  }
  finally {
    await client.query('SELECT operation_.end_session_()');
    client.release();
  }
};