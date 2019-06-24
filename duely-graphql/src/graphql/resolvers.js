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
    async signUp(obj, { email, name, password }, context, info) {
      
      if (!validator.isEmail(email))
        throw new Error(`Email format '${email}' is invalid.`);

      const res = await db.query(`
        SELECT * 
          FROM sign_up_account($1::text, $2::text, $3::text);
        `, 
        [email, name, password]);

      if (res.rows) {
        const verificationCode = ('000000' + Math.floor(Math.random() * Math.floor(1000000)).toString()).substr(-6);
        
        const body = [
          `Hello ${name},`,
          '',
          `Your duely.app email verification code is ${verificationCode}.`,
        ].join('\r\n');
        
        const messages = await gmail.sendEmailAsAdminDuely({ 
          to: email, 
          subject: 'Email verification - Sign up for duely.app',
          body
        });

        if (!messages.id)
          throw new Error(`Error while sending verification code email.`);

        const res = await db.query(`
          INSERT INTO emails (email, verification_code)
            VALUES (lower($1::text), ($2::text))
            RETURNING *;
          `, 
          [email, verificationCode]);

        if (!res.rows)
          throw new Error(`Error while creating the verification code.`);
      }

      return res.rows[0];
    },
    async verifyEmailAddress(obj, { email, verificationCode }, context, info) {
      verificationCode = ('000000' + verificationCode).substr(-6);
      const res = await db.query(`
        UPDATE emails
          SET verified = CURRENT_TIMESTAMP
          WHERE email = lower($1::text)
            AND verification_code = $2::text
            AND verified IS NULL
          RETURNING *;
        `, 
        [email, verificationCode]);

      if (res.rows) {
        const res = await db.query(`
          SELECT a.*
            FROM accounts a
            WHERE a.email = lower($1::text);
          `, 
          [email]);

          return res.rows[0];
      }
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
    async verified(account, args, context, info) {
      const res = await db.query(`
        SELECT e.*
          FROM emails e
          WHERE e.email = lower($1::text);
        `, 
        [account.email]);

      return res.rows 
        ? res.rows[0].verified
        : null;
    }
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
