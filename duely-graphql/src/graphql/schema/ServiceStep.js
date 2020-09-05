import { withConnection } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    enum ServiceStepType {
      PAYMENT
      FORM
      CONFIRMATION_BY_AGENCY
      DOCUMENT_DELIVERY
      DOCUMENT_SUBMISSION
    }

    type ServiceStep implements Node {
      uuid: ID!
      name: String!
      type: ServiceStepType!
      previous: ServiceStep
      service: Service!
    }
  `,
  resolvers: {
    ServiceStep: {
      uuid: serviceStep => serviceStep.uuid_,
      name: serviceStep => serviceStep.name_,
      type: serviceStep => serviceStep.type_.toUpperCase(),
      async previous(serviceStep, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (serviceStep.previous_service_step_uuid_ === null)
          return null;

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_service_step_($1::uuid)', [serviceStep.previous_service_step_uuid_]);
              return res.rows.length === 1 ? res.rows[0] : null;
            } catch (error) {
              throw new AuthenticationError(error.message);
            }
          });
        });
      },
      async service(serviceStep, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_service_($1::uuid)', [serviceStep.service_uuid_]);
              return res.rows[0];
            } catch (error) {
              throw new AuthenticationError(error.message);
            }
          });
        });
      }
    }
  }
};
