import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource } from '../../utils';
import { AuthenticationError } from 'apollo-server-core';

const resource = {
  name: 'service'
};

export const Service = {
  typeDef: `
    type Service implements Node {
      id: ID!
      name: String!
      status: String!
      agency: Agency!
      default_variant: ServiceVariant!
    }

    input ServiceFilter {
      name: String
    }

    extend type Query {
      service(id: ID!): Service
      services(filter: ServiceFilter!): [Service!]
    }

    extend type Mutation {
      create_service(agency_id: ID!, name: String!, description: String, duration: String, price: Int, currency: String, status: String): ServiceMutationResult!
      update_service(service_id: ID!, name: String, description: String, duration: String, price: Int, currency: String, status: String): ServiceMutationResult!
    }

    type ServiceMutationResult implements MutationResult {
      success: Boolean!
      message: String
      service: Service
    }
  `,
  resolvers: {
    Service: {
      async agency(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource }) => {
              return await queryResource(source.agency_id);
            });
          });
        } catch (error) {
          throw new Error(error.message);
        }
      },
      async default_variant(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource }) => {
              return await queryResource(source.default_variant_id);
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
      async create_service(obj, { agency_id, name, ...args }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ createResource, updateResource }) => {
              // create service resource
              const serviceCreationOptionalArgs = {};
              if (args.hasOwnProperty('status')) serviceCreationOptionalArgs.status = args.status;
              const service = await createResource('service', { name, agency_id, ...serviceCreationOptionalArgs });
              // create service variant resource
              const service_variant = await createResource('service variant', { name, service_id: service.id, ...args });
              // set service variant as default
              service.default_variant_id = service_variant.id;
              await updateResource(service.id, { default_variant_id: service.default_variant_id });

              // success
              return {
                success: true,
                service,
                type: 'ServiceMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ServiceMutationResult'
          };
        }
      },
      async update_service(obj, { service_id, ...args }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ updateResource }) => {
              // updata service resource
              const serviceUpdates = {};
              if (args.hasOwnProperty('name')) serviceUpdates.name = args.name;
              if (args.hasOwnProperty('status')) serviceUpdates.status = args.status;

              const service = await (Object.keys(serviceUpdates).length > 0
                ? updateResource(service_id, serviceUpdates)
                : queryResource(service_id));

              // update service variant resource
              const service_variant = await updateResource(service.default_variant_id, args);

              // success
              return {
                success: true,
                service,
                type: 'ServiceMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ServiceMutationResult'
          };
        }
      }
    }
  }
};
