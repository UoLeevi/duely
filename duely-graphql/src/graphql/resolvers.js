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
    async startEmailAddressVerification(obj, { email }, context, info) {
      if (!validator.isEmail(email))
        return {
          success: false,
          message: `Email format '${email}' is invalid.`,
          type: 'StartEmailAddressVerificationResult'
        };

      const verificationCode = ('000000' + Math.floor(Math.random() * Math.floor(1000000)).toString()).substr(-6);

      const res = await db.query(
        'SELECT * FROM start_email_verification($1::text, $2::text);', 
        [email, verificationCode]);

      if (res.rows[0].uuid === null)
        return {
          success: false,
          message: `Account with email '${email}' already exists.`,
          type: 'StartEmailAddressVerificationResult'
        };

      const messages = await gmail.sendEmailAsAdminDuely({ 
        to: email, 
        subject: 'Email verification - Sign up for duely.app',
        body: [
          `Your email verification code is ${verificationCode}.`,
        ].join('\r\n')
      });

      if (!messages.id)
        return {
          success: false,
          message: `Error while sending verification code email to '${email}'.`,
          type: 'StartEmailAddressVerificationResult'
        };

      return {
        success: true,
        message: `Verification code sent to '${email}'.`,
        type: 'StartEmailAddressVerificationResult'
      };
    },
    async signUp(obj, { email, verificationCode, name, password }, context, info) {
      const res = await db.query(
        'SELECT * FROM sign_up_account($1::text, $2::text, $3::text, $4::text);',
        [email, verificationCode, name, password]);

      if (res.rows[0].uuid === null)
        return {
          success: false,
          message: `Unable to complete sign up an account for '${email}'. It might be that the verification code was incorrect.`,
          type: 'SignUpResult'
        };

      return {
        success: true,
        account: res.rows[0],
        type: 'SignUpResult'
      };
    },
    async logIn(obj, { email, password }, context, info) {
      const res = await db.query(
        'SELECT * FROM log_in_account($1::text, $2::text);', 
        [email, password]);

      if (res.rows[0].uuid === null)
        return {
          success: false,
          message: `Your email or password was invalid. Please try again.`,
          type: 'LogInResult'
        };

      const session = res.rows[0];
      session.jwt = await auth.issue(session.account_uuid);

      return {
        success: true,
        session,
        type: 'LogInResult'
      };
    },
    async createSeller(obj, { name, subdomain }, context, info) {
      if (!context.claims || !context.claims.sub)
        return {
          success: false,
          message: `Unauthorized.`,
          type: 'CreateSellerResult'
        };

      const reservedSubdomains = ['api', 'test', 'example', 'admin'];

      if (reservedSubdomains.includes(subdomain.toLowerCase()))
        return {
          success: false,
          message: `Subdomain '${subdomain}' is not allowed.`,
          type: 'CreateSellerResult'
        };

      if (!validator.isFQDN(`${subdomain}.duely.app`))
        return {
          success: false,
          message: `Subdomain format '${subdomain}' is invalid.`,
          type: 'CreateSellerResult'
        };

      try {
        const res = await db.query(
          'SELECT * FROM create_seller($1::uuid, $2::text, $3::text);', 
          [context.claims.sub, name, subdomain]);

        return {
          success: true,
          seller: res.rows[0],
          type: 'CreateSellerResult'
        };
      } catch (error) {
        return {
          success: false,
          message: `Try different subdomain.`,
          type: 'CreateSellerResult'
        };
      }
    },
    async deleteSeller(obj, { seller_uuid }, context, info) {
      if (!context.claims || !context.claims.sub)
        return {
          success: false,
          message: `Unauthorized.`,
          type: 'DeleteSellerResult'
        };

      const res = await db.query(
        'SELECT * FROM delete_seller($1::uuid, $2::uuid);', 
        [context.claims.sub, seller_uuid]);

      if (res.rows[0].uuid === null)
        return {
          success: false,
          message: `Invalid seller uuid.`,
          type: 'DeleteSellerResult'
        };

      return {
        success: true,
        type: 'DeleteSellerResult'
      };
    }
  },
  Account: {
    sellersConnection(account, args, context, info) {
      return { account_uuid: account.uuid, type: 'AccountSellersConnection' };
    },
  },
  AccountSellersConnection: {
    async edges(connection, args, context, info) {
      const res = await db.query(`
        SELECT a_x_s.*
          FROM accounts_x_sellers a_x_s
          WHERE a_x_s.account_uuid = $1::uuid;
        `,
        [connection.account_uuid]);

      return res.rows.map(row => ({ ...row, type: 'AccountSellersEdge' }));
    }
  },
  AccountSellersEdge: {
    cursor(edge, args, context, info) {
      return Buffer.from(`${edge.account_uuid},${edge.seller_uuid}`).toString('base64');
    },
    async node(edge, args, context, info) {
      const res = await db.query(`
        SELECT s.*
          FROM sellers s
          WHERE s.uuid = $1::uuid;
        `,
        [edge.seller_uuid]);

      return { ...res.rows[0], type: "Seller" };
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
    subdomainsConnection(seller, args, context, info) {
      return { seller_uuid: seller.uuid, type: 'SellerSubdomainsConnection' };
    },
  },
  SellerSubdomainsConnection: {
    async edges(connection, args, context, info) {
      const res = await db.query(`
        SELECT d.uuid subdomain_uuid, d.seller_uuid
          FROM subdomains d
          WHERE d.seller_uuid = $1::uuid;
        `,
        [connection.seller_uuid]);

      return res.rows.map(row => ({ ...row, type: 'SellerSubdomainsEdge' }));
    }
  },
  SellerSubdomainsEdge: {
    cursor(edge, args, context, info) {
      return Buffer.from(`${edge.seller_uuid},${edge.subdomain_uuid}`).toString('base64');
    },
    async node(edge, args, context, info) {
      const res = await db.query(`
        SELECT d.*
          FROM subdomains d
          WHERE d.uuid = $1::uuid;
        `,
        [edge.subdomain_uuid]);

      return { ...res.rows[0], type: "Subdomain" };
    }
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
  MutationResult: {
    __resolveType(mutationResult, context, info) {
      return mutationResult.type;
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
