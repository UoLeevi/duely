import { pool } from '../../../db';
import stripe from '../../../stripe';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';

export default async function createAgency(obj, { name, subdomain, countryCode, returnUrl }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  // validate subdomain
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

    // create agency on database
    const res = await client.query('SELECT uuid_ FROM operation_.create_agency_($1::text, $2::text)', [name, subdomain]);
    const agencyUuid = res.rows[0].uuid_;

    // create stripe custom account for agency
    let accountId;
    try {
      const { account } = await stripe.accounts.create(
        {
          type: 'custom',
          country: countryCode,
          requested_capabilities: [
            'card_payments',
            'transfers'
          ],
          business_profile: {
            name,
            url: `${subdomain}.duely.app`
          },
          metadata: {
            agency_uuid_: agencyUuid
          }
        }
      );

      accountId = account.id;

    } catch (err) {
      // if stripe custom account could not be created, delete agency from database
      await client.query('SELECT operation_.delete_agency_($1::uuid)', [agencyUuid]);
      return {
        success: false,
        message: err.message,
        type: 'CreateAgencyResult'
      };
    }

    // store stripe custom account id to database
    await client.query('SELECT operation_.create_stripe_account_($1::text, $2::uuid)', [accountId, agencyUuid]);

    // create stripe account verification url
    let stripeVerificationUrl;
    let message = null;
    try {
      const accountLink = await stripe.accountLinks.create(
        {
          account: accountId,
          failure_url: returnUrl,
          success_url: returnUrl,
          type: 'custom_account_verification',
          collect: 'eventually_due'
        }
      );
      stripeVerificationUrl = accountLink.url;
    } catch (err) {
      message = err.message;
    }

    // success
    return {
      success: true,
      message,
      agencyUuid,
      stripeVerificationUrl,
      type: 'CreateAgencyResult'
    };

  } catch (error) {
    return {
      // error
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