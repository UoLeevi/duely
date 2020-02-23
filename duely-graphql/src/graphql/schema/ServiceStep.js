import { pool } from '../../db';
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

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_service_step_($1::uuid)', [serviceStep.previous_service_step_uuid_]);
          return res.rows.length === 1 ? res.rows[0] : null;
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
        finally {
          await client.query('SELECT operation_.end_session_()');
          client.release();
        }
      },
      async service(serviceStep, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_service_($1::uuid)', [serviceStep.service_uuid_]);
          return res.rows[0];
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
        finally {
          await client.query('SELECT operation_.end_session_()');
          client.release();
        }
      }
    }
  }
};
