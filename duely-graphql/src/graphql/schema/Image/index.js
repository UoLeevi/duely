import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource, createResolverForReferencedResource } from '../../utils';
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
      access: AccessLevel!
    }

    input ImageInput {
      name: String!
      data: String!
      color: String!
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
      create_image(agency_id: ID, name: String!, data: String!, color: String!, access: AccessLevel): ImageMutationResult!
      update_image(image_id: ID!, name: String, data: String, color: String, access: AccessLevel): ImageMutationResult!
    }

    type ImageMutationResult implements MutationResult {
      success: Boolean!
      message: String
      image: Image
    }
  `,
  resolvers: {
    Image: {
      ...createResolverForReferencedResource({ name: 'agency' }),
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_image(obj, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        // validate image

        if (!validator.isDataURI(args.data))
          return {
            success: false,
            message: `Image data should be encoded as a data URL.`,
            type: 'ImageMutationResult'
          };

        if (!args.data.startsWith('data:image/jpeg;base64,')
          && !args.data.startsWith('data:image/png;base64,'))
          return {
            success: false,
            message: `Image should be either a JPEG or PNG`,
            type: 'ImageMutationResult'
          };

        if (!validator.isByteLength(args.data, { max: Math.round(512000 / 4 * 3) }))
          return {
            success: false,
            message: `Image max size is 512KB.`,
            type: 'ImageMutationResult'
          };

        let image_buffer;

        try {
          const image_base64 = args.data.split(',')[1];
          image_buffer = Buffer.from(image_base64, 'base64');
        } catch {
          return {
            success: false,
            message: `Unable to read image file.`,
            type: 'ImageMutationResult'
          };
        }

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

        if (args.data) {
          // validate image

          if (!validator.isDataURI(args.data))
            return {
              success: false,
              message: `Image data should be encoded as a data URL.`,
              type: 'ImageMutationResult'
            };

          if (!args.data.startsWith('data:image/jpeg;base64,')
            && !args.data.startsWith('data:image/png;base64,'))
            return {
              success: false,
              message: `Image should be either a JPEG or PNG`,
              type: 'ImageMutationResult'
            };

          if (!validator.isByteLength(args.data, { max: Math.round(512000 / 4 * 3) }))
            return {
              success: false,
              message: `Image max size is 512KB.`,
              type: 'ImageMutationResult'
            };

          let image_buffer;

          try {
            const image_base64 = args.data.split(',')[1];
            image_buffer = Buffer.from(image_base64, 'base64');
          } catch {
            return {
              success: false,
              message: `Unable to read image file.`,
              type: 'ImageMutationResult'
            };
          }
        }

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
