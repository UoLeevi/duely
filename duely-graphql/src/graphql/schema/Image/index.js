import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource } from '../../utils';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';

const resource = {
  name: 'image'
};

export const Image = {
  typeDef: `
    type Image implements Node {
      id: ID!
      name: String!
      data: String!
      color: String!
      agency: Agency
    }

    input ImageFilter {
      name: String
      agency_id: ID
    }

    extend type Query {
      image(id: ID!): Image
      images(filter: ImageFilter!): [Image!]
    }

    extend type Mutation {
      create_image(agency_id: ID, name: String!, data: String!, color: String!): ImageMutationResult!
      update_image(image_id: ID!, name: String, data: String, color: String): ImageMutationResult!
    }

    type ImageMutationResult implements MutationResult {
      success: Boolean!
      message: String
      image: Image
    }
  `,
  resolvers: {
    Image: {
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
      }
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_image(obj, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ createResource }) => {
              // create image resource
              const image = await createResource(resource.name, args);

              // success
              return {
                success: true,
                image,
                type: 'ImageMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ImageMutationResult'
          };
        }
      },
      async update_image(obj, { image_id, ...args }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ updateResource }) => {
              // update image resource
              const image = await updateResource(image_id, args);

              // success
              return {
                success: true,
                image,
                type: 'ImageMutationResult'
              };
            });
          });
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'ImageMutationResult'
          };
        }
      }
    }
  }
};
