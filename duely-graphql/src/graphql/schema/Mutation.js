import pool from '../../db';
import gmail from '../../gmail';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';

export default {
  typeDef: `
    type Mutation {
      beginVisit: BeginVisitResult!
      endVisit: EndVisitResult!
      signUp(emailAddress: String!, verificationCode: String!, name: String!, password: String!): SignUpResult!
      startEmailAddressVerification(emailAddress: String!): StartEmailAddressVerificationResult!
      logIn(emailAddress: String!, password: String!): LogInResult!
      logOut: LogOutResult!
    }
  `,
  resolvers: {
    Mutation: {
      async beginVisit(obj, args, context, info) {
        const client = await pool.connect();
        try {
          const res = await client.query('SELECT * FROM operation_.begin_visit_() jwt_');
          return {
            success: true,
            jwt: res.rows[0].jwt_,
            type: 'BeginVisitResult'
          };
        } catch (error) {
          return {
            success: false,
            message: error.message,
            type: 'BeginVisitResult'
          };
        }
        finally {
          client.release();
        }
      },
      async endVisit(obj, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT operation_.end_visit_()');
          await client.query('SELECT operation_.end_session_()');
          return {
            success: true,
            type: 'EndVisitResult'
          };
        } catch (error) {
          return {
            success: false,
            message: error.message,
            type: 'EndVisitResult'
          };
        }
        finally {
          client.release();
        }
      },
      async startEmailAddressVerification(obj, { emailAddress }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (!validator.isEmail(emailAddress))
          return {
            success: false,
            message: `Email address format '${emailAddress}' is invalid.`,
            type: 'StartEmailAddressVerificationResult'
          };

        let verificationCode;

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT verification_code_ FROM operation_.start_email_address_verification_($1::text)', [emailAddress]);
          await client.query('SELECT operation_.end_session_()');
          verificationCode = res.rows[0].verification_code_;
        } catch (error) {
          return {
            success: false,
            message: error.message,
            type: 'StartEmailAddressVerificationResult'
          };
        }
        finally {
          client.release();
        }

        const messages = await gmail.sendEmailAsAdminDuely({ 
          to: emailAddress, 
          subject: 'Email verification - Sign up for duely.app',
          body: [
            `Your email verification code is ${verificationCode}.`,
          ].join('\r\n')
        });
  
        if (!messages.id)
          return {
            success: false,
            message: `Error while sending verification code email to '${emailAddress}'.`,
            type: 'StartEmailAddressVerificationResult'
          };
  
        return {
          success: true,
          message: `Verification code sent to '${emailAddress}'.`,
          type: 'StartEmailAddressVerificationResult'
        };
      },
      async signUp(obj, { emailAddress, verificationCode, name, password }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query(
            'SELECT uuid_ FROM operation_.sign_up_user_($1::text, $2::text, $3::text, $4::text)', 
            [emailAddress, verificationCode, name, password]);
          await client.query('SELECT operation_.end_session_()');
          return {
            success: true,
            userUuid: res.rows[0].uuid_,
            type: 'SignUpResult'
          };
        } catch (error) {
          return {
            success: false,
            message: error.message, // `Unable to complete sign up an account for '${emailAddress}'. It might be that the verification code was incorrect.`,
            type: 'SignUpResult'
          };
        }
        finally {
          client.release();
        }
      },
      async logIn(obj, { emailAddress, password }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT operation_.log_in_user_($1::text, $2::text) jwt_', [emailAddress, password]);
          await client.query('SELECT operation_.end_session_()');
          return {
            success: true,
            jwt: res.rows[0].jwt_,
            type: 'LogInResult'
          };
        } catch (error) {
          return {
            success: false,
            message: error.message, // `Your email or password was invalid. Please try again.`
            type: 'LogInResult'
          };
        }
        finally {
          client.release();
        }
      },
      async logOut(obj, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT operation_.log_out_user_()');
          await client.query('SELECT operation_.end_session_()');
          return {
            success: true,
            type: 'LogOutResult'
          };
        } catch (error) {
          return {
            success: false,
            message: error.message, // `Your email or password was invalid. Please try again.`
            type: 'LogOutResult'
          };
        }
        finally {
          client.release();
        }
      }
    }
  }
};
