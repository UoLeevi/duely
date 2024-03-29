import { Resources, withSession } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import validator from 'validator';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { DuelyGraphQLError } from '../../errors';

const resource = {
  name: 'image'
} as const;

const defaultValidationOptions = {
  allowedMimeTypes: ['image/jpeg', 'image/png'],
  maxSize: 512000
};

function formatFileSize(size: number) {
  if (size < 1000) return `${size}B`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}KB`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}MB`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}GB`;
}

export function validateAndReadDataUrlAsBuffer(
  dataUrl: string,
  options?: typeof defaultValidationOptions
): [Buffer | null, string | null] {
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

  if (!options.allowedMimeTypes.some((type) => dataUrl.startsWith(`data:${type};base64,`))) {
    const extensions = options.allowedMimeTypes.map((t) =>
      t.split('/', 2)[1].split(/\W/, 1)[0].toUpperCase()
    );
    return [null, 'File type should be one of ' + extensions.join(',')];
  }

  if (!validator.isByteLength(dataUrl, { max: Math.round(options.maxSize * (4 / 3)) })) {
    return [null, `File max size is ${formatFileSize(options.maxSize)}.`];
  }

  try {
    return [Buffer.from(dataUrl.split(',')[1], 'base64'), null];
  } catch {
    return [null, 'Unable to read file.'];
  }
}

export const Image: GqlTypeDefinition<Resources['image']> = {
  typeDef: gql`
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
      images(
        filter: ImageFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Image!]
      count_images(filter: ImageFilter!, token: String): Int!
    }

    extend type Mutation {
      create_image(
        agency_id: ID
        name: String!
        data: String!
        color: String!
        access: AccessLevel
      ): ImageMutationResult!
      update_image(
        image_id: ID!
        name: String
        data: String
        color: String
        access: AccessLevel
      ): ImageMutationResult!
    }

    type ImageMutationResult implements MutationResult {
      success: Boolean!
      message: String
      image: Image
    }
  `,
  resolvers: {
    Image: {
      ...createResolverForReferencedResource({ name: 'agency' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_image(obj, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

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
          return await withSession(context, async ({ createResource }) => {
            // create image resource
            const image = await createResource(resource.name, args);

            // success
            return {
              success: true,
              image,
              type: 'ImageMutationResult'
            };
          });
        } catch (error: any) {
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
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

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
          return await withSession(context, async ({ updateResource }) => {
            // update image resource
            const image = await updateResource('image', image_id, args);

            // success
            return {
              success: true,
              image,
              type: 'ImageMutationResult'
            };
          });
        } catch (error: any) {
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
