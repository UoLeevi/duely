import { pool } from '../../../db';
import stripe from '../../../stripe';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';

export default async function createAgency(obj, { name, subdomain, countryCode, successUrl, failureUrl }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  const reservedSubdomains = ['api', 'test', 'example', 'admin'];

  if (reservedSubdomains.includes(subdomain.toLowerCase()))
    return {
      success: false,
      message: `Subdomain '${subdomain}' is not allowed.`,
      type: 'CreateAgencyResult'
    };

  if (subdomain.includes('.'))
    return {
      success: false,
      message: `Subdomain '${subdomain}' has more than one part and is not allowed.`,
      type: 'CreateAgencyResult'
    };

  if (!validator.isFQDN(`${subdomain}.duely.app`))
    return {
      success: false,
      message: `Subdomain format '${subdomain}' is invalid.`,
      type: 'CreateAgencyResult'
    };

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);

    const res = await client.query('SELECT uuid_ FROM operation_.create_agency_($1::text, $2::text)', [name, subdomain]);
    const agencyUuid = res.rows[0].uuid_;

    const res_as = await client.query('SELECT * FROM operation_.query_active_subject_()');
    const emailAddress = res_as.rows[0].email_address_;

    let res_stripe = await stripe.createAccount(countryCode, {
      'email': emailAddress,
      'metadata[agency_uuid_]': agencyUuid,
      'business_profile[name]': name,
      'business_profile[url]': `${subdomain}.duely.app`,
    });

    if (res_stripe.error)
      return {
        success: false,
        message: res_stripe.error.message,
        type: 'CreateAgencyResult'
      };

    await client.query('SELECT uuid_ FROM operation_.create_stripe_account_($1::text, $2::uuid)', [res_stripe.id, agencyUuid]);

    res_stripe = await stripe.createAccountLink(res_stripe.id, successUrl, failureUrl);

    if (res_stripe.error)
      return {
        success: false,
        message: res_stripe.error.message,
        type: 'CreateAgencyResult'
      };

    const stripeVerificationUrl = res_stripe.url;

    return {
      success: true,
      agencyUuid,
      stripeVerificationUrl,
      type: 'CreateAgencyResult'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      type: 'CreateAgencyResult'
    };
  }
  finally {
    await client.query('SELECT operation_.end_session_()');
    client.release();
  }
};