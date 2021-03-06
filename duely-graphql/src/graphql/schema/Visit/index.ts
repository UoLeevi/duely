import gql from 'graphql-tag';
import { beginVisit, endVisit } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import { DuelyGraphQLError } from '../../errors';

export const Visit: GqlTypeDefinition = {
  typeDef: gql`
    extend type Mutation {
      begin_visit: BeginVisitResult!
      end_visit: SimpleResult!
    }

    type BeginVisitResult implements MutationResult {
      success: Boolean!
      message: String
      jwt: String
    }
  `,
  resolvers: {
    Mutation: {
      async begin_visit(obj, args, context, info) {
        try {
          return {
            success: true,
            jwt: await beginVisit(),
            type: 'BeginVisitResult'
          };
        } catch (error: any) {
          return {
            success: false,
            message: error.message,
            type: 'BeginVisitResult'
          };
        }
      },
      async end_visit(obj, args, context, info) {
        if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");

        try {
          await endVisit(context);
          return {
            success: true,
            type: 'SimpleResult'
          };
        } catch (error: any) {
          return {
            success: false,
            message: error.message,
            type: 'SimpleResult'
          };
        }
      }
    }
  }
};
