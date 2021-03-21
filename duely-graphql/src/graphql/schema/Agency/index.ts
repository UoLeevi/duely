import { queryResource, withSession } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource,
  createResolverForReferencedResourceAll
} from '../../util';
import validator from 'validator';
import stripe from '../../../stripe';
import { validateAndReadDataUrlAsBuffer } from '../Image';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';

const resource = {
  name: 'agency',
  plural: 'agencies'
} as const;

export const Agency: GqlTypeDefinition = {
  typeDef: gql`
    type Agency implements Node {
      id: ID!
      name: String!
      livemode: Boolean!
      stripe_account(livemode: Boolean): StripeAccount!
      subdomain: Subdomain!
      theme: Theme!
      products(filter: ProductFilter): [Product!]
      pages(filter: PageFilter): [Page!]
      settings: AgencySettings!
      subscription_plan: SubscriptionPlan!
    }

    input AgencyFilter {
      name: String
    }

    extend type Query {
      agency(id: ID!): Agency
      agencies(filter: AgencyFilter!): [Agency!]
    }

    extend type Mutation {
      create_agency(
        name: String!
        livemode: Boolean!
        subdomain_name: String!
        country_code: String!
        image_logo: ImageInput!
        return_url: String!
      ): CreateAgencyResult!
      delete_agency(agency_id: ID!): DeleteAgencyResult!
    }

    type CreateAgencyResult implements MutationResult {
      success: Boolean!
      message: String
      agency: Agency
      stripe_verification_url: String
    }

    type DeleteAgencyResult implements MutationResult {
      success: Boolean!
      message: String
      agency: Agency
    }
  `,
  resolvers: {
    Agency: {
      async stripe_account(source, { livemode }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        livemode = livemode ?? source.livemode;
        const stripe_env = livemode ? 'live' : 'test';

        try {
          const stripe_account = await queryResource(context, 'stripe account', {
            agency_id: source.id,
            livemode
          });
          const { id, object, ...stripe_account_ext } = await stripe[stripe_env].accounts.retrieve(
            stripe_account.stripe_id_ext
          );
          return { ...stripe_account, ...stripe_account_ext };
        } catch (error) {
          throw new Error(error.message);
        }
      },
      ...createResolverForReferencedResource({ name: 'subdomain' }),
      ...createResolverForReferencedResource({
        name: 'subscription_plan',
        resource_name: 'subscription plan'
      }),
      ...createResolverForReferencedResource({
        name: 'theme',
        reverse: true,
        column_name: 'agency_id'
      }),
      ...createResolverForReferencedResourceAll({
        name: 'products',
        resource_name: 'product',
        column_name: 'agency_id'
      }),
      ...createResolverForReferencedResourceAll({
        name: 'pages',
        resource_name: 'page',
        column_name: 'agency_id'
      }),
      settings: (agency) => ({ agency_id: agency.id })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_agency(
        obj,
        { name, livemode, subdomain_name, country_code, image_logo, return_url },
        context
      ) {
        if (!context.jwt) throw new Error('Unauthorized');

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

        // validate and read logo image
        const [image_buffer, validationError] = validateAndReadDataUrlAsBuffer(image_logo.data);

        if (validationError) {
          return {
            success: false,
            message: 'Logo image validation failed. ' + validationError,
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
          return await withSession(context, async ({ query, createResource }) => {
            // get current user
            const user = await query('SELECT * FROM operation_.query_current_user_()');

            // create subdomain and agency on database
            const subdomain = (await createResource('subdomain', {
              name: subdomain_name,
              agency: { name, livemode }
            } as any)) as any; // TODO: Fix types
            const agency = subdomain.agency;

            // create logo image
            const image = await createResource('image', {
              ...image_logo,
              agency_id: agency.id,
              access: 'public'
            });

            // create theme
            const theme = await createResource('theme', {
              name,
              image_logo_id: image.id,
              agency_id: agency.id
            });

            // create stripe custom account for agency
            // see: https://stripe.com/docs/api/accounts/create

            const createStripeAccountArgs: Stripe.AccountCreateParams = {
              type: 'custom',
              email: user.email_address,
              country: country_code,
              capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
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
                  logo: undefined
                }
              }
            };

            if (context.ip && validator.isIP(context.ip)) {
              createStripeAccountArgs.tos_acceptance!.ip = context.ip;
            }

            const stripe_envs: (keyof typeof stripe)[] = agency.livemode
              ? ['test', 'live']
              : ['test'];

            const accounts: Record<keyof typeof stripe, Stripe.Account | undefined> = {
              test: undefined,
              live: undefined
            };

            for (const stripe_env of stripe_envs) {
              // upload logo image to stripe
              const logo_upload = await stripe[stripe_env].files.create({
                file: {
                  data: image_buffer,
                  name: image_logo.name,
                  type: 'application/octet-stream'
                },
                purpose: 'business_logo'
              });

              createStripeAccountArgs.settings!.branding!.logo = logo_upload.id;

              const account = await stripe[stripe_env].accounts.create(createStripeAccountArgs);
              accounts[stripe_env] = account;

              // store stripe custom account id to database
              await createResource('stripe account', {
                agency_id: agency.id,
                stripe_id_ext: account.id,
                livemode: stripe_env === 'live'
              });
            }

            // create stripe account verification url
            // see: https://stripe.com/docs/api/account_links/create
            let accountLink;
            try {
              const stripe_env = agency.livemode ? 'live' : 'test';

              accountLink = await stripe[stripe_env].accountLinks.create({
                account: accounts[stripe_env]!.id,
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
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CreateAgencyResult'
          };
        }
      },
      async delete_agency(obj, { agency_id }, context) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          return await withSession(context, async ({ queryResource, deleteResource }) => {
            const agency = await queryResource('agency', agency_id);

            if (agency == null) {
              return {
                // error
                success: false,
                message: 'Agency not found',
                type: 'DeleteAgencyResult'
              };
            }

            const stripe_envs: (keyof typeof stripe)[] = agency.livemode
              ? ['test', 'live']
              : ['test'];

            for (const stripe_env of stripe_envs) {
              // query stripe account from database
              const stripe_account = await queryResource('stripe account', {
                agency_id,
                livemode: stripe_env === 'live'
              });

              // delete stripe custom account for agency
              // see: https://stripe.com/docs/api/accounts/delete
              await stripe[stripe_env].accounts.del(stripe_account.stripe_id_ext);
            }

            // delete subdomain from database, will cascade to agency, theme, subject assignment and stripe account tables
            await deleteResource('subdomain', agency.subdomain_id);

            // success
            return {
              success: true,
              agency,
              type: 'DeleteAgencyResult'
            };
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'DeleteAgencyResult'
          };
        }
      }
    }
  }
};
