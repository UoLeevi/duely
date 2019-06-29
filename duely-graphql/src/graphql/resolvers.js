import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import auth from '../auth';
import db from '../db';
import gmail from '../gmail';
import validator from 'validator';

export default {
  Query: {
    async subdomain(obj, { host }, context, info) {
      const res = await db.query(`
        SELECT d.* 
          FROM subdomains d
          WHERE d.host = $1::text;
        `,
        [host]);
      return res.rows ? res.rows[0] : null;
    },
    async me(obj, args, context, info) {
      if (!context.claims || !context.claims.sub)
        return null;

      const res = await db.query(`
        SELECT a.* 
          FROM accounts a
          WHERE a.uuid = $1::uuid;
        `,
        [context.claims.sub]);
      return res.rows ? res.rows[0] : null;
    }
  },
  Mutation: {
    /*
    signUp(email: String!, verificationCode: String!, name: String!, password: String!): Account
     */
    async startEmailAddressVerification(obj, { email }, context, info) {
      if (!validator.isEmail(email))
        throw new Error(`Email format '${email}' is invalid.`);

      const verificationCode = ('000000' + Math.floor(Math.random() * Math.floor(1000000)).toString()).substr(-6);

      const res = await db.query(
        'SELECT * FROM start_email_verification($1::text, $2::text);', 
        [email, verificationCode]);

      if (res.rows[0].uuid === null)
        throw new Error(`Account with email '${email}' already exists.`);

      const messages = await gmail.sendEmailAsAdminDuely({ 
        to: email, 
        subject: 'Email verification - Sign up for duely.app',
        body: [
          `Your email verification code is ${verificationCode}.`,
        ].join('\r\n')
      });

      if (!messages.id)
          throw new Error(`Error while sending verification code email to '${email}'.`);

      return `Verification code sent to '${email}'.`;
    },
    async signUp(obj, { email, verificationCode, name, password }, context, info) {
      const res = await db.query(
        'SELECT * FROM sign_up_account($1::text, $2::text, $3::text, $4::text);',
        [email, verificationCode, name, password]);

      if (res.rows[0].uuid === null)
        throw new Error(`Unable to complete sign up an account for '${email}'. It might be that the verification code was incorrect.`);

      return res.rows[0];
    },
    async logIn(obj, { email, password }, context, info) {
      const res = await db.query(`
        SELECT *
          FROM log_in_account($1::text, $2::text);
        `, 
        [email, password]);

      const session = res.rows[0];

      return {
        ...session,
        jwt: await auth.issue(session.account_uuid)
      };
    }
  },
  Account: {
  },
  Session: {
    name(session, args, context, info) {
      return session.jwt;
    },
    async account(session, args, context, info) {
      const res = await db.query(`
        SELECT a.* 
          FROM accounts a
          WHERE a.uuid = $1::uuid;
        `,
        [session.account_uuid]);
      return res.rows[0];
    }
  },
  Seller: {
  },
  Subdomain: {
    name(subdomain, args, context, info) {
      return 'subdomain';
    },
    async seller(subdomain, args, context, info) {
      const res = await db.query(`
        SELECT s.* 
          FROM sellers s
          WHERE s.uuid = $1::uuid;
        `,
        [subdomain.seller_uuid]);
      return res.rows[0];
    },
    async theme(subdomain, args, context, info) {
      const res = await db.query(`
        SELECT t.* 
          FROM themes t
          WHERE t.uuid = $1::uuid;
        `,
        [subdomain.theme_uuid]);
      return res.rows[0];
    }
  },
  Theme: {
    colorPrimary(theme, args, context, info) {
      return theme.color_primary;
    },
    colorSecondary(theme, args, context, info) {
      return theme.color_secondary;
    },
    colorAccent(theme, args, context, info) {
      return theme.color_accent;
    },
    colorError(theme, args, context, info) {
      return theme.color_error;
    },
    colorInfo(theme, args, context, info) {
      return theme.color_info;
    },
    colorSuccess(theme, args, context, info) {
      return theme.color_success;
    },
    colorWarning(theme, args, context, info) {
      return theme.color_warning;
    }
  },
  Node: {
    __resolveType(node, context, info) {
      return node.type;
    }
  },
  Connection: {
    __resolveType(connection, context, info) {
      return connection.type;
    }
  },
  Edge: {
    __resolveType(edge, context, info) {
      return edge.type;
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT)
        return new Date(ast.value);

      return null;
    }
  })
};
