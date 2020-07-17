import { pool } from '../../../db';

export default async function beginVisit(obj, args, context, info) {
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
};
