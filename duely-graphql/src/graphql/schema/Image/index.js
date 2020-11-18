import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource, createResolverForReferencedResource } from '../../util';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';

const resource = {
  name: 'image'
};

const defaultValidationOptions = {
  allowedMimeTypes: [
    'image/jpeg',
    'image/png'
  ],
  maxSize: 512000
};

function formatFileSize(size) {
  if (size < 1000) return `${size}B`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}KB`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}MB`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}GB`;
}

export function validateAndReadDataUrlAsBuffer(dataUrl, options) {
  options = {
    ...defaultValidationOptions,
    ...options
  };

  if (typeof dataUrl != 'string') {
    return [null, 'File should be encoded as a data URL.'];
  }

  if (!validator.isDataURI(dataUrl)) {
    return [null, 'File data should be encoded as a data URL.'];
  }

  if (!options.allowedMimeTypes.some(type => dataUrl.startsWith(`data:${type};base64,`))) {
    const extensions = options.allowedMimeTypes.map(t => t.split('/', 2)[1].split(/\W/, 1)[0].toUpperCase());
    return [null, 'File type should be one of ' + extensions.join(',')];
  }

  if (!validator.isByteLength(dataUrl, { max: Math.round(options.maxSize / 4 * 3) })) {
    return [null, `File max size is ${formatFileSize(options.maxSize)}.`];
  }

  try {
    return [Buffer.from(dataUrl.split(',')[1], 'base64'), null];
  } catch {
    return [null, 'Unable to read file.'];
  }
}

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

        // validate and read image

        const [_, validationError] = validateAndReadDataUrlAsBuffer(args.data);

        if (validationError) {
          return {
            success: false,
            message: 'Image validation failed. ' + validationError,
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
          const [_, validationError] = validateAndReadDataUrlAsBuffer(args.data);

          if (validationError) {
            return {
              success: false,
              message: 'Image validation failed. ' + validationError,
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
