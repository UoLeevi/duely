import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource } from '../../utils';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';
import stripe from '../../../stripe';

const resource = {
  name: 'agency',
  plural: 'agencies'
};

export const Agency = {
  typeDef: `
    type Agency implements Node {
      id: ID!
      name: String!
      stripe_account: StripeAccount!
      subdomain: Subdomain!
      theme: Theme!
    }

    input AgencyFilter {
      name: String
    }

    extend type Query {
      agency(id: ID!): Agency
      agencies(filter: AgencyFilter!): [Agency!]
    }

    extend type Mutation {
      create_agency(name: String!, subdomain_name: String!, country_code: String!, image_logo: ImageInput!, return_url: String!): CreateAgencyResult!
    }

    type CreateAgencyResult implements MutationResult {
      success: Boolean!
      message: String
      agency: Agency
      stripe_verification_url: String
    }
  `,
  resolvers: {
    Agency: {
      async stripe_account(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          const stripe_account = await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource }) => {
              return await queryResource('stripe account', { agency_id: source.id });
            });
          });

          const { id, object, ...stripe_account_ext } = await stripe.accounts.retrieve(stripe_account.stripe_id_ext);
          return { ...stripe_account, ...stripe_account_ext };
        } catch (error) {
          throw new Error(error.message);
        }
      },
      async subdomain(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource }) => {
              return await queryResource(source.subdomain_id);
            });
          });
        } catch (error) {
          throw new Error(error.message);
        }
      },
      async theme(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource }) => {
              return await queryResource('theme', { agency_id: source.id });
            });
          });
        } catch (error) {
          throw new Error(error.message);
        }
      }
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_agency(obj, { name, subdomain_name, country_code, image_logo, return_url }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        // validate subdomain name
        const reservedSubdomains = ['api', 'test', 'example', 'admin'];

        if (reservedSubdomains.includes(subdomain_name.toLowerCase()))
          return {
            success: false,
            message: `Subdomain '${subdomain_name}' is not allowed.`,
            type: 'CreateAgencyResult'
          };

        if (subdomain_name.includes('.'))
          return {
            success: false,
            message: `Subdomain '${subdomain_name}' has more than one part and is not allowed.`,
            type: 'CreateAgencyResult'
          };

        if (!validator.isFQDN(`${subdomain_name}.duely.app`))
          return {
            success: false,
            message: `Subdomain format '${subdomain_name}' is invalid.`,
            type: 'CreateAgencyResult'
          };

        // validate logo image

        if (!validator.isDataURI(image_logo.data))
          return {
            success: false,
            message: `Image data should be encoded as a data URL.`,
            type: 'CreateAgencyResult'
          };

        if (!image_logo.data.startsWith('data:image/jpeg;base64,') 
         && !image_logo.data.startsWith('data:image/png;base64,'))
          return {
            success: false,
            message: `Image should be either a JPEG or PNG`,
            type: 'CreateAgencyResult'
          };

        if (!validator.isByteLength(image_logo.data, { max: Math.round(512000/4*3) }))
          return {
            success: false,
            message: `Image max size is 512KB.`,
            type: 'CreateAgencyResult'
          };

        let image_buffer;

        try {
          const image_base64 = image_logo.data.split(',')[1];
          image_buffer = Buffer.from(image_base64, 'base64');
        } catch {
          return {
            success: false,
            message: `Unable to read image file.`,
            type: 'CreateAgencyResult'
          };
        }

        // validate country code
        if (!validator.isISO31661Alpha2(country_code))
          return {
            success: false,
            message: `Invalid country code.`,
            type: 'CreateAgencyResult'
          };

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ query, createResource }) => {
              // get current user
              const user = await query('SELECT * FROM operation_.query_current_user_()');

              // create subdomain and agency on database
              const subdomain = await createResource('subdomain', { name: subdomain_name, agency: { name } });
              const agency = subdomain.agency;

              // create logo image
              const image = await createResource('image', { ...image_logo, agency_id: agency.id, access: 'public' });

              // create theme
              const theme = await createResource('theme', { name, image_logo_id: image.id, agency_id: agency.id });

              // upload logo image to stripe
              const logo_upload = await stripe.files.create({
                file: {
                  data: image_buffer,
                  name: image_logo.name,
                  type: 'application/octet-stream',
                },
                purpose: 'business_logo',
              });

              // create stripe custom account for agency
              // see: https://stripe.com/docs/api/accounts/create

              const createStripeAccountArgs = {
                type: 'custom',
                email: user.email_address,
                country: country_code,
                capabilities: {
                  card_payments: { requested: true },
                  transfers: { requested: true },
                },
                business_profile: {
                  name,
                  url: `${subdomain.name}.duely.app`
                },
                tos_acceptance: {
                  date: Math.floor(Date.now() / 1000)
                },
                metadata: {
                  agency_id: agency.id
                },
                settings: {
                  branding: {
                    logo: logo_upload.id
                  }
                }
              };

              if (validator.isIP(context.ip)) {
                createStripeAccountArgs.tos_acceptance.ip = context.ip;
              }

              const account = await stripe.accounts.create(createStripeAccountArgs);

              // store stripe custom account id to database
              agency.stripe_account = await createResource('stripe account', { agency_id: agency.id, stripe_id_ext: account.id });

              // create stripe account verification url
              // see: https://stripe.com/docs/api/account_links/create
              let accountLink;
              try {
                accountLink = await stripe.accountLinks.create({
                  account: account.id,
                  refresh_url: return_url,
                  return_url,
                  type: 'account_onboarding',
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
                stripe_verification_url: accountLink.url,
                type: 'CreateAgencyResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CreateAgencyResult'
          };
        }
      }
    }
  }
};
