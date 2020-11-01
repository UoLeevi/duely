import { Client, Pool } from 'pg';
import config from './config';

const RECONNECTION_TIMEOUT = 30000;
const RECONNECTION_RETRY_COUNT = 3;
let retryCounter = RECONNECTION_RETRY_COUNT;

export const pool = new Pool(config);
pool.on('error', error => {
  console.error('error on idle postgres client.', error.stack);
});

let sharedClient = new Client(config);
let isSharedClientConnected = false;
const backgroundJobs = [];

function retrySharedClientConnect() {
  setTimeout(() => {
    sharedClient = new Client(config);
    sharedClient.connect(error => {
      if (error) {
        if (retryCounter-- === 0) {
          console.error('error on connecting shared postgres client and retries failed.', error.stack);
          process.exit(1);
        }

        retrySharedClientConnect();
        return;
      }

      isSharedClientConnected = true;

      sharedClient.on('error', error => {
        isSharedClientConnected = false;
        console.error('error on shared postgres client.', error.stack);
        retrySharedClientConnect();
      });

      retryCounter = RECONNECTION_RETRY_COUNT;
      backgroundJobs.forEach(async callback => await callback(sharedClient));
    });
  }, RECONNECTION_TIMEOUT);
}

sharedClient.connect(error => {
  if (error) {
    console.error('error on connecting shared postgres client.', error.stack);
    retrySharedClientConnect();
    return;
  }

  isSharedClientConnected = true;

  sharedClient.on('error', error => {
    isSharedClientConnected = false;
    console.error('error on shared postgres client.', error.stack);
    retrySharedClientConnect();
  });

  backgroundJobs.forEach(async callback => await callback(sharedClient));
});

export async function addBackgroundJob(callback = async client => { }, execute = true) {
  function removeBackgroundJob() {
    const index = backgroundJobs.indexOf(callback);
    backgroundJobs.splice(index, 1);
  }

  backgroundJobs.push(callback);

  if (isSharedClientConnected && execute) {
    await callback(sharedClient);
  }

  return removeBackgroundJob;
}

export async function withConnection(context, callback = async withSession => { }) {
  const client = await pool.connect();
  async function withSession(callback = async client => { }) {
    const functions = useFunctions(client);
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
    try {
      await client.query('BEGIN');
      const res = await callback(functions);
      await client.query('COMMIT');
      return res;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      await client.query('SELECT operation_.end_session_()');
    }
  }

  try {
    return await callback(withSession);
  } finally {
    client.release();
  }
}

function useFunctions(client) {
  const functions = { client };

  functions.queryAll = async function (sql, ...parameters) {
    const res = await functions.client.query(sql, parameters.length > 0 ? parameters : undefined);
    const resultFieldName = res.fields[0].name;
    return res.rows.map(r => r[resultFieldName]);
  };

  functions.query = async function (sql, ...parameters) {
    const res = await functions.queryAll(sql, ...parameters);
    return res[0];
  };

  functions.queryResourceAccess = async function (id) {
    return await functions.query('SELECT * FROM operation_.query_resource_access_($1::text)', id);
  };

  functions.queryResource = async function (id_or_resource_name, filter) {
    if (filter) {
      const resources = await functions.queryResourceAll(id_or_resource_name, filter);
      return resources[0];
    }

    const id = id_or_resource_name;
    return await functions.query('SELECT * FROM operation_.query_resource_($1::text)', id);
  };

  functions.queryResourceAll = async function (resource_name, filter) {
    return await functions.queryAll('SELECT * FROM operation_.query_resource_all_($1::text, $2::jsonb)', resource_name, filter);
  };

  functions.createResource = async function (resource_name, data) {
    return await functions.query('SELECT * FROM operation_.create_resource_($1::text, $2::jsonb)', resource_name, data);
  };

  functions.updateResource = async function (id, data) {
    return await functions.query('SELECT * FROM operation_.update_resource_($1::text, $2::jsonb)', id, data);
  };

  functions.deleteResource = async function (id) {
    return await functions.query('SELECT * FROM operation_.delete_resource_($1::text)', id);
  };

  return functions;
}
