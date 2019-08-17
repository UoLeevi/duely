import pool from '../../db';

export default {
  // typeDef: `
  //   type SubjectAgenciesConnection implements Connection {
  //     edges: [SubjectAgenciesEdge!]!
  //   }
  // `,
  // resolvers: {
  //   async edges(connection, args, context, info) {
  //     if (!context.jwt)
  //       return null;

  //     const client = await pool.connect();
  //     try {
  //       await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
  //       const res = await client.query('SELECT * FROM operation_.query_subdomain_() WHERE uuid_ = $1::uuid', [agency.subdomain_uuid_]);
  //       await client.query('SELECT operation_.end_session_()');
  //       return res.rows ? res.rows[0] : null;
  //     } catch (error) {
  //       return null;
  //     }
  //     finally {
  //       client.release();
  //     }
  //     const res = await db.query(`
  //       SELECT a_x_s.*
  //         FROM accounts_x_sellers a_x_s
  //         WHERE a_x_s.account_uuid = $1::uuid;
  //       `,
  //       [connection.account_uuid]);

  //     return res.rows.map(row => ({ ...row, type: 'AccountAgenciesEdge' }));
  //   }
  // }
};
