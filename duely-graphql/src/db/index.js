import { Pool } from 'pg';
import config from './config';

const pool = new Pool(config);
const sharedClientPromise = pool.connect();

async function getSharedClient() {
  return await sharedClientPromise;
}

export {
  pool,
  getSharedClient
};
