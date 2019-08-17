import pool from '../../db';

export default {
  typeDef: `
    type Query {
      me: Subject
    }
  `,
  resolvers: {
    Query: {
      async me(obj, args, context, info) {
        if (!context.jwt)
          return null;
  
        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_active_subject_()');
          await client.query('SELECT operation_.end_session_()');
          return res.rows ? res.rows[0] : null;
        } catch (error) {
          return null;
        }
        finally {
          client.release();
        }
      }
    }
  }
};
