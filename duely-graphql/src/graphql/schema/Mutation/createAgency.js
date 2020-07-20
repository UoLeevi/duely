import { withConnection } from '../../../db';
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

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        // create agency on database
        const res = await client.query('SELECT uuid_ FROM operation_.create_agency_($1::text, $2::text)', [name, subdomain]);
        const agency = res.rows[0];

        // create stripe custom account for agency
        let account;
        try {
          account = await stripe.accounts.create({
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
              agency_uuid_: agency.uuid_
            }
          });

        } catch (error) {
          // if stripe custom account could not be created, delete agency from database
          await client.query('SELECT operation_.delete_agency_($1::uuid)', [agency.uuid_]);
          return {
            success: false,
            message: error.message,
            type: 'CreateAgencyResult'
          };
        }

        // store stripe custom account id to database
        await client.query('SELECT operation_.create_stripe_account_($1::uuid, $2::text)', [agency.uuid_, account.id]);

        // create stripe account verification url
        let accountLink;
        try {
          accountLink = await stripe.accountLinks.create({
            account: account.id,
            failure_url: returnUrl,
            success_url: returnUrl,
            type: 'custom_account_verification',
            collect: 'eventually_due'
          });
        } catch (error) {
          return {
            // something went wrong during account verification link creation
            success: true,
            message: error.message,
            agency,
            type: 'CreateAgencyResult'
          };
        }

        // success
        return {
          success: true,
          agency,
          stripeVerificationUrl: accountLink.url,
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
    });
  });
};
